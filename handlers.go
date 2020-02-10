package main

import (
	"encoding/gob"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"strconv"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/sessions"
	"github.com/xxarchexx/auth/auth_apps"
	auth_models "github.com/xxarchexx/auth/models"
	"github.com/xxarchexx/auth/pages"
	users_module "github.com/xxarchexx/auth/users"
	"gopkg.in/oauth2.v3"
	"gopkg.in/oauth2.v3/errors"
	"gopkg.in/oauth2.v3/generates"
	"gopkg.in/oauth2.v3/manage"
	"gopkg.in/oauth2.v3/models"
	"gopkg.in/oauth2.v3/server"
	"gopkg.in/oauth2.v3/store"
)

var logins map[uint]string

type OauthServer struct {
	Server     *server.Server
	gen        *generates.JWTAccessGenerate
	tokenStore oauth2.TokenStore
}

type RetUri struct {
	Key   string
	Value url.Values
}

var (
	auth         OauthServer
	sessionStore = sessions.NewCookieStore([]byte("tets"))
	keyData, _   = ioutil.ReadFile("keys/id_rsa_test")
	gen          generates.JWTAccessGenerate
	err          error
	clientStore  *store.ClientStore
)

func initAuth() {
	logins = make(map[uint]string)
	gob.Register(RetUri{})
	gob.Register(auth_models.User{})
	auth = OauthServer{}
	manager := manage.NewDefaultManager()
	manager.SetAuthorizeCodeTokenCfg(manage.DefaultAuthorizeCodeTokenCfg)
	auth.gen = generates.NewJWTAccessGenerate(keyData, jwt.GetSigningMethod("RS256"))
	// token store
	auth.tokenStore, err = store.NewMemoryTokenStore()
	auth.Server = server.NewServer(server.NewConfig(), manager)
	auth.Server.SetUserAuthorizationHandler(userAuthorizeHandler)

	go auth.Server.SetInternalErrorHandler(func(err error) (re *errors.Response) {
		log.Println("Internal Error:", err.Error())
		return
	})
	auth.Server.SetResponseErrorHandler(func(re *errors.Response) {
		log.Println("Response Error:", re.Error.Error())
	})

	manager.MustTokenStorage(auth.tokenStore, err)
	clientStore = store.NewClientStore()
	fillStore()
	manager.MapClientStorage(clientStore)
	manager.SetAuthorizeCodeTokenCfg(manage.DefaultAuthorizeCodeTokenCfg)
}

func fillStore() {
	auth_apps.FillClients()
	for _, v := range auth_apps.AuthApps {
		clientStore.Set(v.CLIENT_ID, &models.Client{
			ID:     v.CLIENT_ID,
			Secret: v.SECRET_ID,
			Domain: v.DOMAIN,
		})
	}
}

func userAuthorizeHandler(w http.ResponseWriter, r *http.Request) (userID string, err error) {
	store, _ := sessionStore.Get(r, "AuthSession")

	uid, ok := store.Values["LoggedInUserID"]

	if !ok {

		if r.Form == nil {
			r.ParseForm()
		}

		data := RetUri{Key: "ReturnUri", Value: r.Form}
		store.Values["ReturnUri"] = data
		store.Save(r, w)

		w.Header().Set("Location", "/login")
		w.WriteHeader(http.StatusFound)
		return
	}

	data, ok := uid.(string)

	if !ok {

		if r.Form == nil {
			r.ParseForm()
		}

		data := RetUri{Key: "ReturnUri", Value: r.Form}
		store.Values["ReturnUri"] = data
		store.Save(r, w)

		w.Header().Set("Location", "/login")
		w.WriteHeader(http.StatusFound)

		return
	}

	store.Options.MaxAge = -1
	store.Save(r, w)
	userID = data
	return
}

func authorizeHandle(w http.ResponseWriter, r *http.Request) {

	st, _ := sessionStore.Get(r, "AuthSession")

	if err != nil {

		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var form url.Values

	data, ok := st.Values["ReturnUri"]

	if ok {
		dd, ok := data.(RetUri)
		if ok {
			form = dd.Value
			st.Values["ReturnUri"] = ""
		}
	}

	r.Form = form

	client_id, ok := form["client_id"]
	if ok {
		st.Values["client_id"] = client_id
	}

	state, ok := form["state"]
	if ok {
		st.Values["state"] = state
	}

	redirect_uri, ok := form["redirect_uri"]

	if ok {
		st.Values["redirect_uri"] = redirect_uri
	}

	st.Save(r, w)

	err = auth.Server.HandleAuthorizeRequest(w, r)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

}

func tokenHandle(w http.ResponseWriter, r *http.Request) {
	s := auth.Server
	var ti oauth2.TokenInfo

	gt, tgr, _ := s.ValidationTokenRequest(r)

	if allowed := s.CheckGrantType(gt); !allowed {
		return
	}

	if fn := s.ClientAuthorizedHandler; fn != nil {
		allowed, verr := fn(tgr.ClientID, gt)
		if verr != nil {
			err = verr
			return
		} else if !allowed {
			err = errors.ErrUnauthorizedClient
			return
		}
	}

	switch gt {
	case oauth2.AuthorizationCode:
		ati, verr := auth.generateAccessToken(gt, tgr)
		if verr != nil {

			if verr == errors.ErrInvalidAuthorizeCode {
				err = errors.ErrInvalidGrant
			} else if verr == errors.ErrInvalidClient {
				err = errors.ErrInvalidClient
			} else {
				err = verr
			}
			return
		}
		ti = ati
	case oauth2.PasswordCredentials, oauth2.ClientCredentials:
		if fn := s.ClientScopeHandler; fn != nil {

			allowed, verr := fn(tgr.ClientID, tgr.Scope)
			if verr != nil {
				err = verr
				return
			} else if !allowed {
				err = errors.ErrInvalidScope
				return
			}
		}
		ti, err = s.Manager.GenerateAccessToken(gt, tgr)
	case oauth2.Refreshing:
		// check scope
		if scope, scopeFn := tgr.Scope, s.RefreshingScopeHandler; scope != "" && scopeFn != nil {

			rti, verr := s.Manager.LoadRefreshToken(tgr.Refresh)
			if verr != nil {
				if verr == errors.ErrInvalidRefreshToken || verr == errors.ErrExpiredRefreshToken {
					err = errors.ErrInvalidGrant
					return
				}
				err = verr
				return
			}

			allowed, verr := scopeFn(scope, rti.GetScope())
			if verr != nil {
				err = verr
				return
			} else if !allowed {
				err = errors.ErrInvalidScope
				return
			}
		}

		rti, verr := s.Manager.RefreshAccessToken(tgr)
		if verr != nil {
			if verr == errors.ErrInvalidRefreshToken || verr == errors.ErrExpiredRefreshToken {
				err = errors.ErrInvalidGrant
			} else {
				err = verr
			}
			return
		}
		ti = rti
	}
	err = auth.token(w, auth.Server.GetTokenData(ti), nil)
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		st, err := sessionStore.Get(r, "AuthSession")

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		u := auth_models.User{}
		json.NewDecoder(r.Body).Decode(&u)
		fmt.Printf(u.Login)
		fmt.Printf(u.Password)
		r.ParseForm()

		ok := users_module.VerifyUser(u)

		if ok {

			st.Values["LoggedInUserID"] = strconv.FormatUint(uint64(u.ID), 10)
			fmt.Print("LoggedInUserID")
			logins[u.ID] = u.Login
		}

		st.Save(r, w)

		return
	}

	fmt.Fprintf(w, "%s", pages.Pages["index.html"].Body)
}

func (srv *OauthServer) token(w http.ResponseWriter, data map[string]interface{}, header http.Header, statusCode ...int) (err error) {
	w.Header().Set("Content-Type", "application/json;charset=UTF-8")
	w.Header().Set("Cache-Control", "no-store")
	w.Header().Set("Pragma", "no-cache")

	for key := range header {
		w.Header().Set(key, header.Get(key))
	}

	status := http.StatusOK
	if len(statusCode) > 0 && statusCode[0] > 0 {
		status = statusCode[0]
	}

	w.WriteHeader(status)
	err = json.NewEncoder(w).Encode(data)
	return
}

func registrationHandle(w http.ResponseWriter, r *http.Request) {
	u := auth_models.User{}
	st, _ := sessionStore.Get(r, "AuthSession")
	error := json.NewDecoder(r.Body).Decode(&u)

	if error != nil {
		st.Values["HasError"] = "Can not decode user to json"
		st.Save(r, w)
		return
	}

	users_module.CreateUser(&u)

	st.Values["LoggedInUserID"] = strconv.FormatUint(uint64(u.ID), 10)

	logins[u.ID] = u.Login

	st.Save(r, w)

	if u.LoginType == 22 {
		type exist struct {
			AccountExist bool `json:"accountExist"`
		}

		userExists := exist{AccountExist: true}
		data, err := json.Marshal(&userExists)
		if err != nil {
			log.Fatal(err)
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(data)
		return
	}

	type success struct {
		Success bool `json:"success"`
	}
	_success := success{Success: true}
	data, _ := json.Marshal(&_success)
	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}

func redirectHandle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Location", "/auth")
	w.WriteHeader(http.StatusFound)
	return
}

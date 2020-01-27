package main

import (
	"encoding/base64"
	"encoding/gob"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	"github.com/xxarchexx/auth/pages"
	"github.com/xxarchexx/auth/users"
	"gopkg.in/oauth2.v3"
	"gopkg.in/oauth2.v3/errors"
	"gopkg.in/oauth2.v3/generates"
	"gopkg.in/oauth2.v3/manage"
	"gopkg.in/oauth2.v3/models"
	"gopkg.in/oauth2.v3/server"
	"gopkg.in/oauth2.v3/store"
	"gopkg.in/oauth2.v3/utils/uuid"
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
)

func main() {
	logins = make(map[uint]string)
	auth := OauthServer{}

	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}

	pages.LoadPage()
	gob.Register(RetUri{})
	manager := manage.NewDefaultManager()
	manager.SetAuthorizeCodeTokenCfg(manage.DefaultAuthorizeCodeTokenCfg)
	auth.gen = generates.NewJWTAccessGenerate(keyData, jwt.GetSigningMethod("RS256"))
	var err error

	// token store
	auth.tokenStore, err = store.NewMemoryTokenStore()
	manager.MustTokenStorage(auth.tokenStore, err)

	//
	clientStore := store.NewClientStore()
	clientStore.Set("222222", &models.Client{
		ID:     "222222",
		Secret: "22222222",
		Domain: "http://localhost:3003",
	})
	manager.MapClientStorage(clientStore)

	manager.SetAuthorizeCodeTokenCfg(manage.DefaultAuthorizeCodeTokenCfg)
	fs := http.FileServer(http.Dir("dist"))

	// http.Handle("/static/", http.StripPrefix("/static/", fs))
	http.Handle("/dist/", http.StripPrefix("/dist/", fs))

	auth.Server = server.NewServer(server.NewConfig(), manager)

	auth.Server.SetUserAuthorizationHandler(userAuthorizeHandler)

	go auth.Server.SetInternalErrorHandler(func(err error) (re *errors.Response) {
		log.Println("Internal Error:", err.Error())
		return
	})

	auth.Server.SetResponseErrorHandler(func(re *errors.Response) {
		log.Println("Response Error:", re.Error.Error())
	})

	// http.HandleFunc("/confim/", confirmHandler)

	http.HandleFunc("/login", loginHandler)
	// http.HandleFunc("/facebooklogin", facebookLoginHandler)
	http.HandleFunc("/auth", authHandler)
	http.HandleFunc("/facebooklogin", handleFacebookLogin)
	http.HandleFunc("/oauth2Callback", handleFacebookCallback)

	//var letterRunes = []rune("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

	http.HandleFunc("/redirect", func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Location", "/auth")
		w.WriteHeader(http.StatusFound)

		return
	})

	http.HandleFunc("/registration", func(w http.ResponseWriter, r *http.Request) {
		u := users.User{}
		st, _ := sessionStore.Get(r, "AuthSession")
		error := json.NewDecoder(r.Body).Decode(&u)

		if error != nil {
			st.Values["HasError"] = "Can not decode user to json"
			st.Save(r, w)
			return
		}

		u.CreateUser()

		st.Values["LoggedInUserID"] = strconv.FormatUint(uint64(u.ID), 10)

		logins[u.ID] = u.Login

		st.Save(r, w)
		w.Header().Set("Location", "/auth")
		w.WriteHeader(http.StatusFound)
	})

	http.HandleFunc("/button", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")

	})

	http.HandleFunc("/authorize", func(w http.ResponseWriter, r *http.Request) {
		st, err := sessionStore.Get(r, "AuthSession")

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

		st.Save(r, w)

		err = auth.Server.HandleAuthorizeRequest(w, r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
		}
	})

	http.HandleFunc("/token", func(w http.ResponseWriter, r *http.Request) {
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
			ati, verr := auth.GenerateAccessToken(gt, tgr)
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
		return
	})

	http.HandleFunc("/test2", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "<h1>test</h1>")
	})

	http.HandleFunc("/test", func(w http.ResponseWriter, r *http.Request) {
		token, err := auth.Server.ValidationBearerToken(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		data := map[string]interface{}{
			"expires_in": int64(token.GetAccessCreateAt().Add(token.GetAccessExpiresIn()).Sub(time.Now()).Seconds()),
			"client_id":  token.GetClientID(),
			"user_id":    token.GetUserID(),
		}
		e := json.NewEncoder(w)
		e.SetIndent("", "  ")
		e.Encode(data)
	})

	log.Println("Server is running at 9096 port.")
	err = http.ListenAndServe(":9096", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

// GenerateAccessToken generate the access token
func (auth *OauthServer) GenerateAccessToken(gt oauth2.GrantType, tgr *oauth2.TokenGenerateRequest) (accessToken oauth2.TokenInfo, err error) {
	m := auth.Server.Manager
	tokenStore := auth.tokenStore
	// err = auth.token(w, auth.Server.GetTokenData(ti), nil)
	// code := tgr.Code

	cli, err := m.GetClient(tgr.ClientID)
	if err != nil {
		return
	} else if tgr.ClientSecret != cli.GetSecret() {
		err = errors.ErrInvalidClient
		return
	} else if tgr.RedirectURI != "" {
		if verr := manage.DefaultValidateURI(cli.GetDomain(), tgr.RedirectURI); verr != nil {
			err = verr
			return
		}
	}

	if gt == oauth2.AuthorizationCode {
		// _ := tgr.Code

		ti, verr := auth.getAndDelAuthorizationCode(tgr)
		if verr != nil {
			err = verr
			return
		}
		tgr.UserID = ti.GetUserID()
		tgr.Scope = ti.GetScope()
		if exp := ti.GetAccessExpiresIn(); exp > 0 {
			tgr.AccessTokenExp = exp
		}
	}

	ti := models.NewToken()
	ti.SetClientID(tgr.ClientID)
	ti.SetUserID(tgr.UserID)
	ti.SetRedirectURI(tgr.RedirectURI)
	ti.SetScope(tgr.Scope)

	createAt := time.Now()
	ti.SetAccessCreateAt(createAt)

	var gcfg *manage.Config = &manage.Config{AccessTokenExp: time.Hour * 2, RefreshTokenExp: time.Hour * 24 * 3, IsGenerateRefresh: true}

	if gt == oauth2.AuthorizationCode {
		gcfg = manage.DefaultAuthorizeCodeTokenCfg
	}

	aexp := gcfg.AccessTokenExp
	if exp := tgr.AccessTokenExp; exp > 0 {
		aexp = exp
	}
	ti.SetAccessExpiresIn(aexp)
	if gcfg.IsGenerateRefresh {
		ti.SetRefreshCreateAt(createAt)
		ti.SetRefreshExpiresIn(gcfg.RefreshTokenExp)
	}

	td := &oauth2.GenerateBasic{
		Client:    cli,
		UserID:    tgr.UserID,
		CreateAt:  createAt,
		TokenInfo: ti,
		Request:   tgr.Request,
	}

	av, rv, terr := auth.TokenSign(td, gcfg.IsGenerateRefresh)
	if terr != nil {
		err = terr
		return
	}
	ti.SetAccess(av)

	if rv != "" {
		ti.SetRefresh(rv)
	}

	err = tokenStore.Create(ti)
	if err != nil {
		return
	}
	accessToken = ti

	return
}

func (auth *OauthServer) delAuthorizationCode(code string) (err error) {
	// m := auth.Server.Manager
	tokenStore := auth.tokenStore
	err = tokenStore.RemoveByCode(code)
	return
}

func (auth *OauthServer) getAndDelAuthorizationCode(tgr *oauth2.TokenGenerateRequest) (info oauth2.TokenInfo, err error) {
	code := tgr.Code
	ti, err := auth.getAuthorizationCode(code)
	if err != nil {
		return
	} else if ti.GetClientID() != tgr.ClientID {
		err = errors.ErrInvalidAuthorizeCode
		return
	} else if codeURI := ti.GetRedirectURI(); codeURI != "" && codeURI != tgr.RedirectURI {
		err = errors.ErrInvalidAuthorizeCode
		return
	}

	err = auth.delAuthorizationCode(code)
	if err != nil {
		return
	}
	info = ti
	return
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

func test(w http.ResponseWriter, r *http.Request) {
	log.Print("confimt pattern is not correct")
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		st, err := sessionStore.Get(r, "AuthSession")

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		u := users.User{}
		json.NewDecoder(r.Body).Decode(&u)
		fmt.Printf(u.Login)
		fmt.Printf(u.Password)
		r.ParseForm()

		ok := u.VerifyUser(u.Login, u.Password)

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

func authHandler(w http.ResponseWriter, r *http.Request) {
	_, err := sessionStore.Get(r, "AuthSession")

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	//store.Values["LoggedInUserID"] = "2"

	outputHTML(w, r, "views/auth.html")
}

func outputHTML2(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	fmt.Fprintf(w, "%s", pages.Pages["login.html"].Body)
}

func outputHTML(w http.ResponseWriter, req *http.Request, filename string) {
	file, err := os.Open(filename)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	defer file.Close()
	fi, _ := file.Stat()
	http.ServeContent(w, req, file.Name(), fi.ModTime(), file)
}

// GetErrorData get error response data
func (srv *OauthServer) GetErrorData(err error) (data map[string]interface{}, statusCode int, header http.Header) {
	re := new(errors.Response)

	if v, ok := errors.Descriptions[err]; ok {
		re.Error = err
		re.Description = v
		re.StatusCode = errors.StatusCodes[err]
	} else {
		if fn := srv.Server.InternalErrorHandler; fn != nil {
			if vre := fn(err); vre != nil {
				re = vre
			}
		}

		if re.Error == nil {
			re.Error = errors.ErrServerError
			re.Description = errors.Descriptions[errors.ErrServerError]
			re.StatusCode = errors.StatusCodes[errors.ErrServerError]
		}
	}

	if fn := srv.Server.ResponseErrorHandler; fn != nil {
		fn(re)

		if re == nil {
			re = new(errors.Response)
		}
	}

	data = make(map[string]interface{})

	if err := re.Error; err != nil {
		data["error"] = err.Error()
	}

	if v := re.ErrorCode; v != 0 {
		data["error_code"] = v
	}

	if v := re.Description; v != "" {
		data["error_description"] = v
	}

	if v := re.URI; v != "" {
		data["error_uri"] = v
	}

	header = re.Header

	statusCode = http.StatusInternalServerError
	if v := re.StatusCode; v > 0 {
		statusCode = v
	}

	return
}

func (srv *OauthServer) tokenError(w http.ResponseWriter, err error) (uerr error) {
	data, statusCode, header := srv.Server.GetErrorData(err)

	uerr = srv.token(w, data, header, statusCode)
	return
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

// get authorization code data
func (auth *OauthServer) getAuthorizationCode(code string) (info oauth2.TokenInfo, err error) {

	tokenStore := auth.tokenStore
	ti, terr := tokenStore.GetByCode(code)
	if terr != nil {
		err = terr
		return
	} else if ti == nil || ti.GetCode() != code || ti.GetCodeCreateAt().Add(ti.GetCodeExpiresIn()).Before(time.Now()) {
		err = errors.ErrInvalidAuthorizeCode
		return
	}
	info = ti
	return
}

// Token based on the UUID generated token
func (auth *OauthServer) TokenSign(data *oauth2.GenerateBasic, isGenRefresh bool) (access, refresh string, err error) {
	a := *auth.gen

	type MyCustomClaims struct {
		Userid string `json:"userid"`
		jwt.StandardClaims
	}

	// var standartClaims = jwt.StandardClaims{
	// 	Audience:  data.Client.GetID(),
	// 	Subject:   data.UserID,
	// 	ExpiresAt: data.TokenInfo.GetAccessCreateAt().Add(data.TokenInfo.GetAccessExpiresIn()).Unix(),
	// }

	claims := MyCustomClaims{
		string(data.UserID),
		jwt.StandardClaims{
			Audience:  data.Client.GetID(),
			Subject:   data.UserID,
			ExpiresAt: data.TokenInfo.GetAccessCreateAt().Add(data.TokenInfo.GetAccessExpiresIn()).Unix(),
		},
	}

	uid, err := strconv.ParseUint(data.UserID, 10, 32)
	if err != nil {
		fmt.Println(err)
	}

	wd := uint(uid)

	login := logins[wd]
	fmt.Print(login)
	token := jwt.NewWithClaims(a.SignedMethod, claims)
	var key interface{}

	key, err = jwt.ParseRSAPrivateKeyFromPEM(a.SignedKey)
	if err != nil {
		return "", "", err
	}

	access, err = token.SignedString(key)
	if err != nil {
		return
	}

	if isGenRefresh {
		refresh = base64.URLEncoding.EncodeToString(uuid.NewSHA1(uuid.Must(uuid.NewRandom()), []byte(access)).Bytes())
		refresh = strings.ToUpper(strings.TrimRight(refresh, "="))
	}

	return
}

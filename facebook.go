package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strconv"
	"time"

	auth_models "github.com/xxarchexx/auth/models"
	"golang.org/x/oauth2"
	gpkg "gopkg.in/oauth2.v3"
	"gopkg.in/oauth2.v3/models"
	"gopkg.in/oauth2.v3/server"
)

var (
	port      = 9096
	oauthConf = &oauth2.Config{
		ClientID:     "538091347047705",
		ClientSecret: "a194158661d4686330c6abde8ffa05ce",
		RedirectURL:  "http://localhost:9096/oauth2Callback",
		Scopes:       []string{"email", "public_profile"},
		// Still using version v3.2.
		// Endpoint:     facebook.Endpoint,
		Endpoint: oauth2.Endpoint{
			AuthURL:  "https://www.facebook.com/v5.0/dialog/oauth",
			TokenURL: "https://graph.facebook.com/v5.0/oauth/access_token",
		},
	}
	oauthStateString = "thisshouldberandom"
)

type Data struct {
	Url string
}

func handleFacebookLogin(w http.ResponseWriter, r *http.Request) {
	u := oauthConf.AuthCodeURL(oauthStateString)
	data := Data{}
	data.Url = u
	js, err := json.Marshal(data)
	if err == nil {
		w.Header().Set("Content-Type", "application/json")
		w.Write(js)
	} else {
		fmt.Print(err)
		fmt.Print("test")
	}

	fmt.Print(js)

}

func handleFacebookCallback(w http.ResponseWriter, r *http.Request) {
	var facebookUser auth_models.User

	st, err := sessionStore.Get(r, "AuthSession")
	state := r.FormValue("state")

	if state != oauthStateString {
		fmt.Printf("invalid oauth state, expected %q got %q", oauthStateString, state)
		http.Redirect(w, r, "/", http.StatusFound)
		return
	}
	code := r.FormValue("code")

	// Use a custom HTTP client when requesting a token.
	// httpClient := &http.Client{Timeout: 2 * time.Second}
	// ctx := context.WithValue(context.Background(), oauth2.HTTPClient, httpClient)

	token, err := oauthConf.Exchange(oauth2.NoContext, code)
	facebookUser.TokenFromProvider = token.AccessToken

	if err != nil {
		fmt.Printf("oauthConf.Exchange() failed with %q", err)
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}
	// https://developers.facebook.com/docs/graph-api/reference/user
	resp, err := http.Get(fmt.Sprintf("https://graph.facebook.com/me?fields=name,middle_name,first_name,last_name,email,address,age_range,gender&access_token=%s", url.QueryEscape(token.AccessToken)))
	if err != nil {
		fmt.Printf("Get: %q", err)
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	defer resp.Body.Close()

	response, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		fmt.Printf("ReadAll: %q", err)
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
		return
	}

	var m map[string]interface{}
	if err := json.Unmarshal(response, &m); err != nil {
		fmt.Printf("error unmarshalling response: %s", err)
		http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
	}

	fmt.Println("got response body", m)
	resp, err = http.Get(fmt.Sprintf("https://graph.facebook.com/v5.0/%s/picture?redirect=0&access_token=%s", m["id"], url.QueryEscape(token.AccessToken)))

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	defer resp.Body.Close()

	if err := json.NewDecoder(resp.Body).Decode(&m); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	facebookUser.EmailFromProvider = m["email"].(string)
	temp := m["id"].(string)
	facebookUser.UserIDFromProvider, err = strconv.ParseUint(temp, 10, 64)
	facebookUser.FirstNameFromProvider = m["first_name"].(string)
	facebookUser.LastNameFromProvider = m["last_name"].(string)
	facebookUser.LoginType = 1
	facebookUser.Expired = token.Expiry.Sub(time.Now())
	if err != nil {
		fmt.Print(err)
	}

	fmt.Println("get user profile", m)
	facebookUser.ID = processAuthFromOutside(facebookUser)
	fmt.Print(st.Values["client_id"])

	var redirect_uri string = st.Values["redirect_uri"].([]string)[0]

	var client *models.Client

	c, err := clientStore.GetByID(st.Values["client_id"].([]string)[0])
	client = c.(*models.Client)
	state = st.Values["state"].([]string)[0]
	st2, err := sessionStore.Get(r, "Token")
	st2.Values["Auth"] = facebookUser

	// ti, err := auth.createTokenFast(client, redirect_uri, "", string(facebookUser.ID), token.Expiry)
	// //if ti.ClientID != nil {
	// st.Values["ClientID"] = ti.ClientID
	// //}
	// //if ti.UserID != nil {
	// st.Values["UserID"] = ti.UserID
	// //	}

	// //if ti.RedirectURI != nil {
	// st.Values["RedirectURI"] = ti.RedirectURI
	// //	}

	// //if ti.Scope != nil {
	// st.Values["Scope"] = ti.Scope
	// //}
	// //if ti.Code != nil {
	// st.Values["Code"] = ti.Code
	// st.AddFlash("IsFirst", true)
	// //}

	// //if ti.CodeCreateAt != nil {
	// st.Values["CodeCreateAt"] = ti.CodeCreateAt
	// //}

	// //if ti.CodeCreateAt != nil {
	// st.Values["CodeExpiresIn"] = ti.CodeExpiresIn
	// //}

	// //if ti.Access != nil {
	// st.Values["Access"] = ti.Access
	// //}

	// //if ti.Refresh != nil {
	// st.Values["Refresh"] = ti.Refresh
	// //}

	// //if ti.RefreshCreateAt != nil {
	// st.Values["RefreshCreateAt"] = ti.RefreshCreateAt
	// //}

	// //if ti.RefreshExpiresIn != nil {
	// st.Values["RefreshExpiresIn"] = ti.RefreshExpiresIn
	// //}

	// st.Values["State"] = state

	// st.Save(r, w)
	// var buf bytes.Buffer

	// // v.Set("state", st.Values["state"].([]string)[0])

	// if strings.Contains(redirect_uri, "?") {
	// 	buf.WriteByte('&')
	// } else {
	// 	buf.WriteByte('?')
	// }

	// buf.WriteString(v.Encode())
	// fmt.Print(redirect_uri)

	// auth.Server.GetTokenData(ti)

	// err = auth.token(w, auth.Server.GetTokenData(ti), nil)

	// http.Redirect(w, r, buf.String(), http.StatusTemporaryRedirect)

	// st2, _ := sessionStore.Get(r, "Token")
	// data, ok := st2.Values["Auth"]

	var req *server.AuthorizeRequest = &server.AuthorizeRequest{}
	req.Scope = ""

	//again create code
	req.ResponseType = "code"

	req.RedirectURI = redirect_uri
	req.Request = r
	req.State = state
	req.UserID = string(facebookUser.ID)
	req.ClientID = client.ID
	req.AccessTokenExp = facebookUser.Expired

	tgr := &gpkg.TokenGenerateRequest{
		ClientID:       req.ClientID,
		UserID:         req.UserID,
		RedirectURI:    req.RedirectURI,
		Scope:          req.Scope,
		AccessTokenExp: req.AccessTokenExp,
		Request:        req.Request,
	}

	ti, err := auth.Server.Manager.GenerateAuthToken(req.ResponseType, tgr)
	data := auth.Server.GetAuthorizeData(req.ResponseType, ti)

	uri, err := auth.Server.GetRedirectURI(req, data)
	if err != nil {
		return
	}
	w.Header().Set("Location", uri)
	w.WriteHeader(302)
	return
}

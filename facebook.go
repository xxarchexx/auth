package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"

	"golang.org/x/oauth2"
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
	{
		fmt.Println("got response body", m)
		resp, err := http.Get(fmt.Sprintf("https://graph.facebook.com/v5.0/%s/picture?redirect=0&access_token=%s", m["id"], url.QueryEscape(token.AccessToken)))

		if err != nil {

			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		defer resp.Body.Close()

		var m map[string]interface{}
		if err := json.NewDecoder(resp.Body).Decode(&m); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		fmt.Println("get user profile", m)
	}

	http.Redirect(w, r, "/login", http.StatusTemporaryRedirect)
}

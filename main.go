package main

import (
	"encoding/json"
	"fmt"

	"log"
	"net/http"
	"os"
	"time"

	"github.com/xxarchexx/auth/database"
	"github.com/xxarchexx/auth/pages"
)

func main() {
	pages.LoadPage()
	database.InitPgx()
	initAuth()

	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/auth", authHandler)
	http.HandleFunc("/facebooklogin", handleFacebookLogin)
	http.HandleFunc("/oauth2Callback", handleFacebookCallback)
	http.HandleFunc("/registration", registrationHandle)
	http.HandleFunc("/token", tokenHandle)
	http.HandleFunc("/redirect", redirectHandle)
	http.HandleFunc("/authorize", authorizeHandle)

	fs := http.FileServer(http.Dir("dist"))

	// http.Handle("/static/", http.StripPrefix("/static/", fs))
	http.Handle("/dist/", http.StripPrefix("/dist/", fs))

	// http.HandleFunc("/confim/", confirmHandler)

	//var letterRunes = []rune("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

	http.HandleFunc("/button", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
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

func test(w http.ResponseWriter, r *http.Request) {
	log.Print("confimt pattern is not correct")
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

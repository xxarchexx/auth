package main

//

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"time"

	"./pages"
	"./users"
	"github.com/dgrijalva/jwt-go"
	"github.com/go-session/session"

	"github.com/gorilla/sessions"

	"gopkg.in/oauth2.v3/errors"
	"gopkg.in/oauth2.v3/generates"
	"gopkg.in/oauth2.v3/manage"
	"gopkg.in/oauth2.v3/server"
)

type clientsStruct struct {
	sessionid string
	id        string
	secret    string
	domain    string
}

/* #region Main */
var (
	key        = []byte("super-secret-key")
	store      = sessions.NewCookieStore(key)
	clientInfo = clientsStruct{sessionid: "test", secret: "test", domain: "http://localhost:8080"}
)

func registerClients(w http.ResponseWriter, r *http.Request) {
	session, _ := store.Get(r, clientInfo.id)
	session.Values[clientInfo.id] = clientInfo

	// store.Get(clientInfo.id, &models.Client{
	// 	ID:     clientInfo.id,
	// 	Secret: clientInfo.secret,
	// 	Domain: clie,
	// })
}

/* #endregion  */
func userAuthorizeHandler(w http.ResponseWriter, r *http.Request) (userID string, err error) {
	store, err := store.Get(r, "AuthSession")

	if err != nil {
		return
	}

	if err != nil {
		if r.Form == nil {
			r.ParseForm()
		}

		store.Values["ReturnUri"] = r.Form
		store.Save(r, w)

		w.Header().Set("Location", "/login")
		w.WriteHeader(http.StatusFound)
		return
	}

	i, ok := store.Values["LoggedInUserID"]

	if !ok {
		if r.Form == nil {
			r.ParseForm()
		}

		store.Values["ReturnUri"] = r.Form
		store.Save(r, w)

		w.Header().Set("Location", "/login")
		w.WriteHeader(http.StatusFound)
		return
	}

	return
}

//Responsedata
type ResponseData struct {
	RedirectURL string
}

func main() {

	// s := "/confirm/123"

	// s := "/confirm/1223232fff3"
	// re1, _ := regexp.Compile(`/confirm/([\d+\w+]*)`)
	// result := re1.FindStringSubmatch(s)
	// ss := len(result)
	// log.Print(ss)
	// fmt.Printf(result[1])
	// for k, v := range result {
	// 	fmt.Printf("%d. %s\n", k, v)
	// }

	// return

	//return

	pages.LoadPage()
	manager := manage.NewDefaultManager()

	manager.SetAuthorizeCodeTokenCfg(manage.DefaultAuthorizeCodeTokenCfg)
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	http.HandleFunc("/index2", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Location", "/index3")
		w.WriteHeader(http.StatusFound)
	})

	// token store
	manager.MustTokenStorage(store.new())

	// generate jwt access24341 token
	manager.MapAccessGenerate(generates.NewJWTAccessGenerate([]byte("00000000"), jwt.SigningMethodHS512))

	srv := server.NewServer(server.NewConfig(), manager)

	srv.SetUserAuthorizationHandler(userAuthorizeHandler)

	go srv.SetInternalErrorHandler(func(err error) (re *errors.Response) {
		log.Println("Internal Error:", err.Error())
		return
	})

	srv.SetResponseErrorHandler(func(re *errors.Response) {
		log.Println("Response Error:", re.Error.Error())
	})

	http.HandleFunc("/confim/", confirmHandler)

	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/auth", authHandler)

	type Data struct {
		Users users.User
	}

	//var letterRunes = []rune("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

	http.HandleFunc("/redirect", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "http://www.google.com", 301)
		return
	})

	http.HandleFunc("/registration", func(w http.ResponseWriter, r *http.Request) {

		// w.Header().Set("Content-Type", "application/json")
		// resData := ResponseData{`https://www.alexedwards.net/blog/golang-response-snippets`}
		// js, err := json.Marshal(resData)
		// if err != nil {
		// 	panic(err)
		// }
		// w.Write(js)
		// return

		u := users.User{}
		// uu := &users.User{}
		// uu = &u

		json.NewDecoder(r.Body).Decode(&u)

		u.CreateUser()

		store, _ := session.Start(context, w, r)

		store.Set("userID", u.ID)
		//state session data
		// rand.Seed(time.Now().UnixNano())

		// hash, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.MinCost)

		// if err != nil {
		// 	panic(err)
		// }

		// u.PasswordHahs = string(hash)

		// keyLink := make([]rune, 6)
		// for i := range keyLink {
		// 	keyLink[i] = letterRunes[rand.Intn(len(letterRunes))]
		// }

		// var body = "<p><strong>Спасибо за регистрацию , для завершения регистрации пройдите по ссылке ниже</strong></p><p><a href=\"http://localhost:/configm/%s\">Подтвердите ссылку</a></p>"

		// body = fmt.Sprintf(body, keyLink)

		// mail.SendMessage(string(u.Email), string(body), "Добрый вечер, подтвердите авторизацию")

		// uu.
		// database.Adduser(string(u.Username), string(u.Username), string(u.Email), string(u.PasswordHahs), string(keyLink))

		// if r.Method == "POST" {
		// 	r.ParseForm()
		// 	c := r.FormValue("email")
		// 	fmt.Print(c)
		// }

		// w.Header().Set("Content-Type", "text/html; charset=utf-8")
		// fmt.Fprintf(w, "%s", "TEST")
	})

	// http.HandleFunc("/registration", func(w http.ResponseWriter, r *http.Request) {
	// 	// http.Redirect(w, r, "http://www.google.com", 301)
	// 	// return
	// 	w.Header().Set("Content-Type", "application/json")
	// 	resData := ResponseData{`https://www.alexedwards.net/blog/golang-response-snippets`}
	// 	js, err := json.Marshal(resData)
	// 	if err != nil {
	// 		panic(err)
	// 	}
	// 	w.Write(js)
	// 	return
	// 	u := Users{}
	// 	return
	// 	decoder := json.NewDecoder(r.Body)
	// 	decoder.Decode(&u)
	// 	rand.Seed(time.Now().UnixNano())

	// 	hash, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.MinCost)

	// 	if err != nil {
	// 		panic(err)
	// 	}

	// 	u.PasswordHahs = string(hash)

	// 	keyLink := make([]rune, 6)
	// 	for i := range keyLink {
	// 		keyLink[i] = letterRunes[rand.Intn(len(letterRunes))]
	// 	}

	// 	var body = "<p><strong>Спасибо за регистрацию , для завершения регистрации пройдите по ссылке ниже</strong></p><p><a href=\"http://localhost:/configm/%s\">Подтвердите ссылку</a></p>"

	// 	body = fmt.Sprintf(body, keyLink)

	// 	mail.SendMessage(string(u.Email), string(body), "Добрый вечер, подтвердите авторизацию")
	// 	database.Adduser(string(u.Username), string(u.Username), string(u.Email), string(u.PasswordHahs), string(keyLink))

	// 	// if r.Method == "POST" {
	// 	// 	r.ParseForm()
	// 	// 	c := r.FormValue("email")
	// 	// 	fmt.Print(c)
	// 	// }

	// 	// w.Header().Set("Content-Type", "text/html; charset=utf-8")
	// 	// fmt.Fprintf(w, "%s", "TEST")
	// })

	http.HandleFunc("/button", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		fmt.Fprintf(w, "%s", pages.Pages["button.html"].Body)
	})

	// func loginHandler(w http.ResponseWriter, r *http.Request) {
	// 	store, err := session.Start(nil, w, r)
	// 	if err != nil {
	// 		http.Error(w, err.Error(), http.StatusInternalServerError)
	// 		return
	// 	}

	// 	if r.Method == "POST" {
	// 		store.Set("LoggedInUserID", "000000")
	// 		store.Save()

	// 		w.Header().Set("Location", "/auth")
	// 		w.WriteHeader(http.StatusFound)
	// 		return
	// 	}
	// 	fmt.Fprintf(w, "%s", pages.Pages["login.html"].Body)
	// 	//outputHTML(w, r, "static/login.html")
	// }

	// http.HandleFunc("/login", loginHandler)
	// http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
	// 	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	// 	fmt.Fprintf(w, "%s", pages.Pages["login.html"].Body)
	// })

	http.HandleFunc("/authorize", func(w http.ResponseWriter, r *http.Request) {
		store, err := session.Start(nil, w, r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		print()
		var form url.Values
		if v, ok := store.Get("ReturnUri"); ok {
			form = v.(url.Values)
		}
		r.Form = form

		store.Delete("ReturnUri")
		store.Save()

		err = srv.HandleAuthorizeRequest(w, r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
		}
	})

	http.HandleFunc("/token", func(w http.ResponseWriter, r *http.Request) {
		err := srv.HandleTokenRequest(w, r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	})

	http.HandleFunc("/test", func(w http.ResponseWriter, r *http.Request) {
		token, err := srv.ValidationBearerToken(r)
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
	log.Fatal(http.ListenAndServe(":9096", nil))
}

func test(w http.ResponseWriter, r *http.Request) {
	log.Print("confimt pattern is not correct")
}

func confirmHandler(w http.ResponseWriter, r *http.Request) {
	re1, _ := regexp.Compile(`/confirm/([\d+\w+]*)`)
	store, _ := session.Start(nil, w, r)
	println(store)
	result := re1.FindStringSubmatch(r.URL.Path)
	cntMatches := len(result)
	if cntMatches < 2 {
		log.Print("confimt pattern is not correct")
		return
	}

	fmt.Printf(result[1])
	// for k, v := range result {
	// 	// fmt.Printf("%d. %s\n", k, v)
	// }
	// database.ApproveUserdb(result[1])

	return

}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	store, err := session.Start(nil, w, r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Println("SloginHandler")
	if r.Method == "POST" {
		store.Set("LoggedInUserID", "000000")
		store.Save()

		w.Header().Set("Location", "/auth")
		w.WriteHeader(http.StatusFound)
		return
	}

	fmt.Fprintf(w, "%s", pages.Pages["login.html"].Body)
}

// func loginHandler(w http.ResponseWriter, r *http.Request) {
// 	store, err := session.Start(nil, w, r)
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}
// 	log.Println("SloginHandler")
// 	if r.Method == "POST" {
// 		store.Set("LoggedInUserID", "000000")
// 		store.Save()

// 		w.Header().Set("Location", "/auth")
// 		w.WriteHeader(http.StatusFound)
// 		return
// 	}
// 	outputHTML2(w, r) //, "static/login.html")
// }

func authHandler(w http.ResponseWriter, r *http.Request) {
	store, err := session.Start(nil, w, r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Println("authHandler")
	if _, ok := store.Get("AuthSession"); !ok {
		w.Header().Set("Location", "/login")
		w.WriteHeader(http.StatusFound)
		return
	}

	outputHTML(w, r, "static/auth.html")
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

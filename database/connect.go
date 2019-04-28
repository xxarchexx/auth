package database

import (
	"database/sql"
	"fmt"
	_ "strings"

	_ "github.com/lib/pq"
)

const (
	dbhost = "DBHOST"
	dbport = "DBPORT"
	dbuser = "DBUSER"
	dbpass = "DBPASS"
	dbname = "DBNAME"
)

var db *sql.DB

const string = "Insert Into USERS (name,se"

type Status int

const (
	Added Status = iota
	Faild
	Exixsts
)

const selectstring = "select count (1) from users where email = ?"

//Adduser with check if exists into temp table
func Adduser(name, login, password, email, confimgPassword string) (status Status) {
	//u := User{Name: name, login: login, email: email, password: password}
	db.Query("Select count(1) from users where email =?", email)
	defer rows.Close()
	var cntRow int = 0
	err = db.Query(selectstring, email).Scan(&cntRow)
	if err != nil {
		return Faild
		panic(err)
	}
	if cntRow > 0 {
		return Exixsts
	}

	db.Exec("Insert Into TEMP_USERS (USERNAME,LOGIN,PASSWORD,EMAIL,TEMP_LINK", name, login, password, email, "33")

	return Added
}

func initDb() {
	config := dbConfig()
	var err error
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s "+
		"password=%s dbname=%s sslmode=disable",
		config[dbhost], config[dbport],
		config[dbuser], config[dbpass], config[dbname])

	db, err = sql.Open("postgres", psqlInfo)
	err = db.Ping()

	if err != nil {
		panic(err)
	}

	if err != nil {
		panic(err)
	}
	err = db.Ping()
	if err != nil {
		panic(err)
	}
	fmt.Println("Successfully connected!")
}

func dbConfig() map[string]string {
	conf := make(map[string]string)

	conf[dbhost] = "localhost"
	conf[dbport] = "5432"
	conf[dbuser] = "docker"
	conf[dbpass] = "docker"
	conf[dbname] = "auth_service"
	return conf
}

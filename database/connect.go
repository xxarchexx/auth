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

type Status int

const (
	Added Status = iota
	Faild
	Exixsts
)

const selectstring = "select count (1) from users where email = ?"

func InitDb() {
	config := dbConf()
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

func dbConf() map[string]string {
	conf := make(map[string]string)

	conf[dbhost] = "localhost"
	conf[dbport] = "5432"
	conf[dbuser] = "docker"
	conf[dbpass] = "docker"
	conf[dbname] = "auth_service"
	return conf
}

package database

import (
	"database/sql"
	"fmt"
	"log"
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

//ApproveUser db//
func ApproveUserdb(confimCode string) bool {
	_, err := db.Exec(`insert into users (name,password,email,approve_date) 
	select name,password,email,current_date as approve_date from users_temp
	where temp_link = $1 `, confimCode)

	if err != nil {
		panic(err)
	}

	_, err = db.Exec(`delete from users_temp where temp_link = $1 `, confimCode)

	if err != nil {
		panic(err)
	}

	return true
}

//Adduser with check if exists into temp table
func Adduser(name, login, password, email, tempCode string) (status Status) {
	//u := User{Name: name, login: login, email: email, password: password}
	cntRow := 0

	rows, err := db.Query("Select count(1) from users where name = $1", "test")

	defer rows.Close()

	if err != nil {
		log.Fatal(err)
	}

	for rows.Next() {
		// var name string
		if err := rows.Scan(&cntRow); err != nil {
			// Check for a scan error.
			// Query rows will be closed with defer.
			log.Fatal(err)
		}
		log.Print(cntRow)
	}

	if cntRow > 0 {
		return Exixsts
	}

	// if CntRow > 0 {
	// 	return Exixsts
	// }

	db.Exec("Insert Into users (USERNAME,LOGIN,PASSWORD,EMAIL,TEMP_LINK) values($1, $2, $3, $4, $5)", name, login, password, email, tempCode)
	return Exixsts
	// return Added
}

//InitDb
func InitDb() {
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

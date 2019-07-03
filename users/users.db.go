package users

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

var db *sql.DB

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
func addToDb(name, login, password, email string) (userid uint) {
	initDb()
	defer db.Close()
	//u := User{Name: name, login: login, email: email, password: password}
	cntRow := 0

	rows, err := db.Query("Select id from users where login = $1", login)

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
		return 1
	}

	_, err = db.Exec("Insert Into users (NAME,LOGIN,PASSWORD,EMAIL) values($1, $2, $3, $4)", name, login, password, email)
	if err != nil {
		log.Fatal(err)
	}
	row := db.QueryRow(" select max(id) id from users ")

	row.Scan(&userid)

	return userid
}

const (
	dbhost = "DBHOST"
	dbport = "DBPORT"
	dbuser = "DBUSER"
	dbpass = "DBPASS"
	dbname = "DBNAME"
)

func initDb() {
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

package auth_clients

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

var db *sql.DB

//ApproveUser db//
func ApproveUserdb(confimCode string) bool {
	_, err := db.Exec(`c `, confimCode)

	if err != nil {
		panic(err)
	}

	_, err = db.Exec(`delete from users_temp where temp_link = $1 `, confimCode)

	if err != nil {
		panic(err)
	}

	return true
}

func verifyUserByPassword(login string) (id uint, dbpasword string, err error) {
	err = initDb()
	row := db.QueryRow("Select id,password from users where login = $1", login)
	row.Scan(&id, &dbpasword)
	return
}

//Adduser with check if exists into temp table
func addToDb(name, login, password, email string) (userid uint, err error) {
	err = initDb()

	if err != nil {
		return 0, err
	}

	defer db.Close()
	//u := User{Name: name, login: login, email: email, password: password}
	cntRow := 0

	rows, err := db.Query("Select count(1) from users where login = $1", login)
	if err != nil {
		return 0, err
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
		return 0, err
	}

	_, err = db.Exec("Insert Into users (NAME,LOGIN,PASSWORD,EMAIL) values($1, $2, $3, $4)", name, login, password, email)
	if err != nil {
		return 0, err
		log.Fatal(err)
	}
	row := db.QueryRow(" select max(id) id from users ")

	row.Scan(&userid)
	return
}

const (
	dbhost = "DBHOST"
	dbport = "DBPORT"
	dbuser = "DBUSER"
	dbpass = "DBPASS"
	dbname = "DBNAME"
)

func initDb() (err error) {
	config := dbConf()

	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s "+
		"password=%s dbname=%s sslmode=disable",
		config[dbhost], config[dbport],
		config[dbuser], config[dbpass], config[dbname])

	db, err = sql.Open("postgres", psqlInfo)

	if err != nil {
		panic(err)
		return err
	}

	err = db.Ping()

	if err != nil {
		panic(err)
		return err
	}

	err = db.Ping()
	if err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected!")
	return
}

func dbConf() map[string]string {
	conf := make(map[string]string)

	conf[dbhost] = "localhost"
	conf[dbport] = "5432"
	conf[dbuser] = "admin"
	conf[dbpass] = "12345"
	conf[dbname] = "AUTH_SERVICE"
	return conf
}

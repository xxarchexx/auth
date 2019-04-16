package database

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

type user_data struct {
	userid   int
	name     int
	password string
	email    string
}

type usr_data struct {
	users []user_data
}

const (
	dbhost = "DBHOST"
	dbport = "DBPORT"
	dbuser = "DBUSER"
	dbpass = "DBPASS"
	dbname = "DBNAME"
)

func selectUsers(users *usr_data) error {
	rows, err := db.Query(`
		Select id,name,address,email from users
	`)

	defer rows.Close()

	for rows.Next() {
		user := user_data{}
		err = rows.Scan(
			&user.userid,
			&user.name,
			&user.email,
		)

		if err != nil {
			return err
		}
	}

	err = rows.Err()

	if err != nil {
		return err
	}

	return nil
}

var db *sql.DB

func initDb() {
	config := dbConfig()
	var err error
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s "+
		"password=%s dbname=%s sslmode=disable",
		config[dbhost], config[dbport],
		config[dbuser], config[dbpass], config[dbname])

	db, err = sql.Open("postgres", psqlInfo)
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
	// host, ok := os.LookupEnv(dbhost)
	// if !ok {
	// 	panic("DBHOST environment variable required but not set")
	// }
	// port, ok := os.LookupEnv(dbport)
	// if !ok {
	// 	panic("DBPORT environment variable required but not set")
	// }
	// user, ok := os.LookupEnv(dbuser)
	// if !ok {
	// 	panic("DBUSER environment variable required but not set")
	// }
	// password, ok := os.LookupEnv(dbpass)
	// if !ok {
	// 	panic("DBPASS environment variable required but not set")
	// }
	// name, ok := os.LookupEnv(dbname)
	// if !ok {
	// 	panic("DBNAME environment variable required but not set")
	// }
	conf[dbhost] = "localhost"
	conf[dbport] = "5432"
	conf[dbuser] = "docker"
	conf[dbpass] = "docker"
	conf[dbname] = "auth_service"
	return conf
}

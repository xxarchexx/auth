package database

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx"
	"github.com/joho/godotenv"
)

// postgresql://
// postgresql://localhost
// postgresql://localhost:5432
// postgresql://localhost/mydb
// postgresql://user@localhost
// postgresql://user:secret@localhost
// postgresql://other@localhost/otherdb?connect_timeout=10&application_name=myapp
// postgresql://localhost/mydb?user=other&password=secret

//Conn
var Conn *pgx.Conn

func initEnv() {
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}
}

//InitPgx
func InitPgx() {
	initEnv()

	host, _ := os.LookupEnv("dbhost")
	port, _ := os.LookupEnv("dbport")
	username, _ := os.LookupEnv("dbuser")
	password, _ := os.LookupEnv("dbpass")
	database, _ := os.LookupEnv("dbname")
	var sqlconn string = fmt.Sprintf(`postgresql://%s:%s/%s?user=%s&password=%s`, host, port, database, username, password)
	fmt.Printf(sqlconn)

	connection, err := pgx.Connect(context.Background(), sqlconn)
	if err != nil {
		fmt.Print(err)
		return
	}
	fmt.Printf("OKK")
	Conn = connection

}

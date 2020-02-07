package users

import (
	"context"
	_ "database/sql"
	"fmt"
	"log"
	"github.com/xxarchexx/auth/database"
)

//ApproveUser db//
func ApproveUserdb(confimCode string) bool {
	_, err := database.Conn.Exec(context.Background(), `c `, confimCode)

	if err != nil {
		panic(err)
	}

	_, err = database.Conn.Exec(context.Background(), `delete from users_temp where temp_link = $1 `, confimCode)

	if err != nil {
		panic(err)
	}

	return true
}

func verifyUserByPassword(login string) (id uint, dbpasword string, err error) {
	err = database.Conn.QueryRow(context.Background(), "Select id,password from users where login = $1", login).Scan(&id, &dbpasword)
	if err != nil {
		return 0, "", err
	}
	return
}

//Adduser with check if exists into temp table
func (user *user) addToDb() (userid uint, err error) {

	//u := User{Name: name, login: login, email: email, password: password}
	cntRow := 0

	rows, err := database.Conn.Query(context.Background(), "Select count(1) from users where login = $1", user.Login)
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

	_, err = database.Conn.Exec(context.Background(), "Insert Into users (NAME,LOGIN,PASSWORD,EMAIL) values($1, $2, $3, $4)", user.Name, user.Login, user.Password, user.Email)

	if err != nil {
		return 0, err
	}
	row := database.Conn.QueryRow(context.Background(), " select max(id) id from users ")

	err = row.Scan(&userid)
	if err != nil {
		return 0, err
	}

	return
}

func (user *user) dbCreateUserFromFacebook() (err error) {
	tx, err := database.Conn.Begin(context.Background())

	tx.Exec(context.Background(), `insert into USERS
		   (name,      login ,  email, userid_fromprovider, email_from_provider, token_provider, first_name_from_provider, last_name_from_provider) 
	Values($1,    		$2,       $3,       $4,     				  $5,      		   $6      ,          		 $7,					$8			);`,
		user.FirstNameFromProvider,
		user.EmailFromProvider,
		user.LastNameFromProvider,
		user.UserIDFromProvider,
		user.EmailFromProvider,
		user.TokenFromProvider,
		user.FirstNameFromProvider,
		user.LastNameFromProvider,
	)

	var id uint
	tx.QueryRow(context.Background(), "select currval('users_id_seq')").Scan(&id)
	tx.Commit(context.Background())
	if err != nil {
		fmt.Println(err)
	}

	user.ID = id
	return
}

func (user *user) dbCheckUseExist() bool {

	var cnt int = 0
	if user.LoginType == 1 {
		rows := database.Conn.QueryRow(context.Background(), "Select count(1) from USERS where login = $1", user.EmailFromProvider)
		rows.Scan(&cnt)
	}

	return cnt > 0
}

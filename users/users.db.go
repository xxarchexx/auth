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
func (user *user) addToDb() error {

	//u := User{Name: name, login: login, email: email, password: password}

	rows, err := database.Conn.Query(context.Background(), "Select ID,LOGIN from users where email = $1", user.Email)
	if err != nil {
		return err
	}

	for rows.Next() {
		// var name string
		if err := rows.Scan(&user.ID, &user.Login); err != nil {
			// Check for a scan error.
			// Query rows will be closed with defer.
			log.Fatal(err)
		}
	}

	if user.ID > 0 {
		//just random choise mean if user already exists(had redistrated before) - 22
		user.LoginType = 22
		return nil
	}

	tx, err := database.Conn.Begin(context.Background())

	_, err = tx.Exec(context.Background(), "Insert Into users (NAME,LOGIN,PASSWORD,EMAIL) values($1, $2, $3, $4)", user.Name, user.Login, user.Password, user.Email)

	if err != nil {
		tx.Rollback(context.Background())
		return err
	}

	err = tx.QueryRow(context.Background(), "select currval('users_id_seq')").Scan(&user.ID)

	if err != nil {
		tx.Rollback(context.Background())
		return err
	}

	tx.Commit(context.Background())
	return nil
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

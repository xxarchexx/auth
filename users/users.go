package users

import (
	"fmt"
	"time"

	"golang.org/x/crypto/bcrypt"
)

func compare(hash string, s string) error {
	incoming := []byte(s)
	existing := []byte(hash)
	return bcrypt.CompareHashAndPassword(incoming, existing)
}

func generate(s string) (string, error) {
	passwordBytes := []byte(s)
	hashedBytes, err := bcrypt.GenerateFromPassword(passwordBytes, bcrypt.MinCost)
	return string(hashedBytes), err
}

type User struct {
	ID          uint
	Name        string
	Login       string
	Username    string
	Password    string
	ApproveDate time.Time
	Email       string
}

func (usr *User) CreateUser() (err error) {
	usr.Password, _ = generate(usr.Password)
	usr.ID, err = addToDb(usr.Name, usr.Login, usr.Password, usr.Email)
	return err
}

func (usr *User) VerifyUser(login, password string) bool {
	userid, respassword, err := verifyUserByPassword(login)
	if err != nil {
		return false
	}
	err = bcrypt.CompareHashAndPassword([]byte(respassword), []byte(password))
	if err == nil {
		usr.ID = userid
		fmt.Print("GOOD")
		return true
	}

	return false
}

type Status int

const (
	Added Status = iota
	Faild
	Exixsts
)

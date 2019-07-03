package users

import (
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
	hashedBytes, err := bcrypt.GenerateFromPassword(passwordBytes, bcrypt.DefaultCost)
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

func (usr *User) CreateUser() {
	usr.Password, _ = generate(usr.Password)
	usr.ID = addToDb(usr.Name, usr.Login, usr.Password, usr.Email)
}

type Status int

const (
	Added Status = iota
	Faild
	Exixsts
)

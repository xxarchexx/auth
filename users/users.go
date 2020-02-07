package users

import (
	"fmt"
	"time"

	"github.com/xxarchexx/auth/models"
	"golang.org/x/crypto/bcrypt"
)

type Status int

const (
	Added Status = iota
	Faild
	Exixsts
)

type user struct {
	LoginType             int
	ID                    uint
	Name                  string
	Login                 string
	Username              string
	Password              string
	ApproveDate           time.Time
	Email                 string
	UserIDFromProvider    uint64
	EmailFromProvider     string
	TokenFromProvider     string
	FirstNameFromProvider string
	LastNameFromProvider  string
	Expired               time.Duration
}

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

func CreateUser(usr models.User) (err error) {
	usr.Password, _ = generate(usr.Password)
	var u user = user(usr)
	u.ID, err = u.addToDb()
	return err
}

func VerifyUser(usr models.User) bool {
	userid, respassword, err := verifyUserByPassword(usr.Login)
	if err != nil {
		return false
	}

	err = bcrypt.CompareHashAndPassword([]byte(respassword), []byte(usr.Password))
	if err == nil {
		usr.ID = userid
		fmt.Print("GOOD")
		return true
	}

	return false
}

func ProcessFromProviderUser(u *models.User) uint {
	var _user user = user(*u)
	exist := _user.checkUseExist()
	if exist {
		return 0
	}
	_user.createUserFromFacebok()
	fmt.Print(exist)
	return _user.ID
}

func (user *user) checkUseExist() bool {
	exist := user.dbCheckUseExist()

	return exist
}

func (user *user) createUserFromFacebok() {
	user.dbCreateUserFromFacebook()
}

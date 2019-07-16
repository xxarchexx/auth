package users

import (
	"fmt"
	"testing"

	"golang.org/x/crypto/bcrypt"
)

func TestCgenerate(t *testing.T) {
	got, _ := generate("12345")

	fmt.Print(got)
	fmt.Print("\n")
}

func TestCompare(t *testing.T) {
	byteHash := []byte("$2a$10$K2vRMQ4ddGQBcO69i.wgMeAOy/SbJ70VrAZ/f7DKjMI2gdK5bxvrG")
	err := bcrypt.CompareHashAndPassword(byteHash, []byte("12345"))

	fmt.Print(err)
	//fmt.Print("\n")
}

// func VerifyUser(t *testing.T) {
// 	initDb()
// 	got, _ := generate("test")
// 	want := "test2"
// 	fmt.Print(got)
// 	t.Log(got)
// 	t.Log(want)
// }

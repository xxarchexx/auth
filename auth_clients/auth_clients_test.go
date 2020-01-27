package auth_clients

import (
	"fmt"
	"testing"

	"github.com/xxarchexx/auth/database"
	"github.com/xxarchexx/auth/models"
)

var clients []models.AuthApps

func Test(t *testing.T) {
	database.InitPgx()

	res, err := FillClients()
	if err != nil {
		fmt.Print(err)
		fmt.Print("baad")
	} else {
		fmt.Print("good")
	}
	for _, v := range res {
		fmt.Printf("%d\n", v.ID)
		fmt.Printf("%s\n", v.NAME)
	}

}

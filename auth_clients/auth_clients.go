package auth_clients

import (
	"github.com/xxarchexx/auth/models"
)

func GetClients() []models.AuthApps {
	return AuthApps
}

var AuthApps []models.AuthApps

func FillClients() error {
	res, err := fillClientsFromDb()
	if err != nil {
		return err
	}
	AuthApps = res
	return nil
}

package auth_apps

import (
	"errors"

	"github.com/xxarchexx/auth/models"
)

func GetClients() []models.AuthApp {
	return AuthApps
}

var AuthApps []models.AuthApp

func FillClients() error {
	res, err := fillClientsFromDb()
	if err != nil {
		return err
	}
	AuthApps = res
	return nil
}

func GetAppByID(clientID string) (*models.AuthApp, error) {
	for _, v := range AuthApps {
		if v.CLIENT_ID == clientID {
			return &v, nil
		}
	}
	return nil, errors.New("nil")
}

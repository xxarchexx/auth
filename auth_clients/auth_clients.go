package auth_clients

import (
	"github.com/xxarchexx/auth/models"
)

func GetClients() {

}

func FillClients() ([]models.AuthApps, error) {
	return fillClientsFromDb()
}

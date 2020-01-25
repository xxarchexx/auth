package auth_clients

import (
	"gopkg.in/oauth2.v3/models"
)

//ClientApps for registred
type ClientApps struct {
	Clients []models.Client
}

var ClientApps clients = ClientApps{}

func GetClients(clients *ClientApps) {
	return clients
}

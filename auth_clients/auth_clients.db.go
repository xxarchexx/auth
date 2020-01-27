package auth_clients

import (
	"context"

	_ "github.com/lib/pq"
	"github.com/xxarchexx/auth/database"
	"github.com/xxarchexx/auth/models"
)

//fillClientsFromDb fill
func fillClientsFromDb() ([]models.AuthApps, error) {

	var authApps []models.AuthApps = make([]models.AuthApps, 0)

	rows, err := database.Conn.Query(context.Background(), "select ID, NAME, cast(client_id as varchar) CLIENT_ID, cast(SECRET_ID as varchar) SECRET_ID, REDIRECT_URI from public.auth_apps ")

	if err != nil {
		return nil, err
	}
	for rows.Next() {
		app := models.AuthApps{}

		err := rows.Scan(&app.ID, &app.NAME, &app.CLIENT_ID, &app.SECRET_ID, &app.REDIRECT_URI)

		if err != nil {
			return nil, err
		}

		authApps = append(authApps, app)

	}

	return authApps, nil
}

// func setClientToDB - manually

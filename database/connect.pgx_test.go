package database

import "testing"

func Test(t *testing.T) {
	InitPgx()
	rows, err := database.Conn.Query(context.Background(), "select from public.auth_apps ")
}

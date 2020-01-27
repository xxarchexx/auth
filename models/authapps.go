package models

//AuthApps applications that registration in system
type AuthApps struct {
	ID           int
	NAME         string
	CLIENT_ID    string
	SECRET_ID    string
	REDIRECT_URI string
}

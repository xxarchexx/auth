package models

import "time"

type User struct {
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

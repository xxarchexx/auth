package models

import "time"

type User struct {
	LoginType             int
	ID                    uint
	Name                  string `json:"firstname,omitempty"`
	LastName              string `json:"lastname,omitempty"`
	Login                 string `json:"login,omitempty"`
	Password              string `json:"password,omitempty"`
	ApproveDate           time.Time
	Email                 string `json:"email,omitempty"`
	UserIDFromProvider    uint64
	EmailFromProvider     string
	TokenFromProvider     string
	FirstNameFromProvider string
	LastNameFromProvider  string
	Expired               time.Duration
}

package mail

import (
	"net/smtp"

	"gopkg.in/gomail.v2"
)

type message struct {
	client *smtp.Client
	From   string
	To     string
	Subj   string
	Body   string
}

//SendMessage smpt message
func SendMessage(to, body, subject string) {
	m := gomail.NewMessage()
	m.SetHeader("From", "testgmail.com")
	m.SetHeader("To", "test@mail.ru")
	m.SetBody("text/html", body)
	d := gomail.NewDialer("smtp.test.com", 25, "tests@gmail.com", "test")
	err := d.DialAndSend(m)
	if err != nil {
		panic(err)
	}

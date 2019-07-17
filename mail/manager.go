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
	m.SetHeader("From", "22@gmail.com")
	m.SetHeader("To", "22@mail.ru")
	// m.SetAddressHeader("Cc", "")
	m.SetBody("text/html", body)
	d := gomail.NewDialer("smtp.11.com", 25, "1@gmail.com", "1@93dy")
	err := d.DialAndSend(m)2
	if err != nil {
		panic(err)
	}
}

// msg := message{}
// msg.client =

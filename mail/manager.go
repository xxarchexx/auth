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
	m.SetHeader("From", "sansolovyov19866@gmail.com")
	m.SetHeader("To", to)
	// m.SetAddressHeader("Cc", "")
	m.SetBody("text/html", "Hello<b>Bob</b>!")
	d := gomail.NewDialer("smtp.gmail.com", 25, "sansolovyov19866@gmail.com", "Alexander14a@93dy")
	err := d.DialAndSend(m)
	if err != nil {
		panic(err)
	}
}

// msg := message{}
// msg.client =

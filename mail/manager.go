package mailll

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

func SendMessage() {
	m := gomail.NewMessage()
	m.SetHeader("From", "sansolovyov19866@gmail.com")
	m.SetHeader("To", "sansolovyov@mail.ru")
	// m.SetAddressHeader("Cc", "")
	m.SetBody("text/html", "Hello<b>Bob</b>!")
	d := gomail.NewDialer("smtp.gmail.com", 25, "sansolovyov19866@gmail.com", "Alexander14a@93dy")

	if err := d.DialAndSend(m); err != nil {
		panic(err)
	}

	// msg := message{}
	// msg.client =
}

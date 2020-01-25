package pages

import (
	"fmt"
	"io/ioutil"
	"log"
)

//Page struct
type Page struct {
	Title string
	Body  []byte
}

var (
	Pages    map[string]Page
	PageDist map[string]Page
)

//SavePage s
func SavePage(title string, data []byte) {
	p := Page{Body: make([]byte, len(data)), Title: "test"}
	ioutil.WriteFile(p.Title, p.Body, 0600)
}

//LoadPage d
func LoadPage() {
	Pages = make(map[string]Page)
	var files, err = ioutil.ReadDir("views")
	if err != nil {
		log.Fatal(err)
	}
	for _, f := range files {
		b, err2 := ioutil.ReadFile("views/" + f.Name())
		if err2 != nil {
			fmt.Printf("%v\n err", err2)
		}
		p := Page{Title: f.Name(), Body: b}
		Pages[f.Name()] = p
	}
}

//LoadDistPage
func LoadDistPageByName(filename string) {
	PageDist = make(map[string]Page)

	b, err2 := ioutil.ReadFile("dist/" + filename)

	if err2 != nil {
		fmt.Printf("%v\n err", err2)
	}

	p := Page{Title: filename, Body: b}
	PageDist[filename] = p
}

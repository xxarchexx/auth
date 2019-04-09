FROM golang:1.11
LABEL maintainer="Alexander Solovyov <sansolovyov@mail.ru"
WORKDIR $GOPATH/src/auth
COPY . .
RUN go get -d -v ./...
RUN go install -v ./...
EXPOSE 8080
CMD ["auth"]

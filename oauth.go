package main

import (
	"encoding/base64"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	auth_models "github.com/xxarchexx/auth/models"
	users_module "github.com/xxarchexx/auth/users"
	"gopkg.in/oauth2.v3"
	"gopkg.in/oauth2.v3/errors"
	"gopkg.in/oauth2.v3/manage"
	"gopkg.in/oauth2.v3/models"
	"gopkg.in/oauth2.v3/utils/uuid"
)

type AuthType int

// const (
// 	Self     AuthType = 0
// 	Facebook AuthType = 1
// 	Google   AuthType = 2
// )

// GetErrorData get error response data
func (srv *OauthServer) GetErrorData(err error) (data map[string]interface{}, statusCode int, header http.Header) {
	re := new(errors.Response)

	if v, ok := errors.Descriptions[err]; ok {
		re.Error = err
		re.Description = v
		re.StatusCode = errors.StatusCodes[err]
	} else {
		if fn := srv.Server.InternalErrorHandler; fn != nil {
			if vre := fn(err); vre != nil {
				re = vre
			}
		}

		if re.Error == nil {
			re.Error = errors.ErrServerError
			re.Description = errors.Descriptions[errors.ErrServerError]
			re.StatusCode = errors.StatusCodes[errors.ErrServerError]
		}
	}

	if fn := srv.Server.ResponseErrorHandler; fn != nil {
		fn(re)

		if re == nil {
			re = new(errors.Response)
		}
	}

	data = make(map[string]interface{})

	if err := re.Error; err != nil {
		data["error"] = err.Error()
	}

	if v := re.ErrorCode; v != 0 {
		data["error_code"] = v
	}

	if v := re.Description; v != "" {
		data["error_description"] = v
	}

	if v := re.URI; v != "" {
		data["error_uri"] = v
	}

	header = re.Header

	statusCode = http.StatusInternalServerError
	if v := re.StatusCode; v > 0 {
		statusCode = v
	}

	return
}

// Token based on the UUID generated token
func (auth *OauthServer) tokenSign(data *oauth2.GenerateBasic, isGenRefresh bool) (access, refresh string, err error) {
	a := *auth.gen

	type MyCustomClaims struct {
		Userid string `json:"userid"`
		jwt.StandardClaims
	}

	// var standartClaims = jwt.StandardClaims{
	// 	Audience:  data.Client.GetID(),
	// 	Subject:   data.UserID,
	// 	ExpiresAt: data.TokenInfo.GetAccessCreateAt().Add(data.TokenInfo.GetAccessExpiresIn()).Unix(),
	// }

	claims := MyCustomClaims{
		string(data.UserID),
		jwt.StandardClaims{
			Audience:  data.Client.GetID(),
			Subject:   data.UserID,
			ExpiresAt: data.TokenInfo.GetAccessCreateAt().Add(data.TokenInfo.GetAccessExpiresIn()).Unix(),
		},
	}

	uid, err := strconv.ParseUint(data.UserID, 10, 32)
	if err != nil {
		fmt.Println(err)
	}

	wd := uint(uid)

	login := logins[wd]
	fmt.Print(login)
	token := jwt.NewWithClaims(a.SignedMethod, claims)
	var key interface{}

	key, err = jwt.ParseRSAPrivateKeyFromPEM(a.SignedKey)
	if err != nil {
		return "", "", err
	}

	access, err = token.SignedString(key)
	if err != nil {
		return
	}

	if isGenRefresh {
		refresh = base64.URLEncoding.EncodeToString(uuid.NewSHA1(uuid.Must(uuid.NewRandom()), []byte(access)).Bytes())
		refresh = strings.ToUpper(strings.TrimRight(refresh, "="))
	}

	return
}

func (auth *OauthServer) delAuthorizationCode(code string) (err error) {
	// m := auth.Server.Manager
	tokenStore := auth.tokenStore
	err = tokenStore.RemoveByCode(code)
	return
}

// get authorization code data
func (auth *OauthServer) getAuthorizationCode(code string) (info oauth2.TokenInfo, err error) {

	tokenStore := auth.tokenStore
	ti, terr := tokenStore.GetByCode(code)
	if terr != nil {
		err = terr
		return
	} else if ti == nil || ti.GetCode() != code || ti.GetCodeCreateAt().Add(ti.GetCodeExpiresIn()).Before(time.Now()) {
		err = errors.ErrInvalidAuthorizeCode
		return
	}
	info = ti
	return
}

func (auth *OauthServer) getAndDelAuthorizationCode(tgr *oauth2.TokenGenerateRequest) (info oauth2.TokenInfo, err error) {
	code := tgr.Code
	ti, err := auth.getAuthorizationCode(code)
	if err != nil {
		return
	} else if ti.GetClientID() != tgr.ClientID {
		err = errors.ErrInvalidAuthorizeCode
		return
	} else if codeURI := ti.GetRedirectURI(); codeURI != "" && codeURI != tgr.RedirectURI {
		err = errors.ErrInvalidAuthorizeCode
		return
	}

	err = auth.delAuthorizationCode(code)
	if err != nil {
		return
	}
	info = ti
	return
}

func (auth *OauthServer) generateAccessToken(gt oauth2.GrantType, tgr *oauth2.TokenGenerateRequest) (accessToken oauth2.TokenInfo, err error) {
	m := auth.Server.Manager
	tokenStore := auth.tokenStore
	// err = auth.token(w, auth.Server.GetTokenData(ti), nil)
	// code := tgr.Code

	cli, err := m.GetClient(tgr.ClientID)
	if err != nil {
		return
	} else if tgr.ClientSecret != cli.GetSecret() {
		err = errors.ErrInvalidClient
		return
	} else if tgr.RedirectURI != "" {
		if verr := manage.DefaultValidateURI(cli.GetDomain(), tgr.RedirectURI); verr != nil {
			err = verr
			return
		}
	}

	if gt == oauth2.AuthorizationCode {
		// _ := tgr.Code

		ti, verr := auth.getAndDelAuthorizationCode(tgr)
		if verr != nil {
			err = verr
			return
		}
		tgr.UserID = ti.GetUserID()
		tgr.Scope = ti.GetScope()
		if exp := ti.GetAccessExpiresIn(); exp > 0 {
			tgr.AccessTokenExp = exp
		}
	}

	ti := models.NewToken()
	ti.SetClientID(tgr.ClientID)
	ti.SetUserID(tgr.UserID)
	ti.SetRedirectURI(tgr.RedirectURI)
	ti.SetScope(tgr.Scope)

	createAt := time.Now()
	ti.SetAccessCreateAt(createAt)

	var gcfg *manage.Config = &manage.Config{AccessTokenExp: time.Hour * 2, RefreshTokenExp: time.Hour * 24 * 3, IsGenerateRefresh: true}

	if gt == oauth2.AuthorizationCode {
		gcfg = manage.DefaultAuthorizeCodeTokenCfg
	}

	aexp := gcfg.AccessTokenExp
	if exp := tgr.AccessTokenExp; exp > 0 {
		aexp = exp
	}
	ti.SetAccessExpiresIn(aexp)
	if gcfg.IsGenerateRefresh {
		ti.SetRefreshCreateAt(createAt)
		ti.SetRefreshExpiresIn(gcfg.RefreshTokenExp)
	}

	td := &oauth2.GenerateBasic{
		Client:    cli,
		UserID:    tgr.UserID,
		CreateAt:  createAt,
		TokenInfo: ti,
		Request:   tgr.Request,
	}

	av, rv, terr := auth.tokenSign(td, gcfg.IsGenerateRefresh)

	if terr != nil {
		err = terr
		return
	}
	ti.SetAccess(av)

	if rv != "" {
		ti.SetRefresh(rv)
	}

	err = tokenStore.Create(ti)
	if err != nil {
		return
	}
	accessToken = ti

	return
}

func processAuthFromOutside(user auth_models.User) (id uint) {
	id = users_module.ProcessFromProviderUser(&user)
	return
}

//from second provider's token we have created userid in previos step
func (auth *OauthServer) createTokenFast(client *models.Client, redirect_uri, scope, userId string, expiry time.Time) (*models.Token, error) {
	ti := models.NewToken()
	ti.SetClientID(client.ID)
	ti.SetUserID(userId)
	ti.SetRedirectURI(redirect_uri)
	ti.SetScope(scope)

	createAt := time.Now()
	ti.SetAccessCreateAt(createAt)

	var gcfg *manage.Config = &manage.Config{AccessTokenExp: time.Hour * 2, RefreshTokenExp: time.Hour * 24 * 3, IsGenerateRefresh: true}

	if !expiry.IsZero() {
		gcfg.AccessTokenExp = expiry.Sub(createAt)
	}

	aexp := gcfg.AccessTokenExp

	ti.SetAccessExpiresIn(aexp)

	if gcfg.IsGenerateRefresh {
		ti.SetRefreshCreateAt(createAt)
		ti.SetRefreshExpiresIn(gcfg.RefreshTokenExp)
	}

	td := &oauth2.GenerateBasic{
		Client:    client,
		UserID:    userId,
		CreateAt:  createAt,
		TokenInfo: ti,
		// Request:   tgr.Request,
	}

	av, rv, terr := auth.tokenSign(td, gcfg.IsGenerateRefresh)

	if terr != nil {
		err = terr
		return nil, err
	}
	ti.SetAccess(av)

	if rv != "" {
		ti.SetRefresh(rv)
	}

	tokenStore := auth.tokenStore
	err := tokenStore.Create(ti)
	if err != nil {
		return nil, err
	}

	return ti, nil
}

func (srv *OauthServer) tokenError(w http.ResponseWriter, err error) (uerr error) {
	data, statusCode, header := srv.Server.GetErrorData(err)

	uerr = srv.token(w, data, header, statusCode)
	return
}

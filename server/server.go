package server

import (
	"fmt"
	"io/fs"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/nilsleifeld/biblevector"
	"github.com/nilsleifeld/biblevector/domain"
	"github.com/nilsleifeld/biblevector/explorer"
)

func Serve(app *domain.App) {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	if os.Getenv("ENVIRONMENT") == "dev" {
		e.Static("/static", "static")
	} else {
		staticFS, err := fs.Sub(biblevector.StaticFiles, "static")
		if err != nil {
			panic(err)
		}
		e.StaticFS("/static", staticFS)
	}

	explorer.Serve(app, e)

	port := os.Getenv("PORT")
	if port == "" {
		port = "80"
	}
	e.Logger.Fatal(e.Start(fmt.Sprintf(":%s", port)))
}

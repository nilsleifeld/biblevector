package main

import (
	"os"

	"github.com/nilsleifeld/biblevector/database"
	"github.com/nilsleifeld/biblevector/domain"
	"github.com/nilsleifeld/biblevector/pkg/env"
	"github.com/nilsleifeld/biblevector/server"
	"github.com/nilsleifeld/biblevector/store"
)

func main() {
	env.Load()
	if os.Getenv("ENVIRONMENT") == "" {
		err := os.Setenv("ENVIRONMENT", "prod")
		if err != nil {
			panic(err)
		}
	}

	db, err := database.OpenLibSqlBible()
	if err != nil {
		panic(err)
	}
	defer db.Close()

	bibleStore := store.NewSqliteBibleStore(db)
	referencesStore := store.NewLibSqlReferencesStore(db)

	app := domain.App{
		Database:   db,
		Bible:      bibleStore,
		References: referencesStore,
	}

	server.Serve(&app)
}

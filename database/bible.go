package database

import (
	"database/sql"
	"os"

	_ "github.com/tursodatabase/go-libsql"
)

func OpenLibSqlBible() (*sql.DB, error) {
	source := os.Getenv("DB_SOURCE")
	if source == "" {
		source = "file:./data/bible.db"
	}
	db, err := sql.Open("libsql", source)
	if err != nil {
		return nil, err
	}
	return db, nil
}

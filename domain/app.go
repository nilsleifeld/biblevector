package domain

import "database/sql"

type App struct {
	Database   *sql.DB
	Bible      BibleStore
	References ReferencesStore
}

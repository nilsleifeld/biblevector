package biblevector

import "embed"

//go:embed "static"
var StaticFiles embed.FS

//go:embed "templates"
var TemplateFiles embed.FS

//go:embed schema.sql
var BibleDatabaseSchema string

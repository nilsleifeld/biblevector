package explorer

import (
	"encoding/json"
	"html/template"
	"io"

	"github.com/nilsleifeld/biblevector"
)

var indexTemplate = template.Must(template.ParseFS(biblevector.TemplateFiles, "templates/explorer.html"))

func explorer(w io.Writer) error {
	model := map[string]interface{}{}
	json, err := json.Marshal(model)
	if err != nil {
		return err
	}
	if err := indexTemplate.Execute(w, string(json)); err != nil {
		return err
	}
	return nil
}

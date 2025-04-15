package explorer

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/nilsleifeld/biblevector/domain"
)

func Serve(app *domain.App, e *echo.Echo) {
	e.GET("/explorer/api/sections/:sectionId/references", func(c echo.Context) error {
		sectionId, err := strconv.Atoi(c.Param("sectionId"))
		if err != nil {
			return err
		}
		res, err := getChapterReferencesFromSection(sectionId, app.References, app.Bible)
		if err != nil {
			return err
		}
		return c.JSON(http.StatusOK, res)
	})
	e.GET("/explorer/api/books/:book/chapters/:chapter/sections", func(c echo.Context) error {
		book, err := strconv.Atoi(c.Param("book"))
		if err != nil {
			return err
		}
		chapter, err := strconv.Atoi(c.Param("chapter"))
		if err != nil {
			return err
		}
		res, err := getChapterInSections(book, chapter, app.Bible)
		if err != nil {
			return err
		}
		return c.JSON(http.StatusOK, res)
	})
	e.GET("/", func(c echo.Context) error {
		err := explorer(c.Response().Writer)
		if err != nil {
			return err
		}
		c.Response().Header().Set(echo.HeaderContentType, echo.MIMETextHTMLCharsetUTF8)
		c.Response().WriteHeader(http.StatusOK)
		return nil
	})
}

package domain

import (
	"errors"
	"fmt"
	"strings"
)

type BookNumber int

func NewBookNumber(book int) (BookNumber, error) {
	if book < 1 || book > len(Books) {
		return 0, errors.New(fmt.Sprintf("book number must be between 1 and %d", len(Books)))
	}
	return BookNumber(book), nil
}

type ChapterNumber int

var noIdFoundForBibleBook = errors.New("no id found for bible book")

func IsNewTestament(book BookNumber) bool {
	return book >= 40
}

func NewChapterNumber(chapter int) (ChapterNumber, error) {
	// TODO: Add a check for the maximum chapter number for each book and add better error messages
	if chapter < 1 {
		return 0, errors.New("chapter number must be greater than 0")
	}
	return ChapterNumber(chapter), nil
}

func GetBookIdByName(name string) (BookNumber, error) {
	name = strings.TrimSpace(name)

	for i, book := range Books {
		if strings.EqualFold(book.Name, name) {
			return BookNumber(i + 1), nil
		}
	}

	return 0, errors.New(fmt.Sprintf("no id found for bible book %s", name))
}

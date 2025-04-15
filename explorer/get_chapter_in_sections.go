package explorer

import "github.com/nilsleifeld/biblevector/domain"

type getChapterResponse struct {
	Sections []domain.ChapterSection `json:"sections"`
}

func getChapterInSections(book int, chapter int, bible domain.BibleStore) (*getChapterResponse, error) {
	bookNumber, err := domain.NewBookNumber(book)
	if err != nil {
		return nil, err
	}
	chapterNumber, err := domain.NewChapterNumber(chapter)
	if err != nil {
		return nil, err
	}
	sections, err := bible.GetChapterInSections(bookNumber, chapterNumber)
	if err != nil {
		return nil, err
	}
	return &getChapterResponse{
		Sections: sections,
	}, nil
}

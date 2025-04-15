package explorer

import "github.com/nilsleifeld/biblevector/domain"

type getChapterReferencesFromSectionResponse struct {
	Chapter    domain.ChapterNumber      `json:"chapter"`
	Book       domain.BookNumber         `json:"book"`
	Title      string                    `json:"title"`
	StartVerse uint                      `json:"startVerse"`
	EndVerse   uint                      `json:"endVerse"`
	SectionId  int                       `json:"sectionId"`
	References []domain.ChapterReference `json:"references"`
}

func getChapterReferencesFromSection(sectionId int, references domain.ReferencesStore, bible domain.BibleStore) (*getChapterReferencesFromSectionResponse, error) {
	refs, err := references.GetReferencesFromSectionToChapters(sectionId)
	if err != nil {
		return nil, err
	}
	section, err := bible.GetSectionDetails(sectionId)
	return &getChapterReferencesFromSectionResponse{
		References: refs,
		Chapter:    section.Chapter,
		Book:       section.Book,
		Title:      section.Title,
		StartVerse: section.StartVerse,
		EndVerse:   section.EndVerse,
		SectionId:  sectionId,
	}, nil
}

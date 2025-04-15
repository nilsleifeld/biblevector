package domain

type ReferencesStore interface {
	GetReferencesFromSectionToChapters(sectionId int) ([]ChapterReference, error)
}

type ChapterReference struct {
	Book       BookNumber    `json:"book"`
	Chapter    ChapterNumber `json:"chapter"`
	Title      string        `json:"title"`
	StartVerse uint          `json:"startVerse"`
	EndVerse   uint          `json:"endVerse"`
	SectionId  int           `json:"sectionId"`
}

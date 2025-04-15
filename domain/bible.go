package domain

type BibleStore interface {
	GetChapterInSections(book BookNumber, chapter ChapterNumber) ([]ChapterSection, error)
	GetSectionDetails(sectionId int) (*SectionDetails, error)
	GetBookVerses(book BookNumber) ([]Verse, error)
	GetBookSectionsWithVerses(book BookNumber) ([]ChapterSection, error)
}

type SectionDetails struct {
	SectionId  int           `json:"sectionId"`
	Title      string        `json:"title"`
	StartVerse uint          `json:"startVerse"`
	EndVerse   uint          `json:"endVerse"`
	Chapter    ChapterNumber `json:"chapter"`
	Book       BookNumber    `json:"book"`
}

type ChapterSection struct {
	SectionId int           `json:"sectionId"`
	Title     string        `json:"title"`
	Verses    []Verse       `json:"verses"`
	Chapter   ChapterNumber `json:"chapter"`
	Book      BookNumber    `json:"book"`
}

type Verse struct {
	Chapter ChapterNumber `json:"chapter"`
	Text    string        `json:"text"`
	Number  uint          `json:"number"`
}

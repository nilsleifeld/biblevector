package store

import (
	"database/sql"

	"github.com/nilsleifeld/biblevector/domain"
)

type SqliteBibleStore struct {
	db *sql.DB
}

func NewSqliteBibleStore(db *sql.DB) *SqliteBibleStore {
	return &SqliteBibleStore{db: db}
}

func (s *SqliteBibleStore) GetBookSectionsWithVerses(book domain.BookNumber) ([]domain.ChapterSection, error) {
	sections, err := s.getSectionsFromBook(book)
	if err != nil {
		return nil, err
	}
	verses, err := s.getBookVerses(book)
	if err != nil {
		return nil, err
	}

	var bookSections []domain.ChapterSection

	for _, s := range sections {
		chapterSection := domain.ChapterSection{
			SectionId: s.Id,
			Title:     s.Title,
			Book:      book,
			Verses:    []domain.Verse{},
			Chapter:   s.Chapter,
		}

		for _, verse := range verses {
			if verse.Chapter == s.Chapter && verse.Number >= s.StartVerse && verse.Number <= s.EndVerse {
				chapterSection.Verses = append(chapterSection.Verses, verse)
			}
		}
		bookSections = append(bookSections, chapterSection)
	}

	return bookSections, nil
}

func (s *SqliteBibleStore) getBookVerses(book domain.BookNumber) ([]domain.Verse, error) {
	query := `SELECT text, verse, chapter FROM verses WHERE book = :book`
	rows, err := s.db.Query(query, sql.Named("book", book))
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var verses []domain.Verse
	for rows.Next() {
		var verse domain.Verse
		if err := rows.Scan(&verse.Text, &verse.Number, &verse.Chapter); err != nil {
			return nil, err

		}
		verses = append(verses, verse)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return verses, nil
}

func (s *SqliteBibleStore) GetBookVerses(book domain.BookNumber) ([]domain.Verse, error) {
	query := `SELECT text, verse, chapter FROM verses WHERE book = :book`
	rows, err := s.db.Query(query, sql.Named("book", book))
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var verses []domain.Verse
	for rows.Next() {
		var verse domain.Verse
		if err := rows.Scan(&verse.Text, &verse.Number, &verse.Chapter); err != nil {
			return nil, err
		}
		verses = append(verses, verse)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return verses, nil
}

func (s *SqliteBibleStore) GetChapterInSections(book domain.BookNumber, chapter domain.ChapterNumber) ([]domain.ChapterSection, error) {
	verses, err := s.getChapterVerses(book, chapter)
	if err != nil {
		return nil, err
	}
	sections, err := s.getSectionsFromChapter(book, chapter)
	if err != nil {
		return nil, err
	}

	var chapterSections []domain.ChapterSection

	for _, s := range sections {
		chapterSection := domain.ChapterSection{
			Title:     s.Title,
			SectionId: s.Id,
			Verses:    []domain.Verse{},
			Chapter:   s.Chapter,
			Book:      book,
		}
		for _, verse := range verses {
			if verse.Number >= s.StartVerse && verse.Number <= s.EndVerse {
				chapterSection.Verses = append(chapterSection.Verses, verse)
			}
		}
		chapterSections = append(chapterSections, chapterSection)
	}

	return chapterSections, nil
}

func (s *SqliteBibleStore) getSectionsFromBook(book domain.BookNumber) ([]section, error) {
	sql := `SELECT id, title, start_verse, end_verse, chapter FROM sections WHERE book = ?`
	rows, err := s.db.Query(sql, book)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var sections []section
	for rows.Next() {
		var section section
		if err := rows.Scan(&section.Id, &section.Title, &section.StartVerse, &section.EndVerse, &section.Chapter); err != nil {
			return nil, err
		}
		sections = append(sections, section)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return sections, nil
}

type section struct {
	Id         int
	Title      string
	StartVerse uint
	EndVerse   uint
	Chapter    domain.ChapterNumber
}

func (s *SqliteBibleStore) getSectionsFromChapter(book domain.BookNumber, chapter domain.ChapterNumber) ([]section, error) {
	sql := `SELECT id, title, start_verse, end_verse FROM sections WHERE book = ? AND chapter = ?`
	rows, err := s.db.Query(sql, book, chapter)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var sections []section
	for rows.Next() {
		var section section
		if err := rows.Scan(&section.Id, &section.Title, &section.StartVerse, &section.EndVerse); err != nil {
			return nil, err
		}
		section.Chapter = chapter
		sections = append(sections, section)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return sections, nil
}

func (s *SqliteBibleStore) getChapterVerses(book domain.BookNumber, chapter domain.ChapterNumber) ([]domain.Verse, error) {
	query := `SELECT text, verse FROM verses WHERE book = :book AND chapter = :chapter`
	rows, err := s.db.Query(query, sql.Named("book", book), sql.Named("chapter", chapter))
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var verses []domain.Verse
	for rows.Next() {
		var verse domain.Verse
		if err := rows.Scan(&verse.Text, &verse.Number); err != nil {
			return nil, err
		}
		verses = append(verses, verse)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return verses, nil
}

func (s *SqliteBibleStore) GetSectionDetails(sectionId int) (*domain.SectionDetails, error) {
	query := `SELECT title, start_verse, end_verse, chapter, book FROM sections WHERE id = ?`
	row := s.db.QueryRow(query, sectionId)
	var details domain.SectionDetails
	if err := row.Scan(&details.Title, &details.StartVerse, &details.EndVerse, &details.Chapter, &details.Book); err != nil {
		return nil, err
	}
	details.SectionId = sectionId
	return &details, nil
}

package store

import (
	"database/sql"
	"log/slog"

	"github.com/nilsleifeld/biblevector/domain"
)

type LibSqlReferencesStore struct {
	db *sql.DB
}

func NewLibSqlReferencesStore(db *sql.DB) *LibSqlReferencesStore {
	return &LibSqlReferencesStore{db: db}
}

func (s *LibSqlReferencesStore) GetReferencesFromSectionToChapters(
	sectionId int,
) ([]domain.ChapterReference, error) {
	references := []domain.ChapterReference{}

	var hasEmbedding bool
	err := s.db.QueryRow(`
		SELECT COUNT(*)
		FROM sections
		WHERE id = ? AND text_embedding_3_small IS NOT NULL
      LIMIT 1;
	`, sectionId).Scan(&hasEmbedding)
	if err != nil {
		return nil, err
	}
	if !hasEmbedding {
		slog.Warn("The section has no embedding and therefore no references can be determined")
		return references, nil
	}

	rows, err := s.db.Query(`
		SELECT
		   sections.id,
		   book,
			chapter,
			start_verse,
			end_verse,
			title
		FROM vector_top_k('sections_text_embedding_3_small_idx', (select text_embedding_3_small from sections WHERE id = ?), 22) as vector
      JOIN sections on sections.id = vector.id
      WHERE sections.id != ? AND sections.text_embedding_3_small IS NOT NULL
	`, sectionId, sectionId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var ref domain.ChapterReference
		if err := rows.Scan(&ref.SectionId, &ref.Book, &ref.Chapter, &ref.StartVerse, &ref.EndVerse, &ref.Title); err != nil {
			return nil, err
		}
		references = append(references, ref)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return references, nil
}

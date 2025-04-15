CREATE TABLE IF NOT EXISTS verses (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "book" INTEGER NOT NULL,
    "chapter" INTEGER NOT NULL,
    "verse" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "text_embedding_3_small" F32_BLOB(1536)
);

CREATE INDEX "ixb" ON "verses" ("book");
CREATE INDEX "ixc" ON "verses" ("chapter");
CREATE INDEX "ixv" ON "verses" ("verse");
CREATE INDEX "ixbcv" ON "verses" ("book", "chapter", "verse");
CREATE INDEX verses_text_embedding_3_small_idx
    ON verses (libsql_vector_idx("text_embedding_3_small"));

CREATE TABLE IF NOT EXISTS sections (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "book" INTEGER NOT NULL,
    "chapter" INTEGER NOT NULL,
    "start_verse" INTEGER NOT NULL,
    "end_verse" INTEGER,
    "title" TEXT,
    "text_embedding_3_small" F32_BLOB(1536)
);

CREATE INDEX sections_text_embedding_3_small_idx
    ON sections (libsql_vector_idx("text_embedding_3_small"));

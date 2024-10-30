-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT NOT NULL,
    "dateDay" INTEGER NOT NULL,
    "dateMonth" INTEGER NOT NULL,
    "dateYear" INTEGER NOT NULL,
    "favourited" BOOLEAN NOT NULL,
    "publishedAt" DATETIME,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT
);
INSERT INTO "new_Project" ("dateDay", "dateMonth", "dateYear", "description", "favourited", "id", "name", "public", "publishedAt", "shortDescription", "status") SELECT "dateDay", "dateMonth", "dateYear", "description", "favourited", "id", "name", "public", "publishedAt", "shortDescription", "status" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_id_key" ON "Project"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

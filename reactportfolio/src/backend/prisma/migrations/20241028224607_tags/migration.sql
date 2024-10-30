-- CreateTable
CREATE TABLE "Tags" (
    "projectId" INTEGER NOT NULL,
    "tag" TEXT NOT NULL,

    PRIMARY KEY ("projectId", "tag"),
    CONSTRAINT "Tags_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Projects" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT NOT NULL,
    "dateDay" INTEGER NOT NULL,
    "dateMonth" INTEGER NOT NULL,
    "dateYear" INTEGER NOT NULL,
    "favourited" BOOLEAN NOT NULL,
    "publishedAt" DATETIME,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'draft'
);
INSERT INTO "new_Projects" ("dateDay", "dateMonth", "dateYear", "description", "favourited", "id", "name", "public", "publishedAt", "shortDescription", "status") SELECT "dateDay", "dateMonth", "dateYear", "description", "favourited", "id", "name", "public", "publishedAt", "shortDescription", coalesce("status", 'draft') AS "status" FROM "Projects";
DROP TABLE "Projects";
ALTER TABLE "new_Projects" RENAME TO "Projects";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

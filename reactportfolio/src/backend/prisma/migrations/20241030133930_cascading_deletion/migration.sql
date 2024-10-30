-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tags" (
    "projectId" INTEGER NOT NULL,
    "tag" TEXT NOT NULL,

    PRIMARY KEY ("projectId", "tag"),
    CONSTRAINT "Tags_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Tags" ("projectId", "tag") SELECT "projectId", "tag" FROM "Tags";
DROP TABLE "Tags";
ALTER TABLE "new_Tags" RENAME TO "Tags";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

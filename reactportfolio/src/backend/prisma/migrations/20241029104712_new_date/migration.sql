/*
  Warnings:

  - You are about to drop the column `dateDay` on the `Projects` table. All the data in the column will be lost.
  - You are about to drop the column `dateMonth` on the `Projects` table. All the data in the column will be lost.
  - You are about to drop the column `dateYear` on the `Projects` table. All the data in the column will be lost.
  - Added the required column `createdAt` to the `Projects` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Projects" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "favourited" BOOLEAN NOT NULL,
    "publishedAt" TEXT,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'draft'
);
INSERT INTO "new_Projects" ("description", "favourited", "id", "name", "public", "publishedAt", "shortDescription", "status") SELECT "description", "favourited", "id", "name", "public", "publishedAt", "shortDescription", "status" FROM "Projects";
DROP TABLE "Projects";
ALTER TABLE "new_Projects" RENAME TO "Projects";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

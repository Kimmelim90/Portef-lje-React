/*
  Warnings:

  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Project";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Projects" (
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

-- CreateIndex
CREATE UNIQUE INDEX "Projects_id_key" ON "Projects"("id");

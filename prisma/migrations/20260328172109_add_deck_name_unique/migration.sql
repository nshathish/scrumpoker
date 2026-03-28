/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `decks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "decks_name_key" ON "decks"("name");

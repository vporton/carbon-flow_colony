/*
  Warnings:

  - Added the required column `tokenName` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenSymbol` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Organization" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "colonyNickName" TEXT NOT NULL,
    "colonyAddress" BLOB NOT NULL,
    "tokenAddress" BLOB NOT NULL,
    "tokenName" TEXT NOT NULL,
    "tokenSymbol" TEXT NOT NULL
);
INSERT INTO "new_Organization" ("colonyAddress", "colonyNickName", "id", "name", "tokenAddress") SELECT "colonyAddress", "colonyNickName", "id", "name", "tokenAddress" FROM "Organization";
DROP TABLE "Organization";
ALTER TABLE "new_Organization" RENAME TO "Organization";
CREATE INDEX "Organization_colonyNickName_idx" ON "Organization"("colonyNickName");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

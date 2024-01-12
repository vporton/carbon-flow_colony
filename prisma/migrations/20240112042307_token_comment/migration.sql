/*
  Warnings:

  - Added the required column `comment` to the `AddExistingTokenTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comment` to the `CreateNewTokenTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AddExistingTokenTransaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "organizationId" INTEGER NOT NULL,
    "tokenId" BIGINT NOT NULL,
    "comment" TEXT NOT NULL,
    CONSTRAINT "AddExistingTokenTransaction_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AddExistingTokenTransaction_id_fkey" FOREIGN KEY ("id") REFERENCES "Transaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AddExistingTokenTransaction" ("id", "organizationId", "tokenId") SELECT "id", "organizationId", "tokenId" FROM "AddExistingTokenTransaction";
DROP TABLE "AddExistingTokenTransaction";
ALTER TABLE "new_AddExistingTokenTransaction" RENAME TO "AddExistingTokenTransaction";
CREATE TABLE "new_CreateNewTokenTransaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "organizationId" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    CONSTRAINT "CreateNewTokenTransaction_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CreateNewTokenTransaction_id_fkey" FOREIGN KEY ("id") REFERENCES "Transaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CreateNewTokenTransaction" ("id", "organizationId") SELECT "id", "organizationId" FROM "CreateNewTokenTransaction";
DROP TABLE "CreateNewTokenTransaction";
ALTER TABLE "new_CreateNewTokenTransaction" RENAME TO "CreateNewTokenTransaction";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

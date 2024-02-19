/*
  Warnings:

  - You are about to drop the column `blockChecked` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `lastCheckedAt` on the `Transaction` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tx" BLOB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kind" INTEGER NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Transaction" ("confirmed", "createdAt", "id", "kind", "tx") SELECT "confirmed", "createdAt", "id", "kind", "tx" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE UNIQUE INDEX "Transaction_tx_key" ON "Transaction"("tx");
CREATE INDEX "Transaction_confirmed_idx" ON "Transaction"("confirmed");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

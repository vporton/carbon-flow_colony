-- CreateTable
CREATE TABLE "RemoveTokenTransaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "organizationId" INTEGER NOT NULL,
    "tokenId" INTEGER NOT NULL,
    CONSTRAINT "RemoveTokenTransaction_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RemoveTokenTransaction_id_fkey" FOREIGN KEY ("id") REFERENCES "Transaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

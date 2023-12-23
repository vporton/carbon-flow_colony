-- CreateTable
CREATE TABLE "Organization" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "colonyNickName" TEXT NOT NULL,
    "colonyAddress" BLOB NOT NULL,
    "tokenAddress" BLOB NOT NULL,
    "tokenAuthorityAddress" BLOB NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "email" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "OrganizationsUsers" (
    "organizationId" INTEGER NOT NULL,
    "userEmail" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("organizationId", "userEmail"),
    CONSTRAINT "OrganizationsUsers_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrganizationsUsers_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Token" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "OrganizationsTokens" (
    "organizationId" INTEGER NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment" TEXT NOT NULL,

    PRIMARY KEY ("organizationId", "tokenId"),
    CONSTRAINT "OrganizationsTokens_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrganizationsTokens_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChildToken" (
    "parentId" INTEGER NOT NULL,
    "childId" INTEGER NOT NULL,
    "organizationId" INTEGER NOT NULL,

    PRIMARY KEY ("organizationId", "parentId", "childId"),
    CONSTRAINT "ChildToken_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChildToken_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Token" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChildToken_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Token" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tx" BLOB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blockChecked" INTEGER,
    "lastCheckedAt" DATETIME,
    "kind" INTEGER NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "CreateNewTokenTransaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "organizationId" INTEGER NOT NULL,
    CONSTRAINT "CreateNewTokenTransaction_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CreateNewTokenTransaction_id_fkey" FOREIGN KEY ("id") REFERENCES "Transaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AddExistingTokenTransaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "organizationId" INTEGER NOT NULL,
    "tokenId" BIGINT NOT NULL,
    CONSTRAINT "AddExistingTokenTransaction_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AddExistingTokenTransaction_id_fkey" FOREIGN KEY ("id") REFERENCES "Transaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CreateNewOrganizationTransaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tokenName" TEXT NOT NULL,
    "tokenSymbol" TEXT NOT NULL,
    "colonyNickName" TEXT NOT NULL,
    "organizationName" TEXT NOT NULL,
    CONSTRAINT "CreateNewOrganizationTransaction_id_fkey" FOREIGN KEY ("id") REFERENCES "Transaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Organization_colonyNickName_idx" ON "Organization"("colonyNickName");

-- CreateIndex
CREATE INDEX "OrganizationsUsers_organizationId_idx" ON "OrganizationsUsers"("organizationId");

-- CreateIndex
CREATE INDEX "OrganizationsUsers_userEmail_idx" ON "OrganizationsUsers"("userEmail");

-- CreateIndex
CREATE INDEX "OrganizationsTokens_organizationId_idx" ON "OrganizationsTokens"("organizationId");

-- CreateIndex
CREATE INDEX "OrganizationsTokens_tokenId_idx" ON "OrganizationsTokens"("tokenId");

-- CreateIndex
CREATE INDEX "ChildToken_parentId_idx" ON "ChildToken"("parentId");

-- CreateIndex
CREATE INDEX "ChildToken_childId_idx" ON "ChildToken"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_tx_key" ON "Transaction"("tx");

-- CreateIndex
CREATE INDEX "Transaction_confirmed_idx" ON "Transaction"("confirmed");

-- CreateIndex
CREATE INDEX "Transaction_lastCheckedAt_idx" ON "Transaction"("lastCheckedAt");

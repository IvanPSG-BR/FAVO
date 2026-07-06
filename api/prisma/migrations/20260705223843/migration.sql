-- CreateEnum
CREATE TYPE "SEASON" AS ENUM ('SPRING', 'SUMMER', 'AUTUMN', 'WINTER');

-- CreateEnum
CREATE TYPE "CATEGORY" AS ENUM ('HARVEST', 'MINING', 'FORAGE', 'FISHING', 'COMBAT', 'MISC');

-- CreateEnum
CREATE TYPE "QUALITY" AS ENUM ('NORMAL', 'SILVER', 'GOLD', 'IRIDIUM');

-- CreateEnum
CREATE TYPE "TRANSACTION_TYPE" AS ENUM ('INCOME', 'EXPENSE');

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "transactionsId" INTEGER,
    "name" TEXT NOT NULL,
    "quality" "QUALITY" NOT NULL DEFAULT 'NORMAL',
    "quantity" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "category" "CATEGORY" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "totalValue" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "season" "SEASON" NOT NULL,
    "type" "TRANSACTION_TYPE" NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_transactionsId_fkey" FOREIGN KEY ("transactionsId") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

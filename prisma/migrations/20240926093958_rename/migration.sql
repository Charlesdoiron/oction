/*
  Warnings:

  - You are about to drop the column `adjudication` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Ad` table. All the data in the column will be lost.
  - Added the required column `starting_price` to the `Ad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ad" DROP COLUMN "adjudication",
DROP COLUMN "date",
DROP COLUMN "price",
ADD COLUMN     "adjudication_price" INTEGER,
ADD COLUMN     "auction_date" TEXT,
ADD COLUMN     "starting_price" INTEGER NOT NULL,
ADD COLUMN     "visit_date" TEXT,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

/*
  Warnings:

  - You are about to drop the column `description` on the `Jot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Jot" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "JotGroup" ADD COLUMN     "description" TEXT;

/*
  Warnings:

  - You are about to drop the column `counter` on the `Likes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Likes" DROP COLUMN "counter";

-- AlterTable
ALTER TABLE "Notes" ADD COLUMN     "likesCounter" INTEGER NOT NULL DEFAULT 0;

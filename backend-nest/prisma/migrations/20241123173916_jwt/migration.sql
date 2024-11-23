/*
  Warnings:

  - You are about to drop the column `refreshTokens` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "refreshTokens",
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "resetPasswordToken" TEXT,
ADD COLUMN     "resetPasswordTokenExpiresAt" TIMESTAMP(3);

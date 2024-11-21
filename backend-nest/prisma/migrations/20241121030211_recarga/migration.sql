-- AlterTable
ALTER TABLE "User" ADD COLUMN     "expirationToken" TEXT,
ADD COLUMN     "expirationTokenDate" TIMESTAMP(3);

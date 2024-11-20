-- DropForeignKey
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_noteId_fkey";

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "Jot" DROP CONSTRAINT "Jot_jotGroupId_fkey";

-- AddForeignKey
ALTER TABLE "Jot" ADD CONSTRAINT "Jot_jotGroupId_fkey" FOREIGN KEY ("jotGroupId") REFERENCES "JotGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

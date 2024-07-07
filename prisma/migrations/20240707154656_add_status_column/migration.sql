/*
  Warnings:

  - The primary key for the `Organisation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Organisation` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OrganisationToUser" DROP CONSTRAINT "_OrganisationToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrganisationToUser" DROP CONSTRAINT "_OrganisationToUser_B_fkey";

-- AlterTable
ALTER TABLE "Organisation" DROP CONSTRAINT "Organisation_pkey",
DROP COLUMN "id",
ADD COLUMN     "orgId" SERIAL NOT NULL,
ADD CONSTRAINT "Organisation_pkey" PRIMARY KEY ("orgId");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "userId" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- AddForeignKey
ALTER TABLE "_OrganisationToUser" ADD CONSTRAINT "_OrganisationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Organisation"("orgId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganisationToUser" ADD CONSTRAINT "_OrganisationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

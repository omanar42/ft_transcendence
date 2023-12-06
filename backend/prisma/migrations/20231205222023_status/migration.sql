/*
  Warnings:

  - You are about to drop the column `result` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `losses` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `wins` on the `User` table. All the data in the column will be lost.
  - The `status` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `enemyId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `win` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AchievementName" AS ENUM ('LEVEL_10', 'LEVEL_20', 'LEVEL_30', 'LEVEL_40', 'LEVEL_50', 'LEVEL_60', 'LEVEL_70', 'LEVEL_80', 'LEVEL_90', 'LEVEL_100', 'WIN_5_GAMES', 'WIN_10_GAMES', 'WIN_20_GAMES', 'WIN_50_GAMES', 'WIN_100_GAMES', 'FIRST_WIN', 'FIRST_LOSS', 'FIRST_FRIEND', 'Perfect');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ONLINE', 'OFFLINE', 'INGAME');

-- AlterEnum
ALTER TYPE "FriendActions" ADD VALUE 'UNBLOCK';

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "result",
DROP COLUMN "updatedAt",
ADD COLUMN     "enemyId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "win" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "level",
DROP COLUMN "losses",
DROP COLUMN "wins",
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'OFFLINE';

-- CreateTable
CREATE TABLE "Stats" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" SERIAL NOT NULL,
    "name" "AchievementName" NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "statsId" INTEGER NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stats_userId_key" ON "Stats"("userId");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("oauthId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("oauthId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_statsId_fkey" FOREIGN KEY ("statsId") REFERENCES "Stats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

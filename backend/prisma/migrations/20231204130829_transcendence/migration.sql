-- CreateEnum
CREATE TYPE "FriendStatus" AS ENUM ('FRIENDS', 'PENDING', 'BLOCKED');

-- CreateEnum
CREATE TYPE "FriendActions" AS ENUM ('ADD', 'REMOVE', 'ACCEPT', 'REJECT', 'REVOKE', 'BLOCK');

-- CreateTable
CREATE TABLE "User" (
    "oauthId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "provider" TEXT NOT NULL,
    "hashedRt" TEXT,
    "twoFactor" BOOLEAN NOT NULL DEFAULT false,
    "twoFaSec" TEXT,
    "status" TEXT NOT NULL DEFAULT 'offline',
    "level" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Friend" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "FriendStatus" NOT NULL,
    "actions" "FriendActions"[],

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "result" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_oauthId_key" ON "User"("oauthId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("oauthId") ON DELETE RESTRICT ON UPDATE CASCADE;

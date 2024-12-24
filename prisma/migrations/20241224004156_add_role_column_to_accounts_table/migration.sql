-- CreateEnum
CREATE TYPE "role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "role" "role" NOT NULL DEFAULT 'USER';

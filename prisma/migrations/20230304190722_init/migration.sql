-- CreateTable
CREATE TABLE "User" (
    "id" BIGINT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "username" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "always_speak" BOOLEAN NOT NULL DEFAULT false,
    "slow_mode" BOOLEAN NOT NULL DEFAULT false,
    "language" TEXT NOT NULL DEFAULT 'en',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audio" (
    "id" SERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "language" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Audio_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Audio" ADD CONSTRAINT "Audio_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "googleId" TEXT,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT 'https://archive.org/download/instagram-plain-round/instagram%20dip%20in%20hair.jpg',
    "password" TEXT,
    "bio" TEXT,
    "email" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'Accra',
    "region" TEXT NOT NULL DEFAULT 'Greater Accra',
    "phone" TEXT,
    "languages" TEXT[] DEFAULT ARRAY['English']::TEXT[],
    "qualification" TEXT[] DEFAULT ARRAY['Home School']::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gig" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "pitch" TEXT NOT NULL,
    "basicPitch" TEXT NOT NULL,
    "standardPitch" TEXT NOT NULL,
    "premiumPitch" TEXT NOT NULL,
    "basicPrice" DOUBLE PRECISION NOT NULL,
    "standardPrice" DOUBLE PRECISION NOT NULL,
    "premiumPrice" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name");

-- CreateIndex
CREATE INDEX "User_city_idx" ON "User"("city");

-- CreateIndex
CREATE INDEX "User_region_idx" ON "User"("region");

-- CreateIndex
CREATE INDEX "User_languages_idx" ON "User"("languages");

-- CreateIndex
CREATE INDEX "User_qualification_idx" ON "User"("qualification");

-- CreateIndex
CREATE INDEX "User_name_city_region_idx" ON "User"("name", "city", "region");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_email_key" ON "User"("googleId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_userId_key" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Gig_title_idx" ON "Gig"("title");

-- CreateIndex
CREATE INDEX "Gig_category_idx" ON "Gig"("category");

-- CreateIndex
CREATE INDEX "Gig_title_category_idx" ON "Gig"("title", "category");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gig" ADD CONSTRAINT "Gig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

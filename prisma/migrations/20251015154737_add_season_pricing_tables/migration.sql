-- CreateTable
CREATE TABLE "SeasonPeriod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "seasonType" TEXT NOT NULL,
    "pricePerNight" DOUBLE PRECISION NOT NULL,
    "minimumStay" INTEGER NOT NULL,
    "sundayToSunday" BOOLEAN NOT NULL DEFAULT false,
    "year" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeasonPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingSettings" (
    "id" TEXT NOT NULL,
    "cleaningFee" DOUBLE PRECISION NOT NULL DEFAULT 450,
    "linenPerPerson" DOUBLE PRECISION NOT NULL DEFAULT 25,
    "depositAmount" DOUBLE PRECISION NOT NULL DEFAULT 1500,
    "defaultHighSeasonPrice" DOUBLE PRECISION NOT NULL DEFAULT 410,
    "defaultLowSeasonPrice" DOUBLE PRECISION NOT NULL DEFAULT 310,
    "defaultMinimumStay" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingSettings_pkey" PRIMARY KEY ("id")
);

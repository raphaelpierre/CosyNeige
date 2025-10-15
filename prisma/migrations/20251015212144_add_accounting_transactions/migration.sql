-- CreateTable
CREATE TABLE "AccountingTransaction" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "notes" TEXT,
    "reservationId" TEXT,
    "invoiceId" TEXT,
    "paymentMethod" TEXT,
    "paymentReference" TEXT,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attachmentUrl" TEXT,
    "createdBy" TEXT,
    "validated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountingTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccountingTransaction_type_idx" ON "AccountingTransaction"("type");

-- CreateIndex
CREATE INDEX "AccountingTransaction_category_idx" ON "AccountingTransaction"("category");

-- CreateIndex
CREATE INDEX "AccountingTransaction_transactionDate_idx" ON "AccountingTransaction"("transactionDate");

-- CreateIndex
CREATE INDEX "AccountingTransaction_reservationId_idx" ON "AccountingTransaction"("reservationId");

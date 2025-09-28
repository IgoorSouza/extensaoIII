-- CreateTable
CREATE TABLE "public"."payments" (
    "id" TEXT NOT NULL,
    "mercado_pago_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "value" DOUBLE PRECISION NOT NULL,
    "copy_paste_code" TEXT NOT NULL,
    "qr_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customer_id" TEXT NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_mercado_pago_id_key" ON "public"."payments"("mercado_pago_id");

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

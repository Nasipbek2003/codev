-- CreateTable
CREATE TABLE "student_requests" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "deadline" TEXT NOT NULL,
    "expected_price" TEXT NOT NULL,
    "with_website" BOOLEAN NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PeopleEnrichmentEndpoint" (
    "email" TEXT NOT NULL,
    "response" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PeopleEnrichmentEndpoint_pkey" PRIMARY KEY ("email")
);

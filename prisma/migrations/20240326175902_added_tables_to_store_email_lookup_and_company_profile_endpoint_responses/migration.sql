-- CreateTable
CREATE TABLE "ReverseEmailLookupEndpoint" (
    "email" TEXT NOT NULL,
    "response" JSONB NOT NULL,

    CONSTRAINT "ReverseEmailLookupEndpoint_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "CompanyProfileEndpoint" (
    "url" TEXT NOT NULL,
    "respone" JSONB NOT NULL,

    CONSTRAINT "CompanyProfileEndpoint_pkey" PRIMARY KEY ("url")
);

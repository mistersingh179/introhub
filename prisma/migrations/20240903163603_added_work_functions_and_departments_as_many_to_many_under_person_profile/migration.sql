-- CreateTable
CREATE TABLE "PersonProfileWorkFunction" (
    "personProfileId" TEXT NOT NULL,
    "workFunctionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonProfileWorkFunction_pkey" PRIMARY KEY ("personProfileId","workFunctionId")
);

-- CreateTable
CREATE TABLE "WorkFunction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkFunction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonProfileDepartment" (
    "personProfileId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonProfileDepartment_pkey" PRIMARY KEY ("personProfileId","departmentId")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkFunction_name_key" ON "WorkFunction"("name");

-- CreateIndex
CREATE INDEX "WorkFunction_name_idx" ON "WorkFunction"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE INDEX "Department_name_idx" ON "Department"("name");

-- AddForeignKey
ALTER TABLE "PersonProfileWorkFunction" ADD CONSTRAINT "PersonProfileWorkFunction_personProfileId_fkey" FOREIGN KEY ("personProfileId") REFERENCES "PersonProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonProfileWorkFunction" ADD CONSTRAINT "PersonProfileWorkFunction_workFunctionId_fkey" FOREIGN KEY ("workFunctionId") REFERENCES "WorkFunction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonProfileDepartment" ADD CONSTRAINT "PersonProfileDepartment_personProfileId_fkey" FOREIGN KEY ("personProfileId") REFERENCES "PersonProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonProfileDepartment" ADD CONSTRAINT "PersonProfileDepartment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

import prisma from "@/prismaClient";
import { NextResponse } from "next/server";
import getEmailAndCompanyUrlProfiles from "@/services/getEmailAndCompanyUrlProfiles";
import getProfiles from "@/services/getProfiles";
import {getCategoryNames} from "@/app/dashboard/introductions/list/IntroTable";

type OptionsType = {
  params: { id: string };
};

export async function GET(request: Request, { params }: OptionsType) {
  const { id } = params;

  const contact = await prisma.contact.findFirstOrThrow({
    where: {
      id,
    },
  });
  const email = contact.email;
  const { emailToProfile, companyUrlToProfile } =
    await getEmailAndCompanyUrlProfiles([email]);
  const {
    personExp,
    companyProfile,
    personProfile
  } =
    getProfiles(
      email,
      emailToProfile,
      companyUrlToProfile,
    );
  const categoryNames = getCategoryNames(companyProfile);
  const departmentNames = personProfile.departments.map(
    (d) => d.department.name,
  );
  const workFunctionNames = personProfile.workFunctions.map(
    (wf) => wf.workFunction.name,
  );


  const response = NextResponse.json(
    {
      contact,
      personExp,
      companyProfile,
      personProfile,
      workFunctionNames,
      departmentNames,
      categoryNames
    },
    {
      status: 200,
    },
  );
  return response;
}

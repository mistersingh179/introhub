import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import * as React from "react";
import prisma from "@/prismaClient";
import { auth } from "@/auth";
import { Session } from "next-auth";
import checkUserPermissions from "@/services/checkUserPermissions";
import LogoutLink from "@/components/LogoutLink";

const OnBoardingCard = async () => {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
    include: {
      accounts: true,
    },
  });
  const weHavePermissions = await checkUserPermissions(user!.id);

  const filtersCount = await prisma.filters.count({
    where: {
      userId: user.id,
    },
  });

  const wantedProspectsCount = await prisma.wantedContact.count({
    where: {
      userId: user.id,
    },
  });
  const hideMe =
    weHavePermissions && filtersCount > 0 && wantedProspectsCount > 0 && user.icpDescription;

  console.log(
    "OnBoardingCard, permisions, filters, wanted ",
    weHavePermissions,
    filtersCount,
    wantedProspectsCount,
  );

  return (
    <Card className={`${hideMe ? "hidden" : ""}`}>
      <CardHeader>
        <CardTitle>Onboarding Checklist</CardTitle>
        <CardDescription>
          IntroHub will handle prospecting and manage introductions on your
          behalf. Complete the tasks below to start building valuable
          connections effortlessly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className={"list-disc ml-4 [&>li]:mt-2"}>
          <li>
            <div className={"flex flex-row gap-2"}>
              <div className={`${weHavePermissions ? "line-through decoration-1" : ""}`}>
                <LogoutLink label={"Log-in"} /> with Google and provide
                necessary permissions.
              </div>
              {weHavePermissions && <div> ✅ </div>}
              {!weHavePermissions && <div> ⚠️ ️</div>}
            </div>
          </li>
          <li>
            <div className={"flex flex-row gap-2"}>
              <div className={`${user.icpDescription ? "line-through decoration-1" : ""}`}>
                Go to the{" "}
                <Link href={"/dashboard/home"} className={"underline"}>
                  {"home"}
                </Link>{" "}
                page and describe your ICP in natural language
              </div>
              {user.icpDescription && <div> ✅ </div>}
              {!user.icpDescription && <div> ⚠️ </div>}
            </div>
          </li>
          {/*<li>*/}
          {/*  <div className={"flex flex-row gap-2"}>*/}
          {/*    <div className={`${filtersCount > 0 ? "line-through decoration-1" : ""}`}>*/}
          {/*      Go to the{" "}*/}
          {/*      <Link href={"/dashboard/prospects"} className={"underline"}>*/}
          {/*        {"Prospects"}*/}
          {/*      </Link>{" "}*/}
          {/*      page and create a few filters that represent your ICP*/}
          {/*    </div>*/}
          {/*    {filtersCount > 0 && <div> ✅ </div>}*/}
          {/*    {filtersCount === 0 && <div> ⚠️ </div>}*/}
          {/*  </div>*/}
          {/*</li>*/}
          <li>
            <div className={"flex flex-row gap-2"}>
              <div
                className={`${wantedProspectsCount > 0 ? "line-through decoration-1" : ""}`}
              >
                Go to the{" "}
                <Link href={"/dashboard/prospects"} className={"underline"}>
                  {"Prospects"}
                </Link>{" "}
                page and star a few prospects that most accurately reflect your
                ICP
              </div>
              {wantedProspectsCount > 0 && <div> ✅ </div>}
              {wantedProspectsCount === 0 && <div> ⚠️ </div>}
            </div>
          </li>
        </ul>
      </CardContent>
      {/*<CardFooter className="flex justify-between">*/}
      {/*  <Button variant="outline">Cancel</Button>*/}
      {/*  <Button>Deploy</Button>*/}
      {/*</CardFooter>*/}
    </Card>
  );
};

export default OnBoardingCard;

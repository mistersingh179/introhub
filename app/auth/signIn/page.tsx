import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";
import Typography from "@/components/Typography";
import networking from "./networking.png";
import SignInWithGoogleForm from "@/app/auth/signIn/SignInWithGoogleForm";
import prisma from "@/prismaClient";
import { PlatformGroupName } from "@/app/utils/constants";
import { buildS3ImageUrlFromKey } from "@/lib/url";

type SearchParams = { groupName?: string };

export default async function AuthenticationPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  let { groupName } = searchParams;
  groupName = groupName || PlatformGroupName;
  console.log("in AuthenticationPage, with: ", searchParams, groupName);
  const group = await prisma.group.findFirstOrThrow({
    where: {
      name: groupName,
    },
  });

  const imageUrl = group.imageName
    ? buildS3ImageUrlFromKey(group.imageName)
    : networking.src;

  return (
    <div className={"flex flex-col lg:flex-row flex-grow"}>
      <div
        className={
          "flex flex-col gap-4 justify-center items-center bg-gray-50 dark:bg-slate-900 p-4 lg:basis-1/2"
        }
      >
        <Typography
          variant={"h2"}
          style={{ borderBottom: "0" }}
          affects={"removePMargin"}
          className={"text-center lg:text-left"}
        >
          Connect with your target prospects @ {group.name}
        </Typography>
        <Typography variant={"p"} affects={"removePMargin"} className={"text-center lg:text-left"}>
          {group.description}
        </Typography>
        <img src={imageUrl} alt="networking" className="w-full max-h-48 lg:max-h-96 object-contain" />
      </div>
      <div
        className={
          "flex flex-col gap-4 justify-center items-center p-4 lg:basis-1/2"
        }
      >
        <Typography className={"text-purple-600"}>introhub</Typography>
        <Typography variant={"h4"}>Create an account</Typography>
        <Typography
          variant={"p"}
          affects={"removePMargin"}
          className={"text-sm font-medium leading-none"}
        >
          Sign-in with your Google Apps email.
        </Typography>
        <div className={"my-4"}>
          <Suspense>
            <div className={"flex flex-col gap-4 items-center"}>
              <SignInWithGoogleForm />
            </div>
          </Suspense>
        </div>
        <Typography
          variant={"p"}
          affects={"removePMargin"}
          className={"text-sm font-medium leading-none text-center"}
        >
          By clicking continue, you agreed to our{" "}
          <Link
            href={"https://introhub.net/terms-of-service/"}
            target="_blank"
            className={"underline"}
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href={"https://introhub.net/privacy-policy/"}
            target={"_blank"}
            className={"underline"}
          >
            Privacy Policy
          </Link>
        </Typography>
      </div>
    </div>
  );

}

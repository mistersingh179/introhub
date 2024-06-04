import Image from "next/image";
import Link from "next/link";
import React, {Suspense} from "react";
import Typography from "@/components/Typography";
import networking from "./networking.png";
import SignInWithGoogleForm from "@/app/auth/signIn/SignInWithGoogleForm";

export default function AuthenticationPage() {
  return (
    <div className={"flex flex-row flex-grow"}>
      <div
        className={
          "hidden lg:flex basis-1/2 flex-col gap-4 justify-center items-center bg-gray-50 dark:bg-slate-900"
        }
      >
        <Typography
          variant={"h2"}
          style={{ borderBottom: "0" }}
          affects={"removePMargin"}
        >
          Connect with your target prospects
        </Typography>
        <Typography variant={"p"} affects={"removePMargin"}>
          Warm introductions await in the IntroHub beta program.
        </Typography>
        <Image src={networking} alt={"networking"}></Image>
      </div>
      <div
        className={
          "basis-full lg:basis-1/2 flex flex-col gap-4 justify-center items-center"
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
            <SignInWithGoogleForm />
          </Suspense>
        </div>
        <Typography
          variant={"p"}
          affects={"removePMargin"}
          className={"text-sm font-medium leading-none"}
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

"use client";

import {useSearchParams} from "next/navigation";
import {signInWithGoogleAction} from "@/app/actions/auth";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import googleImage from "@/app/auth/web_light_sq_ctn@1x.png";
import React from "react";

const SignInWithGoogleForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  return (
    <form action={signInWithGoogleAction}>
      <Input
        type={"hidden"}
        name={"callbackUrl"}
        value={callbackUrl ?? undefined}
      />
      <Button type={"submit"} className={"m-0 p-0"}>
        <Image
          src={googleImage}
          alt={"google logo"}
          className="hover:brightness-90"
        />
      </Button>

      {/*<Button type={"submit"}>*/}
      {/*  <img*/}
      {/*    className="w-6 h-6"*/}
      {/*    src="https://www.svgrepo.com/show/475656/google-color.svg"*/}
      {/*    alt="Google logo"*/}
      {/*  />*/}
      {/*  <div className={"ml-2"}>Continue with Google</div>*/}
      {/*</Button>*/}
    </form>
  );
};

export default SignInWithGoogleForm;
"use client";

import {useSearchParams} from "next/navigation";
import {signInWithLinkedInAction} from "@/app/actions/auth";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import linkedInImage from "@/app/auth/Sign-In-Large---Default 2.png";
import React from "react";

const SignInWithLinkedInForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  return (
    <form action={signInWithLinkedInAction}>
      <Input
        type={"hidden"}
        name={"callbackUrl"}
        value={callbackUrl ?? undefined}
      />
      <Button type={"submit"} className={"m-0 p-0"}>
        <Image
          src={linkedInImage}
          alt={"google logo"}
          className="hover:brightness-90"
        />
      </Button>

      {/*<Button type={"submit"}>*/}
      {/*  <img*/}
      {/*    className="w-6 h-6"*/}
      {/*    src="https://www.svgrepo.com/show/475656/google-color.svg"*/}
      {/*    alt="LinkedI logo"*/}
      {/*  />*/}
      {/*  <div className={"ml-2"}>Continue with LinkedI</div>*/}
      {/*</Button>*/}
    </form>
  );
};

export default SignInWithLinkedInForm;
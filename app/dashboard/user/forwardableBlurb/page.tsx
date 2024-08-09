import React from "react";
import { auth } from "@/auth";
import { Session } from "next-auth";
import prisma from "@/prismaClient";
import ForwardableBlurbForm from "@/app/dashboard/user/ForwardableBlurbForm";

export default async function ForwardableBlurb() {
  const session = (await auth()) as Session;
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: session.user?.email ?? "",
    },
    include: {
      accounts: true,
    },
  });

  return (
    <>
      <div className="flex flex-row justify-start items-center gap-4 mb-4">
        <h1 className="text-2xl my-4">Forwardable Blurb</h1>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            What is a Forwardable Blurb?
          </h4>
        </div>
        <div>
          Introhub automatically prospects based on your defined ICP. It then
          contacts prospects, asking if they are open to an introduction. In
          this permission-seeking email, we include a message from you, known as
          the Forwardable Blurb.
        </div>
        <div>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            How to Customize the Forwardable Blurb?
          </h4>
        </div>
        <div>
          Use the form below to customize your Forwardable Blurb. You can also
          leave it unchanged, in which case the default value will be used. When
          customizing, you can utilize the variables listed below. These
          variables, enclosed in curly braces, will be replaced with actual
          values at run-time when the email is sent to the prospect.
        </div>
        <div>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Available Variables:
          </h4>
        </div>
        <div>
          <ul className="ml-6 list-disc [&>li]:mt-2">
            <li>{"{facilitator-name}"}</li>
            <li>{"{prospect-name}"}</li>
            <li>{"{prospect-company-name}"}</li>
          </ul>
        </div>
        <div>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Your Customized Blurb:
          </h4>
        </div>
        <div className="flex flex-col gap-4">
          <ForwardableBlurbForm user={user} />
        </div>
      </div>
    </>
  );
}

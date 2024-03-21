import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createIntroductionAction } from "@/app/actions/introductions";
import prisma from "@/prismaClient";
import { IntroStates } from "@/lib/introStates";
import CreateIntroductionForm from "@/app/dashboard/introductions/create/[contactId]/CreatIntroductionForm";

export default async function Introductions({
  params,
  searchParams,
}: {
  params: { contactId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  console.log("*** with params: ", params);
  console.log("*** with searchParams: ", searchParams);
  const contact = await prisma.contact.findFirstOrThrow({
    where: { id: params.contactId },
  });
  return (
    <>
      <h1 className={"text-2xl my-4"}>
        Create an Introduction – {contact.email}
      </h1>
      <CreateIntroductionForm />
    </>
  );
}

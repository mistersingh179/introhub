import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import createContactAction from "@/app/actions/contacts/createContactAction";
import CreateContactForm from "@/app/dashboard/my-contacts/create/CreateContactForm";

export default async function CreateContact() {
  return (
    <>
      <div className={"flex flex-col gap-4 mt-4"}>
        <h1 className={"text-2xl"}>Create Contact</h1>
        <CreateContactForm />
      </div>
    </>
  );
}

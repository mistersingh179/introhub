"use client";

import { Contact } from "@prisma/client";
import { Switch } from "@/components/ui/switch";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import { useFormState } from "react-dom";
import updateContactAction from "@/app/actions/contacts/updateContactAction";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import ShowChildren from "@/components/ShowChildren";
import * as React from "react";
import { Input } from "@/components/ui/input";
import {useEffect, useRef, useState} from "react";

type ContactAvailableFormProps = {
  contact: Contact;
};

const ContactAvailableForm = (props: ContactAvailableFormProps) => {
  const { contact } = props;
  const action = updateContactAction;
  const [errorMessage, dispatch] = useFormState(action, undefined);

  const formRef = useRef<HTMLFormElement>(null)

  return (
    <>
      <form action={dispatch} ref={formRef}>
        <ShowChildren showIt={!!errorMessage}>
          <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
        </ShowChildren>
        <Switch
          name={"available"}
          defaultChecked={contact.available}
          value={"true"}
          onCheckedChange={(newValue) => {
            formRef.current?.requestSubmit();
          }}
        />
        <Input type={"hidden"} name={"contactId"} value={contact.id} />
      </form>
    </>
  );
};

export default ContactAvailableForm;

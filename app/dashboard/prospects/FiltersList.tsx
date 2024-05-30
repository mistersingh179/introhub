"use client";

import { Filters } from "@prisma/client";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dot, X } from "lucide-react";
import { useFormState } from "react-dom";
import deleteFilterAction from "@/app/actions/filters/deleteFilterAction";
import ErrorMessage from "@/app/dashboard/introductions/create/[contactId]/ErrorMessage";
import React from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";

type FiltersListProps = {
  savedFilters: Filters[];
};
const FiltersList = (props: FiltersListProps) => {
  const { savedFilters } = props;
  const pathName = usePathname();
  const action = deleteFilterAction;
  const [errorMessage, dispatch] = useFormState(action, undefined);
  return (
    <div className={"mt-4 px-2"}>
      <h4>Saved Filters</h4>
      <div className={"flex flex-col gap-1 mt-2"}>
        {errorMessage && (
          <ErrorMessage description={JSON.stringify(errorMessage, null, 2)} />
        )}
        {savedFilters.map((f) => {
          return (
            <div key={f.id} className={"flex flex-row items-center gap-1"}>
              <div className={"relative top-[2px]"}>
                <Dot size={"24"} />
              </div>
              <Link href={`${pathName}?${f.searchParams}`}>{f.name}</Link>
              <form action={dispatch}>
                <Input type={"hidden"} name={"id"} value={f.id} />
                <SubmitButton
                  label={"x"}
                  variant={"outline"}
                  size={"sm"}
                  className={"ml-2 w-6 h-6 rounded-full"}
                />
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FiltersList;

"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {ScrollArea} from "@/components/ui/scroll-area";

type DropdownMenuCheckboxesProps = {
  values: Record<string, boolean>;
  setValues: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
};
export function DropdownMenuCheckboxes(props: DropdownMenuCheckboxesProps) {
  const { values, setValues } = props;
  console.log("*** values: ", values);
  // const toggleCity = (city: string) => {
  //   const newCities = { ...values };
  //   newCities[city] = !newCities.city;
  //   setValues(newCities);
  // };
  const setValue = (city: string, newValue: boolean) => {
    const newCities = { ...values };
    newCities[city] = newValue;
    setValues(newCities);
  };

  const selectedCount = Object.keys(values).reduce((acc, cv) => {
    return values[cv] ? acc + 1 : acc;
  }, 0);

  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" onClick={(x) => setOpen(true)}>
          Select ({selectedCount})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        onFocusOutside={() => setOpen(false)}
        onInteractOutside={() => setOpen(false)}
        onEscapeKeyDown={() => setOpen(false)}
      >
        <DropdownMenuLabel>Select multiple values</DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <ScrollArea className="h-[200px]">
        {Object.keys(values).map((city) => (
          <DropdownMenuCheckboxItem
            key={city}
            checked={values[city]}
            onCheckedChange={setValue.bind(null, city)}
          >
            {city}
          </DropdownMenuCheckboxItem>
        ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

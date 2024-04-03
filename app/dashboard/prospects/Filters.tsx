"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenuCheckboxes } from "@/components/DropDownMenuCheckboxes";
import * as React from "react";
import { useState } from "react";
import { MultiSelect } from "@/components/MultiSelect";
import { FancyMultiSelect } from "@/components/FancyMultiSelect";
import {FancyOption} from "@/components/FancyOption";

type FiltersProps = {
  allCities: { city: string | null }[];
  allStates: { state: string | null }[];
  allJobTitles: { jobTitle: string | null }[];
};

const Filters = (props: FiltersProps) => {
  const { allCities, allStates, allJobTitles } = props;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const defaultCities: Record<string, boolean> = {};
  for (const city of allCities) {
    if (city.city) {
      defaultCities[city.city] = false;
    }
  }
  const [cities, setCities] = useState(defaultCities);

  const defaultStates: Record<string, boolean> = {};
  for (const state of allStates) {
    if (state.state) {
      defaultStates[state.state] = false;
    }
  }
  const [states, setStates] = useState(defaultStates);

  const defaultJobTitles: Record<string, boolean> = {};
  for (const jobTitle of allJobTitles) {
    if (jobTitle.jobTitle) {
      defaultJobTitles[jobTitle.jobTitle] = false;
    }
  }
  const [jobTitles, setJobTitles] = useState(defaultJobTitles);

  const formHandler = (formData: FormData) => {
    console.log("in formHandler: ", formData);
    formData.forEach((value, key) => {
      console.log("key: ", key, "value: ", value);
    });

    const params = new URLSearchParams(searchParams);

    params.delete("city");
    Object.keys(cities).forEach((city) => {
      if (cities[city]) {
        params.append("city", city);
      }
    });

    params.delete("state");
    Object.keys(states).forEach((state) => {
      if (states[state]) {
        params.append("state", state);
      }
    });

    params.delete("jobTitle");
    Object.keys(jobTitles).forEach((jobTitle) => {
      if (jobTitles[jobTitle]) {
        params.append("jobTitle", jobTitle);
      }
    });

    console.log("params: ", params.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  const options: FancyOption[] = [
    { value: "foo", label: "Foo" },
    { value: "bar", label: "Bar" },
  ];
  const [selected, setSelected] = useState<FancyOption[]>([]);
  return (
    <>
      {/*<form action={formHandler}>*/}
      {/*  <div className={"flex flex-col gap-4 max-w-96 my-4"}>*/}
      {/*    <h1>Person Profile</h1>*/}
      {/*    <div className={"flex flex-row items-center gap-4"}>*/}
      {/*      <Label htmlFor="city">City</Label>*/}
      {/*      /!*<DropdownMenuCheckboxes values={cities} setValues={setCities} />*!/*/}
      {/*      <FancyMultiSelect*/}
      {/*        selected={selected}*/}
      {/*        setSelected={setSelected}*/}
      {/*        options={options}*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*    <div className={"flex flex-row items-center gap-4"}>*/}
      {/*      <Label htmlFor="country">Country</Label>*/}
      {/*    </div>*/}
      {/*    <div className={"flex flex-row items-center gap-4"}>*/}
      {/*      <Label htmlFor="state">State</Label>*/}
      {/*      <DropdownMenuCheckboxes values={states} setValues={setStates} />*/}
      {/*    </div>*/}
      {/*    <h1>Person Experience</h1>*/}
      {/*    <div className={"flex flex-row items-center gap-4"}>*/}
      {/*      <Label htmlFor="companyName">Company Name</Label>*/}
      {/*      <Input*/}
      {/*        type="companyName"*/}
      {/*        id="companyName"*/}
      {/*        placeholder="Company Name"*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*    <div className={"flex flex-row items-center gap-4"}>*/}
      {/*      <Label htmlFor="jobTitle">Job Title</Label>*/}
      {/*      <DropdownMenuCheckboxes*/}
      {/*        values={jobTitles}*/}
      {/*        setValues={setJobTitles}*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*    <div className={"flex flex-row items-center justify-center gap-4"}>*/}
      {/*      <Button className={"max-w-24"}>Submit</Button>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</form>*/}
    </>
  );
};

export default Filters;

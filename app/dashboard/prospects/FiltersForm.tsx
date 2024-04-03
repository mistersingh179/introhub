"use client";

import { useState } from "react";
import { FancyOption } from "@/components/FancyOption";
import { FancyMultiSelect } from "@/components/FancyMultiSelect";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

const buildOptions = (values: string[]): FancyOption[] => {
  return values.map((rec) => ({ label: rec, value: rec }));
};

type FiltersFormProps = {
  cities: string[];
  states: string[];
  jobTitles: string[];
  industries: string[];
};

const FiltersForm = (props: FiltersFormProps) => {
  const { cities, states, jobTitles, industries } = props;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [selectedCities, setSelectedCities] = useState<FancyOption[]>(
    searchParams
      .getAll("selectedCities")
      .map((rec) => ({ label: rec, value: rec })),
  );
  const [selectedStates, setSelectedStates] = useState<FancyOption[]>(
    searchParams
      .getAll("selectedStates")
      .map((rec) => ({ label: rec, value: rec })),
  );
  const [selectedJobTitles, setSelectedJobTitles] = useState<FancyOption[]>(
    searchParams
      .getAll("selectedJobTitles")
      .map((rec) => ({ label: rec, value: rec })),
  );
  const [selectedIndustries, setSelectedIndustries] = useState<FancyOption[]>(
    searchParams
      .getAll("selectedIndustries")
      .map((rec) => ({ label: rec, value: rec })),
  );

  const formHandler = (formData: FormData) => {
    console.log("in formHandler: ", formData);
    formData.forEach((value, key) => {
      console.log("key: ", key, "value: ", value);
    });

    const params = new URLSearchParams(searchParams);

    params.delete("selectedCities");
    selectedCities.forEach((rec) => params.append("selectedCities", rec.value));

    params.delete("selectedStates");
    selectedStates.forEach((rec) => params.append("selectedStates", rec.value));

    params.delete("selectedJobTitles");
    selectedJobTitles.forEach((rec) =>
      params.append("selectedJobTitles", rec.value),
    );

    params.delete("selectedIndustries");
    selectedIndustries.forEach((rec) =>
      params.append("selectedIndustries", rec.value),
    );

    params.delete("selectedEmail");
    if (formData.get("selectedEmail")) {
      params.set("selectedEmail", formData.get("selectedEmail") as string);
    }

    console.log("params: ", params.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <form action={formHandler}>
      <div className={"flex flex-col gap-4 max-w-96 py-4"}>
        <FancyMultiSelect
          placeholder={"Cities"}
          options={buildOptions(cities)}
          selected={selectedCities}
          setSelected={setSelectedCities}
        />
        <FancyMultiSelect
          placeholder={"States"}
          options={buildOptions(states)}
          selected={selectedStates}
          setSelected={setSelectedStates}
        />
        <FancyMultiSelect
          placeholder={"Job Titles"}
          options={buildOptions(jobTitles)}
          selected={selectedJobTitles}
          setSelected={setSelectedJobTitles}
        />
        <FancyMultiSelect
          placeholder={"Industries"}
          options={buildOptions(industries)}
          selected={selectedIndustries}
          setSelected={setSelectedIndustries}
        />

        <div className={"flex flex-row items-center gap-4 whitespace-nowrap"}>
          <Label htmlFor="email">Email</Label>
          <Input
            type="text"
            name="selectedEmail"
            id="email"
            placeholder="customer@company.com"
          />
        </div>
        <div className={"flex flex-row justify-center"}>
          {/* todo – disable button on submit */}
          {/* todo – enable upon change in filters */}
          <Button className={"max-w-24"}>Apply Filter</Button>
        </div>
      </div>
    </form>
  );
};

export default FiltersForm;

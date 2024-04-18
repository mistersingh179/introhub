"use client";

import { useState } from "react";
import { FancyOption } from "@/components/FancyOption";
import { FancyMultiSelect } from "@/components/FancyMultiSelect";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";

const buildOptions = (values: string[]): FancyOption[] => {
  return values.map((rec) => ({ label: rec, value: rec }));
};

const addMultiOptionsToParams = (
  params: URLSearchParams,
  selectedOptions: FancyOption[],
  optionsName: string,
) => {
  params.delete(optionsName);
  selectedOptions.forEach((rec) => params.append(optionsName, rec.value));
};

type FiltersFormProps = {
  cities: string[];
  states: string[];
  jobTitles: string[];
  industries: string[];
  categories: string[];
};

const FiltersForm = (props: FiltersFormProps) => {
  const { cities, states, jobTitles, industries, categories } = props;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [selectedCities, setSelectedCities] = useState<FancyOption[]>(
    buildOptions(searchParams.getAll("selectedCities")),
  );
  const [selectedStates, setSelectedStates] = useState<FancyOption[]>(
    buildOptions(searchParams.getAll("selectedStates")),
  );
  const [selectedJobTitles, setSelectedJobTitles] = useState<FancyOption[]>(
    buildOptions(searchParams.getAll("selectedJobTitles")),
  );
  const [selectedIndustries, setSelectedIndustries] = useState<FancyOption[]>(
    buildOptions(searchParams.getAll("selectedIndustries")),
  );

  const [selectedCategories, setSelectedCategories] = useState<FancyOption[]>(
    buildOptions(searchParams.getAll("selectedCategories")),
  );

  const formHandler = (formData: FormData) => {
    console.log("in formHandler: ", formData);

    formData.forEach((value, key) => {
      console.log("key: ", key, "value: ", value);
    });

    const params = new URLSearchParams(searchParams);

    addMultiOptionsToParams(params, selectedCities, "selectedCities");
    addMultiOptionsToParams(params, selectedStates, "selectedStates");
    addMultiOptionsToParams(params, selectedJobTitles, "selectedJobTitles");
    addMultiOptionsToParams(params, selectedIndustries, "selectedIndustries");
    addMultiOptionsToParams(params, selectedCategories, "selectedCategories");

    params.delete("selectedEmail");
    if (formData.get("selectedEmail")) {
      params.set("selectedEmail", formData.get("selectedEmail") as string);
    }

    params.delete("selectedWebsite");
    if (formData.get("selectedWebsite")) {
      params.set("selectedWebsite", formData.get("selectedWebsite") as string);
    }

    params.set("page", "1");

    console.log("params: ", params.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <form action={formHandler}>
      <div className={"flex flex-col gap-4 max-w-96 py-4 px-2"}>
        <div className={"flex flex-row items-center gap-4 whitespace-nowrap"}>
          <Input
            type="search"
            name="selectedEmail"
            id="email"
            placeholder="customer@company.com"
          />
        </div>
        <div className={"flex flex-row items-center gap-4 whitespace-nowrap"}>
          <Input
            type="search"
            name="selectedWebsite"
            id="website"
            placeholder="company.com"
          />
        </div>
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
        <FancyMultiSelect
          placeholder={"Categories"}
          options={buildOptions(categories)}
          selected={selectedCategories}
          setSelected={setSelectedCategories}
        />

        <div className={"flex flex-row justify-center"}>
          <SubmitButton label={"Apply Filter"} />
        </div>
      </div>
    </form>
  );
};

export default FiltersForm;

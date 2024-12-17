"use client";

import { useEffect, useState } from "react";
import { FancyOption } from "@/components/FancyOption";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/app/dashboard/introductions/create/[contactId]/SubmitButton";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ShowChildren from "@/components/ShowChildren";
import dynamic from "next/dynamic";

const MyDropDown = dynamic(() => import("@/app/dashboard/home/MyDropDown"), {
  ssr: false,
});

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
  userEmails: string[];
  groups: string[];
};

const FiltersForm = (props: FiltersFormProps) => {
  const {
    cities,
    states,
    jobTitles,
    industries,
    categories,
    userEmails,
    groups,
  } = props;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [sizeFrom, setSizeFrom] = useState<string | undefined>(
    searchParams.get("sizeFrom") ?? undefined,
  );
  const [sizeTo, setSizeTo] = useState<string | undefined>(
    searchParams.get("sizeTo") ?? undefined,
  );
  const [selectedEmail, setSelectedEmail] = useState<string | undefined>(
    searchParams.get("selectedEmail") ?? undefined,
  );
  const [selectedWebsite, setSelectedWebsite] = useState<string | undefined>(
    searchParams.get("selectedWebsite") ?? undefined,
  );
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
  const [selectedGroups, setSelectedGroups] = useState<FancyOption[]>(
    buildOptions(
      searchParams.getAll("selectedGroups").length > 0
        ? searchParams.getAll("selectedGroups")
        : groups,
    ),
  );

  const [selectedCategories, setSelectedCategories] = useState<FancyOption[]>(
    buildOptions(searchParams.getAll("selectedCategories")),
  );
  const [selectedUserEmails, setSelectedUserEmails] = useState<FancyOption[]>(
    buildOptions(searchParams.getAll("selectedUserEmails")),
  );
  const createdAfter = searchParams.get("createdAfter");
  const [date, setDate] = useState<Date | undefined>(
    createdAfter ? new Date(createdAfter) : undefined,
  );

  useEffect(() => {
    console.log("*** we have a change!");
    formHandler();
  }, [
    selectedEmail,
    selectedWebsite,
    selectedCities,
    selectedStates,
    selectedJobTitles,
    selectedIndustries,
    selectedGroups,
    selectedCategories,
    selectedUserEmails,
    sizeFrom,
    sizeTo,
    date,
  ]);

  const formHandler = (formData?: FormData) => {
    console.log("*** in formHandler: ", formData);
    if (formData) {
      formData.forEach((value, key) => {
        console.log("key: ", key, "value: ", value);
      });
    }

    const params = new URLSearchParams(searchParams);

    addMultiOptionsToParams(params, selectedCities, "selectedCities");
    addMultiOptionsToParams(params, selectedStates, "selectedStates");
    addMultiOptionsToParams(params, selectedJobTitles, "selectedJobTitles");
    addMultiOptionsToParams(params, selectedIndustries, "selectedIndustries");
    addMultiOptionsToParams(params, selectedGroups, "selectedGroups");
    addMultiOptionsToParams(params, selectedCategories, "selectedCategories");
    addMultiOptionsToParams(params, selectedUserEmails, "selectedUserEmails");

    params.delete("selectedEmail");
    if (selectedEmail) {
      params.set("selectedEmail", selectedEmail as string);
    }

    params.delete("selectedWebsite");
    if (selectedWebsite) {
      console.log("selectedWebsite: ", selectedWebsite);
      params.set("selectedWebsite", selectedWebsite as string);
    }

    params.delete("createdAfter");
    if (date) {
      params.set("createdAfter", date.toISOString());
    }

    params.delete("sizeFrom");
    if (sizeFrom) {
      params.set("sizeFrom", sizeFrom);
    }

    params.delete("sizeTo");
    if (sizeTo) {
      params.set("sizeTo", sizeTo);
    }

    console.log("*** setting page to 1");
    params.set("page", "1");

    console.log("*** replacing url with params: ", params.toString());
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
            onChange={(evt) => {
              setSelectedEmail(evt.target.value);
            }}
            value={selectedEmail}
            placeholder="customer@company.com"
          />
        </div>
        <div className={"flex flex-row items-center gap-4 whitespace-nowrap"}>
          <Input
            type="search"
            name="selectedWebsite"
            id="website"
            placeholder="company.com"
            value={selectedWebsite}
            onChange={(evt) => {
              setSelectedWebsite(evt.target.value);
            }}
          />
        </div>
        <MyDropDown
          placeholder={"Cities"}
          options={buildOptions(cities)}
          selected={selectedCities}
          setSelected={setSelectedCities}
          limit={50}
        />
        <MyDropDown
          placeholder={"States"}
          options={buildOptions(states)}
          selected={selectedStates}
          setSelected={setSelectedStates}
          limit={50}
        />
        <MyDropDown
          placeholder={"Job Titles"}
          options={buildOptions(jobTitles)}
          selected={selectedJobTitles}
          limit={50}
          setSelected={setSelectedJobTitles}
        />
        <MyDropDown
          placeholder={"Industries"}
          options={buildOptions(industries)}
          selected={selectedIndustries}
          setSelected={setSelectedIndustries}
          limit={50}
        />
        <MyDropDown
          placeholder={"Groups"}
          options={buildOptions(groups)}
          selected={selectedGroups}
          setSelected={setSelectedGroups}
          limit={50}
        />
        <MyDropDown
          placeholder={"Categories"}
          options={buildOptions(categories)}
          selected={selectedCategories}
          setSelected={setSelectedCategories}
          limit={50}
        />
        <MyDropDown
          placeholder={"Facilitators"}
          options={buildOptions(userEmails)}
          selected={selectedUserEmails}
          setSelected={setSelectedUserEmails}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Created After</span>}
              <div className={"flex-grow"}></div>
              <ShowChildren showIt={!!date}>
                <X
                  className="mr-2 h-4 w-4"
                  onClick={(x) => {
                    setDate(undefined);
                    x.preventDefault();
                  }}
                />
              </ShowChildren>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <div className={"flex flex-row items-center gap-4 whitespace-nowrap"}>
          <Input
            type="number"
            name="sizeFrom"
            onChange={(evt) => {
              setSizeFrom(evt.target.value);
            }}
            value={sizeFrom}
            placeholder="Size From"
          />
          <Input
            type="number"
            name="sizeTo"
            onChange={(evt) => {
              setSizeTo(evt.target.value);
            }}
            value={sizeTo}
            placeholder="Size To"
          />
        </div>
        {/*<div className={"flex flex-row justify-center"}>*/}
        {/*  <SubmitButton label={"Apply Filter"} />*/}
        {/*</div>*/}
      </div>
    </form>
  );
};

export default FiltersForm;

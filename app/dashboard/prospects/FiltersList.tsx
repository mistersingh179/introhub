"use client";

import { Filters } from "@prisma/client";
import { usePathname } from "next/navigation";
import { Dot } from "lucide-react";
import React from "react";
import EditFiltersDialog from "@/app/dashboard/prospects/EditFiltersDialog";
import DeleteFiltersDialog from "@/app/dashboard/prospects/DeleteFiltersDialog";

type FiltersListProps = {
  savedFilters: Filters[];
};
const FiltersList = (props: FiltersListProps) => {
  const { savedFilters } = props;
  const pathName = usePathname();
  return (
    <div className={"mt-4 px-2"}>
      <h4>Saved Filters :</h4>
      <div className={"flex flex-col gap-1 mt-2"}>
        {savedFilters.map((f) => {
          return (
            <div key={f.id} className={"flex flex-row items-center gap-1"}>
              <div className={"relative top-[2px]"}>
                <Dot size={"24"} />
              </div>
              <a href={`${pathName}?${f.searchParams}`}>{f.name}</a>
              <EditFiltersDialog filtersObj={f} />
              <DeleteFiltersDialog filtersObj={f} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FiltersList;

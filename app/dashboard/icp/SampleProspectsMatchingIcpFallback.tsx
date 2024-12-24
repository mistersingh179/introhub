import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

const SampleProspectsMatchingIcpFallback = () => {
  return (
    <div>
      <div className={"text-2xl my-6"}>Sample Prospects</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={"w-1/2"}>Prospect</TableHead>
            <TableHead className={"w-1/2"}>Company</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({length: 3}).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded-full"/>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-32"/>
                    <Skeleton className="h-4 w-24"/>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded-full"/>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-32"/>
                    <Skeleton className="h-4 w-24"/>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SampleProspectsMatchingIcpFallback;

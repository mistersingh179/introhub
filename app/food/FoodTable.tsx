import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {FoodWithCosine} from "@/app/food/page";
import MyPagination from "@/components/MyPagination";

const FoodTable = ({ foods }: { foods: FoodWithCosine[] }) => {
  return (
    <>
      <Table>
        <TableCaption>Food Items</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className={"p-2"}>Id</TableHead>
            <TableHead className={"p-2"}>Name</TableHead>
            <TableHead className={"p-2"}>Embedding</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {foods.map((food) => {
            return <FoodRow key={food.id} food={food} />;
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>
              <MyPagination />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
};

export default FoodTable;


const FoodRow = ({
  food,
}: {
  food:FoodWithCosine;
}) => {
  return (
    <>
      <TableRow className={""} key={food.id}>
        <TableCell className={"p-2"}>
          {food.id}
        </TableCell>
        <TableCell className={"p-2"}>
          {food.name}
        </TableCell>
        <TableCell className={"p-2"}>
          {food.cosine_similiarity}
        </TableCell>
      </TableRow>
    </>
  );
};

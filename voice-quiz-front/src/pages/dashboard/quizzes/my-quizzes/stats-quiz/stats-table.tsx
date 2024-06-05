import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender
} from "@tanstack/react-table";

import { useState, useEffect } from "react";
import { UserTable } from "./stats-quiz";
import { Chip } from "@material-tailwind/react";

interface Props {
  userResults: UserTable[]
}

const StatsTable: React.FC<Props> = ({ userResults }) => {
  const [data, setData] = useState<UserTable[]>([]);

  useEffect(() => {
    setData(userResults);
  }, [userResults]);

  console.log(userResults)
  const columnHelper = createColumnHelper<UserTable>()
  const columns = [
    columnHelper.accessor("userName", {
      header: () => <div className="w-[30%] text-start">Estudiante</div>,
      filterFn: "auto",
      cell: (info) => <p className="font-normal flex w-full items-start ml-3 py-4">{info.getValue()}</p>,
    }),
    columnHelper.accessor("finalScore", {
      header: () => "Score final",
      filterFn: "auto",
      cell: (info) => <p className="font-normal py-4">{info.getValue().toFixed(2)}</p>,
    }),
    columnHelper.accessor("passed", {
      header: () => "Status",
      filterFn: "auto",
      cell: (info) => <div className="font-normal flex justify-center items-center0 py-4">{info.getValue() ? 
        <Chip 
          value="Aprobado"
          color="green"
          size="sm"
          variant="ghost"
          className="w-fit"
        />: <Chip 
          value="Desaprobado"
          color="red"
          size="sm"
          variant="ghost"
          className="w-fit"
        />}</div>, 
    }),
  ];

  const table = useReactTable({
    data: data as UserTable[], 
    columns, 
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(), 
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true, 
    debugHeaders: true,
    debugColumns: false,
    state:{
      globalFilter: ''
    }
  });

  return (
    <table className="w-full border-collapse rounded-xl overflow-hidden">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} className='py-4 text-blue-gray-800 text-center pl-2 border-b'>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className='auto'>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className='min-h-[40px]'>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className='border-b text-center max-w-[100px] min-h-[40px] h-full w-fit text-black'>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default StatsTable;

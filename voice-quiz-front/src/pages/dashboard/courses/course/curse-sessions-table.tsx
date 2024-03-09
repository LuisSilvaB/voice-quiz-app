import { useReactTable, getCoreRowModel, createColumnHelper, flexRender } from '@tanstack/react-table';
import { Session } from '../../../../interface/types';
import { IconButton } from '@material-tailwind/react';
import { IoMdTrash } from "react-icons/io";
import { RxEyeOpen } from "react-icons/rx";

interface Props {
  sessions: Session[];
}

const CourseSessionsTable:React.FC<Props>= ({sessions}) => {
  const columnHelper = createColumnHelper<Session>()
  const columns = [
    columnHelper.accessor("id", {
      header: () => "Id",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("title", {
      header: () => "Título",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("createAt", {
      header: () => "Fecha de creación",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("id", {
      header: () => "Acciones",
      cell: () => (
        <div className="flex gap-2">
          <IconButton className="bg-blue-500" placeholder={""}>
            <RxEyeOpen />
          </IconButton>
          <IconButton className='bg-red-500' placeholder={""}>
            <IoMdTrash />
          </IconButton>
        </div>
      ),
    }),
  ];
  const table = useReactTable({
    data: sessions ?? [], 
    columns, 
    debugTable: true, 
    getCoreRowModel: getCoreRowModel() 
})

  return (
    <table className="w-full border-collapse rounded-xl overflow-hidden"> 
      <thead>
        {table.getHeaderGroups().map((headerGroups, index) => (
          <tr key={index}>
            {headerGroups.headers.map((headItem, index) => (
              <th key={index} className='bg-blue-gray-500 py-4 text-white border'>
                {flexRender(
                  headItem.column.columnDef.header,
                  headItem.getContext(),
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className='h-fit'>
        {table.getRowModel().rows.map((rowModel, index) => (
          <tr key={index} className='border h-20'>
            {
              rowModel.getVisibleCells().map((cell, index) => (
                <td key={index} className='border text-center mx-auto h-10 max-h-10' >
                  <div className='flex justify-center items-center h-fit'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </td>
              ))
            }
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CourseSessionsTable
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  getPaginationRowModel,
  flexRender,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Session, toggleProps } from '../../../../interface/types';
import { IconButton } from '@material-tailwind/react';
import { IoMdTrash } from "react-icons/io";
import { RxEyeOpen } from "react-icons/rx";
import { TbListDetails } from "react-icons/tb";


interface Props extends toggleProps {
  sessions: Session[];
  filter: string; 
  openSessionDetails(id:string): void;
  openSessionView(id:string): void;
  setFilter:React.Dispatch<React.SetStateAction<string>>; 
}

const CourseSessionsTable:React.FC<Props> = ({sessions, filter, openSessionDetails, openSessionView, setFilter}) => {
  // const [targerFilter, setTargetFilter] = useState<Session | null>(null)
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
      filterFn: "auto", 
      header: () => "Acciones",
      cell: (info) => (
        <div className="flex gap-2" >
          <IconButton className="bg-blue-500" onClick={ () => openSessionView(info.getValue()) } placeholder={""}>
            <RxEyeOpen />
          </IconButton>
          <IconButton className="bg-orange-500" onClick={ () => openSessionDetails(info.getValue())} placeholder={""}>
            <TbListDetails />
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
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(), 
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true, 
    debugHeaders: true,
    debugColumns: false,
    state:{
      globalFilter: filter
    },
    onGlobalFilterChange: setFilter
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
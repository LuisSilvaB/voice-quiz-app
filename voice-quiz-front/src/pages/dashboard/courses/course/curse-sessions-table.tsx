import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  getPaginationRowModel,
  flexRender,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { ModalActions, toggleProps } from '../../../../interface/types';
import { Session } from '../../../../class/sessions';
import { Button, Chip } from '@material-tailwind/react';
import { IoMdTrash } from "react-icons/io";
import { RxEyeOpen } from "react-icons/rx";
// import { TbListDetails } from "react-icons/tb";
import {
  setTargetSession,
  setSessionTypeModal,
  setSessionToggleModal,
} from "../../../../features/db-features/sessions.features";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../app/store";

interface Props extends toggleProps {
  sessions: Session[];
  filter: string; 
  openSessionDetails(id:string): void;
  openSessionView(id:string): void;
  setFilter:React.Dispatch<React.SetStateAction<string>>; 
  sessionLoading: boolean;
}

const CourseSessionsTable:React.FC<Props> = ({sessions, filter, openSessionView, setFilter}) => {
  // const [targerFilter, setTargetFilter] = useState<Session | null>(null)
  const formatDate = (dateString: string) => { 
    const date = new Date(dateString);
  
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
  
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  const dispatch = useDispatch<AppDispatch>()
  const openModal = (action: ModalActions, session: Session) => {
    dispatch(setSessionTypeModal(action));
    dispatch(setTargetSession(session));
    dispatch(setSessionToggleModal());
  }
  const columnHelper = createColumnHelper<Session>()
  const columns = [
    columnHelper.accessor("title", {
      header: () => "Título",
      cell: (info) => (
        <p className="font-medium text-gray-800">{info.getValue()}</p>
      ),
    }),
    columnHelper.accessor("transcription", {
      header: () => "transcripción",
      cell: (info) => (
        <p className="font-medium text-gray-800">
          {info.getValue()?.length ? (
            <Chip color="green" variant="ghost" value={"Transcripción"} />
          ) : (
            <Chip color="red" variant="ghost" value={"Sin transcripción"} />
          )}
        </p>
      ),
    }),
    columnHelper.accessor("created_at", {
      header: () => "Fecha de creación",
      cell: (info) => (
        <p className="font-medium text-gray-800">
          {formatDate(info.getValue().toString())}
        </p>
      ),
    }),
    columnHelper.accessor("ID", {
      filterFn: "auto",
      header: () => "Acciones",
      cell: (info) => (
        <div className="flex gap-2">
          <Button
            className="flex flex-row items-center gap-2 bg-blue-500"
            onClick={() => openSessionView(String(info.getValue()))}
            placeholder={""}
          >
            <p className="hidden text-center lg:flex">Abrir sessión</p>
            <RxEyeOpen className="flex lg:hidden"/>
          </Button>
          <Button
            className="flex w-fit flex-row items-center gap-2 bg-red-500"
            onClick={() => openModal("delete", info.row.original)}
            placeholder={""}
          >
            <p className="hidden text-center lg:flex">Eliminar</p>
            <IoMdTrash className="flex lg:hidden"/>
          </Button>
        </div>
      ),
    }),
  ];
  const table = useReactTable({
    data: sessions as Session[], 
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
    <table className="w-full border-collapse overflow-hidden rounded-xl">
      <thead>
        {table.getHeaderGroups().map((headerGroups, index) => (
          <tr key={index}>
            {headerGroups.headers.map((headItem, index) => (
              <th
                key={index}
                className="border bg-blue-gray-500 py-4 text-white"
              >
                {flexRender(
                  headItem.column.columnDef.header,
                  headItem.getContext(),
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="h-fit bg-white shadow-lg">
        {table.getRowModel().rows.map((rowModel, index) => (
          <tr key={index} className="h-20 border">
            {rowModel.getVisibleCells().map((cell, index) => (
              <td
                key={index}
                className="mx-auto h-10 max-h-10 border text-cente"
              >
                <div className="flex h-fit items-center justify-center">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CourseSessionsTable
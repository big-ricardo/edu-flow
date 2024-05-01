import { Table as ChakraTable, TableCaption } from "@chakra-ui/react";
import TableBody, { TableData } from "@components/molecules/Table/TableBody";
import TableHead, {
  TableHeadProps,
} from "@components/molecules/Table/TableHead";

type TableProps = {
  columns: TableHeadProps["columns"];
  tableTitle?: string;
  data: TableData[];
  isLoading?: boolean;
};

const Table: React.FC<TableProps> = ({ columns, data, tableTitle }) => {
  return (
    <ChakraTable>
      <TableCaption>{tableTitle}</TableCaption>
      <TableHead columns={columns} />
      <TableBody columns={columns} data={data} />
    </ChakraTable>
  );
};

export default Table;

import React, { memo } from "react";

import { Tbody, Tr, Td } from "@chakra-ui/react";
import { TableHeadProps } from "../TableHead";

export interface TableData {
  [key: string]: string | React.ReactNode;
}

interface TableBodyProps {
  columns: TableHeadProps["columns"];
  data: TableData[];
}

const TableBodyC: React.FC<TableBodyProps> = ({ columns, data }) => {
  return (
    <Tbody>
      {data?.map((row, index) => (
        <Row key={`Row-${index}`} row={row} columns={columns} />
      ))}

      {data?.length === 0 && (
        <Tr>
          <Td colSpan={columns.length} textAlign="center">
            Nenhum registro encontrado
          </Td>
        </Tr>
      )}
    </Tbody>
  );
};

const TableBody = React.memo(TableBodyC);
export default TableBody;

interface RowProps {
  row: TableBodyProps["data"][0];
  columns: TableBodyProps["columns"];
}

const Row = memo(({ row, columns }: RowProps) => {
  return (
    <Tr>
      {columns.map((column, index) => (
        <Td key={`Td-${index}`} isNumeric={column.isNumeric}>
          {row[column.key]}
        </Td>
      ))}
    </Tr>
  );
});

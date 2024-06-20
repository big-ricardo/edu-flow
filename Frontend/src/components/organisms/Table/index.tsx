import React from "react";
import {
  useBreakpointValue,
  Box,
  Table as ChakraTable,
  TableCaption,
  Text,
  VStack,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import TableBody, { TableData } from "@components/molecules/Table/TableBody";
import TableHead, {
  TableHeadProps,
} from "@components/molecules/Table/TableHead";

type TableProps = {
  columns: TableHeadProps["columns"];
  tableTitle?: string;
  data: TableData[] | null;
  isLoading?: boolean;
};

const Table: React.FC<TableProps> = ({
  columns,
  data,
  tableTitle,
  isLoading,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return isMobile ? (
    <div>
      <Text fontSize="lg" fontWeight="bold">
        {tableTitle}
      </Text>
      <Flex direction="column" gap={4}>
        {isLoading && <Spinner />}

        {data?.length === 0 && (
          <Text fontSize="sm" color="gray.500">
            Nenhum dado encontrado
          </Text>
        )}

        {data?.map((item) => (
          <CardBody columns={columns} data={item} key={item._id} />
        ))}
      </Flex>
    </div>
  ) : (
    <ChakraTable>
      <TableCaption>{tableTitle}</TableCaption>
      <TableHead columns={columns} />
      <TableBody columns={columns} data={data ?? []} />
    </ChakraTable>
  );
};

export default Table;

const CardBody = ({
  columns,
  data,
}: {
  columns: TableHeadProps["columns"];
  data: TableData;
}) => {
  return (
    <Box p={4} borderWidth="1px" borderRadius="md" display="relative">
      <VStack spacing={4} align="start">
        {columns.map((column) => (
          <CardItem key={column.key} column={column} data={data} />
        ))}
      </VStack>
    </Box>
  );
};

const CardItem = ({
  column,
  data,
}: {
  column: TableHeadProps["columns"][0];
  data: TableData;
}) => {
  return (
    <Flex key={column.key} gap={2} direction="column">
      <Text fontSize="sm" fontWeight="bold">
        {column.label}:
      </Text>
      <Text fontSize="sm">{data[column.key] as React.ReactNode}</Text>
    </Flex>
  );
};

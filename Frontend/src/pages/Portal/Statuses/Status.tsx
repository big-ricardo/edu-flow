import { Flex } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import StatusForm from "./Form";

export default function Status() {
  const params = useParams<{ id?: string }>();

  const id = params?.id ?? "";

  return (
    <Flex w="100%" my="6" mx="auto" px="6" justify="center">
      <StatusForm id={id} />
    </Flex>
  );
}

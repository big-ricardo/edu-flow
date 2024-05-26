import { getOpenForms } from "@apis/dashboard";
import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import IForm from "@interfaces/Form";
import { useQuery } from "@tanstack/react-query";
import { convertDateTime } from "@utils/date";
import React, { memo, useCallback } from "react";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OpenForms: React.FC = () => {
  const { data: forms, isLoading } = useQuery({
    queryKey: ["open-forms"],
    queryFn: getOpenForms,
  });

  if (!forms || forms.length === 0) {
    return (
      <Box p={4} bg="bg.card" borderRadius="md">
        <Heading size="md">Formulários Abertos</Heading>
        <Text>Nenhuma formulário disponível no momento.</Text>
      </Box>
    );
  }

  return (
    <Box p={4} bg="bg.card" borderRadius="md">
      <Heading size="md">Formulários Abertos</Heading>
      <Divider my={2} />

      {isLoading && <Spinner />}

      {forms && (
        <Flex
          gap={4}
          mt={4}
          width="100%"
          flexWrap="wrap"
        >
          {forms?.map((form) => (
            <FormItem key={form._id} form={form} />
          ))}
        </Flex>
      )}
    </Box>
  );
};

export default OpenForms;

interface ActivityItemProps {
  form: IForm;
}

const FormItem: React.FC<ActivityItemProps> = memo(({ form }) => {
  const navigate = useNavigate();

  const handleView = useCallback(() => {
    navigate(`/response/${form.slug}`);
  }, [navigate, form.slug]);

  return (
    <Card
      boxShadow="md"
      borderWidth="1px"
      borderRadius="md"
      p={4}
      borderColor={"bg.border"}
      w={["100%", "100%", "30%"]}
      h={"100%"}
      gap={2}
    >
      <Stack
        spacing={2}
        display={"flex"}
        justifyContent={"space-between"}
        h="100%"
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h2" size="md">
            {form.name}
          </Heading>

          <Flex gap="2">
            <Button size="sm" onClick={handleView}>
              <FaEye />
            </Button>
          </Flex>
        </Flex>
        <Text fontSize="sm" noOfLines={2}>
          {form.description}
        </Text>
        <Text fontSize="sm">
          Fechamento:{" "}
          {form.period?.open ? convertDateTime(form.period.close) : "Indefinido"}
        </Text>
      </Stack>
    </Card>
  );
});

import { getOpenForms } from "@apis/dashboard";
import {
  Box,
  Button,
  Card,
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
      <Box p={4}>
        <Heading>Formulários Abertos</Heading>
        <Text>Nenhuma formulário disponível no momento.</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Heading>Minhas Atividades</Heading>

      {isLoading && <Spinner />}

      {forms && (
        <Grid
          gap={4}
          mt={4}
          width="100%"
          templateColumns="repeat(auto-fill, minmax(350px, 1fr))"
        >
          {forms?.map((form) => (
            <FormItem key={form._id} form={form} />
          ))}
        </Grid>
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
      borderColor={"gray"}
      w={"100%"}
      h={"100%"}
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
        <Text>
          Fechamento:{" "}
          {form.period?.open ? convertDateTime(form.period.open) : "Indefinido"}
        </Text>
      </Stack>
    </Card>
  );
});

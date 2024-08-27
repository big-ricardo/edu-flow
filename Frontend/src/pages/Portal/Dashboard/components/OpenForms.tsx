import { Flex, Button } from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const OpenForms: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Flex
      borderRadius="md"
      id="open-forms"
      w="100%"
      justifyContent={"flex-end"}
    >
      <Link to="/portal/new">
        <Button colorScheme="blue" fontSize="sm" fontWeight="normal" mb={2}>
          {t("dashboard.title.openForms")}
        </Button>
      </Link>
    </Flex>
  );
};

export default OpenForms;

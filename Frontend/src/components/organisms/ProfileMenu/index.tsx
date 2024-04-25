import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Button,
  Divider,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import useAuth from "@hooks/useAuth";

const rolesMap = (role: string) => {
  switch (role) {
    case "student":
      return "Aluno";
    case "teacher":
      return "Professor";
    case "admin":
      return "Administrador";
    default:
      return "Usuário";
  }
};

const AvatarMenu: React.FC = () => {
  const navigate = useNavigate();

  const [auth, setAuth] = useAuth();

  const userName = auth?.name;
  const roles = auth?.roles ?? [];
  const matriculation = auth?.matriculation;
  const email = auth?.email;

  const handleLogout = useCallback(() => {
    setAuth(null);
    navigate("/");
  }, [setAuth, navigate]);

  return (
    <Popover placement="right-start">
      <PopoverTrigger>
        <Avatar
          name={userName ?? "Usuário"}
          src="https://bit.ly/broken-link"
          size="sm"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Configurações</PopoverHeader>
        <PopoverBody>
          <Flex flexDir="column" alignItems="start">
            <Flex flexDir="row" alignItems="center" gap={1}>
              <Text mb={2} fontWeight="bold" fontSize="md">
                {userName}
              </Text>
              <Text mb={2} fontSize="sm" opacity={0.7}>
                #{matriculation}
              </Text>
            </Flex>
            <Flex flexDir="row" alignItems="center" gap={1}>
              <Text mb={2} fontSize="sm">
                Perfil:
              </Text>
              <Text mb={2} fontSize="sm" fontWeight="bold">
                {roles?.map((role) => rolesMap(role)).join(", ")}
              </Text>
            </Flex>
            <Flex flexDir="row" alignItems="center" gap={1}>
              <Text mb={2} fontSize="sm">
                Email:
              </Text>
              <Text mb={2} fontSize="sm" fontWeight="bold">
                {email}
              </Text>
            </Flex>
          </Flex>
          <Divider my={2} />
          <Button color={"icons"} size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default AvatarMenu;

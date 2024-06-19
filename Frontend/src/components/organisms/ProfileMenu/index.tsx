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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useBreakpointValue,
  useDisclosure,
  Hide,
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
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [auth, setAuth] = useAuth();

  const userName = auth?.name;
  const roles = auth?.roles ?? [];
  const matriculation = auth?.matriculation;
  const email = auth?.email;

  const handleLogout = useCallback(() => {
    setAuth(null);
    navigate("/");
  }, [setAuth, navigate]);

  const userDetails = useCallback(() => {
    return (
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
    );
  }, [userName, matriculation, roles, email]);

  return (
    <div id="profile-menu">
      <Flex align="center" gap={2} onClick={onOpen} cursor="pointer">
        <Avatar
          name={userName ?? "Usuário"}
          src="https://bit.ly/broken-link"
          size="sm"
        />
        <Hide above="md">
          <Text fontWeight="bold">{userName}</Text>
        </Hide>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex align="center" gap={2}>
              <Avatar
                name={userName ?? "Usuário"}
                src="https://bit.ly/broken-link"
                size="sm"
              />
              <Text fontWeight="bold">{userName}</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {userDetails()}
            <Divider my={2} />
            <Button colorScheme="blue" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AvatarMenu;

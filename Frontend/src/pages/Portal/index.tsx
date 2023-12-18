import {
  Flex,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Navbar from "@components/organisms/Navbar";
import { Outlet } from "react-router-dom";
import ProfileMenu from "@components/organisms/ProfileMenu";
import { FaSun, FaMoon } from "react-icons/fa";

function Dashboard() {
  const { toggleColorMode } = useColorMode();

  return (
    <Flex flexDir={"row"} position="relative">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        flexDir="column"
        h="100vh"
        position="fixed"
        bg={useColorModeValue("gray.50", "gray.900")}
        shadow="lg"
      >
        <Navbar />
        <Flex direction={"column"} mb="4">
          <IconButton
            mb={4}
            aria-label="toggle theme"
            rounded="full"
            size="xs"
            onClick={toggleColorMode}
            icon={useColorModeValue(<FaMoon />, <FaSun />)}
          />
          <ProfileMenu />
        </Flex>
      </Flex>

      <Flex
        minH={"100vh"}
        w={"100%"}
        ml={12}
        p={5}
        bg={useColorModeValue("gray.200", "gray.800")}
      >
        <Outlet />
      </Flex>
    </Flex>
  );
}

export default Dashboard;

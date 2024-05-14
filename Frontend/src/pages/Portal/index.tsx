import { Flex } from "@chakra-ui/react";
import Navbar from "@components/organisms/Navbar";
import { Outlet } from "react-router-dom";
import ProfileMenu from "@components/organisms/ProfileMenu";
import SwitchTheme from "@components/molecules/SwicthTheme";

function Dashboard() {
  return (
    <Flex flexDir={"row"} position="relative">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        flexDir="column"
        h="100vh"
        position="fixed"
        bg={"bg.navbar"}
      >
        <Navbar />
        <Flex direction={"column"} mb="4">
          <SwitchTheme />
          <ProfileMenu />
        </Flex>
      </Flex>

      <Flex minH={"100vh"} w={"100%"} ml={12} bg={"bg.page"}>
        <Outlet />
      </Flex>
    </Flex>
  );
}

export default Dashboard;

import { IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const SwitchTheme: React.FC = () => {
  const { toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="toggle theme"
      rounded="full"
      size="xs"
      onClick={toggleColorMode}
      icon={useColorModeValue(<FaMoon />, <FaSun />)}
      id="switch-theme"
    />
  );
};

export default SwitchTheme;

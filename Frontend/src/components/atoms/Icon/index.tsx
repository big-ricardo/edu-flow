import Logo from "../../../assets/logo-v2.png";
import LogoDark from "../../../assets/logo-v2-dark.png";
import { Image, ImageProps, useColorMode } from "@chakra-ui/react";
import React, { memo, useMemo } from "react";

interface IconProps extends ImageProps {}

const Icon: React.FC<IconProps> = memo((props) => {
  const theme = useColorMode();

  const img = useMemo(() => {
    if (theme.colorMode === "dark") {
      return LogoDark;
    }
    return Logo;
  }, [theme.colorMode]);

  return <Image src={img} {...props} />;
});

export default Icon;

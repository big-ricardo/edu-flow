import { extendTheme } from "@chakra-ui/react";

const customTheme = {
  fonts: {
    heading: `'Rubik', sans-serif`,
    body: `'Rubik', sans-serif`,
  },
};

const Theme = extendTheme(customTheme);

export type ThemeType = typeof customTheme;

export default Theme;

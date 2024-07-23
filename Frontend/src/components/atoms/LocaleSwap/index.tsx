import {
  Box,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tag,
  HStack,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import PtBr from "@assets/flags/pt-br.svg";
import EnUs from "@assets/flags/en-us.svg";

const Locales = {
  "pt-BR": { src: PtBr, beta: false },
  "en-US": { src: EnUs, beta: true },
} as const;

const LocaleSwap: React.FC = () => {
  const { t, i18n } = useTranslation();

  const handleLocaleChange = useCallback(
    (locale: keyof typeof Locales) => {
      i18n.changeLanguage(locale ?? "pt-BR");
      window.localStorage.setItem("locale", locale);
    },
    [i18n]
  );

  return (
    <Box>
      <Menu size={"sm"} isLazy>
        <MenuButton
          px={2}
          py={1}
          transition="all 0.2s"
          borderRadius="md"
          borderWidth="1px"
          w={"100%"}
        >
          <Image
            src={
              i18n.language === "pt-BR"
                ? Locales["pt-BR"].src
                : Locales["en-US"].src
            }
            width="1rem"
            margin="0 auto"
          />
        </MenuButton>
        <MenuList>
          {(Object.keys(Locales) as (keyof typeof Locales)[]).map((locale) => (
            <MenuItem
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              icon={<Image src={Locales[locale].src} width="1rem" />}
            >
              <HStack>
                <span>{t(`locale.${locale}`)}</span>
                {Locales[locale].beta && (
                  <Tag colorScheme="red" size={"sm"}>
                    Beta
                  </Tag>
                )}
              </HStack>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default LocaleSwap;

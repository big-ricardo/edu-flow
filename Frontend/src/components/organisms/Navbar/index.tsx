import {
  Box,
  List,
  ListItem,
  Tag,
  Tooltip,
  Link as ChakraLink,
  TagLabel,
  TagProps,
  Hide,
} from "@chakra-ui/react";
import { Link as ReactRouterLink, useLocation } from "react-router-dom";

import {
  BsHouse,
  BsBuilding,
  BsPerson,
  BsTag,
  BsFileEarmarkText,
  BsPostcardFill,
  BsActivity,
} from "react-icons/bs";
import { FaRegEnvelope, FaUniversity } from "react-icons/fa";
import { GoWorkflow } from "react-icons/go";
import React from "react";
import Can from "@components/atoms/Can";
import Icon from "@components/atoms/Icon";
import Tutorial, { JoyrideSteps } from "@components/molecules/Tutorial";

const steps: JoyrideSteps = [
  {
    target: "#dashboard",
    content: "Clique aqui para voltar para a página inicial quando quiser.",
  },
  {
    target: "#activities",
    content: "Clique aqui para ver as suas atividades.",
  },
  {
    target: "#users",
    content: "Clique aqui para adicionar/ver usuários.",
  },
  {
    target: "#institutes",
    content: "Clique aqui para ver as instituições.",
  },
  {
    target: "#universities",
    content: "Clique aqui para ver as universidades.",
  },
  {
    target: "#statuses",
    content: "Clique aqui para criar/editar os status.",
  },
  {
    target: "#emails",
    content: "Clique aqui para criar/editar os templates de emails.",
  },
  {
    target: "#forms",
    content: "Clique aqui para criar/editar os formulários.",
  },
  {
    target: "#workflows",
    content: "Clique aqui para criar/editar os fluxos.",
  },
  {
    target: "#reportings",
    content: "Clique aqui para criar/editar os relatórios.",
  },
];

const CustomCard = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ children, ...rest }, ref) => (
    <Box p="0">
      <Tag
        ref={ref}
        {...rest}
        backgroundColor="transparent"
        size="lg"
        borderRadius="none"
        justifyContent="flex-start"
        alignItems="center"
      >
        <TagLabel
          display="flex"
          justifyContent="flex-start"
          flexDirection={"row"}
          gap={4}
        >
          {children}
        </TagLabel>
      </Tag>
    </Box>
  )
);

function Sidebar() {
  const location = useLocation();

  return (
    <List fontSize="xl" spacing={4}>
      <Tutorial name="navbar" steps={steps} />

      <Hide below="md">
        <ListItem>
          <Icon w="50px" />
        </ListItem>
      </Hide>

      <Can permission="dashboard.view">
        <NavLink
          id="dashboard"
          to="/portal"
          label="Dashboard"
          icon={BsHouse}
          active={location.pathname === "/portal"}
        />
      </Can>

      <Can permission="activity.view">
        <NavLink
          id="activities"
          to="/portal/activities"
          label="Atividades"
          icon={BsActivity}
          active={location.pathname === "/portal/activities"}
        />
      </Can>

      <Can permission="user.view">
        <NavLink
          id="users"
          to="/portal/users"
          label="Usuários"
          icon={BsPerson}
          active={location.pathname === "/portal/users"}
        />
      </Can>

      <Can permission="institute.view">
        <NavLink
          id="institutes"
          to="/portal/institutes"
          label="Instituições"
          icon={BsBuilding}
          active={location.pathname === "/portal/institutes"}
        />
      </Can>

      <Can permission="university.view">
        <NavLink
          id="universities"
          to="/portal/universities"
          label="Universidades"
          icon={FaUniversity}
          active={location.pathname === "/portal/universities"}
        />
      </Can>

      <Can permission="status.view">
        <NavLink
          id="statuses"
          to="/portal/statuses"
          label="Status"
          icon={BsTag}
          active={location.pathname === "/portal/statuses"}
        />
      </Can>

      <Can permission="email.view">
        <NavLink
          id="emails"
          to="/portal/emails"
          label="Emails"
          icon={FaRegEnvelope}
          active={location.pathname === "/portal/emails"}
        />
      </Can>

      <Can permission="form.view">
        <NavLink
          id="forms"
          to="/portal/forms"
          label="Formulários"
          icon={BsFileEarmarkText}
          active={location.pathname === "/portal/forms"}
        />
      </Can>

      <Can permission="workflow.view">
        <NavLink
          id="workflows"
          to="/portal/workflows"
          label="Fluxos"
          icon={GoWorkflow}
          active={location.pathname === "/portal/workflows"}
        />
      </Can>

      <Can permission="reporting.view">
        <NavLink
          id="reportings"
          to="/portal/reportings"
          label="Relatórios"
          icon={BsPostcardFill}
          active={location.pathname === "/portal/reportings"}
        />
      </Can>
    </List>
  );
}

const NavLink = React.memo(
  ({
    id,
    to,
    label,
    icon: Icon,
    active = false,
  }: {
    id: string;
    to: string;
    label: string;
    icon: React.ElementType;
    active?: boolean;
  }) => (
    <ListItem key={id} id={id}>
      <ChakraLink as={ReactRouterLink} to={to}>
        <Tooltip
          label={label}
          aria-label="A tooltip"
          hasArrow
          size="md"
          placement="right-end"
          id={to.replace("/portal/", "")}
          display="flex"
        >
          <CustomCard
            _hover={{ textDecor: "none", color: "blue.500" }}
            _focus={{ outline: "none" }}
            color={active ? "blue.500" : ""}
          >
            <Icon size={24} />
            <Hide above="md">{label}</Hide>
          </CustomCard>
        </Tooltip>
      </ChakraLink>
    </ListItem>
  )
);

export default Sidebar;

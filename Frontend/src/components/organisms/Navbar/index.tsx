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
import { useTranslation } from "react-i18next";

const steps: JoyrideSteps = [
  {
    target: "#dashboard",
    content: "navbar.joyride.dashboard",
  },
  {
    target: "#activities",
    content: "navbar.joyride.activities",
  },
  {
    target: "#users",
    content: "navbar.joyride.users",
  },
  {
    target: "#institutes",
    content: "navbar.joyride.institutes",
  },
  {
    target: "#universities",
    content: "navbar.joyride.universities",
  },
  {
    target: "#statuses",
    content: "navbar.joyride.statuses",
  },
  {
    target: "#emails",
    content: "navbar.joyride.emails",
  },
  {
    target: "#forms",
    content: "navbar.joyride.forms",
  },
  {
    target: "#workflows",
    content: "navbar.joyride.workflows",
  },
  {
    target: "#reportings",
    content: "navbar.joyride.reportings",
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
    <List fontSize="xl" spacing={4} overflowY="auto" maxH="100vh">
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
          label="title.dashboard"
          icon={BsHouse}
          active={location.pathname === "/portal"}
        />
      </Can>

      <Can permission="activity.view">
        <NavLink
          id="activities"
          to="/portal/activities"
          label="title.activities"
          icon={BsActivity}
          active={location.pathname === "/portal/activities"}
        />
      </Can>

      <Can permission="user.view">
        <NavLink
          id="users"
          to="/portal/users"
          label="title.users"
          icon={BsPerson}
          active={location.pathname === "/portal/users"}
        />
      </Can>

      <Can permission="institute.view">
        <NavLink
          id="institutes"
          to="/portal/institutes"
          label="title.institutes"
          icon={BsBuilding}
          active={location.pathname === "/portal/institutes"}
        />
      </Can>

      <Can permission="university.view">
        <NavLink
          id="universities"
          to="/portal/universities"
          label="title.universities"
          icon={FaUniversity}
          active={location.pathname === "/portal/universities"}
        />
      </Can>

      <Can permission="status.view">
        <NavLink
          id="statuses"
          to="/portal/statuses"
          label="title.statuses"
          icon={BsTag}
          active={location.pathname === "/portal/statuses"}
        />
      </Can>

      <Can permission="email.view">
        <NavLink
          id="emails"
          to="/portal/emails"
          label="title.emails"
          icon={FaRegEnvelope}
          active={location.pathname === "/portal/emails"}
        />
      </Can>

      <Can permission="form.view">
        <NavLink
          id="forms"
          to="/portal/forms"
          label="title.forms"
          icon={BsFileEarmarkText}
          active={location.pathname === "/portal/forms"}
        />
      </Can>

      <Can permission="workflow.view">
        <NavLink
          id="workflows"
          to="/portal/workflows"
          label="title.workflows"
          icon={GoWorkflow}
          active={location.pathname === "/portal/workflows"}
        />
      </Can>

      <Can permission="reporting.view">
        <NavLink
          id="reportings"
          to="/portal/reportings"
          label="title.reportings"
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
  }) => {
    const { t } = useTranslation();

    return (
      <ListItem key={id} id={id}>
        <ChakraLink as={ReactRouterLink} to={to}>
          <Tooltip
            label={t(label)}
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
              <Hide above="md">{t(label)}</Hide>
            </CustomCard>
          </Tooltip>
        </ChakraLink>
      </ListItem>
    );
  }
);

export default Sidebar;

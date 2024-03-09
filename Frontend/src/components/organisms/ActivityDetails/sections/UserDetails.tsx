// UserDetails.tsx
import React from "react";
import { Box, Text } from "@chakra-ui/react";

interface UserDetailsProps {
  user: { name: string; email: string; matriculation: string };
  accepted?: "accepted" | "rejected" | "pending";
}

const UserDetails: React.FC<UserDetailsProps> = ({
  user,
  accepted = "accepted",
}) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      mb={4}
      opacity={accepted === "pending" ? 0.5 : 1}
    >
      <Text fontSize="sm" fontWeight={"bold"}>
        {user.name}
      </Text>
      <Text fontSize="sm">{user.email}</Text>
      <Text fontSize="sm">{user.matriculation}</Text>
    </Box>
  );
};

export default UserDetails;

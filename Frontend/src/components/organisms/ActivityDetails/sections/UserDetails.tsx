// UserDetails.tsx
import React from "react";
import { Box, Text } from "@chakra-ui/react";

interface UserDetailsProps {
  user: { name: string; email: string; matriculation: string };
  accepted?: "accepted" | "rejected" | "pending";
}

const UserDetails: React.FC<UserDetailsProps> = ({ user, accepted }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      mb={4}
      opacity={accepted === "pending" ? 0.5 : 1}
      borderColor={accepted === "rejected" ? "red.500" : undefined}
    >
      <Text fontSize="sm" fontWeight={"bold"}>
        {user.name}
      </Text>
      <Text fontSize="sm">{user.email}</Text>
      <Text fontSize="sm">{user.matriculation}</Text>

      {accepted === "rejected" && (
        <Text color="red.500" fontSize={"sm"}>
          Rejeitado
        </Text>
      )}
    </Box>
  );
};

export default UserDetails;

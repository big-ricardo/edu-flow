import { Button, Divider, Flex, Tag, Text } from "@chakra-ui/react";
import { convertDateTime } from "@utils/date";
import React, { memo, useCallback, useMemo } from "react";
import { FaEdit } from "react-icons/fa";

type DraftItemProps = {
  draft: {
    _id: string;
    status: "draft" | "published";
    version: number;
    createdAt: string;
    owner: {
      name: string;
    } | null;
  };
  onEdit: (draftId: string) => void;
};

const statusWorkflow = {
  draft: "Rascunho",
  published: "Publicado",
};

const DraftItem: React.FC<DraftItemProps> = memo(({ draft, onEdit }) => {
  const handleEdit = useCallback(() => {
    onEdit(draft._id);
  }, [draft._id, onEdit]);

  const createdAt = useMemo(
    () => convertDateTime(draft.createdAt),
    [draft.createdAt],
  );

  return (
    <Flex
      key={draft._id}
      border="1px solid"
      borderColor="gray.600"
      p="4"
      borderRadius="8"
      direction="column"
      gap="1"
    >
      <Flex
        justify="space-between"
        align="center"
        direction="row"
        gap="4"
        borderColor={draft.status === "draft" ? "blue.500" : "gray.500"}
        w="100%"
      >
        <Tag colorScheme={draft.status === "draft" ? "gray" : "green"}>
          {statusWorkflow[draft.status]}
        </Tag>
        <Text size="sm">Versão #{draft.version}</Text>
        <Text fontSize="sm">{createdAt}</Text>
        <Button
          colorScheme="blue"
          variant="outline"
          size="sm"
          onClick={handleEdit}
        >
          <FaEdit />
        </Button>
      </Flex>
      <Divider />
      <Text fontSize="sm">Criado por: {draft.owner?.name ?? "Anônimo"}</Text>
    </Flex>
  );
});

export default DraftItem;

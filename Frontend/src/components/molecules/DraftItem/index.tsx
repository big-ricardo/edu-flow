import { Button, Divider, Flex, Tag, Text } from "@chakra-ui/react";
import { convertDateTime } from "@utils/date";
import React, { memo, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
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

const DraftItem: React.FC<DraftItemProps> = memo(({ draft, onEdit }) => {
  const { t } = useTranslation();
  const handleEdit = useCallback(() => {
    onEdit(draft._id);
  }, [draft._id, onEdit]);

  const createdAt = useMemo(
    () => convertDateTime(draft.createdAt),
    [draft.createdAt]
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
          {t(`workflow.status.${draft.status}`)}
        </Tag>
        <Text size="sm">
          {t("common.fields.version")} #{draft.version}
        </Text>
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
      <Text fontSize="sm">
        {t("common.fields.by")}:
        {draft.owner?.name ?? t("common.fields.anonymous")}
      </Text>
    </Flex>
  );
});

export default DraftItem;

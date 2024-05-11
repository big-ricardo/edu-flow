import { Text, Icon, Flex, Divider } from "@chakra-ui/react";
import { FileUploaded } from "@interfaces/Answer";
import { DefaultExtensionType, FileIcon, defaultStyles } from "react-file-icon";

interface FileProps {
  file: FileUploaded;
}

const FileItem: React.FC<FileProps> = ({ file }) => {
  if (!file.name) return null;

  const extension = file.mimeType.split("/").pop() as DefaultExtensionType;

  return (
    <Flex direction={"column"} w="fit-content">
      <a href={file.url} target="_blank">
        <Flex
          direction="row"
          alignItems="center"
          border="1px solid"
          p={2}
          borderRadius="md"
          gap={2}
        >
          <Icon boxSize={10}>
            <FileIcon extension={extension} {...defaultStyles?.[extension]} />
          </Icon>
          <Divider orientation="vertical" />
          <Text fontSize="sm" fontWeight={"bold"}>
            {file.name.split("@").pop()}
          </Text>
        </Flex>
      </a>
    </Flex>
  );
};

export default FileItem;

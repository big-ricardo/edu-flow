import { Text, Icon, Flex } from "@chakra-ui/react";
import { FileUploaded } from "@interfaces/Answer";
import { IconType } from "react-icons";
import {
  FaFileImage,
  FaFileAudio,
  FaFileVideo,
  FaFilePdf,
  FaFile,
} from "react-icons/fa";

interface FileProps {
  file: FileUploaded;
}

const FileItem: React.FC<FileProps> = ({ file }) => {
  let IconComponent: IconType;

  if (file.mimeType.startsWith("image")) {
    IconComponent = FaFileImage;
  } else if (file.mimeType.startsWith("audio")) {
    IconComponent = FaFileAudio;
  } else if (file.mimeType.startsWith("video")) {
    IconComponent = FaFileVideo;
  } else if (file.mimeType === "application/pdf") {
    IconComponent = FaFilePdf;
  } else {
    IconComponent = FaFile;
  }

  if (!file.name) return null;

  return (
    <Flex direction={"column"}>
      <a href={file.url} target="_blank">
        <Flex direction="row" gap={1} alignItems="center">
          <Icon as={IconComponent} />
          <Text fontSize="sm" fontWeight={"bold"}>
            {file.name.split("@").pop()}
          </Text>
        </Flex>
      </a>
    </Flex>
  );
};

export default FileItem;

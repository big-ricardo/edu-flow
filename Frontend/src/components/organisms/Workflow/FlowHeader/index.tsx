import { publishUnpublish } from "@apis/workflows";
import {
  Box,
  Button,
  Flex,
  Heading,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React from "react";
import {
  FaArrowLeft,
  FaEdit,
  FaEye,
  FaPen,
  FaPushed,
  FaSave,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { Panel } from "reactflow";

interface FlowPanelProps {
  onSave: () => void;
  isPending?: boolean;
  isView?: boolean;
  status?: "draft" | "published";
}

const FlowPanel: React.FC<FlowPanelProps> = ({
  onSave,
  isPending,
  isView,
  status,
}) => {
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const id = params?.id ?? "";
  const toast = useToast();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending: isPendingPublish } = useMutation({
    mutationFn: publishUnpublish,
    onSuccess: () => {
      toast({
        title: `Workflow alterado com sucesso`,
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "left-accent",
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["workflow", id] });
      queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
    onError: (error: AxiosError<{ message: string; statusCode: number }>) => {
      toast({
        title: `Erro ao alterar workflow`,
        description: error?.response?.data?.message ?? error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "left-accent",
        position: "top-right",
      });
    },
  });

  const handlePublish = React.useCallback(() => {
    mutateAsync({
      _id: id,
      status: status === "draft" ? "published" : "draft",
    });
  }, [mutateAsync, id, status]);

  const handleBack = React.useCallback(() => {
    navigate("/portal/workflows");
  }, [navigate]);

  const handleNavigate = React.useCallback(() => {
    navigate(`/portal/workflow/${id}/${isView ? "edit" : "view"}`);
  }, [navigate, id, isView]);

  return (
    <Panel position="top-center" style={{ width: "100%", margin: 0 }}>
      <Flex
        bg={useColorModeValue("white", "gray.700")}
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="space-between"
        position={"relative"}
        p={2}
        shadow={"md"}
      >
        <Flex alignItems="center" gap={2}>
          <Heading size="md" fontWeight="bold">
            Workflow
          </Heading>
          <Button
            colorScheme="blue"
            onClick={handleBack}
            variant="ghost"
            size="sm"
            title="Voltar"
          >
            <FaArrowLeft />
          </Button>
        </Flex>

        <Flex gap="2" align="center">
          <Button
            colorScheme="blue"
            onClick={handleNavigate}
            variant="outline"
            size="sm"
            title={isView ? "Editar" : "Visualizar"}
          >
            {isView ? <FaPen /> : <FaEye />}
          </Button>

          {!isView && (
            <Button
              colorScheme="green"
              mr={2}
              onClick={onSave}
              size="sm"
              isLoading={isPending}
            >
              <FaSave /> &nbsp; Salvar Alterações
            </Button>
          )}

          <Button
            colorScheme="blue"
            onClick={handlePublish}
            variant="outline"
            size="sm"
            title={isView ? "Editar" : "Visualizar"}
            isDisabled={status === "published"}
            isLoading={isPendingPublish}
          >
            <Box as={FaPushed} transform="rotate(90deg)" /> &nbsp;
            {status === "published" ? "Publicado" : "Publicar"}
          </Button>
        </Flex>
      </Flex>
    </Panel>
  );
};

export default FlowPanel;

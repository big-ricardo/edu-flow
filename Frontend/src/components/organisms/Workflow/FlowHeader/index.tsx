import { publishUnpublish } from "@apis/workflowDraft";
import {
  Button,
  Flex,
  Heading,
  useToast,
} from "@chakra-ui/react";
import Can from "@components/atoms/Can";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React from "react";
import { FaArrowLeft, FaPushed, FaSave, FaEye, FaPen } from "react-icons/fa";
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
  const params = useParams<{ id?: string; workflow_id: string }>();
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
    navigate(`/portal/workflow/${params.workflow_id}`);
  }, [navigate, params.workflow_id]);

  const handleNavigate = React.useCallback(() => {
    navigate(
      `/portal/workflow-draft/${params.workflow_id}/${id}/${
        isView ? "edit" : "view"
      }`
    );
  }, [navigate, id, isView, params.workflow_id]);

  return (
    <Panel position="top-center" style={{ width: "100%", margin: 0 }}>
      <Flex
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="space-between"
        position={"relative"}
        p={2}
        shadow={"md"}
        bg="bg.navbar"
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
          <Can
            permission={isView ? "workflowDraft.create" : "workflowDraft.read"}
          >
            <Button
              colorScheme="blue"
              onClick={handleNavigate}
              variant="outline"
              size="sm"
              title={isView ? "Editar" : "Visualizar"}
            >
              {isView ? <FaPen /> : <FaEye />}
            </Button>
          </Can>
          {isView ? (
            <Can permission="workflowDraft.publish">
              <Button
                colorScheme="green"
                isDisabled={status !== "draft"}
                onClick={handlePublish}
                variant="outline"
                size="sm"
                isLoading={isPendingPublish}
                title={status === "draft" ? "Publicar" : "Despublicar"}
              >
                {status === "draft" ? <FaPushed /> : <FaSave />} &nbsp;
                {status === "draft" ? "Publicar" : "Publicado"}
              </Button>
            </Can>
          ) : (
            <Can permission="workflowDraft.create">
              <Button
                colorScheme="green"
                mr={2}
                onClick={onSave}
                size="sm"
                isLoading={isPending}
              >
                <FaSave /> &nbsp; Salvar Nova Versão
              </Button>
            </Can>
          )}
        </Flex>
      </Flex>
    </Panel>
  );
};

export default FlowPanel;

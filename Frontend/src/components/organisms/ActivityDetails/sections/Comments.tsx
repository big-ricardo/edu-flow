import {
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Card,
  CardBody,
  Button,
  Flex,
  useColorModeValue,
  Text,
  Divider,
  DrawerFooter,
  Badge,
} from "@chakra-ui/react";
import { FaComments } from "react-icons/fa";
import { createOrUpdateComment, getComments } from "@apis/comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { memo, useMemo } from "react";
import useAuth from "@hooks/useAuth";
import IComment from "@interfaces/Comments";
import IUser from "@interfaces/User";
import { FormProvider, useForm } from "react-hook-form";
import TextArea from "@components/atoms/Inputs/TextArea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { convertDateTime } from "@utils/date";

interface CommentsProps {
  id: string;
}

const Comments: React.FC<CommentsProps> = ({ id }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data] = useAuth();
  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", id],
    queryFn: getComments,
  });

  const Length = useMemo(() => {
    if (!comments?.comments?.length || !data) {
      return false;
    }

    return comments?.comments?.length;
  }, [comments, data]);

  return (
    <>
      <Flex position="relative" alignItems="center">
        <IconButton
          isLoading={isLoading}
          aria-label="Comments"
          icon={<FaComments />}
          variant="outline"
          colorScheme="blue"
          size="sm"
          onClick={onOpen}
        />
        <Badge
          colorScheme="blue"
          ml="1"
          position="absolute"
          top="-2"
          right="-2"
          borderRadius="full"
          variant="solid"
        >
          {Length}
        </Badge>
      </Flex>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Comentários</DrawerHeader>
          <DrawerBody>
            <Card w="full" h="full">
              <CardBody>
                <Flex direction="column" gap={2} h="full" overflowY="auto">
                  {comments?.comments?.map((comment) => (
                    <CommentItem key={comment._id} comment={comment} />
                  ))}
                </Flex>
              </CardBody>
            </Card>
          </DrawerBody>
          <DrawerFooter>
            <CommentForm id={id} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Comments;

const formSchema = z.object({
  content: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const CommentForm: React.FC<{ id: string }> = ({ id }) => {
  const queryClient = useQueryClient();

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { handleSubmit, reset } = methods;

  const { mutate, isPending } = useMutation({
    mutationKey: ["comment", id],
    mutationFn: createOrUpdateComment,
    onSuccess: (data) => {
      reset();
      queryClient.setQueryData(
        ["comments", id],
        (oldData: Awaited<ReturnType<typeof getComments>>) => {
          return {
            ...oldData,
            comments: [...oldData.comments, data],
          };
        },
      );
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutate({ ...data, activity: id });
  });

  return (
    <FormProvider {...methods}>
      <Flex as="form" onSubmit={onSubmit} w="full" gap={2} alignItems="end">
        <TextArea
          input={{
            id: "content",
            placeholder: "Escreva seu comentário",
          }}
        />
        <Button
          type="submit"
          mb="2"
          size="md"
          colorScheme="blue"
          isLoading={isPending}
        >
          Enviar
        </Button>
      </Flex>
    </FormProvider>
  );
};

interface CommentItemProps {
  comment: Omit<IComment, "user"> & {
    user: Pick<IUser, "name" | "_id" | "email">;
  };
}

const CommentItem: React.FC<CommentItemProps> = memo(({ comment }) => {
  return (
    <Card mb={2} p={2} bg={useColorModeValue("gray.200", "gray.800")}>
      <Flex justifyContent="space-between">
        <Flex alignItems="start" gap={2} direction="column">
          <Text fontWeight="bold" title={comment.user.email} noOfLines={1}>
            {comment.user.name}
          </Text>
        </Flex>
        <Text as="small" color="gray.500" textAlign={"right"} mt={2}>
          {convertDateTime(comment.createdAt)}
        </Text>
      </Flex>
      <Divider my={2} />
      <Text>{comment.content}</Text>
    </Card>
  );
});

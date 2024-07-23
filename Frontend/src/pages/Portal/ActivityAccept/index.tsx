import { useCallback, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { acceptActivity, getActivity } from "@apis/activity";
import ActivityDetails from "@components/organisms/ActivityDetails";
import { FaCheck, FaTimes } from "react-icons/fa";
import ActivityProvider from "@contexts/ActivityContext";
import { useTranslation } from "react-i18next";

const activitySchema = z.object({
  accepted: z.enum(["accepted", "rejected"]),
});

type ActivityFormSchema = z.infer<typeof activitySchema>;

export default function ActivityAccept() {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const params = useParams<{ id: string }>();
  const id = params.id ?? "";

  const { data: activity, isLoading } = useQuery({
    queryKey: ["activity", id],
    queryFn: getActivity,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: acceptActivity,
    onSuccess: () => {
      toast({
        title: t("activityAccept.success"),
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["activity", id] });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: t("activityAccept.error"),
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    },
  });

  const methods = useForm<ActivityFormSchema>({
    resolver: zodResolver(activitySchema),
  });

  const haveAnswer = methods.watch("accepted");

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    await mutateAsync({ _id: id, accepted: data.accepted });
  });

  const handleCancel = useCallback(() => {
    methods.reset();
  }, [methods]);

  useEffect(() => {}, [errors]);

  const handleAccept = useCallback(() => {
    methods.setValue("accepted", "accepted");
  }, [methods]);

  const handleReject = useCallback(() => {
    methods.setValue("accepted", "rejected");
  }, [methods]);

  console.log(methods.formState.errors);

  if (isLoading)
    return (
      <Flex justify="center">
        <Spinner />
      </Flex>
    );

  return (
    <Flex
      w={["100%", "70%"]}
      my="6"
      mx="auto"
      px="6"
      justify="center"
      direction="column"
    >
      <Card
        as="form"
        onSubmit={onSubmit}
        borderRadius={8}
        h="fit-content"
        w="100%"
        top="5"
      >
        <CardHeader>
          <Box textAlign="center" fontSize="lg" fontWeight="bold">
            {t("activityAccept.title")}
          </Box>
        </CardHeader>
        <CardBody display="flex" flexDirection="column" gap="4">
          <FormProvider {...methods}>
            <ButtonGroup>
              <Flex
                justifyContent="center"
                alignItems="center"
                w="100%"
                gap="4"
              >
                {!haveAnswer ? (
                  <>
                    <Button
                      leftIcon={<FaCheck />}
                      colorScheme="green"
                      onClick={handleAccept}
                    >
                      {t("activityAccept.submit")}
                    </Button>
                    <Button
                      leftIcon={<FaTimes />}
                      colorScheme="red"
                      onClick={handleReject}
                    >
                      {t("activityAccept.reject")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      colorScheme="blue"
                      onClick={onSubmit}
                      isLoading={isPending}
                    >
                      {t("activityAccept.confirm")}
                    </Button>
                    <Button colorScheme="red" onClick={handleCancel}>
                      {t("activityAccept.cancel")}
                    </Button>
                  </>
                )}
              </Flex>
            </ButtonGroup>
          </FormProvider>
        </CardBody>
      </Card>
      <ActivityProvider>
        <ActivityDetails activity={activity} w="100%" />
      </ActivityProvider>
    </Flex>
  );
}

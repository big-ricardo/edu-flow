import { getUsersByRole } from "@apis/field";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Input,
} from "@chakra-ui/react";
import InfoTooltip from "@components/atoms/Inputs/InfoTooltip";
import Select from "@components/atoms/Inputs/Select";
import { ErrorMessage } from "@hookform/error-message";
import { IUserRoles } from "@interfaces/User";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { z } from "zod";

const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

type IUserForm = z.infer<typeof UserSchema>;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IUserForm) => void;
  initialData?: IUserForm | null;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");

  const handleSubmit = () => {
    const data = UserSchema.safeParse({ name, email });

    if (!data.success) {
      alert("Dados inválidos");
      return;
    }

    onSubmit(data.data);
    onClose();
  };

  useEffect(() => {
    setName(initialData?.name ?? "");
    setEmail(initialData?.email ?? "");
  }, [initialData]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {initialData ? "Editar Professor" : "Criar Novo Professor"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Nome</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do professor"
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Email</FormLabel>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email do professor"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Salvar
          </Button>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

interface InputUserProps {
  input: {
    id: string;
    label: string;
    describe?: string | null;
    multi?: boolean;
    created?: boolean;
  };
}

const InputUser: React.FC<InputUserProps> = ({ input }) => {
  const { data: teachers, isLoading } = useQuery({
    queryKey: ["field", IUserRoles.teacher],
    queryFn: getUsersByRole,
  });

  const {
    control,
    watch,
    formState: { errors },
    setValue,
  } = useFormContext();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: input.id,
    rules: {
      maxLength: {
        value: input.multi ? 10 : 1,
        message: "Max length is 10f",
      },
    },
  });
  const [editableUser, setEditableUser] = useState<IUserForm | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const openEditModal = (user: IUserForm | null) => {
    setEditableUser(user);
    onOpen();
  };

  const handleUserSubmit = useCallback(
    ({ name, email }: IUserForm) => {
      if (editableUser) {
        update(
          fields.findIndex((field) => field.email === editableUser?.email),
          { name, email }
        );
      } else {
        append({ name, email });
      }
      setEditableUser(null);
    },
    [append, update, fields, editableUser]
  );

  const selectedTeacherId = watch(`${input.id}-select-user`);
  const teachersData = useMemo(
    () =>
      teachers
        ?.filter((teacher) =>
          fields.every((field) => field.email !== teacher.email)
        )
        ?.map((teacher) => ({
          value: teacher._id,
          label: `${teacher.name} - ${teacher.matriculation}`,
        })),
    [teachers, fields]
  );

  const appendExistingUser = useCallback(() => {
    const teacher = teachers?.find((t) => t._id === selectedTeacherId);
    if (teacher) {
      append({ name: teacher.name, email: teacher.email, _id: teacher._id });
      setValue(`${input.id}-select-user`, "");
    }
  }, [teachers, selectedTeacherId, append, setValue, input.id]);

  return (
    <FormControl id={input.id} isInvalid={!!errors?.[input.id]}>
      <Flex align="start" gap="4" direction={"column"} mb="4">
        <FormLabel>{input?.label}</FormLabel>
        <InfoTooltip describe={input?.describe} />
        <Flex align="end" gap="4" w="100%">
          <Select
            input={{
              id: `${input.id}-select-user`,
              label: "Selecione um professor",
              options: teachersData ?? [],
              placeholder: "Selecione um professor",
            }}
            isLoading={isLoading}
          />
          <Button
            onClick={appendExistingUser}
            colorScheme="blue"
            isDisabled={
              !selectedTeacherId ||
              fields.length >= 10 ||
              (!input.multi && !!fields.length)
            }
          >
            Adicionar
          </Button>
        </Flex>
        {input?.created && (
          <Button
            onClick={() => openEditModal(null)}
            colorScheme="blue"
            size="sm"
          >
            Adicionar Novo Professor
          </Button>
        )}
      </Flex>
      <ErrorMessage errors={errors} name={input.id} as="p" />
      <UserModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleUserSubmit}
        initialData={editableUser}
      />

      {fields.map((field, index) => (
        <ItemUser
          key={index}
          index={index}
          field={field}
          remove={remove}
          edit={() => openEditModal(field)}
        />
      ))}
    </FormControl>
  );
};

const ItemUser: React.FC<{
  index: number;
  field: {
    name: string;
    email: string;
    _id?: string;
  };
  remove: (index: number) => void;
  edit: () => void;
}> = ({ index, field, remove, edit }) => {
  const bg = useColorModeValue("gray.300", "gray.600");
  const isNewUser = !field._id;

  return (
    <Flex
      key={index}
      p="4"
      direction={["column", "row"]}
      borderRadius="md"
      align="center"
      border="1px"
      borderColor={bg}
      mt="4"
    >
      <Text fontWeight="bold" fontSize="lg" flex="1" mr="4">
        {field.name}
      </Text>
      <Text flex="1" mr="4">
        {field.email}
      </Text>
      <div>
        {isNewUser && (
          <Button
            colorScheme="blue"
            onClick={edit}
            ml="4"
            size="sm"
            variant="ghost"
          >
            <FaEdit />
          </Button>
        )}
        <Button
          colorScheme="red"
          onClick={() => remove(index)}
          ml="4"
          size="sm"
          variant="ghost"
        >
          <FaTrashAlt />
        </Button>
      </div>
    </Flex>
  );
};

export default InputUser;

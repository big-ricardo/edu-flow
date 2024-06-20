import { Button, Flex, Icon } from "@chakra-ui/react";
import { memo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { BiSearch } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";

interface FormData {
  [key: string]: string | string[];
}

const Container: React.FC<React.HTMLAttributes<HTMLDivElement>> = memo(
  ({ children }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const methods = useForm({
      defaultValues: Object.fromEntries(searchParams),
    });

    const onSubmit = methods.handleSubmit((data: FormData) => {
      const search: Record<string, string> = {};

      Object.keys(data).forEach((key) => {
        const value = data[key];
        if (Array.isArray(value)) {
          search[key] = value.join(",");
        } else if (value) {
          search[key] = value;
        }
      });

      setSearchParams(search);
    });

    return (
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <Flex
            direction={{ base: "column", md: "row" }}
            p={4}
            justify="space-between"
            align="end"
            gap={4}
          >
            {children}

            <div>
              <Button type="submit">
                <Icon as={BiSearch} />
              </Button>
            </div>
          </Flex>
        </form>
      </FormProvider>
    );
  }
);

export default {
  Container,
};

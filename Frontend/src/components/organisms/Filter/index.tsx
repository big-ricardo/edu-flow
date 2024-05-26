import { Button, Flex, Icon } from "@chakra-ui/react";
import { memo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { BiSearch } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";

const Container: React.FC<React.HTMLAttributes<HTMLDivElement>> = memo(
  ({ children }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const methods = useForm({
      defaultValues: Object.fromEntries(searchParams),
    });

    const onSubmit = methods.handleSubmit((data) => {
      const search: Record<string, string | Array<string>> = {};

      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          if (data[key].length) {
            search[key] = data[key].join(",");
          }
        } else if (data[key]) {
          search[key] = data[key];
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

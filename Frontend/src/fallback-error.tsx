import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  Divider,
  Heading,
  Text,
} from "@chakra-ui/react";

export default function FallbackRender({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <Center flexDirection="column" m="auto">
      <Heading size="lg">Oops...</Heading>
      <Text>Aconteceu um erro inesperado.</Text>

      <Card m="auto" mt="4" w={["100%", "60%"]}>
        <CardBody>
          <Text>Erro: {error.message}</Text>
          <Divider my="2" />
          <Text>Stack: {error.stack}</Text>
        </CardBody>

        <CardFooter>
          <Button onClick={resetErrorBoundary} colorScheme="blue">
            Tentar novamente
          </Button>
        </CardFooter>
      </Card>
    </Center>
  );
}

import { Flex, Card, CardBody, Heading } from "@chakra-ui/react";

const MetricsCards = ({
  openActivitiesCount,
  closedActivitiesCount,
}: {
  openActivitiesCount: number;
  closedActivitiesCount: number;
}) => {
  return (
    <Flex justifyContent="space-between" mb="6" wrap="wrap" direction={["column", "row"]} w="100%">
      <Card>
        <CardBody>
          <Heading size="md">Atividades Abertas</Heading>
          <Heading size="lg" color="green.500">
            {openActivitiesCount}
          </Heading>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <Heading size="md">Atividades Fechadas</Heading>
          <Heading size="lg" color="red.500">
            {closedActivitiesCount}
          </Heading>
        </CardBody>
      </Card>
    </Flex>
  );
};

export default MetricsCards;

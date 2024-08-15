import React, { useCallback } from "react";
import {
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepTitle,
  StepSeparator,
  StepIcon,
  StepNumber,
  Box,
  useSteps,
  Flex,
  Card,
  Button,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface IStep {
  title: string;
  description: string;
  content: React.ReactNode;
}

interface IStepsProps {
  steps: IStep[];
  onFinish?: () => void;
}

const Steps: React.FC<IStepsProps> = ({ steps, onFinish }) => {
  const { t } = useTranslation();
  const { activeStep, goToNext, goToPrevious } = useSteps({
    index: 0,
    count: steps.length,
  });

  const handleFinish = useCallback(() => {
    onFinish && onFinish();
  }, [onFinish]);

  return (
    <Flex w="100%" direction="column" align="center">
      <Card w="100%" p={4} mb={4}>
        <Stepper index={activeStep}>
          {steps.map((step) => (
            <Step key={step.title}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink="0">
                <StepTitle>{step.title}</StepTitle>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>
      </Card>

      <Card p="4" w="100%">
        <Box minH="50vh">{steps[activeStep].content}</Box>
        <Flex justify="space-between" mt={4}>
          <Box>
            {activeStep > 0 && (
              <Button onClick={goToPrevious}>{t("tutorial.previous")}</Button>
            )}
          </Box>
          <Box>
            {activeStep < steps.length - 1 && (
              <Button onClick={goToNext}>{t("tutorial.next")}</Button>
            )}
          </Box>

          {activeStep === steps.length - 1 && (
            <Button colorScheme="teal" onClick={handleFinish}>
              {t("tutorial.finish")}
            </Button>
          )}
        </Flex>
      </Card>
    </Flex>
  );
};

export default Steps;

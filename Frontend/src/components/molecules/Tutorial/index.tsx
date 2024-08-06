import { updateTutorials } from "@apis/users";
import { useTheme } from "@chakra-ui/react";
import useAuth from "@hooks/useAuth";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import JoyrideLib, { Props, CallBackProps } from "react-joyride";

interface JoyrideStep {
  target: string;
  content: string;
  permission?: string;
}

export type JoyrideSteps = Array<JoyrideStep>;

interface JoyrideProps extends Partial<Props> {
  steps: JoyrideSteps;
  name: string;
}

const Tutorial: React.FC<JoyrideProps> = (props) => {
  const [auth] = useAuth();

  if (!auth) return null;

  if (!auth.tutorials.includes(props.name)) {
    return <Joyride {...props} />;
  }

  return null;
};

const Joyride: React.FC<JoyrideProps> = ({ steps, ...props }) => {
  const { t } = useTranslation();
  const [auth] = useAuth();
  const theme = useTheme();
  const permissions = auth?.permissions || [];

  const filteredSteps = useMemo(() => {
    return steps.filter((step) => {
      if (!step.permission) return true;
      return permissions.includes(step.permission);
    });
  }, [permissions, steps]);

  const stepsTranslated = useMemo(() => {
    return filteredSteps.map((step) => {
      return {
        ...step,
        content: t(step.content),
      };
    });
  }, [filteredSteps, t]);

  const finishedOrSkipped = useCallback(() => {
    if (!auth) return;

    auth.tutorials.push(props.name);

    updateTutorials(auth.id, props.name);
  }, [auth, props.name]);

  const Callback = useCallback(
    (data: CallBackProps) => {
      if (data.action === "skip" || data.status === "finished") {
        finishedOrSkipped();
      }
    },
    [finishedOrSkipped]
  );

  const Styles = useMemo(() => {
    return {
      options: {
        arrowColor: "#fff",
        backgroundColor: "#fff",
        overlayColor: "rgba(0, 0, 0, 0.5)",
        primaryColor: theme.semanticTokens.colors.bg.primary.default,
        spotlightShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
        textColor: "#000",
        width: 400,
        zIndex: 1000,
      },
    };
  }, [theme]);

  const Locale = useMemo(() => {
    return {
      back: t("tutorial.back"),
      close: t("tutorial.close"),
      last: t("tutorial.last"),
      next: t("tutorial.next"),
      skip: t("tutorial.skip"),
    };
  }, [t]);

  return (
    <JoyrideLib
      {...props}
      run
      steps={stepsTranslated}
      continuous={true}
      showProgress={true}
      locale={Locale}
      callback={Callback}
      styles={Styles}
    />
  );
};

export default Tutorial;

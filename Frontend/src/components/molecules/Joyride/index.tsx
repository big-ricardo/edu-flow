import useAuth from "@hooks/useAuth";
import React, { useMemo } from "react";
import JoyrideLib, { Props } from "react-joyride";

interface JoyrideStep {
  target: string;
  content: string;
  permission?: string;
}

export type JoyrideSteps = Array<JoyrideStep>;

interface JoyrideProps extends Props {
  steps: JoyrideSteps;
}

const Joyride: React.FC<JoyrideProps> = ({ steps, ...props }) => {
  const [auth] = useAuth();
  const permissions = auth?.permissions || [];

  const filteredSteps = useMemo(() => {
    return steps.filter((step) => {
      if (!step.permission) return true;
      return permissions.includes(step.permission);
    });
  }, [permissions, steps]);

  return (
    <JoyrideLib
      {...props}
      run={false}
      steps={filteredSteps}
      continuous={true}
      showProgress={true}
      locale={{
        back: "Voltar",
        close: "Fechar",
        last: "Finalizar",
        next: "Próximo",
        skip: "Pular",
      }}
    />
  );
};

export default Joyride;

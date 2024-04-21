import { IStep } from "../models/client/WorkflowDraft";

export default function validateGraph(steps: IStep[]) {
  const ids = new Set<string>();

  for (const step of steps) {
    if (ids.has(step.id)) {
      const err = {
        status: 400,
        message: `Duplicate step id ${step.id}`,
      };

      throw err;
    }

    ids.add(step.id);
  }

  for (const step of steps) {
    if (step.next["default-target"] && !ids.has(step.next["default-target"])) {
      const err = {
        status: 400,
        message: `O Step ${step.id} possui um proximo step inválido`,
      };

      throw err;
    }

    if (
      step.next["alternative-target"] &&
      !ids.has(step.next["alternative-target"])
    ) {
      const err = {
        status: 400,
        message: `O Step ${step.id} possui um proximo step inválido`,
      };

      throw err;
    }
  }

  const start = steps.find((step) => step.id === "start");

  if (!start) {
    const err = {
      status: 400,
      message: `Sem step inicial`,
    };

    throw err;
  }

  const visited = new Set<string>();

  const dfs = (step: IStep) => {
    if (visited.has(step.id)) {
      return;
    }

    visited.add(step.id);

    if (step.next["default-target"]) {
      const nextStep = steps.find((s) => s.id === step.next["default-target"]);

      if (nextStep) {
        dfs(nextStep);
      }
    }
  };
}

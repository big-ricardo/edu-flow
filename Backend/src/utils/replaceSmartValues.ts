import { Connection, Types } from "mongoose";
import Activity from "../models/client/Activity";

const replaceSmartValues = async <T extends string | string[]>({
  conn,
  activity_id,
  replaceValues,
}: {
  conn: Connection;
  activity_id: string;
  replaceValues: T;
}): Promise<T> => {
  const activity = (
    await new Activity(conn).model().findById(activity_id)
  ).toObject();

  if (!activity) {
    return replaceValues;
  }

  if (Array.isArray(replaceValues)) {
    return replaceValues.map((replaceValue) => {
      return replaceVariables({ activity }, replaceValue);
    }) as T;
  } else {
    return replaceVariables({ activity }, replaceValues) as T;
  }
};

export default replaceSmartValues;

export function replaceVariables(data, template: string): string {
  const regex = /\${{([\w.#]+)}}/g;

  // Função recursiva para lidar com a navegação e extração de valores.
  function resolveValue(currentValue, levels, levelIndex = 0): any {
    if (currentValue === undefined || levelIndex >= levels.length) {
      return currentValue;
    }

    const level = levels[levelIndex];
    if (level[0] === "#") {
      // Trata arrays
      const arrayName = level.substring(1);
      let nextValue = currentValue[arrayName];

      if (!Array.isArray(nextValue)) {
        return "-";
      }

      if (levelIndex < levels.length - 1) {
        // Processa os elementos do array recursivamente.
        return nextValue
          .map((item) => resolveValue(item, levels, levelIndex + 1))
          .join(", ");
      } else {
        // Se for o último nível, junta os valores do array.
        return nextValue.join(", ");
      }
    } else {
      // Processa objetos e valores simples recursivamente.
      return resolveValue(currentValue[level], levels, levelIndex + 1);
    }
  }

  return template.replace(regex, (match, key) => {
    const levels = key.split(".");
    const resolvedValue = resolveValue(data, levels);
    return resolvedValue !== undefined ? resolvedValue : "-";
  });
}

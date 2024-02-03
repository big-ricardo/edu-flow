import NumberInput from "../Number";

const Evaluated: typeof NumberInput = ({ input }) => {
  return (
    <NumberInput
      input={{
        ...input,
        placeholder: "Insira uma nota de 0 a 10",
      }}
      min={0}
      max={10}
    />
  );
};

export default Evaluated;

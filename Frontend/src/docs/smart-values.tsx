import { Flex, Heading, Text, List, ListItem, Code } from "@chakra-ui/react";

const HelpSmartValues = () => {
  return (
    <Flex
      p={5}
      mx="auto"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      gap={2}
    >
      <Heading as="h1" size="md" mb={5}>
        Guia do Usuário para Utilização do Smart Values
      </Heading>

      <Heading as="h2" fontSize="lg" mb={3}>
        O que é o Smart Values?
      </Heading>
      <Text mb={5}>
        O Smart Values é uma funcionalidade que permite a substituição
        automática de variáveis em textos, usando dados específicos de uma
        atividade. Isso é útil para personalizar mensagens, e-mails e outros
        conteúdos sem precisar fazer isso manualmente.
      </Text>

      <Heading as="h2" fontSize="lg" mb={3}>
        Como Funciona?
      </Heading>
      <Text mb={5}>
        Imagine que você tem uma atividade com várias informações, como o nome
        do cliente, a data da atividade, etc. Com o Smart Values, você pode
        criar templates de texto que serão automaticamente preenchidos com esses
        dados.
      </Text>

      <Heading as="h2" fontSize="lg" mb={3}>
        Exemplos de Uso
      </Heading>

      <Heading as="h3" size="sm" mb={3}>
        1. Template Simples
      </Heading>
      <Text mb={2}>
        Você pode criar um template de texto com variáveis que serão
        substituídas. Por exemplo:
      </Text>
      <Code
        p={2}
        mb={2}
        display="block"
        whiteSpace="pre"
        maxW="100%"
        overflowX="auto"
      >
        Olá, ${"{{'cliente.nome'}}"}! Sua atividade está agendada para $
        {"{{'atividade.data'}}"}.
      </Code>
      <Text mb={2}>
        Se você tiver uma atividade com o nome do cliente como "João" e a data
        da atividade como "10 de julho", o texto será automaticamente convertido
        para:
      </Text>
      <Code p={2} mb={5} display="block" whiteSpace="pre">
        Olá, João! Sua atividade está agendada para 10 de julho.
      </Code>

      <Heading as="h3" size="sm" mb={3}>
        2. Listas e Arrays
      </Heading>
      <Text mb={2}>
        O Smart Values também lida com listas e arrays. Por exemplo:
      </Text>
      <Code p={2} mb={2} display="block" whiteSpace="pre">
        Itens na atividade: ${"{{'atividade.itens.#nome'}}"}.
      </Code>
      <Text mb={2}>
        Se a atividade tiver itens com os nomes "Item1", "Item2" e "Item3", o
        texto será convertido para:
      </Text>
      <Code p={2} mb={5} display="block" whiteSpace="pre">
        Itens na atividade: Item1, Item2, Item3.
      </Code>

      <Heading as="h2" fontSize="lg" mb={3}>
        Como Usar
      </Heading>
      <List spacing={3} mb={5}>
        <ListItem>
          1.{" "}
          <Text as="span" fontWeight="bold">
            Identifique as variáveis que você quer substituir
          </Text>
          : Estas variáveis devem estar dentro de <Code>${"{{}}"}</Code>.
        </ListItem>
        <ListItem>
          2.{" "}
          <Text as="span" fontWeight="bold">
            Crie seu template de texto
          </Text>
          : Use as variáveis dentro do template. Por exemplo:{" "}
          <Code>Olá, ${"{{'cliente.nome'}}"}!</Code>
        </ListItem>
        <ListItem>
          3.{" "}
          <Text as="span" fontWeight="bold">
            Utilize a função Smart Values para fazer a substituição
          </Text>
          : A função cuidará de substituir as variáveis pelos valores corretos
          da atividade.
        </ListItem>
      </List>

      <Heading as="h2" fontSize="lg" mb={3}>
        Dicas Úteis
      </Heading>
      <List spacing={3} mb={5}>
        <ListItem>
          <Text as="span" fontWeight="bold">
            Verifique os nomes das variáveis
          </Text>
          : As variáveis devem corresponder exatamente aos nomes dos dados na
          atividade.
        </ListItem>
        <ListItem>
          <Text as="span" fontWeight="bold">
            Use sempre <Code>${"{{}}"}</Code>
          </Text>
          : Isso ajuda a identificar claramente as variáveis que devem ser
          substituídas.
        </ListItem>
        <ListItem>
          <Text as="span" fontWeight="bold">
            Arrays e Listas
          </Text>
          : Use <Code>#</Code> para indicar que está lidando com listas ou
          arrays. Por exemplo, <Code>${"{{atividade.itens.#nome}}"}</Code>.
        </ListItem>
      </List>

      <Heading as="h2" fontSize="lg" mb={3}>
        Perguntas Frequentes
      </Heading>
      <Text mb={2}>
        <Text as="span" fontWeight="bold">
          P: O que acontece se a variável não existir?
        </Text>
      </Text>
      <Text mb={5}>
        R: Se a variável não for encontrada, será substituída por um hífen{" "}
        <Code>-</Code>.
      </Text>

      <Text mb={2}>
        <Text as="span" fontWeight="bold">
          P: Posso usar múltiplas variáveis em um único texto?
        </Text>
      </Text>
      <Text mb={5}>
        R: Sim! Você pode usar quantas variáveis precisar dentro do seu
        template.
      </Text>

      <Heading as="h2" fontSize="lg" mb={3}>
        Conclusão
      </Heading>
      <Text mb={5}>
        O Smart Values é uma ferramenta poderosa para personalizar seus textos
        de forma dinâmica e automática, economizando tempo e esforço. Com apenas
        alguns passos simples, você pode criar mensagens personalizadas para
        cada atividade. Experimente e veja como pode facilitar sua comunicação!
      </Text>
    </Flex>
  );
};

export default HelpSmartValues;

import React, { useCallback } from "react";
import { Box, Flex, Text, Heading, Divider, Icon } from "@chakra-ui/react";
import { FaTasks, FaFileAlt, FaCheckCircle, FaWpforms } from "react-icons/fa";
import { GoTag, GoWorkflow } from "react-icons/go";
import { BiMailSend } from "react-icons/bi";
import { LiaNotesMedicalSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import { updateTutorials } from "@apis/users";
import useAuth from "@hooks/useAuth";
import Steps from "@components/organisms/Steps";

const steps = [
  {
    title: "Formulários",
    description: "Tipos de formulários",
    content: (
      <Box mt={4}>
        <Heading size="md" mb={4}>
          Formulários
        </Heading>

        <Text fontSize="lg" mb={4}>
          Os formulários são a base do sistema e são utilizados para capturar as
          informações necessárias ao longo do fluxo de TCC. Eles permitem a
          definição de atividades, submissão de informações e avaliação do
          desempenho dos alunos.
        </Text>

        <Divider my={4} />

        <Flex align="center" mb={4}>
          <Icon as={FaTasks} boxSize={6} color="teal.500" mr={4} />
          <Heading size="sm">
            Formulário de Criação da Atividade (Criação)
          </Heading>
        </Flex>
        <Text>
          Este formulário é utilizado para iniciar novas atividades no sistema,
          permitindo a definição de parâmetros iniciais como título, descrição,
          prazo e responsáveis.
        </Text>
        <Text mt={2}>
          <b>Exemplo de Uso:</b> Um professor pode usar este formulário para
          criar uma nova atividade de "Entrega do Projeto Final", onde os alunos
          devem submeter seus trabalhos até uma data específica.
        </Text>

        <Divider my={4} />

        <Flex align="center" mb={4}>
          <Icon as={FaFileAlt} boxSize={6} color="blue.500" mr={4} />
          <Heading size="sm">
            Formulário de Submissão de Informações (Interação)
          </Heading>
        </Flex>
        <Text>
          Usado durante o fluxo para a submissão de informações necessárias em
          várias etapas, como entregas parciais de documentos, solicitações de
          defesa e submissões finais.
        </Text>
        <Text mt={2}>
          <b>Exemplo de Uso:</b> Um aluno pode usar este formulário para
          submeter a versão preliminar de seu TCC para revisão pelo orientador,
          ou para solicitar a data de defesa do projeto.
        </Text>

        <Divider my={4} />

        <Flex align="center" mb={4}>
          <Icon as={FaCheckCircle} boxSize={6} color="green.500" mr={4} />
          <Heading size="sm">Formulário de Avaliação (Avaliação)</Heading>
        </Flex>
        <Text>
          Destinado à avaliação do desempenho dos alunos em diferentes fases,
          como entregas parciais, entrega final e defesa. Permite aos
          avaliadores fornecer notas, comentários e sugestões.
        </Text>
        <Text mt={2}>
          <b>Exemplo de Uso:</b> Após a defesa do TCC, os membros da banca
          utilizam este formulário para avaliar a apresentação do aluno e dar
          notas em diferentes critérios, além de fornecer feedback detalhado.
        </Text>
      </Box>
    ),
  },
  {
    title: "Fluxos de Trabalho",
    description: "Tipos de blocos de automação",
    content: (
      <Box mt={4}>
        <Heading size="md" mb={4}>
          Fluxos de Trabalho
        </Heading>

        <Text fontSize="lg" mb={4}>
          Com base no mapeamento do processo, o fluxo de TCC pode ser modelado
          utilizando cinco componentes parametrizáveis. Esses componentes são
          fundamentais para garantir a flexibilidade e a adaptabilidade do
          sistema, permitindo que ele seja configurado conforme as necessidades
          específicas de diferentes cursos e instituições.
        </Text>

        <Divider my={4} />

        <Flex align="center" mb={4}>
          <Icon as={BiMailSend} boxSize={6} color="teal.500" mr={4} />
          <Heading size="sm">Envio de Email</Heading>
        </Flex>
        <Text>
          Gerencia o envio de emails automáticos para requisição de informações,
          avaliações e comunicações gerais. Pode ser configurado para enviar
          notificações em diferentes pontos do fluxo, como avisos de prazos,
          solicitações de documentos ou feedbacks de avaliações. Ele é ligado a
          um template de email específico e pode ser personalizado conforme a
          necessidade.
        </Text>
        <Text mt={2}>
          <b>Exemplo de Uso:</b> Um email automático pode ser enviado para os
          alunos lembrando-os do prazo final para submissão de seus TCCs, ou
          para os orientadores, solicitando a avaliação de uma entrega parcial.
        </Text>

        <Divider my={4} />

        <Flex align="center" mb={4}>
          <Icon as={GoWorkflow} boxSize={6} color="orange.500" mr={4} />
          <Heading size="sm">Mudança de Fluxo</Heading>
        </Flex>
        <Text>
          Permite a alternância entre diferentes fluxos de trabalho,
          possibilitando a reutilização de fluxos existentes. Essencial para
          garantir que o sistema possa ser adaptado a diversas situações e
          requisitos específicos.
        </Text>
        <Text mt={2}>
          <b>Exemplo de Uso:</b> Após a submissão de um TCC, o sistema pode
          decidir automaticamente se o documento deve passar para um fluxo de
          revisão ou ser encaminhado diretamente para a defesa, dependendo do
          feedback recebido.
        </Text>

        <Divider my={4} />

        <Flex align="center" mb={4}>
          <Icon as={GoTag} boxSize={6} color="purple.500" mr={4} />
          <Heading size="sm">Mudança de Status</Heading>
        </Flex>
        <Text>
          Utilizado para atualizar o status atual de uma atividade e indicar em
          qual etapa do fluxo ela está. Este componente é crucial para o
          monitoramento do progresso do TCC, permitindo que todos os envolvidos
          saibam exatamente em que estágio o trabalho se encontra.
        </Text>
        <Text mt={2}>
          <b>Exemplo de Uso:</b> Após a submissão final do TCC, o status pode
          ser atualizado para "Aguardando Avaliação", e depois para "Defesa
          Marcada", conforme o processo avança.
        </Text>
      </Box>
    ),
  },
  {
    title: "Blocos de Interação",
    description: "Blocos de interação com os usuários",
    content: (
      <Box mt={4}>
        <Heading size="md" mb={4}>
          Fluxos de Trabalho
        </Heading>

        <Text fontSize="lg" mb={4}>
          Esses blocos são responsáveis por gerenciar as interações entre os
          formulários e os usuários do sistema. Eles são responsáveis por
          controlar o fluxo de informações, requisitando informações e
          avaliações nos momentos corretos e para as pessoas certas.
        </Text>

        <Divider my={4} />

        <Flex align="center" mb={4}>
          <Icon as={FaWpforms} boxSize={6} color="blue.500" mr={4} />
          <Heading size="sm">Interação</Heading>
        </Flex>
        <Text>
          Utilizado para solicitar informações específicas de um destinatário.
          Este componente permite configurar requisições para entregas parciais,
          solicitações de defesa ou envio final de documentos. Ele é ligado a um
          formulário específico do tipo "Interação" e pode ser configurado para
          diferentes etapas do fluxo.
        </Text>
        <Text mt={2}>
          <b>Exemplo de Uso:</b> O sistema pode solicitar ao aluno que envie a
          versão final do TCC para avaliação, ou pode solicitar a um membro da
          banca que forneça feedback sobre uma apresentação.
        </Text>

        <Divider my={4} />

        <Flex align="center" mb={4}>
          <Icon
            as={LiaNotesMedicalSolid}
            boxSize={6}
            color="green.500"
            mr={4}
          />
          <Heading size="sm">Avaliação</Heading>
        </Flex>
        <Text>
          Utilizado para avaliar o desempenho do aluno em diferentes fases do
          TCC, como entregas parciais, entrega final e defesa. Pode ser
          configurado para diferentes critérios de avaliação, assegurando que os
          feedbacks sejam padronizados e que os avaliadores tenham uma estrutura
          clara para suas análises. Este componente é ligado a um formulário
          específico do tipo "Avaliação". É possivel defirnir os avaliadores
          previamente ou permitir que o sejam definidos quando a atividade for
          para esta etapa.
        </Text>
        <Text mt={2}>
          <b>Exemplo de Uso:</b> Durante a defesa do TCC, os avaliadores podem
          utilizar este componente para atribuir notas e fornecer feedback
          detalhado sobre a apresentação do aluno.
        </Text>
      </Box>
    ),
  },
];

const SecondPage: React.FC = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();

  const handleFinish = useCallback(() => {
    if (!auth) return;

    updateTutorials(auth.id, "first-page");
    navigate("/portal");
  }, [navigate]);

  return <Steps steps={steps} onFinish={handleFinish} />;
};

export default SecondPage;

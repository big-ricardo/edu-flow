# Utiliza a imagem base do Ubuntu mais recente
FROM ubuntu:latest

# Define variáveis de ambiente para evitar mensagens de erro de front-end durante a instalação
ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /terraform  

# Atualiza a lista de pacotes e instala as dependências necessárias
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    lsb-release \
    software-properties-common \
    && rm -rf /var/lib/apt/lists/*

# Instala o Azure CLI
RUN curl -sL https://aka.ms/InstallAzureCLIDeb | bash

# Instala o Terraform
RUN curl -fsSL https://apt.releases.hashicorp.com/gpg | apt-key add - \
    && apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main" \
    && apt-get update && apt-get install -y terraform

# Verifica a instalação do Azure CLI e do Terraform
RUN az --version
RUN terraform version


COPY . .  

# Define o ponto de entrada; ajuste conforme necessário
CMD [ "tail", "-f", "/dev/null" ]

# LogiTrack - Sistema de Gestão de Frota

LogiTrack é um frontend para gestão de frotas, desenvolvido com **React**, **TypeScript** e **Tailwind CSS**. O sistema consome uma API Spring Boot para fornecer visibilidade em tempo real sobre quilometragem, rankings de veículos, volumes por categoria, cronogramas de manutenção e projeções financeiras.

##  Funcionalidades Implementadas

- **Dashboard de Analytics**: Visão consolidada com métricas críticas:
  - **KM Total**: Soma de toda a quilometragem percorrida pela frota.
  - **Volume por Categoria**: Distribuição de viagens entre veículos Leves e Pesados.
  - **Ranking de Veículos**: Listagem dos veículos com maior rodagem (Top KM).
  - **Cronograma de Manutenção**: Próximas 5 manutenções preventivas/corretivas agendadas.
  - **Projeção Financeira**: Estimativa de custos para o mês atual baseada em dados históricos.
- **Gestão de Viagens (CRUD)**:
  - Listagem completa de viagens com suporte a **paginação via backend**.
  - Fluxo de criação e **edição** de viagens com preenchimento dinâmico.
  - **Exclusão de registros** com confirmação de segurança.
  - **Validação de Regras de Negócio**: Impedimento de datas no passado e garantia de ordem cronológica (saída < chegada).

##  Endpoints Consumidos

A aplicação consome os seguintes recursos da API REST:

- `GET /dashboard/total-km`: Recupera a quilometragem total e resumo de viagens.
- `GET /dashboard/volume-por-tipo`: Agrupamento de volume por categoria de veículo.
- `GET /dashboard/ranking-veiculos`: Ranking ordenado de veículos por KM.
- `GET /dashboard/proximas-manutencoes`: Lista de manutenções futuras.
- `GET /dashboard/projecao-custo`: Dados para o gráfico/card financeiro.
- `GET /viagens`: Listagem paginada de todas as operações.
- `POST /viagens`: Registro de novos trajetos no sistema.
- `PUT /viagens/{id}`: Atualização de dados de uma viagem existente.
- `DELETE /viagens/{id}`: Remoção definitiva de um registro de viagem.
- `GET /veiculos`: Listagem de veículos cadastrados para seleção em novos trajetos.

##  Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e rodar o frontend em sua máquina:

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **npm** (ou Yarn/pnpm)

### Passo a Passo

1. **Clonar o Repositório**
   ```bash
   git clone https://github.com/geovannaadomingos/logitrack-frontend.git
   cd logitrack-frontend
   ```

2. **Instalar Dependências**
   ```bash
   npm install
   ```

3. **Configuração da API**
   O projeto está configurado para se conectar à API local em `http://localhost:8080/api/v1`. 

   > [!IMPORTANT]
   > Para o pleno funcionamento do dashboard e das listagens, é necessário que o **LogiTrack Backend** esteja em execução. 
   > Acesse as instruções de configuração do servidor aqui: [LogiTrack Backend Repo](https://github.com/geovannaadomingos/logitrack-backend)

4. **Executar em Modo de Desenvolvimento**
   ```bash
   npm run dev
   ```
   O sistema estará disponível em [http://localhost:5173](http://localhost:5173).

5. **Gerar Build de Produção**
   ```bash
   npm run build
   ```

---

##  Decisões Técnicas e Arquitetura

### Ferramentas Escolhidas
- **Vite**: Escolhido como build tool pela sua velocidade extrema de HMR (Hot Module Replacement) e configuração simplificada para TypeScript.
- **Tailwind CSS (v3)**: Utilizado para garantir um desenvolvimento de UI rápido, consistente e altamente customizável, mantendo o bundle final leve.
- **Axios**: Preferido em relação ao `fetch` nativo por facilitar a configuração de instâncias globais (Base URL), interceptores e tratamento simplificado de erros JSON.
- **Lucide React**: Biblioteca de ícones leve e moderna para uma interface visual profissional.

### Arquitetura do Projeto
O projeto segue uma estrutura organizada por responsabilidades:
- `src/components`: Componentes de UI reutilizáveis (Navbar, Sidebar, Modais).
- `src/pages`: Componentes de nível de página (Dashboard, Viagens).
- `src/services`: Camada de comunicação com a API, centralizando todos os endpoints em um único local.
- `src/types`: Definições globais de interfaces TypeScript, garantindo segurança de tipos em toda a aplicação.

### Decisões de Design
- **Single Page Application (SPA)**: Utilização de `react-router-dom` para navegação instantânea sem recarregamento de página.
- **Fallbacks Visuais**: Implementação de estados de "Sem Dados", "Carregando" e tratamento de erros para garantir que a interface nunca pareça quebrada, mesmo com baixa conectividade ou ausência de registros na API.

##  Tratamento de Erros e Estados

- **Loading States**: Feedback visual (spinners/esqueletos) durante o carregamento de dados da API.
- **Empty States**: Mensagens amigáveis e orientações quando não há dados retornados para rankings ou manutenções.
- **Fallback de Dados Inválidos**: Implementação de tratamento rigoroso para campos nulos ou corrompidos, exibindo "-" ou valores padrão para evitar quebras na UI.
- **Formatação de Dados**: Parsing robusto de datas (PT-BR) e moedas (BRL) para garantir uma experiência localizada e precisa.

##  Desafios Técnicos Resolvidos

- **Padronização de Datas (ISO vs BR)**: Implementação de uma camada utilitária de parsing para suportar formatos tradicionais brasileiros (dd/MM/yyyy) vindos de inputs/API e convertê-los para objetos `Date` válidos em browsers.
- **Gerenciamento de Tipagem com API Real**: Sincronização de interfaces TypeScript com os DTOs do Spring Boot, garantindo que o contrato entre as camadas fosse respeitado.
- **Sincronização de Veículos**: Substituição progressiva de dados mockados por integração real com o banco de dados de veículos.
- **Integração com Paginação Backend**: Implementação de controle de estado para navegação entre páginas, consumindo metadados de paginação padrão do Spring Data.

##  Diferenciais

- **Arquitetura Escalável**: Separação clara entre serviços (API), utilitários, tipos e componentes.
- **Segurança com TypeScript**: Uso extensivo de tipos para reduzir erros em tempo de execução.
- **UI Premium**: Design moderno com Tailwind CSS focado em usabilidade e estética (Clean UI).
- **Performance**: Uso de Vite para builds otimizados e bundle reduzido.

---

##  Integração com o Backend

Este frontend foi desenvolvido para atuar em total sinergia com o [LogiTrack Backend](https://github.com/geovannaadomingos/logitrack-backend), um ecossistema robusto construído com:
- **Spring Boot 3.4**: Framework principal para a API REST.
- **PostgreSQL**: Banco de dados relacional para persistência de veículos e viagens.
- **Flyway**: Gerenciamento de migrações de banco de dados.

A comunicação é feita de forma assíncrona, respeitando os contratos de dados (DTOs) definidos pelo servidor, o que permite uma experiência de usuário fluida e baseada em dados reais.

---

##  Desenvolvido por
**Geovanna Domingos** - [GitHub](https://github.com/geovannaadomingos)

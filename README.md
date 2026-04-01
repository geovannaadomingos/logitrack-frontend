# LogiTrack - Sistema de Gestão de Frota

LogiTrack é um frontend moderno e performático para gestão de frotas, desenvolvido com **React**, **TypeScript** e **Tailwind CSS**. O sistema consome uma API Spring Boot para fornecer visibilidade em tempo real sobre quilometragem, rankings de veículos, volumes por categoria, cronogramas de manutenção e projeções financeiras.

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

---

##  Integração com o Backend

Este frontend foi desenvolvido para atuar em total sinergia com o [LogiTrack Backend](https://github.com/geovannaadomingos/logitrack-backend), um ecossistema robusto construído com:
- **Spring Boot 3.4**: Framework principal para a API REST.
- **PostgreSQL**: Banco de dados relacional para persistência de veículos e viagens.
- **Flyway**: Gerenciamento de migrações de banco de dados.

A comunicação é feita de forma assíncrona, respeitando os contratos de dados (DTOs) definidos pelo servidor, o que permite uma experiência de usuário fluida e baseada em dados reais.

---

## 👨‍💻 Desenvolvido por
**Geovanna Domingos** - [GitHub](https://github.com/geovannaadomingos)

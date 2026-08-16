# 📚 EmotionBooks

**EmotionBooks** é uma plataforma de recomendação literária inteligente baseada no estado emocional do usuário, inspirada nos princípios da Biblioterapia. O sistema sugere leituras que conversam com o momento atual do leitor, permitindo que ele valide ou transforme suas emoções por meio da literatura.

---

## 🚀 Funcionalidades

- ✅ **Motor de Recomendação:** Sugestões personalizadas cruzando humor atual e intenção de leitura.
- ✅ **Dashboard Pessoal:** Acompanhamento de histórico de emoções e estatísticas de leitura em tempo real.
- ✅ **Minha Biblioteca (CRUD):** Gerenciamento completo do acervo pessoal (Lidos, Quero Ler, Favoritos) com filtros de busca dinâmicos.
- ✅ **Sistema de Autenticação:** Login e cadastro seguros com senhas criptografadas e controle de sessão.
- ✅ **Acessibilidade Integrada:** Suporte a alto contraste e ajuste dinâmico de tamanho de fonte.
- ✅ **Interface Responsiva:** Design elegante e minimalista focado na experiência do usuário (UX).

---

## 🛠️ Arquitetura e Tecnologias

O projeto foi construído utilizando o padrão arquitetural **MVC (Model-View-Controller)**, garantindo separação de responsabilidades, código limpo e fácil manutenção.

| Camada | Tecnologia | Descrição |
|--------|------------|-----------|
| **Backend / Controller** | Node.js + Express | Gerenciamento de rotas, regras de negócio e sessões (`express-session`). |
| **Banco de Dados / Model** | MySQL + `mysql2` | Armazenamento relacional e execução de queries seguras preparadas (Prepared Statements). Segurança reforçada com `bcrypt`. |
| **Frontend / View** | HTML5 + CSS3 + JS | Interfaces dinâmicas criadas com Vanilla JavaScript consumindo a própria API do sistema. |

---

## ⚙️ Pré-requisitos e Configuração do Ambiente

Antes de começar, certifique-se de ter instalado em sua máquina o **Node.js** (v16+) e o **MySQL** (v8+).

### 1. Clone o repositório


2. Instale as dependências

npm install

3. Configure o Banco de Dados
Importe o arquivo de backup para o seu MySQL. Você pode usar o MySQL Workbench ou o terminal:

Bash
mysql -u root -p < database/biblioteca_emocional_bd_backup.sql


4. Variáveis de Ambiente (.env)
Crie um arquivo chamado .env na raiz do projeto e configure as credenciais do seu banco de dados local:

Snippet de código
# Configurações do Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=suasenha
DB_NAME=emotionbooks_bd

# Configurações do Servidor
SESSION_SECRET=uma_chave_secreta_super_segura
PORT=3000



5. Inicie a Aplicação
Bash
npm start
# ou
node server.js

Acesse http://localhost:3000 no seu navegador para ver o sistema rodando!

🌐 Mapeamento de Rotas (API)

GET	/ -Renderiza a página inicial - autenticação:	✅ Exigida

GET	/login | /cadastro	- Renderiza as telas de autenticação - autenticação:	❌ Livre
POST	/cadastrar | /login	Processa a entrada de usuários	- autenticação:❌ Livre
GET	/sair	Destrói a sessão atual (Logout)- autenticação:	✅ Exigida
GET	/perfil | /biblioteca	Renderiza os dashboards do usuário	- autenticação:✅ Exigida
GET	/minha-biblioteca	Retorna o JSON com o acervo e estatísticas	- autenticação:✅ Exigida
POST	/recomendar	Retorna JSON com os livros filtrados pela emoção	- autenticação:✅ Exigida
POST	/marcar-lido | /quero-ler	Adiciona ou atualiza o status de um livro- autenticação:	✅ Exigida
POST	/favoritar | /remover-livro	Alterna favorito ou deleta o livro da biblioteca	- autenticação:✅ Exigida


## 📁 Estrutura do Projeto

O projeto segue a arquitetura **MVC (Model-View-Controller)**, organizada da seguinte forma:

```text
tcc/
├── .env                    # Variáveis de ambiente e senhas (NÃO SUBIR PRO GIT)
├── .gitignore              # Arquivos ignorados pelo repositório
├── README.md               # Documentação do projeto
├── package.json            # Dependências do Node.js
├── server.js               # Ponto de entrada e configuração do servidor
├── public/                 # Arquivos estáticos públicos
│   ├── css/                # Folhas de estilo (style.css, perfil.css, etc.)
│   └── img/                # Imagens estáticas (placeholder, etc.)
└── src/                    # Código-fonte da aplicação
    ├── controllers/        # Lógica de controle e regras de negócio
    ├── middlewares/        # Middlewares (ex: proteção de rotas por sessão)
    ├── models/             # Comunicação com o banco de dados
    │   └── db.js           # Conexão MySQL (usa process.env.DB_PASSWORD)
    ├── routes/             # Definição das rotas da API e navegação
    └── views/              # Telas em HTML (Dashboard, Recomendações, etc.)

🗄️ Modelagem do Banco de Dados
O banco de dados relacional (MySQL) foi estruturado para suportar o motor de recomendações e o gerenciamento do acervo pessoal de cada usuário. As principais entidades são:

-usuario: Armazena os dados de autenticação (nome, email, senha criptografada).

-livro: Catálogo literário contendo título, autor, gênero, sinopse e links para capa e leitura externa.

-tag_emocional: Dicionário de emoções mapeadas pelo sistema (ex: Felicidade, Tristeza, Ansiedade).

-livro_tag: Tabela de relacionamento (N:M) que liga cada livro às emoções que ele desperta.

-usuario_livro: Representa a Minha Biblioteca. Relaciona o usuário ao livro, salvando o status (Lido ou Quero ler) e se é um Favorito (1 ou 0).

-historico: Registra cada busca emocional feita pelo usuário, permitindo a geração do Dashboard de Comportamento.

🎓 Autoria e Contexto Acadêmico
Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC) para o curso de Tecnologia em Análise e Desenvolvimento de Sistemas (TADS) do Instituto Federal de Educação, Ciência e Tecnologia de São Paulo (IFSP) - Campus Campinas.

Desenvolvedoras: Maria Luiza Melo Coelho e Milena Souza Borges Silva

Orientador: Julio Pedroso

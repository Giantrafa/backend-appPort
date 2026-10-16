# backend-appPort

API REST de currículos para o app **Portfólio** (`prog-mobile-2026.2/portifolio`).
Feita com **Express 5 + Sequelize + PostgreSQL** (banco na nuvem: **NeonDB**).

## Como rodar

```bash
npm install
cp .env.example .env      # cole a connection string do Neon em DATABASE_URL
npm run seed              # cria as tabelas e cadastra os 2 currículos (APAGA os dados existentes)
npm run dev               # sobe a API em http://localhost:3000 (reinicia ao salvar)
```

| Script          | O que faz                                                    |
| --------------- | ------------------------------------------------------------ |
| `npm run dev`   | API com `node --watch`                                       |
| `npm start`     | API em modo normal                                           |
| `npm run seed`  | Recria as tabelas e insere os dados de `src/seed/dados.js`   |

## Deploy no Vercel

O Vercel detecta o Express sozinho (usa o `app` exportado em `src/app.js` / `src/index.js`), sem `vercel.json`.

1. Suba o código no GitHub e, no Vercel, **Add New → Project → Import** o repositório `backend-appPort`.
2. Em **Environment Variables**, adicione `DATABASE_URL` com a connection string do Neon (a mesma do `.env`).
3. **Deploy**. A API fica em `https://<projeto>.vercel.app` (ex.: `/pessoas/1/curriculo`).

No Vercel o `sequelize.sync()` não roda — as tabelas são criadas pelo `npm run seed` executado localmente.

## Modelo de dados

```
pessoas ─┬─< contatos
         ├─< formacoes                (experiências acadêmicas)
         ├─< experiencias ─┐          (experiências profissionais)
         ├─< projetos >────┘ (experiencia_id opcional, SET NULL)
         ├─< certificacoes
         ├─< idiomas
         └─< pessoa_habilidades >─ habilidades ─< projeto_habilidades >─ projetos
                (nivel)
```

- **1:N** – uma pessoa tem vários contatos, formações, experiências, projetos, certificações e idiomas
  (apagar a pessoa apaga tudo dela em cascata).
- **N:1 opcional** – um projeto pode pertencer a uma experiência profissional.
- **N:N** – pessoas ↔ habilidades (com `nivel`) e projetos ↔ habilidades (tecnologias usadas).

### Valores aceitos (ENUM)

| Campo                     | Valores                                                                                         |
| ------------------------- | ----------------------------------------------------------------------------------------------- |
| `contatos.tipo`           | email, telefone, whatsapp, github, linkedin, site, outro                                        |
| `formacoes.nivel`         | ensino_medio, tecnico, tecnologo, graduacao, pos_graduacao, mestrado, doutorado, curso_livre    |
| `experiencias.tipo`       | clt, pj, estagio, freelancer, voluntario, outro                                                 |
| `habilidades.categoria`   | linguagem, framework, banco_de_dados, ferramenta, soft_skill, outro                             |
| `pessoa_habilidades.nivel`| basico, intermediario, avancado                                                                 |
| `idiomas.nivel`           | basico, intermediario, avancado, fluente, nativo                                                |

Datas no formato `AAAA-MM-DD`. `data_fim: null` = em andamento / emprego atual.

## Rotas

Todos os recursos têm CRUD completo:

| Método          | Rota              | Descrição                    |
| --------------- | ----------------- | ---------------------------- |
| `GET`           | `/recurso`        | Lista (aceita filtros)       |
| `GET`           | `/recurso/:id`    | Busca por id                 |
| `POST`          | `/recurso`        | Cria                         |
| `PUT` / `PATCH` | `/recurso/:id`    | Atualiza (parcial)           |
| `DELETE`        | `/recurso/:id`    | Remove                       |

| Recurso          | Filtros (query string)          |
| ---------------- | ------------------------------- |
| `/pessoas`       | –                               |
| `/contatos`      | `pessoa_id`, `tipo`             |
| `/formacoes`     | `pessoa_id`, `nivel`            |
| `/experiencias`  | `pessoa_id`, `tipo`             |
| `/projetos`      | `pessoa_id`, `experiencia_id`   |
| `/habilidades`   | `categoria`                     |
| `/certificacoes` | `pessoa_id`                     |
| `/idiomas`       | `pessoa_id`                     |

### Rotas de relacionamento

| Método   | Rota                                        | Corpo                                  |
| -------- | ------------------------------------------- | -------------------------------------- |
| `GET`    | `/pessoas/:id/curriculo`                    | – (currículo completo com tudo aninhado) |
| `GET`    | `/pessoas/:id/habilidades`                  | –                                      |
| `POST`   | `/pessoas/:id/habilidades`                  | `{ "habilidade_id": 1, "nivel": "avancado" }` (cria ou atualiza o nível) |
| `DELETE` | `/pessoas/:id/habilidades/:habilidadeId`    | –                                      |
| `POST`   | `/projetos/:id/tecnologias`                 | `{ "habilidade_id": 1 }`               |
| `DELETE` | `/projetos/:id/tecnologias/:habilidadeId`   | –                                      |

### Exemplos

```bash
# currículo completo da pessoa 1
curl http://localhost:3000/pessoas/1/curriculo

# nova experiência profissional
curl -X POST http://localhost:3000/experiencias \
  -H "Content-Type: application/json" \
  -d '{"pessoa_id":1,"empresa":"Empresa X","cargo":"Estagiário","tipo":"estagio","data_inicio":"2026-01-10"}'
```

### Respostas de erro

| Status | Quando                                                        |
| ------ | ------------------------------------------------------------- |
| 400    | Validação, ENUM inválido, JSON malformado, id não numérico, FK inexistente |
| 404    | Registro ou rota não encontrada                               |
| 409    | E-mail de pessoa ou nome de habilidade duplicado              |

Formato: `{ "mensagem": "...", "erros": ["..."] }`.

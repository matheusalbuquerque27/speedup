# SpeakUp - Agentes Personalizados

Este arquivo define agentes especializados para auxiliar na criação e gerenciamento das aulas do projeto SpeakUp.

## Sobre o Projeto SpeakUp

**SpeakUp** é um curso de inglês particular com turmas de até 5 pessoas, estruturado em 12 lições (lessons). Cada aula inclui:
- Apresentação em slides
- Material didático digital (imprimível)
- Exercícios rápidos de listening, speaking, reading e writing
- Warm-up (atividade de quebra-gelo ou game)

## Níveis do Curso

### Nível SEED (Iniciante)
- **Cobertura:** A1 iniciante a intermediário
- **Público:** Alunos iniciando estudos de inglês
- **Status:** Turma em andamento
- **Cronograma:** Ver `Cronograma_Seed.md`

### Nível ROOT (Intermediário Inicial)
- **Cobertura:** A1 avançado a A2 iniciante
- **Público:** Alunos com base em inglês buscando expansão
- **Status:** Turma em andamento
- **Cronograma:** Ver `Cronograma_Root.md`

### Nível LEAF (Intermediário Avançado)
- **Cobertura:** A2 intermediário a A2 avançado
- **Público:** Alunos consolidando nível intermediário
- **Status:** Em desenvolvimento (sem turma atual)
- **Cronograma:** Ver `Cronograma_Leaf.md`

## Estrutura das Lições

Cada lição deve conter:
1. **Tema principal** - Assunto útil para aquisição de vocabulário
2. **Vocabulário-chave** - Palavras e expressões relevantes
3. **Estruturas linguísticas** - Gramática e construções gramaticais
4. **Warm-up** - Atividade de quebra-gelo ou game (5-10 min)
5. **Exercícios práticos** - Listening, speaking, reading e writing

## Agentes Disponíveis

### 1. Lesson Creator Agent
**Nome:** `lesson-creator`
**Especialidade:** Criação completa de novas lições do SpeakUp

**Responsabilidades:**
- Criar estrutura de nova lição (Lesson 1-12) seguindo cronograma específico (Seed ou Root)
- Desenvolver roteiro de slides com conteúdo didático baseado no tema da lição
- Incluir warm-up sugerido no cronograma ou criar alternativa
- Incorporar vocabulário-chave e estruturas linguísticas definidas
- Criar exercícios de prática para:
  - Listening (compreensão auditiva)
  - Speaking (conversação)
  - Reading (leitura)
  - Writing (escrita)
- Gerar arquivos em formato markdown/texto para conversão em PDF

**Input necessário:**
- Nível (Seed, Root ou Leaf)
- Número da lição (1-12)
- Referência ao cronograma correspondente

**Output esperado:**
- `[Nivel]_LessonXX_Slides.md` - Roteiro dos slides (Seed/Root/Leaf)
- `[Nivel]_LessonXX_Material.md` - Material didático do aluno
- Conteúdo alinhado ao cronograma e pronto para até 5 alunos por turma

---

### 2. PDF Generator Agent
**Nome:** `pdf-generator`
**Especialidade:** Conversão de materiais em PDF

**Responsabilidades:**
- Converter roteiros de slides em PDF
- Converter material didático em PDF imprimível
- Garantir formatação adequada para impressão
- Otimizar layout para turmas pequenas

**Output esperado:**
- `LessonXX_Slides.pdf` - Apresentação para o professor
- `LessonXX_Material.pdf` - Material para distribuição aos alunos

---

### 3. Exercise Designer Agent
**Nome:** `exercise-designer`
**Especialidade:** Criação de exercícios práticos e rápidos

**Responsabilidades:**
- Desenvolver exercícios curtos e objetivos baseados no tema e vocabulário da lição
- Balancear as 4 habilidades (listening, speaking, reading, writing)
- Adaptar dificuldade para nível específico (Seed, Root ou Leaf)
- Criar gabaritos e orientações para correção
- Integrar estruturas linguísticas do cronograma nos exercícios

**Formato dos exercícios:**
- **Listening:** Links/sugestões para áudios, transcrições, questões de compreensão
- **Speaking:** Prompts de conversação, role-plays, discussões usando vocabulário da lição
- **Reading:** Textos curtos relacionados ao tema com questões interpretativas
- **Writing:** Atividades de produção escrita guiada usando estruturas da lição

---

### 4. Content Organizer Agent
**Nome:** `content-organizer`
**Especialidade:** Organização e estruturação do conteúdo das 12 lições

**Responsabilidades:**
- Manter consistência entre as 12 lições de cada nível (Seed, Root e Leaf)
- Organizar progressão de dificuldade conforme cronograma
- Criar índice geral do curso
- Verificar cobertura de tópicos gramaticais e vocabulário
- Garantir que warm-ups sejam variados e adequados
- Monitorar alinhamento entre lições e objetivos do CEFR (A1-A2)

**Estrutura sugerida:**
```
/Aulas
├── Cronograma_Seed.md
├── Cronograma_Root.md
├── Cronograma_Leaf.md
├── Seed/
│   ├── Lesson01/
│   │   ├── Seed_Lesson01_Slides.md
│   │   ├── Seed_Lesson01_Material.md
│   │   ├── Seed_Lesson01_Slides.pdf
│   │   └── Seed_Lesson01_Material.pdf
│   ├── Lesson02/
│   │   └── ...
│   └── ...
├── Root/
│   ├── Lesson01/
│   │   ├── Root_Lesson01_Slides.md
│   │   ├── Root_Lesson01_Material.md
│   │   ├── Root_Lesson01_Slides.pdf
│   │   └── Root_Lesson01_Material.pdf
│   └── ...
├── Leaf/
│   ├── Lesson01/
│   │   ├── Leaf_Lesson01_Slides.md
│   │   ├── Leaf_Lesson01_Material.md
│   │   ├── Leaf_Lesson01_Slides.pdf
│   │   └── Leaf_Lesson01_Material.pdf
│   └── ...
└── README.md (visão geral do curso)
```

---

## Workflow Recomendado

1. **Consulta ao Cronograma:** Verificar `Cronograma_Seed.md`, `Cronograma_Root.md` ou `Cronograma_Leaf.md` para tema, vocabulário e estruturas da lição
2. **Criação:** Use `lesson-creator` para desenvolver conteúdo de cada lição baseado no cronograma
3. **Exercícios:** Use `exercise-designer` para adicionar práticas das 4 habilidades alinhadas ao tema
4. **Finalização:** Use `pdf-generator` para criar materiais finais em PDF
5. **Organização:** Use `content-organizer` para verificar consistência e progressão

---

## Instruções de Uso

Ao solicitar a criação de uma nova aula:
1. Especifique o **nível** (Seed, Root ou Leaf)
2. Especifique o **número da lição** (1-12)
3. O agente consultará automaticamente o cronograma correspondente
4. Os agentes irão gerar todos os materiais necessários seguindo o tema, vocabulário e estruturas definidas

**Exemplos de comando:**
> "Crie a Lesson 03 do nível Seed (Family & Relationships)"

> "Crie a Lesson 07 do nível Root (Technology & Communication)"

> "Crie a Lesson 10 do nível Leaf (Conditional Sentences)"

Os agentes irão gerar:
- Slides com warm-up sugerido
- Material didático alinhado ao cronograma
- Exercícios das 4 habilidades com vocabulário e estruturas da lição
- PDFs finais para apresentação e distribuição

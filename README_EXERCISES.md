# 📚 Sistema de Exercícios de Fixação - SpeakUp

## 🎯 Sobre o Projeto

Sistema de exercícios de repetição espaçada baseado nos métodos **Kumon** e **Duolingo** para aquisição de vocabulário e expressões da **Seed - Lesson 01: Greetings & Introductions**.

## ✨ Funcionalidades

- ✅ **Menu semanal** (Segunda a Sexta-feira)
- ✅ **20 exercícios por dia** com repetição espaçada
- ✅ **5 tipos de exercícios**:
  - 📝 Preencher lacunas
  - ✅ Múltipla escolha
  - 🔄 Tradução
  - ✏️ Completar frases
  - 🔗 Relacionar conceitos
- ✅ **Barra de progresso** em tempo real
- ✅ **Envio automático** para API via POST
- ✅ **Backup local** no localStorage
- ✅ **Sistema de pontuação** automático
- ✅ **Interface responsiva** e moderna

## 🚀 Como Usar

### 1. Configurar a API

Abra o arquivo `app.js` e localize a linha:

```javascript
const API_URL = 'https://sua-api.com/exercises'; // ⚠️ ALTERE AQUI
```

Substitua pela URL da sua API que receberá os dados via POST.

### 2. Abrir o Sistema

Abra o arquivo `index.html` em um navegador web moderno (Chrome, Firefox, Edge, etc.).

### 3. Selecionar o Dia

Clique no botão do dia da semana que deseja praticar.

### 4. Realizar os Exercícios

- Preencha todas as 20 questões
- A barra de progresso mostrará seu avanço
- O botão de envio só será habilitado quando todos os exercícios estiverem respondidos

### 5. Enviar Respostas

Clique no botão **"📤 Enviar Respostas"** para:
- Salvar localmente (backup)
- Enviar para a API
- Ver sua pontuação

## 📊 Estrutura dos Dados Enviados

A API receberá um objeto JSON com a seguinte estrutura:

```json
{
  "day": "monday",
  "dayName": "Segunda-feira",
  "timestamp": "2026-02-08T14:30:00.000Z",
  "studentName": "João Silva",
  "lesson": "Seed - Lesson 01",
  "exercises": [
    {
      "exerciseNumber": 1,
      "type": "multiple-choice",
      "question": "Como se diz 'Olá' em inglês?",
      "correctAnswer": "Hello",
      "userAnswer": "Hello",
      "isCorrect": true
    }
    // ... 19 exercícios restantes
  ],
  "score": {
    "correct": 18,
    "total": 20,
    "percentage": 90
  }
}
```

## 🎓 Metodologia - Repetição Espaçada

O sistema utiliza o método de repetição espaçada para maximizar a retenção:

### Segunda-feira
- **Foco**: Vocabulário básico e primeiros conceitos
- Greetings, introduções, pronomes básicos

### Terça-feira
- **Foco**: Reforço dos conceitos de segunda + novos exemplos
- Revisão do verbo "to be" em novos contextos

### Quarta-feira
- **Foco**: Consolidação e variações
- Formas contraídas, múltiplos contextos

### Quinta-feira
- **Foco**: Integração dos conceitos
- Aplicação prática em diálogos

### Sexta-feira
- **Foco**: Revisão geral da semana
- Mix de todos os conceitos aprendidos

## 📱 Tipos de Exercícios

### 1. Fill Blank (Preencher)
```json
{
  "type": "fill-blank",
  "question": "Complete: 'I _____ fine'",
  "correctAnswer": "am|'m"
}
```

### 2. Multiple Choice (Múltipla Escolha)
```json
{
  "type": "multiple-choice",
  "question": "Como se diz 'Olá' em inglês?",
  "options": ["Hello", "Goodbye", "Thank you"],
  "correctAnswer": "Hello"
}
```

### 3. Translate (Tradução)
```json
{
  "type": "translate",
  "question": "Traduza: 'Qual é seu nome?'",
  "correctAnswer": "what's your name|what is your name"
}
```

### 4. Complete (Completar)
```json
{
  "type": "complete",
  "question": "Complete: 'How _____ you?'",
  "correctAnswer": "are"
}
```

## 💾 Backup Local

Todas as respostas são automaticamente salvas no localStorage do navegador com a chave:

```
speakup_[dia]_[timestamp]
```

Você pode recuperar esses dados pelo console do navegador:

```javascript
// Ver todos os dados salvos
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key.startsWith('speakup_')) {
    console.log(key, JSON.parse(localStorage.getItem(key)));
  }
}
```

## 🎨 Personalização

### Alterar Cores
Edite as variáveis CSS no `index.html`:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Adicionar Mais Exercícios
Edite o arquivo `exercises.json` seguindo o padrão existente.

### Modificar Quantidade de Exercícios
Altere o número de objetos em cada dia no `exercises.json`.

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura
- **CSS3**: Estilização responsiva com gradientes e animações
- **JavaScript (Vanilla)**: Lógica de negócio
- **Fetch API**: Comunicação com servidor
- **LocalStorage API**: Backup local

## 📋 Requisitos

- Navegador web moderno (Chrome 90+, Firefox 88+, Edge 90+)
- JavaScript habilitado
- Conexão com internet (para envio à API)

## 🐛 Solução de Problemas

### Exercícios não carregam
- Verifique se o arquivo `exercises.json` está na mesma pasta
- Abra o console (F12) e veja se há erros

### Erro ao enviar
- Verifique se configurou a URL da API corretamente
- Verifique sua conexão com a internet
- Os dados são salvos localmente mesmo se o envio falhar

### Botão de envio desabilitado
- Você precisa responder todos os 20 exercícios primeiro
- Verifique a barra de progresso

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com o professor responsável.

## 📝 Licença

Este sistema foi desenvolvido exclusivamente para uso nas turmas SpeakUp.

---

**Desenvolvido para SpeakUp - Seed Level** 🌟

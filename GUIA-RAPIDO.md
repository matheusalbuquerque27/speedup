# 🚀 Guia Rápido de Início

## ⚡ Começando em 3 Passos

### 1️⃣ Configure a API (Obrigatório)

Abra o arquivo `app.js` e localize a linha 9:

```javascript
const API_URL = 'https://sua-api.com/exercises'; // ⚠️ ALTERE AQUI
```

**Substitua** pela URL da sua API que receberá os dados.

💡 **Não tem API ainda?**
- Veja exemplos em `api_example.js`
- Use webhook gratuito: [webhook.site](https://webhook.site)
- Teste com: [requestbin.com](https://requestbin.com)

---

### 2️⃣ Abra o Sistema

**Clique duas vezes** no arquivo `index.html` ou arraste para o navegador.

✅ **Navegadores suportados:**
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari

---

### 3️⃣ Faça os Exercícios

1. Escolha o dia da semana
2. Responda os 20 exercícios
3. Clique em **"📤 Enviar Respostas"**

✨ **Pronto!** Os dados serão salvos localmente e enviados para sua API.

---

## 📊 Visualizar Resultados

Abra o arquivo `visualizar-dados.html` para ver:

- 📈 Estatísticas gerais
- 📋 Histórico completo
- ✅ Acertos e erros
- 💾 Exportar dados

---

## 🎯 Ordem Recomendada

### Para Alunos

```
Segunda → Terça → Quarta → Quinta → Sexta
```

Faça 1 dia por vez, respeitando a sequência!

### Para Professores

1. Configure a API ✅
2. Teste com seus dados ✅
3. Compartilhe com alunos ✅
4. Monitore resultados em `visualizar-dados.html` ✅

---

## 🔧 Configurações Opcionais

### Alterar Nome do Aluno

O sistema pedirá o nome ao enviar. Para definir um nome fixo:

Em `app.js`, linha 177, altere:
```javascript
studentName: prompt('Digite seu nome:') || 'Anônimo',
```

Para:
```javascript
studentName: 'João Silva', // Nome fixo
```

---

### Desabilitar Backup Local

Em `app.js`, linha 192, comente a linha:
```javascript
// saveToLocalStorage(submissionData);
```

---

### Alterar Cores

Em `index.html`, procure por:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

Substitua pelas suas cores favoritas!

🎨 **Geradores de gradientes:**
- [cssgradient.io](https://cssgradient.io)
- [uigradients.com](https://uigradients.com)

---

## ❓ Perguntas Frequentes

### ❓ Preciso instalar algo?

**Não!** Tudo funciona no navegador. Apenas configure a URL da API.

---

### ❓ Funciona offline?

**Parcialmente**. Você pode fazer os exercícios offline, mas o envio requer internet. Os dados ficam salvos localmente até conseguir enviar.

---

### ❓ Como adicionar mais exercícios?

Edite o arquivo `exercises.json` seguindo o padrão existente.

---

### ❓ Posso usar em celular/tablet?

**Sim!** O sistema é totalmente responsivo.

---

### ❓ Como resetar meu progresso?

Abra `visualizar-dados.html` e clique em **"🗑️ Limpar Tudo"**.

---

### ❓ Onde os dados são salvos?

- **Localmente**: No localStorage do navegador
- **Online**: Na API que você configurou

---

### ❓ É seguro?

Os dados ficam no seu navegador e são enviados apenas para a API que você configurar.

---

## 🆘 Problemas Comuns

### ⚠️ Botão de envio não habilita

**Solução**: Responda TODOS os 20 exercícios primeiro.

---

### ⚠️ Erro ao enviar

**Possíveis causas:**
1. URL da API incorreta → Verifique `app.js`
2. Sem internet → Verifique conexão
3. API fora do ar → Teste a API separadamente

**Os dados são salvos localmente mesmo se o envio falhar!**

---

### ⚠️ Exercícios não carregam

**Solução**: Verifique se `exercises.json` está na mesma pasta que `index.html`.

---

### ⚠️ Não vejo meus dados salvos

**Soluções:**
1. Abra `visualizar-dados.html`
2. Clique em "🔄 Atualizar Dados"
3. Verifique se completou e enviou algum exercício

---

## 📚 Próximos Passos

✅ **Você configurou a API**
✅ **Você fez os exercícios**
✅ **Você visualizou os resultados**

### O que fazer agora?

1. **Continue praticando** todos os dias
2. **Acompanhe seu progresso** no visualizador
3. **Exporte seus dados** para análise
4. **Compartilhe com colegas** de turma

---

## 📖 Documentação Completa

- **README_EXERCISES.md** - Documentação detalhada
- **api_example.js** - Exemplos de API
- **agents.md** - Sobre o projeto SpeakUp

---

## 💡 Dicas

### Para Máximo Aprendizado:

1. 🎯 **Foco**: Faça sem distrações
2. 📅 **Consistência**: Um dia por vez, em ordem
3. 🔄 **Revisão**: Reveja seus erros no visualizador
4. 📝 **Anote**: Escreva palavras que teve dificuldade
5. 🗣️ **Pratique**: Fale as respostas em voz alta

### Para Professores:

1. 👥 **Monitore**: Acompanhe progresso dos alunos
2. 📊 **Analise**: Use o visualizador para identificar dificuldades
3. 🎯 **Personalize**: Adapte exercícios conforme necessário
4. 💬 **Feedback**: Comente resultados com os alunos

---

## 🎉 Parabéns!

Você está pronto para começar! 

**Boa sorte nos estudos!** 🌟

---

**Alguma dúvida?**
Consulte a documentação completa em `README_EXERCISES.md` ou `api_example.js`.

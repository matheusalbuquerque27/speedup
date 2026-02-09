# 🔍 Guia de Debug - GitHub Pages

## 🎯 Problema: Exercícios não abrem ao clicar nos botões

### Passo 1: Verificar Console do Navegador

1. Abra seu site: `https://matheusalbuquerque27.github.io/speedup/`
2. Pressione `F12` para abrir Developer Tools
3. Vá na aba **Console**
4. Recarregue a página (`F5` ou `Ctrl+R`)

**O que você DEVE ver no console:**

```
✅ SpeakUp - Sistema de Exercícios carregado!
📁 Funções disponíveis: {loadDay: "function", backToMenu: "function", submitExercises: "function"}
📄 Elementos encontrados: {menuScreen: true, exerciseScreen: true}
🧪 Testando carregamento do JSON...
📡 Resposta do fetch: 200 true
✅ JSON carregado com sucesso!
📊 Dias disponíveis: ["monday", "tuesday", "wednesday", "thursday", "friday"]
📝 Exercícios na segunda: 20
🌍 Funções exportadas para window: {loadDay: "function", backToMenu: "function", submitExercises: "function"}
```

**Se ver algo diferente disso, anote e me informe!**

---

### Passo 2: Testar o Clique

1. Com o console aberto (F12)
2. Clique em um dos botões (ex: "Segunda-feira")
3. **Veja o que aparece no console**

**O que DEVERIA aparecer:**
```
Carregando exercícios...
Tentando carregar: ./exercises.json
Exercícios carregados de: ./exercises.json
```

**Se aparecer erro, anote o erro exato!**

---

### Passo 3: Testar Função Manualmente

Com o console aberto, digite e pressione Enter:

```javascript
loadDay('monday')
```

**O que deveria acontecer:**
- A tela de menu deveria sumir
- A tela de exercícios deveria aparecer

**Se não funcionar, qual erro aparece?**

---

### Passo 4: Verificar se o JSON está acessível

No console, digite:

```javascript
fetch('./exercises.json').then(r => r.json()).then(d => console.log(d))
```

**Deveria aparecer:**
```javascript
{monday: Array(20), tuesday: Array(20), ...}
```

**Se der erro 404, o problema é o caminho do arquivo!**

---

### Passo 5: Usar a Página de Teste

Abra: `https://matheusalbuquerque27.github.io/speedup/teste-simples.html`

Esta página vai fazer TODOS os testes automaticamente e mostrar exatamente onde está o problema.

1. **Teste 1**: Verifica se o JSON carrega
2. **Teste 2**: Verifica se a função loadDay funciona
3. **Console de Logs**: Mostra todas as mensagens

---

## 🐛 Erros Comuns e Soluções

### Erro: "loadDay is not defined"

**Causa:** app.js não foi carregado ou função não está no escopo global

**Solução:**
1. Verifique se o arquivo `app.js` existe no repositório
2. Verifique se está no mesmo diretório que `index.html`
3. Limpe o cache: `Ctrl + Shift + R`
4. Faça um novo commit e push

### Erro: "Failed to fetch"

**Causa:** Arquivo exercises.json não encontrado

**Solução:**
```bash
# Verificar se o arquivo está no git
git ls-files | grep exercises.json

# Se não estiver, adicione:
git add exercises.json
git commit -m "Add exercises.json"
git push
```

### Erro: "Unexpected token"

**Causa:** JSON com erro de sintaxe

**Solução:**
1. Abra `exercises.json` no VSCode
2. Verifique se há erros (linha vermelha)
3. Valide em: https://jsonlint.com/

### Nada acontece ao clicar

**Causa:** Função não está acessível ou erro silencioso

**Solução:**
1. Abra o Console (F12)
2. Digite: `window.loadDay('monday')`
3. Veja qual erro aparece
4. Me informe o erro exato

---

## 📋 Checklist Completo

Execute TODOS estes comandos no Console (F12):

```javascript
// 1. Verificar se app.js carregou
console.log('app.js carregado:', typeof loadDay !== 'undefined');

// 2. Verificar se JSON está acessível
fetch('./exercises.json').then(r => console.log('JSON:', r.status));

// 3. Verificar elementos HTML
console.log('Menu:', !!document.getElementById('menu-screen'));
console.log('Exercícios:', !!document.getElementById('exercise-screen'));

// 4. Testar função
loadDay('monday');
```

**Cole as respostas aqui e me envie!**

---

## 🚨 Debug Avançado

Se nada acima funcionou, faça isso:

### Opção 1: Testar Localmente

```bash
cd /home/matheus/Documentos/DevProjects/个人档案/SpeakUp/Exercices/speedup
python3 -m http.server 8000
```

Abra: `http://localhost:8000`

**Se funcionar localmente mas não no GitHub Pages, o problema é deploy.**

### Opção 2: Verificar Network

1. Abra Developer Tools (F12)
2. Vá na aba **Network**
3. Recarregue a página
4. Procure por `exercises.json` e `app.js`
5. Clique neles e veja o status (200, 404, etc)

### Opção 3: Ver o HTML Renderizado

No console, digite:

```javascript
console.log(document.body.innerHTML.substring(0, 500));
```

Verifique se os botões com `onclick="loadDay(...)"` estão lá.

---

## 📞 Me Informe

Para eu te ajudar melhor, me envie:

1. **Console completo** após recarregar a página
2. **Console completo** após clicar em um botão
3. **Resultado** do teste: `fetch('./exercises.json')`
4. **Screenshot** da aba Network (F12)
5. **URL** do seu site no GitHub Pages

---

## ⚡ Solução Rápida

Se tudo falhou, tente isso:

```bash
# 1. Limpar tudo
git rm -r --cached .
git add .

# 2. Fazer commit forçado
git commit -m "Force rebuild"
git push --force

# 3. Aguardar 2 minutos

# 4. Limpar cache do navegador
# Ctrl + Shift + Delete > Limpar tudo
```

---

**Última atualização:** 8 de fevereiro de 2026

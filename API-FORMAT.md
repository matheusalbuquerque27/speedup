# 📡 Formato de Dados da API

## Estrutura do POST

O sistema envia dados via **POST** para a API no seguinte formato:

```json
{
  "timestamp": "2026-02-08T14:30:00.000Z",
  "student": "João Silva",
  "worksheetId": "monday_lesson01_seed",
  "total": 20,
  "correct": 18,
  "payload": [
    {
      "exerciseNumber": 1,
      "type": "multiple-choice",
      "question": "Como se diz 'Olá' em inglês?",
      "correctAnswer": "Hello",
      "userAnswer": "Hello",
      "isCorrect": true
    },
    {
      "exerciseNumber": 2,
      "type": "fill-blank",
      "question": "Complete: 'Good _____' (Bom dia)",
      "correctAnswer": "morning",
      "userAnswer": "morning",
      "isCorrect": true
    }
    // ... mais 18 exercícios
  ]
}
```

---

## 📋 Descrição dos Campos

### Campos Principais

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `timestamp` | String (ISO 8601) | Data e hora do envio | `"2026-02-08T14:30:00.000Z"` |
| `student` | String | Nome do estudante | `"João Silva"` |
| `worksheetId` | String | Identificador da planilha | `"monday_lesson01_seed"` |
| `total` | Number | Total de exercícios | `20` |
| `correct` | Number | Número de acertos | `18` |
| `payload` | Array | Array com todos os exercícios | `[...]` |

### Campo `worksheetId`

Formato: `{dia}_{licao}_{nivel}`

**Exemplos:**
- `"monday_lesson01_seed"` - Segunda-feira, Lição 01, Nível Seed
- `"tuesday_lesson01_seed"` - Terça-feira, Lição 01, Nível Seed
- `"friday_lesson01_seed"` - Sexta-feira, Lição 01, Nível Seed

**Dias possíveis:**
- `monday`, `tuesday`, `wednesday`, `thursday`, `friday`

### Campo `payload` (Array de Exercícios)

Cada objeto no array contém:

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| `exerciseNumber` | Number | Número do exercício (1-20) | `1` |
| `type` | String | Tipo do exercício | `"multiple-choice"` |
| `question` | String | Texto da pergunta | `"Como se diz 'Olá'..."` |
| `correctAnswer` | String | Resposta correta | `"Hello"` |
| `userAnswer` | String | Resposta do usuário | `"Hello"` |
| `isCorrect` | Boolean | Se acertou ou não | `true` |

### Tipos de Exercício Possíveis

- `"fill-blank"` - Preencher lacuna
- `"multiple-choice"` - Múltipla escolha
- `"translate"` - Tradução
- `"complete"` - Completar frase
- `"match"` - Relacionar

---

## 🔧 Exemplo de Recebimento (Node.js + Express)

```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/exercises', (req, res) => {
  const { timestamp, student, worksheetId, total, correct, payload } = req.body;
  
  console.log('Dados recebidos:');
  console.log('Timestamp:', timestamp);
  console.log('Aluno:', student);
  console.log('Planilha:', worksheetId);
  console.log('Total:', total);
  console.log('Acertos:', correct);
  console.log('Exercícios:', payload.length);
  
  // Calcular porcentagem
  const percentage = Math.round((correct / total) * 100);
  console.log('Porcentagem:', percentage + '%');
  
  // Salvar no banco de dados
  // await db.collection('exercises').insertOne(req.body);
  
  res.status(200).json({
    success: true,
    message: 'Dados recebidos com sucesso!',
    student: student,
    score: {
      correct,
      total,
      percentage
    }
  });
});

app.listen(3000);
```

---

## 🐍 Exemplo de Recebimento (Python + Flask)

```python
from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__)

@app.route('/exercises', methods=['POST'])
def receive_exercises():
    data = request.get_json()
    
    timestamp = data['timestamp']
    student = data['student']
    worksheet_id = data['worksheetId']
    total = data['total']
    correct = data['correct']
    payload = data['payload']
    
    print(f'Dados recebidos:')
    print(f'Timestamp: {timestamp}')
    print(f'Aluno: {student}')
    print(f'Planilha: {worksheet_id}')
    print(f'Total: {total}')
    print(f'Acertos: {correct}')
    print(f'Exercícios: {len(payload)}')
    
    # Calcular porcentagem
    percentage = round((correct / total) * 100)
    print(f'Porcentagem: {percentage}%')
    
    # Salvar no banco de dados
    # db.exercises.insert_one(data)
    
    return jsonify({
        'success': True,
        'message': 'Dados recebidos com sucesso!',
        'student': student,
        'score': {
            'correct': correct,
            'total': total,
            'percentage': percentage
        }
    }), 200

if __name__ == '__main__':
    app.run(debug=True, port=3000)
```

---

## 📊 Exemplo de Salvamento em Banco de Dados

### MongoDB

```javascript
const MongoClient = require('mongodb').MongoClient;

app.post('/exercises', async (req, res) => {
  const data = req.body;
  
  try {
    const client = await MongoClient.connect('mongodb://localhost:27017');
    const db = client.db('speakup');
    
    await db.collection('submissions').insertOne({
      timestamp: new Date(data.timestamp),
      student: data.student,
      worksheetId: data.worksheetId,
      total: data.total,
      correct: data.correct,
      percentage: Math.round((data.correct / data.total) * 100),
      payload: data.payload,
      createdAt: new Date()
    });
    
    client.close();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Google Sheets (via API)

```javascript
const { google } = require('googleapis');

app.post('/exercises', async (req, res) => {
  const { timestamp, student, worksheetId, total, correct, payload } = req.body;
  
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  
  const sheets = google.sheets({ version: 'v4', auth });
  
  const percentage = Math.round((correct / total) * 100);
  
  await sheets.spreadsheets.values.append({
    spreadsheetId: 'YOUR_SPREADSHEET_ID',
    range: 'Submissions!A:G',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [[
        timestamp,
        student,
        worksheetId,
        total,
        correct,
        percentage + '%',
        JSON.stringify(payload)
      ]]
    }
  });
  
  res.json({ success: true });
});
```

---

## 📈 Consultas Úteis

### Buscar submissões por aluno

```javascript
// MongoDB
db.submissions.find({ student: "João Silva" });

// SQL
SELECT * FROM submissions WHERE student = 'João Silva';
```

### Calcular média de um aluno

```javascript
// MongoDB
db.submissions.aggregate([
  { $match: { student: "João Silva" } },
  { $group: {
    _id: "$student",
    avgScore: { $avg: { $multiply: [{ $divide: ["$correct", "$total"] }, 100] } }
  }}
]);
```

### Listar exercícios com mais erros

```javascript
// Processar o payload
const errors = [];
submissions.forEach(sub => {
  sub.payload.forEach(exercise => {
    if (!exercise.isCorrect) {
      errors.push({
        question: exercise.question,
        type: exercise.type,
        correctAnswer: exercise.correctAnswer
      });
    }
  });
});
```

---

## 🔒 Validação de Dados

### Schema de Validação (Joi - Node.js)

```javascript
const Joi = require('joi');

const submissionSchema = Joi.object({
  timestamp: Joi.string().isoDate().required(),
  student: Joi.string().min(2).max(100).required(),
  worksheetId: Joi.string().pattern(/^(monday|tuesday|wednesday|thursday|friday)_lesson\d{2}_seed$/).required(),
  total: Joi.number().integer().min(1).max(100).required(),
  correct: Joi.number().integer().min(0).max(Joi.ref('total')).required(),
  payload: Joi.array().items(
    Joi.object({
      exerciseNumber: Joi.number().integer().min(1).required(),
      type: Joi.string().valid('fill-blank', 'multiple-choice', 'translate', 'complete', 'match').required(),
      question: Joi.string().required(),
      correctAnswer: Joi.string().required(),
      userAnswer: Joi.string().required(),
      isCorrect: Joi.boolean().required()
    })
  ).min(1).required()
});

// Uso
app.post('/exercises', (req, res) => {
  const { error, value } = submissionSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  // Processar dados validados
  // ...
});
```

---

## 🧪 Testando a API

### cURL

```bash
curl -X POST https://sua-api.com/exercises \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2026-02-08T14:30:00.000Z",
    "student": "Teste",
    "worksheetId": "monday_lesson01_seed",
    "total": 2,
    "correct": 1,
    "payload": [
      {
        "exerciseNumber": 1,
        "type": "fill-blank",
        "question": "Test question",
        "correctAnswer": "test",
        "userAnswer": "test",
        "isCorrect": true
      },
      {
        "exerciseNumber": 2,
        "type": "multiple-choice",
        "question": "Test question 2",
        "correctAnswer": "A",
        "userAnswer": "B",
        "isCorrect": false
      }
    ]
  }'
```

### Postman

1. Método: `POST`
2. URL: `https://sua-api.com/exercises`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON): Cole o JSON de exemplo acima

---

## 💡 Dicas

1. **Sempre valide** os dados recebidos
2. **Sanitize** os inputs para prevenir XSS/SQL Injection
3. **Use autenticação** em produção (JWT, API Key)
4. **Implemente rate limiting** para prevenir abuso
5. **Faça log** de todas as submissões
6. **Tenha backup** dos dados
7. **Configure CORS** corretamente

---

**Documentação atualizada em:** 8 de fevereiro de 2026

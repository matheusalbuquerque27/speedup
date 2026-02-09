// ========================================
// EXEMPLO DE API PARA RECEBER OS EXERCÍCIOS
// ========================================

// Este é um exemplo de como sua API deve ser configurada
// para receber os dados dos exercícios do SpeakUp

// ========================================
// EXEMPLO 1: Node.js + Express
// ========================================

const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors()); // Permite requisições do frontend
app.use(express.json()); // Parse JSON no body

// Rota para receber os exercícios
app.post('/exercises', (req, res) => {
  const data = req.body;
  
  console.log('Dados recebidos:', data);
  
  // Aqui você pode:
  // 1. Salvar em banco de dados
  // 2. Processar os dados
  // 3. Enviar email
  // 4. Gerar relatórios
  
  // Exemplo de salvamento em banco (pseudocódigo)
  // await database.exercises.insert(data);
  
  // Resposta de sucesso
  res.status(200).json({
    success: true,
    message: 'Exercícios recebidos com sucesso!',
    studentName: data.studentName,
    score: data.score
  });
});

// Rota para consultar exercícios de um aluno
app.get('/exercises/:studentName', (req, res) => {
  const { studentName } = req.params;
  
  // Buscar no banco de dados
  // const exercises = await database.exercises.find({ studentName });
  
  res.json({
    studentName,
    exercises: [] // Retornar dados do banco
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});

// ========================================
// EXEMPLO 2: Python + Flask
// ========================================

/*
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Permite requisições do frontend

@app.route('/exercises', methods=['POST'])
def receive_exercises():
    data = request.get_json()
    
    print('Dados recebidos:', data)
    
    # Aqui você pode:
    # 1. Salvar em banco de dados
    # 2. Processar os dados
    # 3. Enviar email
    # 4. Gerar relatórios
    
    # Exemplo de salvamento em banco (pseudocódigo)
    # db.exercises.insert_one(data)
    
    return jsonify({
        'success': True,
        'message': 'Exercícios recebidos com sucesso!',
        'studentName': data['studentName'],
        'score': data['score']
    }), 200

@app.route('/exercises/<student_name>', methods=['GET'])
def get_exercises(student_name):
    # Buscar no banco de dados
    # exercises = db.exercises.find({'studentName': student_name})
    
    return jsonify({
        'studentName': student_name,
        'exercises': []  # Retornar dados do banco
    })

if __name__ == '__main__':
    app.run(debug=True, port=3000)
*/

// ========================================
// EXEMPLO 3: Webhook (Zapier, Make, n8n)
// ========================================

/*
Se você usar um serviço de webhook como Zapier ou Make.com:

1. Crie um webhook no serviço
2. Configure para receber POST
3. Use a URL gerada no app.js
4. Configure as ações desejadas:
   - Salvar no Google Sheets
   - Enviar email
   - Notificar no Slack
   - Salvar no Notion
   etc.
*/

// ========================================
// EXEMPLO 4: Firebase Functions
// ========================================

/*
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.receiveExercises = functions.https.onRequest(async (req, res) => {
  // Permitir CORS
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).send('');
  }

  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const data = req.body;
  
  try {
    // Salvar no Firestore
    await admin.firestore().collection('exercises').add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).json({
      success: true,
      message: 'Exercícios salvos com sucesso!'
    });
  } catch (error) {
    console.error('Erro:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao salvar exercícios'
    });
  }
});
*/

// ========================================
// ESTRUTURA DOS DADOS RECEBIDOS
// ========================================

const exemploDeRequisicao = {
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
  ],
  "score": {
    "correct": 18,
    "total": 20,
    "percentage": 90
  }
};

// ========================================
// EXEMPLO DE BANCO DE DADOS
// ========================================

// MongoDB Schema
const mongooseSchema = {
  day: String,
  dayName: String,
  timestamp: Date,
  studentName: String,
  lesson: String,
  exercises: [{
    exerciseNumber: Number,
    type: String,
    question: String,
    correctAnswer: String,
    userAnswer: String,
    isCorrect: Boolean
  }],
  score: {
    correct: Number,
    total: Number,
    percentage: Number
  }
};

// ========================================
// DICAS DE SEGURANÇA
// ========================================

/*
1. VALIDAÇÃO DOS DADOS:
   - Sempre valide os dados recebidos
   - Verifique se todos os campos obrigatórios estão presentes
   - Sanitize inputs para prevenir XSS

2. AUTENTICAÇÃO:
   - Adicione autenticação JWT ou API Key
   - Limite requisições por IP (rate limiting)

3. CORS:
   - Configure CORS apenas para seu domínio específico
   - Não use '*' em produção

4. LOGS:
   - Registre todas as requisições
   - Monitore erros

5. BACKUP:
   - Faça backup regular dos dados
   - Implemente versionamento
*/

// ========================================
// EXEMPLO DE RESPOSTA ESPERADA
// ========================================

const respostaAPI = {
  "success": true,
  "message": "Exercícios recebidos com sucesso!",
  "studentName": "João Silva",
  "score": {
    "correct": 18,
    "total": 20,
    "percentage": 90
  },
  "savedAt": "2026-02-08T14:30:00.000Z"
};

// ========================================
// TESTANDO A API COM CURL
// ========================================

/*
curl -X POST https://sua-api.com/exercises \
  -H "Content-Type: application/json" \
  -d '{
    "day": "monday",
    "dayName": "Segunda-feira",
    "timestamp": "2026-02-08T14:30:00.000Z",
    "studentName": "Teste",
    "lesson": "Seed - Lesson 01",
    "exercises": [],
    "score": {
      "correct": 0,
      "total": 20,
      "percentage": 0
    }
  }'
*/

// ========================================
// RECURSOS ÚTEIS
// ========================================

/*
Serviços de Webhook gratuitos para testes:
- webhook.site - Para testar requisições
- requestbin.com - Inspecionar requisições
- beeceptor.com - Mock API

Serviços de Banco de Dados gratuitos:
- MongoDB Atlas (até 512MB grátis)
- Supabase (PostgreSQL)
- Firebase Firestore

Hospedagem de API gratuita:
- Vercel (Node.js)
- Heroku (tier gratuito)
- Railway
- Render
*/

module.exports = app;

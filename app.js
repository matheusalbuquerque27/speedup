// SpeakUp - Sistema de Exercícios de Fixação
// Baseado no método de repetição espaçada (Kumon/Duolingo)

let currentDay = '';
let currentExercises = [];
let userAnswers = {};

// URL da API - VOCÊ DEVE SUBSTITUIR PELA SUA API
const API_URL = 'https://script.google.com/macros/s/AKfycbzR-sxik9fePT8kIhpjRkS70cQafYjVaXyH73mdUkfLlY7Hcbi5A4QQpWonUU7WdWGG/exec'; // ⚠️ ALTERE AQUI

// Mapeamento de nomes dos dias
const dayNames = {
    'monday': 'Segunda-feira',
    'tuesday': 'Terça-feira',
    'wednesday': 'Quarta-feira',
    'thursday': 'Quinta-feira',
    'friday': 'Sexta-feira'
};

// Base de exercícios (embutida para evitar problemas com file://)
const EXERCISES_DB = {
  "monday": [
    {"id": 1, "type": "multiple-choice", "question": "Como se diz 'Olá' em inglês?", "options": ["Hello", "Goodbye", "Thank you", "Please"], "correctAnswer": "Hello"},
    {"id": 2, "type": "fill-blank", "question": "Complete: 'Good _____' (Bom dia)", "correctAnswer": "morning"},
    {"id": 3, "type": "translate", "question": "Traduza para inglês: 'Qual é seu nome?'", "correctAnswer": "what's your name|what is your name"},
    {"id": 4, "type": "fill-blank", "question": "Complete: 'I _____ fine' (Estou bem)", "correctAnswer": "am|'m"},
    {"id": 5, "type": "multiple-choice", "question": "Qual é a tradução de 'Nice to meet you'?", "options": ["Prazer em conhecê-lo", "Como vai?", "Até logo", "Obrigado"], "correctAnswer": "Prazer em conhecê-lo"},
    {"id": 6, "type": "complete", "question": "Complete com o pronome correto: '_____ am a student' (Eu sou estudante)", "correctAnswer": "i"},
    {"id": 7, "type": "fill-blank", "question": "Complete: 'She _____ happy' (Ela está feliz)", "correctAnswer": "is|'s"},
    {"id": 8, "type": "multiple-choice", "question": "Como se despede em inglês à noite?", "options": ["Good night", "Good evening", "Good afternoon", "Good morning"], "correctAnswer": "Good night"},
    {"id": 9, "type": "translate", "question": "Traduza: 'Meu nome é Maria'", "correctAnswer": "my name is maria"},
    {"id": 10, "type": "fill-blank", "question": "Complete: 'They _____ teachers' (Eles são professores)", "correctAnswer": "are|'re"},
    {"id": 11, "type": "multiple-choice", "question": "Qual pronome usamos para 'Nós'?", "options": ["We", "They", "You", "It"], "correctAnswer": "We"},
    {"id": 12, "type": "complete", "question": "Complete: 'How _____ you?' (Como você está?)", "correctAnswer": "are"},
    {"id": 13, "type": "translate", "question": "Traduza: 'Boa tarde'", "correctAnswer": "good afternoon"},
    {"id": 14, "type": "fill-blank", "question": "Complete: 'He _____ Carlos' (Ele é Carlos)", "correctAnswer": "is|'s"},
    {"id": 15, "type": "multiple-choice", "question": "O que significa 'Thank you'?", "options": ["Obrigado", "Por favor", "Desculpe", "Até logo"], "correctAnswer": "Obrigado"},
    {"id": 16, "type": "complete", "question": "Complete com pronome: '_____ is a book' (Isto é um livro)", "correctAnswer": "it"},
    {"id": 17, "type": "fill-blank", "question": "Complete: 'You _____ my friend' (Você é meu amigo)", "correctAnswer": "are|'re"},
    {"id": 18, "type": "translate", "question": "Traduza: 'E você?'", "correctAnswer": "and you"},
    {"id": 19, "type": "multiple-choice", "question": "Qual forma contraída de 'I am'?", "options": ["I'm", "I's", "Im", "I am"], "correctAnswer": "I'm"},
    {"id": 20, "type": "fill-blank", "question": "Complete: 'We _____ students' (Nós somos estudantes)", "correctAnswer": "are|'re"}
  ],
  "tuesday": [
    {"id": 1, "type": "fill-blank", "question": "Complete: '_____ to meet you' (Prazer em conhecê-lo)", "correctAnswer": "nice"},
    {"id": 2, "type": "multiple-choice", "question": "Escolha o pronome para 'Ela':", "options": ["She", "He", "It", "They"], "correctAnswer": "She"},
    {"id": 3, "type": "translate", "question": "Traduza: 'Tchau'", "correctAnswer": "goodbye|bye"},
    {"id": 4, "type": "complete", "question": "Complete a frase: 'Good _____, how are you?' (Bom dia)", "correctAnswer": "morning"},
    {"id": 5, "type": "fill-blank", "question": "Complete: 'She _____ a teacher' (Ela é professora)", "correctAnswer": "is|'s"},
    {"id": 6, "type": "multiple-choice", "question": "O que significa 'I'm fine'?", "options": ["Estou bem", "Estou mal", "Estou cansado", "Estou com fome"], "correctAnswer": "Estou bem"},
    {"id": 7, "type": "translate", "question": "Traduza: 'Ele é John'", "correctAnswer": "he is john|he's john"},
    {"id": 8, "type": "fill-blank", "question": "Complete: 'What's _____ name?' (Qual é seu nome?)", "correctAnswer": "your"},
    {"id": 9, "type": "multiple-choice", "question": "Como se diz 'Boa noite' ao chegar?", "options": ["Good evening", "Good night", "Good afternoon", "Good morning"], "correctAnswer": "Good evening"},
    {"id": 10, "type": "complete", "question": "Complete com pronome: '_____ are friends' (Nós somos amigos)", "correctAnswer": "we"},
    {"id": 11, "type": "fill-blank", "question": "Complete: 'I _____ from Brazil' (Eu sou do Brasil)", "correctAnswer": "am|'m"},
    {"id": 12, "type": "translate", "question": "Traduza: 'Obrigado'", "correctAnswer": "thank you|thanks"},
    {"id": 13, "type": "multiple-choice", "question": "Qual o pronome para 'Eles/Elas'?", "options": ["They", "We", "You", "It"], "correctAnswer": "They"},
    {"id": 14, "type": "fill-blank", "question": "Complete: 'It _____ a pen' (Isto é uma caneta)", "correctAnswer": "is|'s"},
    {"id": 15, "type": "complete", "question": "Complete: '_____ are you?' (Como você está?)", "correctAnswer": "how"},
    {"id": 16, "type": "translate", "question": "Traduza: 'Você é meu amigo'", "correctAnswer": "you are my friend|you're my friend"},
    {"id": 17, "type": "multiple-choice", "question": "O que significa 'Goodbye'?", "options": ["Tchau", "Olá", "Obrigado", "Desculpe"], "correctAnswer": "Tchau"},
    {"id": 18, "type": "fill-blank", "question": "Complete: 'They _____ happy' (Eles estão felizes)", "correctAnswer": "are|'re"},
    {"id": 19, "type": "complete", "question": "Complete com pronome: '_____ is a student' (Ele é um estudante)", "correctAnswer": "he"},
    {"id": 20, "type": "translate", "question": "Traduza: 'Prazer em conhecê-lo também'", "correctAnswer": "nice to meet you too"}
  ],
  "wednesday": [
    {"id": 1, "type": "multiple-choice", "question": "Qual é a forma contraída de 'You are'?", "options": ["You're", "Your", "You's", "Youre"], "correctAnswer": "You're"},
    {"id": 2, "type": "fill-blank", "question": "Complete: 'My name _____ Ana' (Meu nome é Ana)", "correctAnswer": "is"},
    {"id": 3, "type": "translate", "question": "Traduza: 'Bom dia'", "correctAnswer": "good morning"},
    {"id": 4, "type": "complete", "question": "Complete: 'Nice to _____ you' (Prazer em conhecê-lo)", "correctAnswer": "meet"},
    {"id": 5, "type": "multiple-choice", "question": "O pronome para 'Isto/Isso' (coisa) é:", "options": ["It", "He", "She", "They"], "correctAnswer": "It"},
    {"id": 6, "type": "fill-blank", "question": "Complete: 'We _____ learning English' (Estamos aprendendo inglês)", "correctAnswer": "are|'re"},
    {"id": 7, "type": "translate", "question": "Traduza: 'Como você está?'", "correctAnswer": "how are you"},
    {"id": 8, "type": "complete", "question": "Complete com pronome: '_____ is very nice' (Ela é muito legal)", "correctAnswer": "she"},
    {"id": 9, "type": "multiple-choice", "question": "Como se diz 'Olá' informalmente?", "options": ["Hi", "Hello", "Hey", "Todas as anteriores"], "correctAnswer": "Todas as anteriores"},
    {"id": 10, "type": "fill-blank", "question": "Complete: 'I'm _____, thank you' (Estou bem, obrigado)", "correctAnswer": "fine|good|great"},
    {"id": 11, "type": "translate", "question": "Traduza: 'Eles são professores'", "correctAnswer": "they are teachers|they're teachers"},
    {"id": 12, "type": "complete", "question": "Complete: 'Good _____' (Boa tarde)", "correctAnswer": "afternoon"},
    {"id": 13, "type": "multiple-choice", "question": "Qual a tradução de 'What's your name?'", "options": ["Qual é seu nome?", "Como você está?", "Onde você mora?", "Quantos anos você tem?"], "correctAnswer": "Qual é seu nome?"},
    {"id": 14, "type": "fill-blank", "question": "Complete: 'He _____ from São Paulo' (Ele é de São Paulo)", "correctAnswer": "is|'s"},
    {"id": 15, "type": "translate", "question": "Traduza: 'Nós somos felizes'", "correctAnswer": "we are happy|we're happy"},
    {"id": 16, "type": "complete", "question": "Complete: '_____ you!' (Obrigado!)", "correctAnswer": "thank"},
    {"id": 17, "type": "multiple-choice", "question": "Forma contraída de 'She is':", "options": ["She's", "Shes", "She is", "Sh's"], "correctAnswer": "She's"},
    {"id": 18, "type": "fill-blank", "question": "Complete: 'You _____ a good friend' (Você é um bom amigo)", "correctAnswer": "are|'re"},
    {"id": 19, "type": "translate", "question": "Traduza: 'Boa noite' (despedida)", "correctAnswer": "good night"},
    {"id": 20, "type": "complete", "question": "Complete com pronome: '_____ are students' (Eles são estudantes)", "correctAnswer": "they"}
  ],
  "thursday": [
    {"id": 1, "type": "translate", "question": "Traduza: 'Ela está feliz'", "correctAnswer": "she is happy|she's happy"},
    {"id": 2, "type": "multiple-choice", "question": "O que significa 'And you?'", "options": ["E você?", "Você está bem?", "Como vai?", "Obrigado"], "correctAnswer": "E você?"},
    {"id": 3, "type": "fill-blank", "question": "Complete: 'I _____ a student' (Eu sou estudante)", "correctAnswer": "am|'m"},
    {"id": 4, "type": "complete", "question": "Complete: 'What _____ your name?' (Qual é seu nome?)", "correctAnswer": "is|'s"},
    {"id": 5, "type": "translate", "question": "Traduza: 'Boa tarde'", "correctAnswer": "good afternoon"},
    {"id": 6, "type": "multiple-choice", "question": "Pronome para 'Você' em inglês:", "options": ["You", "Your", "Yours", "You're"], "correctAnswer": "You"},
    {"id": 7, "type": "fill-blank", "question": "Complete: 'They _____ from Brazil' (Eles são do Brasil)", "correctAnswer": "are|'re"},
    {"id": 8, "type": "complete", "question": "Complete: 'Good _____, class!' (Bom dia, turma!)", "correctAnswer": "morning"},
    {"id": 9, "type": "translate", "question": "Traduza: 'Ele é meu amigo'", "correctAnswer": "he is my friend|he's my friend"},
    {"id": 10, "type": "multiple-choice", "question": "Como se diz 'Prazer em conhecê-lo'?", "options": ["Nice to meet you", "How are you", "Thank you", "See you later"], "correctAnswer": "Nice to meet you"},
    {"id": 11, "type": "fill-blank", "question": "Complete: 'We _____ happy' (Nós estamos felizes)", "correctAnswer": "are|'re"},
    {"id": 12, "type": "translate", "question": "Traduza: 'Isto é um livro'", "correctAnswer": "it is a book|it's a book"},
    {"id": 13, "type": "complete", "question": "Complete com pronome: '_____ am from Rio' (Eu sou do Rio)", "correctAnswer": "i"},
    {"id": 14, "type": "multiple-choice", "question": "Forma contraída de 'They are':", "options": ["They're", "Their", "Theyre", "They is"], "correctAnswer": "They're"},
    {"id": 15, "type": "fill-blank", "question": "Complete: 'She _____ my teacher' (Ela é minha professora)", "correctAnswer": "is|'s"},
    {"id": 16, "type": "translate", "question": "Traduza: 'Você é legal'", "correctAnswer": "you are nice|you're nice"},
    {"id": 17, "type": "complete", "question": "Complete: 'How _____ you?' (Como você está?)", "correctAnswer": "are"},
    {"id": 18, "type": "multiple-choice", "question": "O que significa 'I'm fine'?", "options": ["Estou bem", "Estou ótimo", "Estou mal", "Estou cansado"], "correctAnswer": "Estou bem"},
    {"id": 19, "type": "fill-blank", "question": "Complete: 'It _____ a cat' (Isto é um gato)", "correctAnswer": "is|'s"},
    {"id": 20, "type": "translate", "question": "Traduza: 'Tchau'", "correctAnswer": "goodbye|bye"}
  ],
  "friday": [
    {"id": 1, "type": "complete", "question": "Complete: 'My _____ is Maria' (Meu nome é Maria)", "correctAnswer": "name"},
    {"id": 2, "type": "multiple-choice", "question": "Como se diz 'Boa noite' ao chegar?", "options": ["Good evening", "Good night", "Good afternoon", "Good day"], "correctAnswer": "Good evening"},
    {"id": 3, "type": "translate", "question": "Traduza: 'Eu estou bem, obrigado'", "correctAnswer": "i am fine thank you|i'm fine thank you"},
    {"id": 4, "type": "fill-blank", "question": "Complete: 'You _____ nice' (Você é legal)", "correctAnswer": "are|'re"},
    {"id": 5, "type": "complete", "question": "Complete com pronome: '_____ are teachers' (Nós somos professores)", "correctAnswer": "we"},
    {"id": 6, "type": "multiple-choice", "question": "Forma contraída de 'He is':", "options": ["He's", "Hes", "His", "He"], "correctAnswer": "He's"},
    {"id": 7, "type": "translate", "question": "Traduza: 'Eles estão aprendendo inglês'", "correctAnswer": "they are learning english|they're learning english"},
    {"id": 8, "type": "fill-blank", "question": "Complete: 'I'm _____, and you?' (Estou bem, e você?)", "correctAnswer": "fine|good|great"},
    {"id": 9, "type": "complete", "question": "Complete: '_____ to meet you too' (Prazer em conhecê-lo também)", "correctAnswer": "nice"},
    {"id": 10, "type": "multiple-choice", "question": "O que significa 'Hello'?", "options": ["Olá", "Tchau", "Obrigado", "Por favor"], "correctAnswer": "Olá"},
    {"id": 11, "type": "translate", "question": "Traduza: 'Ela é Ana'", "correctAnswer": "she is ana|she's ana"},
    {"id": 12, "type": "fill-blank", "question": "Complete: 'He _____ happy' (Ele está feliz)", "correctAnswer": "is|'s"},
    {"id": 13, "type": "complete", "question": "Complete: 'Good _____!' (Boa noite - despedida)", "correctAnswer": "night"},
    {"id": 14, "type": "multiple-choice", "question": "Pronome para 'Ele':", "options": ["He", "She", "It", "They"], "correctAnswer": "He"},
    {"id": 15, "type": "translate", "question": "Traduza: 'Nós somos amigos'", "correctAnswer": "we are friends|we're friends"},
    {"id": 16, "type": "fill-blank", "question": "Complete: 'They _____ students' (Eles são estudantes)", "correctAnswer": "are|'re"},
    {"id": 17, "type": "complete", "question": "Complete: 'Thank _____' (Obrigado)", "correctAnswer": "you"},
    {"id": 18, "type": "multiple-choice", "question": "Forma contraída de 'We are':", "options": ["We're", "Were", "We is", "Weare"], "correctAnswer": "We're"},
    {"id": 19, "type": "translate", "question": "Traduza: 'Bom dia, como você está?'", "correctAnswer": "good morning how are you|good morning, how are you"},
    {"id": 20, "type": "fill-blank", "question": "Complete: 'It _____ nice' (Isto é legal)", "correctAnswer": "is|'s"}
  ]
};

// Carregar exercícios (agora usa base embutida)
async function loadExercises() {
    try {
        // Retorna a base de dados embutida
        return EXERCISES_DB;
    } catch (error) {
        console.error('Erro ao carregar exercícios:', error);
        return null;
    }
}

// Carregar exercícios do dia
async function loadDay(day) {
    currentDay = day;
    const allExercises = await loadExercises();
    
    if (!allExercises || !allExercises[day]) {
        alert('Erro ao carregar exercícios do dia!');
        return;
    }

    currentExercises = allExercises[day];
    userAnswers = {};

    // Atualizar interface
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('exercise-screen').classList.remove('hidden');
    document.getElementById('current-day-name').textContent = dayNames[day];
    document.getElementById('total-exercises').textContent = currentExercises.length;

    renderExercises();
}

// Renderizar exercícios
function renderExercises() {
    const container = document.getElementById('exercises-container');
    container.innerHTML = '';

    currentExercises.forEach((exercise, index) => {
        const card = document.createElement('div');
        card.className = 'exercise-card';
        card.id = `exercise-${index}`;

        let inputHTML = '';

        switch(exercise.type) {
            case 'fill-blank':
            case 'translate':
            case 'complete':
                inputHTML = `
                    <input 
                        type="text" 
                        class="exercise-input" 
                        id="answer-${index}"
                        placeholder="Digite sua resposta aqui..."
                        onchange="saveAnswer(${index}, this.value)"
                    >
                `;
                break;

            case 'multiple-choice':
                inputHTML = `
                    <div class="options-container">
                        ${exercise.options.map((option, optIndex) => `
                            <button 
                                class="option-button" 
                                onclick="selectOption(${index}, ${optIndex}, '${option}')"
                                id="option-${index}-${optIndex}"
                            >
                                ${String.fromCharCode(65 + optIndex)}) ${option}
                            </button>
                        `).join('')}
                    </div>
                `;
                break;

            case 'match':
                inputHTML = `
                    <input 
                        type="text" 
                        class="exercise-input" 
                        id="answer-${index}"
                        placeholder="Digite a letra correspondente (ex: A, B, C...)"
                        onchange="saveAnswer(${index}, this.value.toUpperCase())"
                    >
                    <div style="margin-top: 10px; font-size: 0.9em; color: #666;">
                        ${exercise.hint || ''}
                    </div>
                `;
                break;
        }

        card.innerHTML = `
            <span class="exercise-type">${getTypeLabel(exercise.type)}</span>
            <div class="exercise-question">
                <strong>${index + 1}.</strong> ${exercise.question}
            </div>
            ${inputHTML}
        `;

        container.appendChild(card);
    });

    updateProgress();
}

// Obter label do tipo de exercício
function getTypeLabel(type) {
    const labels = {
        'fill-blank': '📝 Preencher',
        'multiple-choice': '✅ Múltipla Escolha',
        'translate': '🔄 Tradução',
        'complete': '✏️ Completar',
        'match': '🔗 Relacionar'
    };
    return labels[type] || '📚 Exercício';
}

// Salvar resposta
function saveAnswer(index, answer) {
    userAnswers[index] = answer;
    updateProgress();
}

// Selecionar opção em múltipla escolha
function selectOption(exerciseIndex, optionIndex, optionText) {
    // Remover seleção anterior
    const allOptions = document.querySelectorAll(`[id^="option-${exerciseIndex}-"]`);
    allOptions.forEach(opt => opt.classList.remove('selected'));

    // Adicionar seleção atual
    const selectedOption = document.getElementById(`option-${exerciseIndex}-${optionIndex}`);
    selectedOption.classList.add('selected');

    // Salvar resposta
    saveAnswer(exerciseIndex, optionText);
}

// Atualizar barra de progresso
function updateProgress() {
    const answeredCount = Object.keys(userAnswers).length;
    const totalCount = currentExercises.length;
    const percentage = (answeredCount / totalCount) * 100;

    document.getElementById('current-exercise').textContent = answeredCount;
    document.getElementById('progress-fill').style.width = `${percentage}%`;

    // Habilitar/desabilitar botão de envio
    const submitButton = document.getElementById('submit-button');
    if (answeredCount === totalCount) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
}

// Enviar exercícios para a API
async function submitExercises() {
    const messageContainer = document.getElementById('message-container');
    messageContainer.innerHTML = '';

    // Verificar se todas as respostas foram preenchidas
    if (Object.keys(userAnswers).length !== currentExercises.length) {
        messageContainer.innerHTML = `
            <div class="error-message">
                ⚠️ Por favor, responda todos os exercícios antes de enviar!
            </div>
        `;
        return;
    }

    // Calcular pontuação
    const score = calculateScore();

    // Preparar dados completos para backup local
    const fullData = {
        day: currentDay,
        dayName: dayNames[currentDay],
        timestamp: new Date().toISOString(),
        studentName: prompt('Digite seu nome:') || 'Anônimo',
        lesson: 'Seed - Lesson 01',
        exercises: currentExercises.map((exercise, index) => ({
            exerciseNumber: index + 1,
            type: exercise.type,
            question: exercise.question,
            correctAnswer: exercise.correctAnswer,
            userAnswer: userAnswers[index],
            isCorrect: checkAnswer(exercise, userAnswers[index])
        })),
        score: score
    };

    // Salvar no localStorage (backup)
    saveToLocalStorage(fullData);

    // Preparar dados para API no formato solicitado
    const apiData = {
        timestamp: fullData.timestamp,
        student: fullData.studentName,
        worksheetId: `${currentDay}_lesson01_seed`,
        total: score.total,
        correct: score.correct,
        payload: fullData.exercises
    };

    // Enviar para API
    try {
        document.getElementById('submit-button').disabled = true;
        document.getElementById('submit-button').textContent = '📤 Enviando...';

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiData)
        });

        if (response.ok) {
            messageContainer.innerHTML = `
                <div class="success-message">
                    ✅ Respostas enviadas com sucesso!<br>
                    Pontuação: ${score.correct}/${score.total}
                    (${score.percentage}%)
                </div>
            `;
            
            // Desabilitar inputs após envio
            disableAllInputs();
        } else {
            throw new Error('Erro no servidor');
        }
    } catch (error) {
        console.error('Erro ao enviar:', error);
        messageContainer.innerHTML = `
            <div class="error-message">
                ❌ Erro ao enviar para o servidor.<br>
                Suas respostas foram salvas localmente.<br>
                <small>Erro: ${error.message}</small>
            </div>
        `;
    } finally {
        document.getElementById('submit-button').textContent = '📤 Enviar Respostas';
    }
}

// Verificar resposta
function checkAnswer(exercise, userAnswer) {
    if (!userAnswer) return false;
    
    const correctAnswer = exercise.correctAnswer.toString().toLowerCase().trim();
    const userAnswerClean = userAnswer.toString().toLowerCase().trim();

    // Para múltiplas respostas corretas (separadas por |)
    if (correctAnswer.includes('|')) {
        const possibleAnswers = correctAnswer.split('|').map(a => a.trim());
        return possibleAnswers.some(ans => userAnswerClean === ans);
    }

    return userAnswerClean === correctAnswer;
}

// Calcular pontuação
function calculateScore() {
    let correct = 0;
    let total = currentExercises.length;

    currentExercises.forEach((exercise, index) => {
        if (checkAnswer(exercise, userAnswers[index])) {
            correct++;
        }
    });

    return {
        correct: correct,
        total: total,
        percentage: Math.round((correct / total) * 100)
    };
}

// Salvar no localStorage
function saveToLocalStorage(data) {
    const key = `speakup_${currentDay}_${Date.now()}`;
    localStorage.setItem(key, JSON.stringify(data));
    console.log('Dados salvos localmente:', key);
}

// Desabilitar todos os inputs após envio
function disableAllInputs() {
    const inputs = document.querySelectorAll('.exercise-input, .option-button');
    inputs.forEach(input => input.disabled = true);
}

// Voltar ao menu
function backToMenu() {
    if (Object.keys(userAnswers).length > 0) {
        const confirm = window.confirm('Você tem respostas não enviadas. Deseja realmente voltar ao menu?');
        if (!confirm) return;
    }

    document.getElementById('exercise-screen').classList.add('hidden');
    document.getElementById('menu-screen').classList.remove('hidden');
    
    // Limpar dados
    currentDay = '';
    currentExercises = [];
    userAnswers = {};
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('SpeakUp - Sistema de Exercícios carregado!');
    console.log('⚠️ LEMBRE-SE DE CONFIGURAR A URL DA API no arquivo app.js');
});

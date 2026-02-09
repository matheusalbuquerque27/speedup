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

// Carregar exercícios do JSON
async function loadExercises() {
    try {
        // Tentar diferentes caminhos para compatibilidade com GitHub Pages
        const paths = [
            './exercises.json',
            'exercises.json',
            '/speedup/exercises.json'
        ];
        
        let data = null;
        let lastError = null;
        
        for (const path of paths) {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    data = await response.json();
                    console.log('Exercícios carregados de:', path);
                    return data;
                }
            } catch (error) {
                lastError = error;
                continue;
            }
        }
        
        throw lastError || new Error('Arquivo exercises.json não encontrado');
    } catch (error) {
        console.error('Erro ao carregar exercícios:', error);
        alert('❌ Erro ao carregar exercícios!\n\nVerifique se o arquivo exercises.json está na mesma pasta.\n\nErro: ' + error.message);
        return null;
    }
}

// Carregar exercícios do dia
async function loadDay(day) {
    // Mostrar loading
    const menuScreen = document.getElementById('menu-screen');
    const originalContent = menuScreen.innerHTML;
    menuScreen.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
            <div style="font-size: 3em; margin-bottom: 20px;">⏳</div>
            <h2 style="color: #333;">Carregando exercícios...</h2>
            <p style="color: #666;">Por favor, aguarde</p>
        </div>
    `;
    
    currentDay = day;
    const allExercises = await loadExercises();
    
    if (!allExercises) {
        menuScreen.innerHTML = originalContent;
        return; // Erro já foi mostrado em loadExercises
    }
    
    if (!allExercises[day]) {
        menuScreen.innerHTML = originalContent;
        alert('❌ Exercícios do dia "' + dayNames[day] + '" não encontrados!');
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
    console.log('✅ SpeakUp - Sistema de Exercícios carregado!');
    console.log('📁 Funções disponíveis:', {
        loadDay: typeof loadDay,
        backToMenu: typeof backToMenu,
        submitExercises: typeof submitExercises
    });
    
    // Verificar se os elementos existem
    const menuScreen = document.getElementById('menu-screen');
    const exerciseScreen = document.getElementById('exercise-screen');
    
    console.log('📄 Elementos encontrados:', {
        menuScreen: !!menuScreen,
        exerciseScreen: !!exerciseScreen
    });
    
    // Testar carregamento do JSON
    console.log('🧪 Testando carregamento do JSON...');
    fetch('./exercises.json')
        .then(response => {
            console.log('📡 Resposta do fetch:', response.status, response.ok);
            return response.json();
        })
        .then(data => {
            console.log('✅ JSON carregado com sucesso!');
            console.log('📊 Dias disponíveis:', Object.keys(data));
            console.log('📝 Exercícios na segunda:', data.monday ? data.monday.length : 'N/A');
        })
        .catch(error => {
            console.error('❌ Erro ao carregar JSON:', error);
        });
});

// Disponibilizar funções globalmente (para garantir)
window.loadDay = loadDay;
window.backToMenu = backToMenu;
window.submitExercises = submitExercises;
window.saveAnswer = saveAnswer;
window.selectOption = selectOption;

console.log('🌍 Funções exportadas para window:', {
    loadDay: typeof window.loadDay,
    backToMenu: typeof window.backToMenu,
    submitExercises: typeof window.submitExercises
});

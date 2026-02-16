// SpeakUp - Sistema de Exercícios de Fixação
// Baseado no método de repetição espaçada (Kumon/Duolingo)

let currentDay = '';
let currentExercises = [];
let userAnswers = {};
let originalMenuHTML = ''; // Armazenar HTML original do menu
let currentLevel = ''; // Nível atual (seed ou root)
let turmasCodes = {}; // Códigos das turmas

// URL da API - VOCÊ DEVE SUBSTITUIR PELA SUA API
const API_URL = 'https://script.google.com/macros/s/AKfycbzaWH3Z7zyfSTVtyTlNKmJvCCNMWTpD379nQ2EJ6hEef8elI1HWr9jOjjufJ-_x_ibE/exec';

// Mapeamento de nomes dos dias
const dayNames = {
    'monday': 'Segunda-feira',
    'tuesday': 'Terça-feira',
    'wednesday': 'Quarta-feira',
    'thursday': 'Quinta-feira',
    'friday': 'Sexta-feira'
};

// Carregar códigos das turmas
async function loadTurmasCodes() {
    try {
        const paths = ['./turmas.json', 'turmas.json', '/speedup/turmas.json'];
        
        for (const path of paths) {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    turmasCodes = await response.json();
                    console.log('✅ Códigos das turmas carregados:', Object.keys(turmasCodes));
                    return turmasCodes;
                }
            } catch (e) {
                continue;
            }
        }
        
        console.error('❌ Não foi possível carregar turmas.json');
        return null;
    } catch (error) {
        console.error('Erro ao carregar códigos:', error);
        return null;
    }
}

// Selecionar nível (Seed ou Root)
async function selectLevel(level) {
    console.log(`🎯 Nível selecionado: ${level}`);
    
    // Carregar códigos se ainda não carregou
    if (Object.keys(turmasCodes).length === 0) {
        await loadTurmasCodes();
    }
    
    // Verificar se o nível existe
    if (!turmasCodes[level]) {
        alert('❌ Nível não encontrado!');
        return;
    }
    
    // Solicitar código da turma
    const codigo = prompt(`🔐 Digite o código da turma ${level.toUpperCase()}:`);
    
    if (!codigo) {
        return; // Usuário cancelou
    }
    
    // Validar código
    if (codigo.toLowerCase().trim() !== turmasCodes[level].code) {
        alert('❌ Código incorreto! Tente novamente.');
        return;
    }
    
    // Código correto! Avançar para menu
    currentLevel = level;
    console.log(`✅ Acesso autorizado ao nível: ${turmasCodes[level].name}`);
    
    // Atualizar título do header
    const headerSubtitle = document.querySelector('header p');
    if (headerSubtitle) {
        headerSubtitle.textContent = `${turmasCodes[level].name}: ${turmasCodes[level].description}`;
    }
    
    // Esconder tela de nível e mostrar menu
    const levelScreen = document.getElementById('level-screen');
    const menuScreen = document.getElementById('menu-screen');
    
    if (levelScreen) {
        levelScreen.style.display = 'none';
        levelScreen.classList.add('hidden');
    }
    
    if (menuScreen) {
        menuScreen.style.display = 'block';
        menuScreen.classList.remove('hidden');
        
        // Salvar HTML original do menu
        if (!originalMenuHTML) {
            originalMenuHTML = menuScreen.innerHTML;
        }
    }
}

// Carregar exercícios do JSON
async function loadExercises() {
    try {
        // Determinar arquivo baseado no nível
        const exerciseFile = currentLevel === 'root' ? 'exercises-root.json' : 'exercises.json';
        
        // Tentar diferentes caminhos para compatibilidade com GitHub Pages
        const paths = [
            `./${exerciseFile}`,
            exerciseFile,
            `/speedup/${exerciseFile}`
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
    console.log(`🔵 loadDay('${day}') chamado`);
    
    // Verificar se os elementos da interface existem
    const menuScreen = document.getElementById('menu-screen');
    const exerciseScreen = document.getElementById('exercise-screen');
    
    if (!menuScreen || !exerciseScreen) {
        console.warn('⚠️ Elementos de interface não encontrados. Carregando apenas dados...');
    }
    
    // Salvar HTML original do menu (se ainda não salvou)
    if (menuScreen && !originalMenuHTML) {
        originalMenuHTML = menuScreen.innerHTML;
        console.log('💾 HTML original do menu salvo');
    }
    
    // Mostrar loading (se interface existir)
    if (menuScreen) {
        menuScreen.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <div style="font-size: 3em; margin-bottom: 20px;">⏳</div>
                <h2 style="color: #333;">Carregando exercícios...</h2>
                <p style="color: #666;">Por favor, aguarde</p>
            </div>
        `;
    }
    
    currentDay = day;
    const allExercises = await loadExercises();
    
    if (!allExercises) {
        if (menuScreen && originalMenuHTML) menuScreen.innerHTML = originalMenuHTML;
        return; // Erro já foi mostrado em loadExercises
    }
    
    if (!allExercises[day]) {
        if (menuScreen && originalMenuHTML) menuScreen.innerHTML = originalMenuHTML;
        alert('❌ Exercícios do dia "' + dayNames[day] + '" não encontrados!');
        return;
    }

    currentExercises = allExercises[day];
    userAnswers = {};

    console.log(`✅ ${currentExercises.length} exercícios carregados para ${dayNames[day]}`);

    // Atualizar interface (apenas se elementos existirem)
    if (menuScreen && exerciseScreen) {
        console.log('🎨 Atualizando interface...');
        console.log('Menu screen classes antes:', menuScreen.className);
        console.log('Exercise screen classes antes:', exerciseScreen.className);
        
        // Esconder menu e mostrar exercícios
        menuScreen.classList.add('hidden');
        menuScreen.style.display = 'none';
        
        exerciseScreen.classList.remove('hidden');
        exerciseScreen.style.display = 'block';
        
        console.log('Menu screen classes depois:', menuScreen.className);
        console.log('Exercise screen classes depois:', exerciseScreen.className);
        
        const dayNameElement = document.getElementById('current-day-name');
        const totalExercisesElement = document.getElementById('total-exercises');
        
        console.log('Elementos encontrados:', {
            dayNameElement: !!dayNameElement,
            totalExercisesElement: !!totalExercisesElement
        });
        
        if (dayNameElement) dayNameElement.textContent = dayNames[day];
        if (totalExercisesElement) totalExercisesElement.textContent = currentExercises.length;

        console.log('🎯 Chamando renderExercises()...');
        renderExercises();
        console.log('✅ renderExercises() concluído');
    } else {
        console.log('✅ Exercícios carregados (modo teste - sem interface)');
    }
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
                                onclick="selectOption(${index}, ${optIndex}, \`${option}\`)"
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
            mode: 'no-cors',
            body: JSON.stringify(apiData)
        });

        // Com no-cors, não conseguimos verificar response.ok, mas o envio funcionou
        messageContainer.innerHTML = `
            <div class="success-message">
                ✅ Respostas enviadas com sucesso!<br>
                Pontuação: ${score.correct}/${score.total}
                (${score.percentage}%)
            </div>
        `;
        
        // Desabilitar inputs após envio
        disableAllInputs();
        
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

    const exerciseScreen = document.getElementById('exercise-screen');
    const menuScreen = document.getElementById('menu-screen');
    
    // Restaurar HTML original do menu
    if (menuScreen && originalMenuHTML) {
        menuScreen.innerHTML = originalMenuHTML;
        console.log('🔄 HTML do menu restaurado');
    }
    
    exerciseScreen.classList.add('hidden');
    exerciseScreen.style.display = 'none';
    
    menuScreen.classList.remove('hidden');
    menuScreen.style.display = 'block';
    
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
    
    // Carregar códigos das turmas
    loadTurmasCodes();
    
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
window.selectLevel = selectLevel;
window.loadDay = loadDay;
window.backToMenu = backToMenu;
window.submitExercises = submitExercises;
window.saveAnswer = saveAnswer;
window.selectOption = selectOption;
window.showVideos = showVideos;
window.backToMenuFromVideos = backToMenuFromVideos;

console.log('🌍 Funções exportadas para window:', {
    loadDay: typeof window.loadDay,
    backToMenu: typeof window.backToMenu,
    submitExercises: typeof window.submitExercises,
    showVideos: typeof window.showVideos,
    backToMenuFromVideos: typeof window.backToMenuFromVideos
});

// Função para mostrar a tela de vídeos
function showVideos() {
    console.log('🎥 Abrindo tela de vídeos...');
    console.log('📊 Nível atual:', currentLevel);
    
    const menuScreen = document.getElementById('menu-screen');
    const videosScreen = document.getElementById('videos-screen');
    const videosContainer = document.getElementById('videos-container');
    
    if (!menuScreen || !videosScreen || !videosContainer) {
        console.error('❌ Elementos da interface não encontrados');
        return;
    }
    
    // Salvar HTML original do menu (se ainda não salvou)
    if (!originalMenuHTML) {
        originalMenuHTML = menuScreen.innerHTML;
        console.log('💾 HTML original do menu salvo');
    }
    
    // Limpar container de vídeos
    videosContainer.innerHTML = '';
    
    // Definir vídeos baseado no nível
    let videos = [];
    
    if (currentLevel === 'seed') {
        videos = [
            { title: '📚 Seed - Lesson 01', url: 'https://www.youtube.com/embed/bmWPdq6jw3Q' },
            { title: '📚 Seed - Lesson 02', url: 'https://www.youtube.com/embed/Sp_9i-j3Ryw' }
        ];
    } else if (currentLevel === 'root') {
        // Aqui você pode adicionar vídeos do Root no futuro
        videos = [
            { title: '📚 Root - Lesson 01', url: 'https://www.youtube.com/embed/6DArC_SJ7Uw?si=C2ASh0RrQu2GWE-8' },
            { title: '📚 Root - Lesson 02', url: 'https://www.youtube.com/embed/4zqE4uznWxk?si=8JaDLu53E_ju0aa0' }
        ];
    }
    
    // Verificar se há vídeos disponíveis
    if (videos.length === 0) {
        videosContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <h3>🎬 Em Breve!</h3>
                <p>As aulas gravadas para o nível ${currentLevel.toUpperCase()} estarão disponíveis em breve.</p>
            </div>
        `;
    } else {
        // Criar cards de vídeo
        videos.forEach(video => {
            const videoCard = document.createElement('div');
            videoCard.className = 'video-card';
            videoCard.innerHTML = `
                <h3 class="video-title">${video.title}</h3>
                <div class="video-wrapper">
                    <iframe 
                        src="${video.url}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowfullscreen>
                    </iframe>
                </div>
            `;
            videosContainer.appendChild(videoCard);
        });
    }
    
    // Esconder menu e mostrar vídeos
    menuScreen.classList.add('hidden');
    menuScreen.style.display = 'none';
    
    videosScreen.classList.remove('hidden');
    videosScreen.style.display = 'block';
    
    console.log(`✅ Tela de vídeos exibida para nível: ${currentLevel}`);
}

// Função para voltar ao menu a partir da tela de vídeos
function backToMenuFromVideos() {
    console.log('🔙 Voltando ao menu...');
    
    const videosScreen = document.getElementById('videos-screen');
    const menuScreen = document.getElementById('menu-screen');
    
    if (!videosScreen || !menuScreen) {
        console.error('❌ Elementos da interface não encontrados');
        return;
    }
    
    // Restaurar HTML original do menu
    if (originalMenuHTML) {
        menuScreen.innerHTML = originalMenuHTML;
        console.log('🔄 HTML do menu restaurado');
    }
    
    // Esconder vídeos e mostrar menu
    videosScreen.classList.add('hidden');
    videosScreen.style.display = 'none';
    
    menuScreen.classList.remove('hidden');
    menuScreen.style.display = 'block';
    
    console.log('✅ Menu exibido');
}

// ===== FUNÇÕES DE PODCASTS =====

// Lista de podcasts disponíveis por nível
const podcastsList = {
    seed: [
        {
            id: 1,
            title: 'Episode 01 - Greetings & Introductions',
            description: 'Learn basic greetings and how to introduce yourself in English.',
            audioFile: 'aulas/Seed/Podcasts/podcast_episode01.wav',
            scriptFile: 'aulas/Seed/Podcasts/podcast_audioscript.md',
            duration: '5:00',
            level: 'seed'
        }
        // Adicione mais podcasts do Seed aqui
    ],
    root: [
        {
            id: 1,
            title: 'Episode 01 - Travel & Trips',
            description: 'Listen to Alex and Sam talking about their travel experiences and vacation plans.',
            audioFile: 'aulas/Root/Podcasts/podcast_episode01.wav',
            scriptFile: 'aulas/Root/Podcasts/podcast_audioscript.md',
            duration: '5:00',
            level: 'root'
        }
        // Adicione mais podcasts do Root aqui
    ]
};

let currentPodcast = null;

// Função para mostrar a lista de podcasts
function showPodcasts() {
    console.log('🎙️ Abrindo lista de podcasts...');
    console.log('📊 Nível atual:', currentLevel);
    
    const menuScreen = document.getElementById('menu-screen');
    const podcastsScreen = document.getElementById('podcasts-screen');
    const podcastsContainer = document.getElementById('podcasts-container');
    
    if (!menuScreen || !podcastsScreen || !podcastsContainer) {
        console.error('❌ Elementos da interface não encontrados');
        return;
    }
    
    // Salvar HTML original do menu
    if (!originalMenuHTML) {
        originalMenuHTML = menuScreen.innerHTML;
    }
    
    // Limpar container
    podcastsContainer.innerHTML = '';
    
    // Obter podcasts do nível atual
    let podcasts = [];
    
    if (currentLevel === 'seed') {
        podcasts = podcastsList.seed || [];
    } else if (currentLevel === 'root') {
        podcasts = podcastsList.root || [];
    }
    
    // Verificar se há podcasts disponíveis
    if (podcasts.length === 0) {
        podcastsContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">
                <h3><i class="fas fa-podcast"></i> Coming Soon!</h3>
                <p>Podcasts for the ${currentLevel.toUpperCase()} level will be available soon.</p>
            </div>
        `;
    } else {
        // Criar cards de podcasts
        podcasts.forEach(podcast => {
            const podcastCard = document.createElement('div');
            podcastCard.className = 'podcast-card';
            podcastCard.onclick = () => openPodcast(podcast);
            podcastCard.innerHTML = `
                <h3><i class="fas fa-podcast"></i> ${podcast.title}</h3>
                <p>${podcast.description}</p>
                <p style="margin-top: 15px; color: #667eea; font-weight: bold;">
                    <i class="fas fa-clock"></i> Duration: ${podcast.duration}
                </p>
            `;
            podcastsContainer.appendChild(podcastCard);
        });
    }
    
    // Esconder menu e mostrar podcasts
    menuScreen.classList.add('hidden');
    menuScreen.style.display = 'none';
    
    podcastsScreen.classList.remove('hidden');
    podcastsScreen.style.display = 'block';
    
    console.log(`✅ Lista de podcasts exibida para nível: ${currentLevel}`);
}

// Função para voltar ao menu a partir da lista de podcasts
function backToMenuFromPodcasts() {
    console.log('🔙 Voltando ao menu...');
    
    const podcastsScreen = document.getElementById('podcasts-screen');
    const menuScreen = document.getElementById('menu-screen');
    
    if (!podcastsScreen || !menuScreen) {
        console.error('❌ Elementos da interface não encontrados');
        return;
    }
    
    // Restaurar HTML original do menu
    if (originalMenuHTML) {
        menuScreen.innerHTML = originalMenuHTML;
    }
    
    // Esconder podcasts e mostrar menu
    podcastsScreen.classList.add('hidden');
    podcastsScreen.style.display = 'none';
    
    menuScreen.classList.remove('hidden');
    menuScreen.style.display = 'block';
    
    console.log('✅ Menu exibido');
}

// Função para abrir um podcast específico
async function openPodcast(podcast) {
    console.log('🎧 Abrindo podcast:', podcast.title);
    
    currentPodcast = podcast;
    
    const podcastsScreen = document.getElementById('podcasts-screen');
    const playerScreen = document.getElementById('podcast-player-screen');
    const podcastTitle = document.getElementById('podcast-title');
    const audioSource = document.getElementById('podcast-audio-source');
    const audioPlayer = document.getElementById('podcast-audio');
    const scriptContainer = document.getElementById('podcast-script-container');
    
    if (!podcastsScreen || !playerScreen) {
        console.error('❌ Elementos da interface não encontrados');
        return;
    }
    
    // Atualizar título
    podcastTitle.innerHTML = `<i class="fas fa-podcast"></i> ${podcast.title}`;
    
    // Configurar áudio
    audioSource.src = podcast.audioFile;
    audioPlayer.load();
    
    // Carregar script do podcast
    try {
        const response = await fetch(podcast.scriptFile);
        if (response.ok) {
            const scriptText = await response.text();
            // Converter markdown para HTML básico
            scriptContainer.innerHTML = convertMarkdownToHTML(scriptText);
        } else {
            scriptContainer.innerHTML = '<p style="color: #666;">Script not available.</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar script:', error);
        scriptContainer.innerHTML = '<p style="color: #666;">Error loading script.</p>';
    }
    
    // Esconder lista e mostrar player
    podcastsScreen.classList.add('hidden');
    podcastsScreen.style.display = 'none';
    
    playerScreen.classList.remove('hidden');
    playerScreen.style.display = 'block';
    
    console.log('✅ Podcast aberto');
}

// Função para voltar à lista de podcasts
function backToPodcastsList() {
    console.log('🔙 Voltando à lista de podcasts...');
    
    const playerScreen = document.getElementById('podcast-player-screen');
    const podcastsScreen = document.getElementById('podcasts-screen');
    const audioPlayer = document.getElementById('podcast-audio');
    
    if (!playerScreen || !podcastsScreen) {
        console.error('❌ Elementos da interface não encontrados');
        return;
    }
    
    // Pausar áudio
    audioPlayer.pause();
    
    // Esconder player e mostrar lista
    playerScreen.classList.add('hidden');
    playerScreen.style.display = 'none';
    
    podcastsScreen.classList.remove('hidden');
    podcastsScreen.style.display = 'block';
    
    console.log('✅ Lista de podcasts exibida');
}

// Função para fazer download do podcast
function downloadPodcast() {
    if (!currentPodcast) {
        alert('No podcast selected');
        return;
    }
    
    console.log('💾 Iniciando download do podcast:', currentPodcast.title);
    
    const link = document.createElement('a');
    link.href = currentPodcast.audioFile;
    link.download = `${currentPodcast.title.replace(/[^a-z0-9]/gi, '_')}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ Download iniciado');
}

// Função auxiliar para converter Markdown básico em HTML
function convertMarkdownToHTML(markdown) {
    let html = markdown;
    
    // Converter headers
    html = html.replace(/### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/## (.*?)$/gm, '<h2>$1</h2>');
    
    // Converter negrito
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Converter linhas horizontais
    html = html.replace(/^---$/gm, '<hr>');
    
    // Converter quebras de linha duplas em parágrafos
    const lines = html.split('\n');
    let inParagraph = false;
    let result = '';
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line === '') {
            if (inParagraph) {
                result += '</p>';
                inParagraph = false;
            }
        } else if (!line.startsWith('<h') && !line.startsWith('<hr')) {
            if (!inParagraph) {
                result += '<p>';
                inParagraph = true;
            }
            result += line + ' ';
        } else {
            if (inParagraph) {
                result += '</p>';
                inParagraph = false;
            }
            result += line;
        }
    }
    
    if (inParagraph) {
        result += '</p>';
    }
    
    return result;
}

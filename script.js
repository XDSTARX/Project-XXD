// Global State
let currentUser = null;
let missions = [];
let achievements = [];
let withdrawals = [];
let checkinHistory = [];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadMissions();
    loadAchievements();
    loadRanking();
    setupEventListeners();
});

// Initialize App
function initializeApp() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInterface();
    }
    
    // Load user data
    loadUserData();
}

// Setup Event Listeners
function setupEventListeners() {
    // Login/Register modals
    document.getElementById('loginBtn').addEventListener('click', () => showModal('loginModal'));
    document.getElementById('closeLoginModal').addEventListener('click', () => hideModal('loginModal'));
    document.getElementById('closeRegisterModal').addEventListener('click', () => hideModal('registerModal'));
    document.getElementById('showRegisterModal').addEventListener('click', () => {
        hideModal('loginModal');
        showModal('registerModal');
    });
    document.getElementById('showLoginModal').addEventListener('click', () => {
        hideModal('registerModal');
        showModal('loginModal');
    });

    // Forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('requestWithdrawBtn').addEventListener('click', handleWithdrawRequest);

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target.getAttribute('href').substring(1);
            scrollToSection(target);
        });
    });

    // Start earning button
    document.getElementById('startEarningBtn').addEventListener('click', () => {
        if (currentUser) {
            scrollToSection('missions');
        } else {
            showModal('loginModal');
        }
    });
}

// User Authentication
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Simulate login (in real app, this would be an API call)
    const user = {
        id: Date.now(),
        name: 'Usuário Teste',
        email: email,
        balance: 15.50,
        points: 1550,
        level: 5,
        joinDate: new Date().toISOString(),
        totalEarnings: 245.80,
        completedMissions: 47,
        checkinStreak: 12
    };

    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    updateUserInterface();
    hideModal('loginModal');
    showMessage('Login realizado com sucesso!', 'success');
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (password !== confirmPassword) {
        showMessage('As senhas não coincidem!', 'error');
        return;
    }

    // Simulate registration
    const user = {
        id: Date.now(),
        name: name,
        email: email,
        balance: 0,
        points: 0,
        level: 1,
        joinDate: new Date().toISOString(),
        totalEarnings: 0,
        completedMissions: 0,
        checkinStreak: 0
    };

    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    updateUserInterface();
    hideModal('registerModal');
    showMessage('Conta criada com sucesso! Bem-vindo!', 'success');
}

// Update User Interface
function updateUserInterface() {
    if (currentUser) {
        document.getElementById('userBalance').textContent = `R$ ${currentUser.balance.toFixed(2)}`;
        document.getElementById('userPoints').textContent = `${currentUser.points} pontos`;
        document.getElementById('loginBtn').textContent = currentUser.name;
        document.getElementById('loginBtn').onclick = () => showUserMenu();
    }
}

// Load Missions
function loadMissions() {
    missions = [
        {
            id: 1,
            title: 'Pesquisa de Satisfação',
            description: 'Responda uma pesquisa rápida sobre produtos e serviços. Leva apenas 2 minutos!',
            reward: 2.50,
            points: 250,
            duration: '2 min',
            difficulty: 'Fácil',
            category: 'Pesquisa',
            completed: false
        },
        {
            id: 2,
            title: 'Avaliação de App',
            description: 'Teste nosso novo aplicativo e nos dê sua opinião honesta.',
            reward: 5.00,
            points: 500,
            duration: '5 min',
            difficulty: 'Fácil',
            category: 'Teste',
            completed: false
        },
        {
            id: 3,
            title: 'Questionário de Hábitos',
            description: 'Compartilhe seus hábitos de consumo para ajudar em pesquisas de mercado.',
            reward: 8.75,
            points: 875,
            duration: '8 min',
            difficulty: 'Médio',
            category: 'Pesquisa',
            completed: false
        },
        {
            id: 4,
            title: 'Review de Produto',
            description: 'Escreva uma avaliação detalhada de um produto que você já usou.',
            reward: 12.00,
            points: 1200,
            duration: '10 min',
            difficulty: 'Médio',
            category: 'Review',
            completed: false
        },
        {
            id: 5,
            title: 'Pesquisa de Mercado',
            description: 'Participe de uma pesquisa abrangente sobre tendências de mercado.',
            reward: 15.50,
            points: 1550,
            duration: '15 min',
            difficulty: 'Médio',
            category: 'Pesquisa',
            completed: false
        },
        {
            id: 6,
            title: 'Teste de Usabilidade',
            description: 'Teste a usabilidade de um novo site e forneça feedback detalhado.',
            reward: 20.00,
            points: 2000,
            duration: '20 min',
            difficulty: 'Difícil',
            category: 'Teste',
            completed: false
        }
    ];

    renderMissions();
}

// Render Missions
function renderMissions() {
    const missionsGrid = document.getElementById('missionsGrid');
    missionsGrid.innerHTML = '';

    missions.forEach(mission => {
        const missionCard = document.createElement('div');
        missionCard.className = 'mission-card';
        missionCard.innerHTML = `
            <div class="mission-header">
                <h3 class="mission-title">${mission.title}</h3>
                <div class="mission-reward">R$ ${mission.reward.toFixed(2)}</div>
            </div>
            <p class="mission-description">${mission.description}</p>
            <div class="mission-meta">
                <span class="mission-duration">⏱️ ${mission.duration}</span>
                <span class="mission-difficulty">📊 ${mission.difficulty}</span>
                <span class="mission-category">🏷️ ${mission.category}</span>
            </div>
            <div class="mission-actions">
                <button class="btn-mission btn-start" onclick="startMission(${mission.id})">
                    ${mission.completed ? 'Concluída' : 'Iniciar Missão'}
                </button>
                <button class="btn-mission" onclick="viewMissionDetails(${mission.id})">
                    Detalhes
                </button>
            </div>
        `;

        if (mission.completed) {
            missionCard.querySelector('.btn-start').className = 'btn-mission btn-completed';
        }

        missionsGrid.appendChild(missionCard);
    });
}

// Start Mission
function startMission(missionId) {
    if (!currentUser) {
        showModal('loginModal');
        return;
    }

    const mission = missions.find(m => m.id === missionId);
    if (!mission || mission.completed) return;

    // Simulate mission completion
    setTimeout(() => {
        completeMission(missionId);
    }, 2000);

    showMessage(`Iniciando missão: ${mission.title}`, 'info');
}

// Complete Mission
function completeMission(missionId) {
    const mission = missions.find(m => m.id === missionId);
    if (!mission || mission.completed) return;

    mission.completed = true;
    currentUser.balance += mission.reward;
    currentUser.points += mission.points;
    currentUser.completedMissions++;
    currentUser.totalEarnings += mission.reward;

    // Save user data
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUserInterface();
    renderMissions();
    loadRanking();

    showMessage(`Missão concluída! Você ganhou R$ ${mission.reward.toFixed(2)} e ${mission.points} pontos!`, 'success');
    checkAchievements();
}

// Load Achievements
function loadAchievements() {
    achievements = [
        {
            id: 1,
            title: 'Primeira Missão',
            description: 'Complete sua primeira missão',
            icon: '🎯',
            reward: 100,
            completed: currentUser ? currentUser.completedMissions > 0 : false
        },
        {
            id: 2,
            title: 'Ganhador',
            description: 'Ganhe R$ 50,00 no total',
            icon: '💰',
            reward: 500,
            completed: currentUser ? currentUser.totalEarnings >= 50 : false
        },
        {
            id: 3,
            title: 'Veterano',
            description: 'Complete 25 missões',
            icon: '🏆',
            reward: 1000,
            completed: currentUser ? currentUser.completedMissions >= 25 : false
        },
        {
            id: 4,
            title: 'Milionário',
            description: 'Ganhe R$ 200,00 no total',
            icon: '💎',
            reward: 2000,
            completed: currentUser ? currentUser.totalEarnings >= 200 : false
        },
        {
            id: 5,
            title: 'Check-in Diário',
            description: 'Faça check-in por 7 dias seguidos',
            icon: '📅',
            reward: 300,
            completed: currentUser ? currentUser.checkinStreak >= 7 : false
        },
        {
            id: 6,
            title: 'Lenda',
            description: 'Complete 100 missões',
            icon: '👑',
            reward: 5000,
            completed: currentUser ? currentUser.completedMissions >= 100 : false
        }
    ];

    renderAchievements();
}

// Render Achievements
function renderAchievements() {
    const achievementsGrid = document.getElementById('achievementsGrid');
    achievementsGrid.innerHTML = '';

    achievements.forEach(achievement => {
        const achievementCard = document.createElement('div');
        achievementCard.className = `achievement-card ${achievement.completed ? 'completed' : ''}`;
        achievementCard.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <h3 class="achievement-title">${achievement.title}</h3>
            <p class="achievement-description">${achievement.description}</p>
            <div class="achievement-reward">+${achievement.reward} pontos</div>
        `;

        achievementsGrid.appendChild(achievementCard);
    });
}

// Check Achievements
function checkAchievements() {
    let newAchievements = 0;
    
    achievements.forEach(achievement => {
        const wasCompleted = achievement.completed;
        
        switch(achievement.id) {
            case 1:
                achievement.completed = currentUser.completedMissions > 0;
                break;
            case 2:
                achievement.completed = currentUser.totalEarnings >= 50;
                break;
            case 3:
                achievement.completed = currentUser.completedMissions >= 25;
                break;
            case 4:
                achievement.completed = currentUser.totalEarnings >= 200;
                break;
            case 5:
                achievement.completed = currentUser.checkinStreak >= 7;
                break;
            case 6:
                achievement.completed = currentUser.completedMissions >= 100;
                break;
        }

        if (!wasCompleted && achievement.completed) {
            newAchievements++;
            currentUser.points += achievement.reward;
        }
    });

    if (newAchievements > 0) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUserInterface();
        renderAchievements();
        showMessage(`Parabéns! Você desbloqueou ${newAchievements} nova(s) conquista(s)!`, 'success');
    }
}

// Load Ranking
function loadRanking() {
    const rankingData = [
        { name: 'João Silva', points: 15420, earnings: 1542.00, avatar: '👨‍💼' },
        { name: 'Maria Santos', points: 12850, earnings: 1285.00, avatar: '👩‍💼' },
        { name: 'Pedro Costa', points: 11200, earnings: 1120.00, avatar: '👨‍🎓' },
        { name: 'Ana Oliveira', points: 9850, earnings: 985.00, avatar: '👩‍🎓' },
        { name: 'Carlos Lima', points: 8750, earnings: 875.00, avatar: '👨‍💻' },
        { name: 'Fernanda Rocha', points: 7200, earnings: 720.00, avatar: '👩‍💻' },
        { name: 'Rafael Souza', points: 6500, earnings: 650.00, avatar: '👨‍🔬' },
        { name: 'Juliana Alves', points: 5800, earnings: 580.00, avatar: '👩‍🔬' },
        { name: 'Lucas Pereira', points: 5200, earnings: 520.00, avatar: '👨‍🎨' },
        { name: 'Camila Ferreira', points: 4800, earnings: 480.00, avatar: '👩‍🎨' }
    ];

    renderRanking(rankingData);
}

// Render Ranking
function renderRanking(rankingData) {
    const rankingBody = document.getElementById('rankingBody');
    rankingBody.innerHTML = '';

    rankingData.forEach((user, index) => {
        const rankingRow = document.createElement('div');
        rankingRow.className = 'ranking-row';
        
        let rankClass = '';
        if (index === 0) rankClass = 'rank-1';
        else if (index === 1) rankClass = 'rank-2';
        else if (index === 2) rankClass = 'rank-3';

        rankingRow.innerHTML = `
            <div class="rank-col ${rankClass}">#${index + 1}</div>
            <div class="user-col">
                <span>${user.avatar}</span>
                <span>${user.name}</span>
            </div>
            <div class="points-col">${user.points.toLocaleString()}</div>
            <div class="earnings-col">R$ ${user.earnings.toFixed(2)}</div>
        `;

        rankingBody.appendChild(rankingRow);
    });
}

// Handle Withdraw Request
function handleWithdrawRequest() {
    if (!currentUser) {
        showModal('loginModal');
        return;
    }

    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const bank = document.getElementById('bankSelect').value;
    const pixKey = document.getElementById('pixKey').value;
    const fullName = document.getElementById('fullName').value;

    if (!amount || amount < 0.10 || amount > 20.00) {
        showMessage('Valor deve estar entre R$ 0,10 e R$ 20,00', 'error');
        return;
    }

    if (!bank) {
        showMessage('Selecione um banco', 'error');
        return;
    }

    if (!pixKey) {
        showMessage('Digite sua chave PIX', 'error');
        return;
    }

    if (!fullName) {
        showMessage('Digite seu nome completo', 'error');
        return;
    }

    if (currentUser.balance < amount) {
        showMessage('Saldo insuficiente', 'error');
        return;
    }

    // Create withdrawal request
    const withdrawal = {
        id: Date.now(),
        amount: amount,
        bank: bank,
        pixKey: pixKey,
        fullName: fullName,
        status: 'processing',
        requestDate: new Date().toISOString(),
        processDate: null,
        completedDate: null
    };

    withdrawals.push(withdrawal);
    currentUser.balance -= amount;
    currentUser.points -= Math.floor(amount); // 1 ponto = R$ 1,00

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('withdrawals', JSON.stringify(withdrawals));

    updateUserInterface();
    showMessage('Saque solicitado com sucesso! Processamento em andamento...', 'success');

    // Simulate processing
    setTimeout(() => {
        processWithdrawal(withdrawal.id);
    }, 30000); // 30 seconds for demo

    // Clear form
    document.getElementById('withdrawAmount').value = '';
    document.getElementById('bankSelect').value = '';
    document.getElementById('pixKey').value = '';
    document.getElementById('fullName').value = '';
}

// Process Withdrawal
function processWithdrawal(withdrawalId) {
    const withdrawal = withdrawals.find(w => w.id === withdrawalId);
    if (!withdrawal) return;

    withdrawal.status = 'completed';
    withdrawal.processDate = new Date().toISOString();
    withdrawal.completedDate = new Date().toISOString();

    localStorage.setItem('withdrawals', JSON.stringify(withdrawals));
    
    showMessage(`Saque de R$ ${withdrawal.amount.toFixed(2)} processado com sucesso!`, 'success');
}

// Load User Data
function loadUserData() {
    const savedWithdrawals = localStorage.getItem('withdrawals');
    if (savedWithdrawals) {
        withdrawals = JSON.parse(savedWithdrawals);
    }
}

// Modal Functions
function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    // Add to page
    document.body.appendChild(messageDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function showUserMenu() {
    // Simple user menu implementation
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="user-menu-item" onclick="showWithdrawHistory()">Histórico de Saques</div>
        <div class="user-menu-item" onclick="showMissionHistory()">Histórico de Missões</div>
        <div class="user-menu-item" onclick="showCheckinModal()">Check-in Diário</div>
        <div class="user-menu-item" onclick="logout()">Sair</div>
    `;
    
    // Position menu
    const loginBtn = document.getElementById('loginBtn');
    const rect = loginBtn.getBoundingClientRect();
    menu.style.position = 'absolute';
    menu.style.top = rect.bottom + 'px';
    menu.style.right = '20px';
    menu.style.background = 'white';
    menu.style.border = '1px solid #ddd';
    menu.style.borderRadius = '10px';
    menu.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
    menu.style.zIndex = '1000';
    menu.style.minWidth = '200px';
    
    document.body.appendChild(menu);
    
    // Remove menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function removeMenu(e) {
            if (!menu.contains(e.target) && e.target !== loginBtn) {
                menu.remove();
                document.removeEventListener('click', removeMenu);
            }
        });
    }, 100);
}

function showWithdrawHistory() {
    showMessage('Histórico de saques em desenvolvimento...', 'info');
}

function showMissionHistory() {
    showMessage('Histórico de missões em desenvolvimento...', 'info');
}

function showCheckinModal() {
    showModal('checkinModal');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserInterface();
    document.getElementById('loginBtn').textContent = 'Entrar';
    document.getElementById('loginBtn').onclick = () => showModal('loginModal');
    showMessage('Logout realizado com sucesso!', 'success');
}

// Initialize check-in calendar
function initializeCheckinCalendar() {
    const calendar = document.getElementById('checkinCalendar');
    if (!calendar) return;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    calendar.innerHTML = '';

    // Add day headers
    const dayHeaders = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.textContent = day;
        dayHeader.style.fontWeight = 'bold';
        dayHeader.style.textAlign = 'center';
        dayHeader.style.padding = '0.5rem';
        calendar.appendChild(dayHeader);
    });

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'checkin-day';
        calendar.appendChild(emptyDay);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'checkin-day';
        dayElement.textContent = day;
        
        if (day === today.getDate()) {
            dayElement.classList.add('today');
        }
        
        if (day <= today.getDate()) {
            dayElement.classList.add('available');
        }
        
        if (currentUser && currentUser.checkinStreak >= day) {
            dayElement.classList.add('completed');
        }
        
        calendar.appendChild(dayElement);
    }
}

// Check-in functionality
document.getElementById('doCheckinBtn')?.addEventListener('click', function() {
    if (!currentUser) {
        showModal('loginModal');
        return;
    }

    const today = new Date().toDateString();
    const lastCheckin = localStorage.getItem('lastCheckin');
    
    if (lastCheckin === today) {
        showMessage('Você já fez check-in hoje!', 'error');
        return;
    }

    // Award check-in bonus
    const bonus = 50; // 50 pontos
    currentUser.points += bonus;
    currentUser.checkinStreak++;
    currentUser.balance += 0.50; // R$ 0,50 bonus

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('lastCheckin', today);

    updateUserInterface();
    checkAchievements();
    showMessage(`Check-in realizado! +${bonus} pontos e R$ 0,50 de bônus!`, 'success');
    hideModal('checkinModal');
});

// Initialize check-in modal
document.getElementById('closeCheckinModal')?.addEventListener('click', () => hideModal('checkinModal'));

// Initialize check-in calendar when modal opens
document.getElementById('checkinModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        initializeCheckinCalendar();
    }
});

// Mission details modal
function viewMissionDetails(missionId) {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${mission.title}</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <p><strong>Descrição:</strong> ${mission.description}</p>
                <p><strong>Recompensa:</strong> R$ ${mission.reward.toFixed(2)}</p>
                <p><strong>Pontos:</strong> ${mission.points}</p>
                <p><strong>Duração:</strong> ${mission.duration}</p>
                <p><strong>Dificuldade:</strong> ${mission.difficulty}</p>
                <p><strong>Categoria:</strong> ${mission.category}</p>
                <div style="margin-top: 1rem;">
                    <button class="btn-primary" onclick="startMission(${mission.id}); this.closest('.modal').remove();">
                        ${mission.completed ? 'Missão Concluída' : 'Iniciar Missão'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Auto-save user data every 30 seconds
setInterval(() => {
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}, 30000);

// Show welcome message for new users
if (!localStorage.getItem('welcomeShown')) {
    setTimeout(() => {
        showMessage('Bem-vindo ao Super Surveys in the World! Comece completando missões para ganhar dinheiro real!', 'info');
        localStorage.setItem('welcomeShown', 'true');
    }, 2000);
}
// Global Variables
let currentUser = null;
let userBalance = 0;
let userPoints = 0;
let missions = [];
let achievements = [];
let withdrawals = [];
let checkinDays = [];
let isLoggedIn = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadMissions();
    loadAchievements();
    loadRanking();
    loadCheckinCalendar();
    setupEventListeners();
});

// Initialize application data
function initializeApp() {
    // Load user data from localStorage
    const savedUser = localStorage.getItem('superSurveysUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        userBalance = currentUser.balance || 0;
        userPoints = currentUser.points || 0;
        isLoggedIn = true;
        updateUserInterface();
    }

    // Initialize missions data
    missions = [
        {
            id: 1,
            title: "Pesquisa de Satisfação",
            description: "Responda uma rápida pesquisa sobre produtos",
            reward: 2.50,
            points: 25,
            icon: "fas fa-clipboard-check",
            completed: false,
            timeRequired: "2 min"
        },
        {
            id: 2,
            title: "Avaliação de App",
            description: "Avalie um aplicativo móvel",
            reward: 5.00,
            points: 50,
            icon: "fas fa-mobile-alt",
            completed: false,
            timeRequired: "3 min"
        },
        {
            id: 3,
            title: "Teste de Produto",
            description: "Teste e avalie um novo produto",
            reward: 8.75,
            points: 87,
            icon: "fas fa-box",
            completed: false,
            timeRequired: "5 min"
        },
        {
            id: 4,
            title: "Pesquisa de Mercado",
            description: "Participe de uma pesquisa de mercado",
            reward: 12.00,
            points: 120,
            icon: "fas fa-chart-line",
            completed: false,
            timeRequired: "7 min"
        },
        {
            id: 5,
            title: "Avaliação de Site",
            description: "Navegue e avalie um website",
            reward: 15.50,
            points: 155,
            icon: "fas fa-globe",
            completed: false,
            timeRequired: "4 min"
        },
        {
            id: 6,
            title: "Pesquisa de Opinião",
            description: "Compartilhe sua opinião sobre um tópico",
            reward: 20.00,
            points: 200,
            icon: "fas fa-comments",
            completed: false,
            timeRequired: "6 min"
        }
    ];

    // Initialize achievements data
    achievements = [
        {
            id: 1,
            title: "Primeiro Saque",
            description: "Faça seu primeiro saque",
            reward: 5.00,
            icon: "fas fa-trophy",
            unlocked: false,
            requirement: 1
        },
        {
            id: 2,
            title: "Ganhador Frequente",
            description: "Complete 10 missões",
            reward: 25.00,
            icon: "fas fa-star",
            unlocked: false,
            requirement: 10
        },
        {
            id: 3,
            title: "Mestre das Pesquisas",
            description: "Complete 50 missões",
            reward: 100.00,
            icon: "fas fa-crown",
            unlocked: false,
            requirement: 50
        },
        {
            id: 4,
            title: "Check-in Diário",
            description: "Faça check-in por 7 dias seguidos",
            reward: 15.00,
            icon: "fas fa-calendar-check",
            unlocked: false,
            requirement: 7
        },
        {
            id: 5,
            title: "Grande Ganhador",
            description: "Acumule R$ 500 em ganhos",
            reward: 50.00,
            icon: "fas fa-gem",
            unlocked: false,
            requirement: 500
        }
    ];

    // Load withdrawals from localStorage
    const savedWithdrawals = localStorage.getItem('superSurveysWithdrawals');
    if (savedWithdrawals) {
        withdrawals = JSON.parse(savedWithdrawals);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Login/Register modals
    document.getElementById('loginBtn').addEventListener('click', showLoginModal);
    document.getElementById('closeLoginModal').addEventListener('click', hideLoginModal);
    document.getElementById('closeRegisterModal').addEventListener('click', hideRegisterModal);
    document.getElementById('showRegisterModal').addEventListener('click', showRegisterModal);
    document.getElementById('showLoginModal').addEventListener('click', showLoginModal);

    // Forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('requestWithdrawBtn').addEventListener('click', handleWithdrawRequest);

    // Check-in
    document.getElementById('checkinBtn').addEventListener('click', handleCheckin);

    // History tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', handleTabSwitch);
    });

    // Start earning button
    document.getElementById('startEarningBtn').addEventListener('click', () => {
        if (!isLoggedIn) {
            showLoginModal();
        } else {
            document.getElementById('missions').scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Navigation handler
function handleNavigation(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    e.target.classList.add('active');
}

// Load missions
function loadMissions() {
    const missionsGrid = document.getElementById('missionsGrid');
    missionsGrid.innerHTML = '';

    missions.forEach(mission => {
        const missionCard = createMissionCard(mission);
        missionsGrid.appendChild(missionCard);
    });
}

// Create mission card
function createMissionCard(mission) {
    const card = document.createElement('div');
    card.className = 'mission-card';
    card.innerHTML = `
        <div class="mission-icon">
            <i class="${mission.icon}"></i>
        </div>
        <h3 class="mission-title">${mission.title}</h3>
        <p class="mission-description">${mission.description}</p>
        <div class="mission-reward">R$ ${mission.reward.toFixed(2)}</div>
        <div class="mission-points">${mission.points} pontos</div>
        <div class="mission-time">⏱️ ${mission.timeRequired}</div>
        <button class="mission-btn" onclick="startMission(${mission.id})" ${mission.completed ? 'disabled' : ''}>
            ${mission.completed ? 'Concluída' : 'Iniciar Missão'}
        </button>
    `;
    return card;
}

// Start mission
function startMission(missionId) {
    if (!isLoggedIn) {
        showLoginModal();
        return;
    }

    const mission = missions.find(m => m.id === missionId);
    if (!mission || mission.completed) return;

    // Simulate mission completion
    const missionBtn = event.target;
    missionBtn.textContent = 'Processando...';
    missionBtn.disabled = true;

    setTimeout(() => {
        completeMission(missionId);
    }, 2000);
}

// Complete mission
function completeMission(missionId) {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    mission.completed = true;
    userBalance += mission.reward;
    userPoints += mission.points;

    // Update user data
    if (currentUser) {
        currentUser.balance = userBalance;
        currentUser.points = userPoints;
        currentUser.completedMissions = (currentUser.completedMissions || 0) + 1;
        localStorage.setItem('superSurveysUser', JSON.stringify(currentUser));
    }

    // Update UI
    updateUserInterface();
    loadMissions();
    checkAchievements();

    // Show success message
    showNotification(`Missão concluída! Você ganhou R$ ${mission.reward.toFixed(2)} e ${mission.points} pontos!`, 'success');

    // Update mission button
    const missionBtn = event.target;
    missionBtn.textContent = 'Concluída';
    missionBtn.style.background = '#28a745';
}

// Load achievements
function loadAchievements() {
    const achievementsGrid = document.getElementById('achievementsGrid');
    achievementsGrid.innerHTML = '';

    achievements.forEach(achievement => {
        const achievementCard = createAchievementCard(achievement);
        achievementsGrid.appendChild(achievementCard);
    });
}

// Create achievement card
function createAchievementCard(achievement) {
    const card = document.createElement('div');
    card.className = `achievement-card ${achievement.unlocked ? 'unlocked' : ''}`;
    card.innerHTML = `
        <div class="achievement-icon">
            <i class="${achievement.icon}"></i>
        </div>
        <h3 class="achievement-title">${achievement.title}</h3>
        <p class="achievement-description">${achievement.description}</p>
        <div class="achievement-reward">+R$ ${achievement.reward.toFixed(2)}</div>
    `;
    return card;
}

// Check achievements
function checkAchievements() {
    if (!currentUser) return;

    achievements.forEach(achievement => {
        if (achievement.unlocked) return;

        let shouldUnlock = false;

        switch (achievement.id) {
            case 1: // First withdrawal
                shouldUnlock = (currentUser.totalWithdrawals || 0) > 0;
                break;
            case 2: // 10 missions
                shouldUnlock = (currentUser.completedMissions || 0) >= 10;
                break;
            case 3: // 50 missions
                shouldUnlock = (currentUser.completedMissions || 0) >= 50;
                break;
            case 4: // 7 days check-in
                shouldUnlock = (currentUser.checkinStreak || 0) >= 7;
                break;
            case 5: // R$ 500 earnings
                shouldUnlock = (currentUser.totalEarnings || 0) >= 500;
                break;
        }

        if (shouldUnlock) {
            unlockAchievement(achievement);
        }
    });
}

// Unlock achievement
function unlockAchievement(achievement) {
    achievement.unlocked = true;
    userBalance += achievement.reward;

    if (currentUser) {
        currentUser.balance = userBalance;
        currentUser.totalEarnings = (currentUser.totalEarnings || 0) + achievement.reward;
        localStorage.setItem('superSurveysUser', JSON.stringify(currentUser));
    }

    updateUserInterface();
    loadAchievements();
    showNotification(`Conquista desbloqueada: ${achievement.title}! +R$ ${achievement.reward.toFixed(2)}`, 'success');
}

// Load ranking
function loadRanking() {
    const rankingList = document.getElementById('rankingList');
    rankingList.innerHTML = '';

    // Generate sample ranking data
    const rankingData = [
        { name: 'João Silva', earnings: 1250.50, avatar: 'JS' },
        { name: 'Maria Santos', earnings: 980.75, avatar: 'MS' },
        { name: 'Pedro Costa', earnings: 875.25, avatar: 'PC' },
        { name: 'Ana Oliveira', earnings: 720.00, avatar: 'AO' },
        { name: 'Carlos Lima', earnings: 650.50, avatar: 'CL' }
    ];

    rankingData.forEach((user, index) => {
        const rankingItem = document.createElement('div');
        rankingItem.className = 'ranking-item';
        rankingItem.innerHTML = `
            <div class="ranking-position">${index + 1}º</div>
            <div class="ranking-avatar">${user.avatar}</div>
            <div class="ranking-user">
                <div class="ranking-name">${user.name}</div>
                <div class="ranking-earnings">R$ ${user.earnings.toFixed(2)}</div>
            </div>
        `;
        rankingList.appendChild(rankingItem);
    });
}

// Load check-in calendar
function loadCheckinCalendar() {
    const calendar = document.getElementById('checkinCalendar');
    calendar.innerHTML = '';

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Generate calendar days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        if (day === today.getDate()) {
            dayElement.classList.add('today');
        } else if (day < today.getDate()) {
            dayElement.classList.add('checked');
        } else {
            dayElement.classList.add('available');
        }

        dayElement.textContent = day;
        dayElement.addEventListener('click', () => handleCheckin(day));
        calendar.appendChild(dayElement);
    }
}

// Handle check-in
function handleCheckin(day) {
    if (!isLoggedIn) {
        showLoginModal();
        return;
    }

    const today = new Date();
    if (day && day !== today.getDate()) return;

    // Add check-in reward
    const checkinReward = 2.00;
    userBalance += checkinReward;
    userPoints += 20;

    if (currentUser) {
        currentUser.balance = userBalance;
        currentUser.points = userPoints;
        currentUser.checkinStreak = (currentUser.checkinStreak || 0) + 1;
        currentUser.lastCheckin = new Date().toISOString();
        localStorage.setItem('superSurveysUser', JSON.stringify(currentUser));
    }

    updateUserInterface();
    showNotification(`Check-in realizado! +R$ ${checkinReward.toFixed(2)} e 20 pontos!`, 'success');
    checkAchievements();
}

// Handle withdrawal request
function handleWithdrawRequest() {
    if (!isLoggedIn) {
        showLoginModal();
        return;
    }

    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const bank = document.getElementById('bankSelect').value;
    const pixKey = document.getElementById('pixKey').value;
    const fullName = document.getElementById('fullName').value;

    // Validation
    if (!amount || amount < 0.10 || amount > 20.00) {
        showNotification('Valor deve estar entre R$ 0,10 e R$ 20,00', 'error');
        return;
    }

    if (!bank) {
        showNotification('Selecione um banco', 'error');
        return;
    }

    if (!pixKey) {
        showNotification('Digite sua chave PIX', 'error');
        return;
    }

    if (!fullName) {
        showNotification('Digite seu nome completo', 'error');
        return;
    }

    if (amount > userBalance) {
        showNotification('Saldo insuficiente', 'error');
        return;
    }

    // Process withdrawal
    processWithdrawal(amount, bank, pixKey, fullName);
}

// Process withdrawal
function processWithdrawal(amount, bank, pixKey, fullName) {
    // Create withdrawal record
    const withdrawal = {
        id: Date.now(),
        amount: amount,
        bank: bank,
        pixKey: pixKey,
        fullName: fullName,
        status: 'processing',
        date: new Date().toISOString(),
        processingSteps: [
            { step: 'Validando dados', completed: false },
            { step: 'Processando PIX', completed: false },
            { step: 'Enviando para banco', completed: false },
            { step: 'Finalizando', completed: false }
        ]
    };

    withdrawals.push(withdrawal);
    localStorage.setItem('superSurveysWithdrawals', JSON.stringify(withdrawals));

    // Update user balance
    userBalance -= amount;
    if (currentUser) {
        currentUser.balance = userBalance;
        currentUser.totalWithdrawals = (currentUser.totalWithdrawals || 0) + amount;
        localStorage.setItem('superSurveysUser', JSON.stringify(currentUser));
    }

    updateUserInterface();
    showProcessingModal(withdrawal);
}

// Show processing modal
function showProcessingModal(withdrawal) {
    const modal = document.getElementById('processingModal');
    modal.classList.add('active');

    // Simulate processing steps
    const steps = document.querySelectorAll('.processing-steps .step');
    const statusText = document.getElementById('processingStatus');

    let currentStep = 0;
    const processInterval = setInterval(() => {
        if (currentStep < steps.length) {
            // Complete current step
            steps[currentStep].classList.add('completed');
            steps[currentStep].querySelector('i').className = 'fas fa-check';
            
            // Update status text
            const stepTexts = [
                'Validando dados do usuário...',
                'Processando transferência PIX...',
                'Enviando para o banco selecionado...',
                'Finalizando transação...'
            ];
            statusText.textContent = stepTexts[currentStep];

            currentStep++;
        } else {
            // Processing complete
            clearInterval(processInterval);
            withdrawal.status = 'completed';
            withdrawal.processingSteps.forEach(step => step.completed = true);
            
            localStorage.setItem('superSurveysWithdrawals', JSON.stringify(withdrawals));
            
            setTimeout(() => {
                modal.classList.remove('active');
                showNotification(`Saque de R$ ${withdrawal.amount.toFixed(2)} processado com sucesso!`, 'success');
                loadWithdrawalsHistory();
                checkAchievements();
            }, 2000);
        }
    }, 1500);
}

// Load withdrawals history
function loadWithdrawalsHistory() {
    const withdrawalsList = document.getElementById('withdrawalsList');
    withdrawalsList.innerHTML = '';

    if (withdrawals.length === 0) {
        withdrawalsList.innerHTML = '<p>Nenhum saque realizado ainda.</p>';
        return;
    }

    withdrawals.reverse().forEach(withdrawal => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-info">
                <div class="history-title">Saque PIX - ${getBankName(withdrawal.bank)}</div>
                <div class="history-date">${formatDate(withdrawal.date)}</div>
            </div>
            <div class="history-amount">R$ ${withdrawal.amount.toFixed(2)}</div>
            <div class="history-status ${withdrawal.status}">${getStatusText(withdrawal.status)}</div>
        `;
        withdrawalsList.appendChild(historyItem);
    });
}

// Get bank name
function getBankName(bankCode) {
    const banks = {
        'picpay': 'PicPay',
        'nubank': 'Nubank',
        'recargapay': 'Recargapay',
        'pagbank': 'PagBank',
        'infinitepay': 'InfinitePay',
        'bradesco': 'Bradesco',
        'itau': 'Itaú',
        'caixa': 'Caixa',
        'santander': 'Santander'
    };
    return banks[bankCode] || bankCode;
}

// Get status text
function getStatusText(status) {
    const statusTexts = {
        'processing': 'Processando',
        'completed': 'Concluído',
        'pending': 'Pendente',
        'failed': 'Falhou'
    };
    return statusTexts[status] || status;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Handle tab switch
function handleTabSwitch(e) {
    const tabId = e.target.getAttribute('data-tab');
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');

    // Load appropriate content
    switch (tabId) {
        case 'withdrawals':
            loadWithdrawalsHistory();
            break;
        case 'missions':
            loadMissionsHistory();
            break;
        case 'progress':
            loadProgressHistory();
            break;
    }
}

// Load missions history
function loadMissionsHistory() {
    const missionsList = document.getElementById('missionsList');
    missionsList.innerHTML = '';

    const completedMissions = missions.filter(m => m.completed);
    
    if (completedMissions.length === 0) {
        missionsList.innerHTML = '<p>Nenhuma missão concluída ainda.</p>';
        return;
    }

    completedMissions.forEach(mission => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-info">
                <div class="history-title">${mission.title}</div>
                <div class="history-date">Concluída</div>
            </div>
            <div class="history-amount">+R$ ${mission.reward.toFixed(2)}</div>
            <div class="history-status completed">Concluída</div>
        `;
        missionsList.appendChild(historyItem);
    });
}

// Load progress history
function loadProgressHistory() {
    const progressList = document.getElementById('progressList');
    progressList.innerHTML = '';

    const progressData = [
        { title: 'Primeira missão concluída', date: 'Hoje', points: 25 },
        { title: 'Check-in diário', date: 'Hoje', points: 20 },
        { title: 'Conquista desbloqueada', date: 'Ontem', points: 50 }
    ];

    progressData.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-info">
                <div class="history-title">${item.title}</div>
                <div class="history-date">${item.date}</div>
            </div>
            <div class="history-amount">+${item.points} pts</div>
            <div class="history-status completed">Concluído</div>
        `;
        progressList.appendChild(historyItem);
    });
}

// Show login modal
function showLoginModal() {
    document.getElementById('loginModal').classList.add('active');
}

// Hide login modal
function hideLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
}

// Show register modal
function showRegisterModal() {
    hideLoginModal();
    document.getElementById('registerModal').classList.add('active');
}

// Hide register modal
function hideRegisterModal() {
    document.getElementById('registerModal').classList.remove('active');
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Simple validation
    if (!email || !password) {
        showNotification('Preencha todos os campos', 'error');
        return;
    }

    // Simulate login
    currentUser = {
        id: Date.now(),
        email: email,
        name: 'Usuário',
        balance: userBalance,
        points: userPoints,
        completedMissions: 0,
        totalEarnings: 0,
        totalWithdrawals: 0,
        checkinStreak: 0
    };

    isLoggedIn = true;
    localStorage.setItem('superSurveysUser', JSON.stringify(currentUser));
    
    updateUserInterface();
    hideLoginModal();
    showNotification('Login realizado com sucesso!', 'success');
}

// Handle register
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Preencha todos os campos', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Senhas não coincidem', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Senha deve ter pelo menos 6 caracteres', 'error');
        return;
    }

    // Create user
    currentUser = {
        id: Date.now(),
        name: name,
        email: email,
        balance: 0,
        points: 0,
        completedMissions: 0,
        totalEarnings: 0,
        totalWithdrawals: 0,
        checkinStreak: 0
    };

    isLoggedIn = true;
    localStorage.setItem('superSurveysUser', JSON.stringify(currentUser));
    
    updateUserInterface();
    hideRegisterModal();
    showNotification('Conta criada com sucesso! Bem-vindo!', 'success');
}

// Update user interface
function updateUserInterface() {
    if (isLoggedIn && currentUser) {
        document.getElementById('userBalance').textContent = `R$ ${userBalance.toFixed(2)}`;
        document.getElementById('userPoints').textContent = `${userPoints} pontos`;
        document.getElementById('loginBtn').textContent = currentUser.name;
        document.getElementById('loginBtn').style.background = '#28a745';
    } else {
        document.getElementById('userBalance').textContent = 'R$ 0,00';
        document.getElementById('userPoints').textContent = '0 pontos';
        document.getElementById('loginBtn').textContent = 'Entrar';
        document.getElementById('loginBtn').style.background = '#667eea';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;

    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = '#28a745';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        case 'warning':
            notification.style.background = '#ffc107';
            notification.style.color = '#333';
            break;
        default:
            notification.style.background = '#667eea';
    }

    // Add to page
    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize history content
document.addEventListener('DOMContentLoaded', function() {
    // Load initial history content
    loadWithdrawalsHistory();
    loadMissionsHistory();
    loadProgressHistory();
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states to buttons
function addLoadingState(button, text = 'Processando...') {
    const originalText = button.textContent;
    button.textContent = text;
    button.disabled = true;
    button.classList.add('loading');
    
    return () => {
        button.textContent = originalText;
        button.disabled = false;
        button.classList.remove('loading');
    };
}

// Simulate offer wall integration
function loadOfferWalls() {
    // This would integrate with real offer wall APIs
    console.log('Loading offer walls...');
    
    // Simulate loading offers
    setTimeout(() => {
        const offerWalls = [
            { name: 'AdGate Media', minReward: 0.10, maxReward: 5.00 },
            { name: 'OfferToro', minReward: 0.25, maxReward: 8.00 },
            { name: 'CPX Research', minReward: 0.50, maxReward: 15.00 },
            { name: 'AdscendMedia', minReward: 0.15, maxReward: 12.00 }
        ];
        
        console.log('Offer walls loaded:', offerWalls);
    }, 1000);
}

// Initialize offer walls
loadOfferWalls();

// Add PIX generation system simulation
function generatePIXPayment(amount, recipientData) {
    // This would integrate with a real PIX generation system
    console.log('Generating PIX payment...', { amount, recipientData });
    
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                transactionId: 'PIX' + Date.now(),
                qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
                pixKey: '00020126580014br.gov.bcb.pix0136' + Math.random().toString(36).substr(2, 9)
            });
        }, 2000);
    });
}

// Add real-time balance updates
function updateBalanceInRealTime() {
    // This would connect to a real-time system
    setInterval(() => {
        if (isLoggedIn && currentUser) {
            // Simulate occasional balance updates from completed offers
            if (Math.random() < 0.1) { // 10% chance every interval
                const bonusAmount = Math.random() * 2; // Random bonus up to R$ 2
                userBalance += bonusAmount;
                currentUser.balance = userBalance;
                localStorage.setItem('superSurveysUser', JSON.stringify(currentUser));
                updateUserInterface();
                
                if (bonusAmount > 0.50) {
                    showNotification(`Bônus recebido: R$ ${bonusAmount.toFixed(2)}!`, 'success');
                }
            }
        }
    }, 30000); // Check every 30 seconds
}

// Start real-time updates
updateBalanceInRealTime();

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    // Ctrl + M to open missions
    if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        document.getElementById('missions').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Ctrl + W to open withdraw
    if (e.ctrlKey && e.key === 'w') {
        e.preventDefault();
        document.getElementById('withdraw').scrollIntoView({ behavior: 'smooth' });
    }
});

// Add touch gestures for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Swipe left/right detection
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
            // Swipe left - could open missions
            console.log('Swipe left detected');
        } else {
            // Swipe right - could open withdraw
            console.log('Swipe right detected');
        }
    }
    
    touchStartX = 0;
    touchStartY = 0;
});

// Add performance monitoring
function monitorPerformance() {
    // Monitor page load time
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        
        if (loadTime > 3000) {
            console.warn('Page load time is slow, consider optimization');
        }
    });
    
    // Monitor memory usage
    if (performance.memory) {
        setInterval(() => {
            const memory = performance.memory;
            const usedMB = (memory.usedJSHeapSize / 1048576).toFixed(2);
            const totalMB = (memory.totalJSHeapSize / 1048576).toFixed(2);
            
            if (usedMB > 50) {
                console.warn(`High memory usage: ${usedMB}MB / ${totalMB}MB`);
            }
        }, 30000);
    }
}

// Start performance monitoring
monitorPerformance();

console.log('Super Surveys in the World - Sistema carregado com sucesso!');
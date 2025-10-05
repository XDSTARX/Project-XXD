// Global State Management
class AppState {
    constructor() {
        this.user = null;
        this.missions = [];
        this.achievements = [];
        this.events = [];
        this.ranking = [];
        this.withdrawals = [];
        this.socket = null;
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.initializeSocket();
        this.simulateLoading();
    }

    loadFromStorage() {
        const userData = localStorage.getItem('superSurveysUser');
        if (userData) {
            this.user = JSON.parse(userData);
        }
    }

    saveToStorage() {
        if (this.user) {
            localStorage.setItem('superSurveysUser', JSON.stringify(this.user));
        }
    }

    setupEventListeners() {
        // Auth tabs
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchAuthTab(tabName);
            });
        });

        // Auth forms
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });

        // Check-in button
        document.getElementById('checkin-btn').addEventListener('click', () => {
            this.handleCheckin();
        });

        // Withdraw button
        document.getElementById('withdraw-btn').addEventListener('click', () => {
            this.handleWithdraw();
        });

        // Mission filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterMissions(filter);
            });
        });
    }

    initializeSocket() {
        this.socket = io();
        
        this.socket.on('connect', () => {
            console.log('Connected to server');
        });

        this.socket.on('mission_completed', (data) => {
            this.showNotification(`Missão concluída! +${data.reward} pontos`, 'success');
            this.updateUserStats();
        });

        this.socket.on('withdrawal_processed', (data) => {
            this.showNotification(`Saque processado! R$ ${data.amount} enviado para seu PIX`, 'success');
            this.updateWithdrawalHistory();
        });
    }

    simulateLoading() {
        setTimeout(() => {
            document.getElementById('loading-screen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loading-screen').style.display = 'none';
                if (this.user) {
                    this.showApp();
                } else {
                    this.showAuthModal();
                }
            }, 500);
        }, 3000);
    }

    switchAuthTab(tabName) {
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });

        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-form`).classList.add('active');
    }

    async handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (!email || !password) {
            this.showNotification('Preencha todos os campos', 'error');
            return;
        }

        // Simulate login
        const userData = {
            id: Date.now(),
            name: 'Usuário Demo',
            email: email,
            phone: '+5511999999999',
            balance: 0,
            points: 1000, // Start with some points for demo
            totalEarned: 0,
            missionsCompleted: 0,
            streakDays: 1,
            lastCheckin: null,
            joinDate: new Date().toISOString()
        };

        this.user = userData;
        this.saveToStorage();
        this.showApp();
        this.showNotification('Login realizado com sucesso!', 'success');
    }

    async handleRegister() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const phone = document.getElementById('register-phone').value;

        if (!name || !email || !password || !phone) {
            this.showNotification('Preencha todos os campos', 'error');
            return;
        }

        // Simulate registration
        const userData = {
            id: Date.now(),
            name: name,
            email: email,
            phone: phone,
            balance: 0,
            points: 1000, // Welcome bonus
            totalEarned: 0,
            missionsCompleted: 0,
            streakDays: 0,
            lastCheckin: null,
            joinDate: new Date().toISOString()
        };

        this.user = userData;
        this.saveToStorage();
        this.showApp();
        this.showNotification('Conta criada com sucesso! Bônus de boas-vindas: 1000 pontos!', 'success');
    }

    showAuthModal() {
        document.getElementById('auth-modal').style.display = 'flex';
    }

    hideAuthModal() {
        document.getElementById('auth-modal').style.display = 'none';
    }

    showApp() {
        this.hideAuthModal();
        document.getElementById('app').classList.remove('hidden');
        this.updateUI();
        this.loadMissions();
        this.loadAchievements();
        this.loadEvents();
        this.loadRanking();
        this.loadWithdrawalHistory();
    }

    updateUI() {
        if (!this.user) return;

        document.getElementById('user-name').textContent = this.user.name;
        document.getElementById('user-balance').textContent = `R$ ${this.user.balance.toFixed(2)}`;
        document.getElementById('user-points').textContent = `${this.user.points} pontos`;
        document.getElementById('available-balance').textContent = `R$ ${this.user.balance.toFixed(2)}`;
        document.getElementById('total-earned').textContent = `R$ ${this.user.totalEarned.toFixed(2)}`;
        document.getElementById('missions-completed').textContent = this.user.missionsCompleted;
        document.getElementById('streak-days').textContent = this.user.streakDays;
    }

    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Show section
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');
    }

    loadMissions() {
        const missions = [
            {
                id: 1,
                title: 'Assistir 5 vídeos',
                description: 'Assista 5 vídeos curtos e ganhe pontos',
                reward: 500,
                rewardMoney: 5.00,
                difficulty: 'easy',
                progress: 0,
                maxProgress: 5,
                type: 'video',
                timeEstimate: '10 min'
            },
            {
                id: 2,
                title: 'Completar 3 pesquisas',
                description: 'Responda 3 pesquisas rápidas sobre produtos',
                reward: 800,
                rewardMoney: 8.00,
                difficulty: 'easy',
                progress: 0,
                maxProgress: 3,
                type: 'survey',
                timeEstimate: '15 min'
            },
            {
                id: 3,
                title: 'Instalar e testar app',
                description: 'Instale um aplicativo e use por 5 minutos',
                reward: 1200,
                rewardMoney: 12.00,
                difficulty: 'medium',
                progress: 0,
                maxProgress: 1,
                type: 'app',
                timeEstimate: '10 min'
            },
            {
                id: 4,
                title: 'Compartilhar nas redes sociais',
                description: 'Compartilhe nossa plataforma em suas redes',
                reward: 300,
                rewardMoney: 3.00,
                difficulty: 'easy',
                progress: 0,
                maxProgress: 1,
                type: 'social',
                timeEstimate: '2 min'
            },
            {
                id: 5,
                title: 'Cadastro em site parceiro',
                description: 'Faça cadastro em site parceiro e confirme email',
                reward: 1500,
                rewardMoney: 15.00,
                difficulty: 'medium',
                progress: 0,
                maxProgress: 1,
                type: 'signup',
                timeEstimate: '5 min'
            },
            {
                id: 6,
                title: 'Jogar game por 20 min',
                description: 'Jogue um jogo mobile por 20 minutos',
                reward: 2000,
                rewardMoney: 20.00,
                difficulty: 'high',
                progress: 0,
                maxProgress: 20,
                type: 'game',
                timeEstimate: '20 min'
            }
        ];

        this.missions = missions;
        this.renderMissions();
    }

    renderMissions(filter = 'all') {
        const container = document.getElementById('missions-list');
        let filteredMissions = this.missions;

        if (filter !== 'all') {
            filteredMissions = this.missions.filter(mission => mission.difficulty === filter);
        }

        container.innerHTML = filteredMissions.map(mission => `
            <div class="mission-card" data-difficulty="${mission.difficulty}">
                <div class="mission-header">
                    <div>
                        <div class="mission-title">${mission.title}</div>
                        <div class="mission-description">${mission.description}</div>
                        <div style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">
                            <i class="fas fa-clock"></i> ${mission.timeEstimate}
                        </div>
                    </div>
                    <div class="mission-reward">R$ ${mission.rewardMoney.toFixed(2)}</div>
                </div>
                <div class="mission-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(mission.progress / mission.maxProgress) * 100}%"></div>
                    </div>
                    <div class="progress-text">${mission.progress}/${mission.maxProgress} concluído</div>
                </div>
                <button class="mission-btn" onclick="app.startMission(${mission.id})" 
                        ${mission.progress >= mission.maxProgress ? 'disabled' : ''}>
                    ${mission.progress >= mission.maxProgress ? 'Concluída' : 'Iniciar Missão'}
                </button>
            </div>
        `).join('');
    }

    filterMissions(filter) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        this.renderMissions(filter);
    }

    async startMission(missionId) {
        const mission = this.missions.find(m => m.id === missionId);
        if (!mission) return;

        this.showNotification(`Missão "${mission.title}" iniciada!`, 'info');
        
        // Simulate mission progress
        const progressInterval = setInterval(() => {
            mission.progress++;
            
            if (mission.progress >= mission.maxProgress) {
                clearInterval(progressInterval);
                this.completeMission(mission);
            }
            
            this.renderMissions();
        }, 2000); // Progress every 2 seconds for demo
    }

    completeMission(mission) {
        this.user.points += mission.reward;
        this.user.balance += mission.rewardMoney;
        this.user.totalEarned += mission.rewardMoney;
        this.user.missionsCompleted++;
        
        this.saveToStorage();
        this.updateUI();
        
        this.showNotification(
            `Missão concluída! +${mission.reward} pontos (+R$ ${mission.rewardMoney.toFixed(2)})`, 
            'success'
        );

        // Check for achievements
        this.checkAchievements();
    }

    handleCheckin() {
        const now = new Date();
        const lastCheckin = this.user.lastCheckin ? new Date(this.user.lastCheckin) : null;
        
        if (lastCheckin && this.isSameDay(now, lastCheckin)) {
            this.showNotification('Você já fez check-in hoje!', 'warning');
            return;
        }

        const checkinReward = 75; // Base reward for day 2
        this.user.points += checkinReward;
        this.user.lastCheckin = now.toISOString();
        this.user.streakDays++;
        
        this.saveToStorage();
        this.updateUI();
        
        this.showNotification(`Check-in realizado! +${checkinReward} pontos`, 'success');
        
        // Update check-in UI
        document.getElementById('checkin-btn').disabled = true;
        document.getElementById('checkin-btn').innerHTML = '<i class="fas fa-check"></i> Check-in Realizado';
    }

    isSameDay(date1, date2) {
        return date1.toDateString() === date2.toDateString();
    }

    async handleWithdraw() {
        const amount = parseFloat(document.getElementById('withdraw-amount').value);
        const bank = document.getElementById('pix-bank').value;
        const pixKey = document.getElementById('pix-key').value;
        const pixName = document.getElementById('pix-name').value;

        if (!pixKey || !pixName) {
            this.showNotification('Preencha todos os dados do PIX', 'error');
            return;
        }

        // Check points requirement (very low thresholds as requested)
        const pointsRequired = this.getPointsForAmount(amount);
        if (this.user.points < pointsRequired) {
            this.showNotification(`Você precisa de ${pointsRequired} pontos para este saque`, 'error');
            return;
        }

        if (this.user.balance < amount) {
            this.showNotification('Saldo insuficiente', 'error');
            return;
        }

        // Process withdrawal
        const withdrawal = {
            id: Date.now(),
            amount: amount,
            bank: bank,
            pixKey: pixKey,
            pixName: pixName,
            status: 'processing',
            date: new Date().toISOString(),
            estimatedTime: '2-5 minutos'
        };

        this.user.points -= pointsRequired;
        this.user.balance -= amount;
        this.withdrawals.unshift(withdrawal);
        
        this.saveToStorage();
        this.updateUI();
        this.renderWithdrawalHistory();
        
        this.showNotification(`Saque de R$ ${amount.toFixed(2)} solicitado! Processamento em andamento...`, 'success');
        
        // Simulate processing
        setTimeout(() => {
            withdrawal.status = 'completed';
            this.renderWithdrawalHistory();
            this.showNotification(`Saque concluído! R$ ${amount.toFixed(2)} enviado para seu ${bank}`, 'success');
        }, Math.random() * 30000 + 10000); // 10-40 seconds
    }

    getPointsForAmount(amount) {
        // Very low point requirements as requested
        const pointsMap = {
            0.10: 10,
            0.50: 25,
            1.00: 50,
            2.00: 75,
            5.00: 100,
            10.00: 150,
            20.00: 200
        };
        return pointsMap[amount] || Math.floor(amount * 10);
    }

    renderWithdrawalHistory() {
        const container = document.getElementById('withdrawal-list');
        
        if (this.withdrawals.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">Nenhum saque realizado ainda</p>';
            return;
        }

        container.innerHTML = this.withdrawals.map(withdrawal => `
            <div class="withdrawal-item">
                <div class="withdrawal-info">
                    <div class="withdrawal-amount">R$ ${withdrawal.amount.toFixed(2)}</div>
                    <div class="withdrawal-date">${new Date(withdrawal.date).toLocaleString('pt-BR')}</div>
                    <div style="font-size: 0.8rem; color: #666;">${withdrawal.bank} - ${withdrawal.pixKey}</div>
                </div>
                <div class="withdrawal-status status-${withdrawal.status}">
                    ${this.getStatusText(withdrawal.status)}
                </div>
            </div>
        `).join('');
    }

    getStatusText(status) {
        const statusMap = {
            pending: 'Pendente',
            processing: 'Processando',
            completed: 'Concluído',
            failed: 'Falhou'
        };
        return statusMap[status] || status;
    }

    loadWithdrawalHistory() {
        // Load from storage or initialize empty
        const stored = localStorage.getItem('superSurveysWithdrawals');
        this.withdrawals = stored ? JSON.parse(stored) : [];
        this.renderWithdrawalHistory();
    }

    loadAchievements() {
        const achievements = [
            {
                id: 1,
                title: 'Primeiro Passo',
                description: 'Complete sua primeira missão',
                icon: '🎯',
                reward: 100,
                unlocked: this.user.missionsCompleted >= 1
            },
            {
                id: 2,
                title: 'Dedicado',
                description: 'Complete 10 missões',
                icon: '⭐',
                reward: 500,
                unlocked: this.user.missionsCompleted >= 10
            },
            {
                id: 3,
                title: 'Milionário',
                description: 'Acumule 10.000 pontos',
                icon: '💎',
                reward: 1000,
                unlocked: this.user.points >= 10000
            },
            {
                id: 4,
                title: 'Fiel',
                description: 'Faça check-in por 7 dias consecutivos',
                icon: '🔥',
                reward: 750,
                unlocked: this.user.streakDays >= 7
            },
            {
                id: 5,
                title: 'Primeiro Saque',
                description: 'Realize seu primeiro saque',
                icon: '💰',
                reward: 200,
                unlocked: this.withdrawals.length > 0
            }
        ];

        this.achievements = achievements;
        this.renderAchievements();
    }

    renderAchievements() {
        const container = document.getElementById('achievements-list');
        
        container.innerHTML = this.achievements.map(achievement => `
            <div class="achievement-card ${achievement.unlocked ? 'unlocked' : ''}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-description">${achievement.description}</div>
                <div class="achievement-reward">+${achievement.reward} pontos</div>
            </div>
        `).join('');
    }

    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (!achievement.unlocked) {
                let shouldUnlock = false;
                
                switch (achievement.id) {
                    case 1:
                        shouldUnlock = this.user.missionsCompleted >= 1;
                        break;
                    case 2:
                        shouldUnlock = this.user.missionsCompleted >= 10;
                        break;
                    case 3:
                        shouldUnlock = this.user.points >= 10000;
                        break;
                    case 4:
                        shouldUnlock = this.user.streakDays >= 7;
                        break;
                    case 5:
                        shouldUnlock = this.withdrawals.length > 0;
                        break;
                }
                
                if (shouldUnlock) {
                    achievement.unlocked = true;
                    this.user.points += achievement.reward;
                    this.showNotification(`Conquista desbloqueada: ${achievement.title}! +${achievement.reward} pontos`, 'success');
                }
            }
        });
        
        this.renderAchievements();
        this.updateUI();
        this.saveToStorage();
    }

    loadEvents() {
        const events = [
            {
                id: 1,
                title: 'Fim de Semana Dourado',
                description: 'Ganhe 2x mais pontos em todas as missões durante o fim de semana!',
                rewards: ['2x Pontos', 'Bônus Especial'],
                endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
                active: true
            },
            {
                id: 2,
                title: 'Desafio dos 100 Saques',
                description: 'Seja um dos primeiros 100 usuários a sacar R$ 10,00 e ganhe bônus!',
                rewards: ['R$ 5,00 Extra', '1000 Pontos'],
                endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                active: true
            },
            {
                id: 3,
                title: 'Maratona de Missões',
                description: 'Complete 20 missões em 24 horas e ganhe mega bônus!',
                rewards: ['R$ 50,00', '5000 Pontos', 'Badge Exclusiva'],
                endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
                active: true
            }
        ];

        this.events = events;
        this.renderEvents();
    }

    renderEvents() {
        const container = document.getElementById('events-list');
        
        container.innerHTML = this.events.map(event => `
            <div class="event-card">
                <div class="event-header">
                    <div>
                        <div class="event-title">${event.title}</div>
                    </div>
                    <div class="event-timer" data-end-time="${event.endTime.toISOString()}">
                        ${this.getTimeRemaining(event.endTime)}
                    </div>
                </div>
                <div class="event-description">${event.description}</div>
                <div class="event-rewards">
                    ${event.rewards.map(reward => `<span class="event-reward">${reward}</span>`).join('')}
                </div>
                <button class="event-btn" onclick="app.joinEvent(${event.id})">
                    Participar do Evento
                </button>
            </div>
        `).join('');

        // Update timers every second
        this.updateEventTimers();
    }

    updateEventTimers() {
        setInterval(() => {
            document.querySelectorAll('.event-timer').forEach(timer => {
                const endTime = new Date(timer.dataset.endTime);
                timer.textContent = this.getTimeRemaining(endTime);
            });
        }, 1000);
    }

    getTimeRemaining(endTime) {
        const now = new Date();
        const diff = endTime - now;
        
        if (diff <= 0) return 'Encerrado';
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    }

    joinEvent(eventId) {
        this.showNotification('Você entrou no evento! Complete as missões para ganhar os prêmios.', 'success');
    }

    loadRanking() {
        // Simulate ranking data
        const ranking = [
            { position: 1, name: 'João Silva', avatar: 'https://via.placeholder.com/50', earnings: 2847.50, missions: 142 },
            { position: 2, name: 'Maria Santos', avatar: 'https://via.placeholder.com/50', earnings: 2156.30, missions: 108 },
            { position: 3, name: 'Pedro Costa', avatar: 'https://via.placeholder.com/50', earnings: 1923.80, missions: 97 },
            { position: 4, name: 'Ana Oliveira', avatar: 'https://via.placeholder.com/50', earnings: 1645.20, missions: 83 },
            { position: 5, name: 'Carlos Mendes', avatar: 'https://via.placeholder.com/50', earnings: 1234.50, missions: 62 },
            { position: 6, name: this.user?.name || 'Você', avatar: 'https://via.placeholder.com/50', earnings: this.user?.totalEarned || 0, missions: this.user?.missionsCompleted || 0 }
        ];

        this.ranking = ranking;
        this.renderRanking();
    }

    renderRanking() {
        const container = document.getElementById('ranking-list');
        
        container.innerHTML = this.ranking.map(user => `
            <div class="ranking-item">
                <div class="ranking-position ${user.position <= 3 ? `top-${user.position}` : ''}">#${user.position}</div>
                <img src="${user.avatar}" alt="${user.name}" class="ranking-avatar">
                <div class="ranking-info">
                    <div class="ranking-name">${user.name}</div>
                    <div class="ranking-stats">${user.missions} missões concluídas</div>
                </div>
                <div class="ranking-earnings">R$ ${user.earnings.toFixed(2)}</div>
            </div>
        `).join('');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        document.getElementById('notifications').appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    logout() {
        localStorage.removeItem('superSurveysUser');
        localStorage.removeItem('superSurveysWithdrawals');
        location.reload();
    }
}

// Global functions
function showSection(sectionName) {
    app.showSection(sectionName);
}

function showProfile() {
    app.showNotification('Funcionalidade em desenvolvimento', 'info');
}

function showHistory() {
    app.showSection('withdraw'); // Show withdrawal history
}

function logout() {
    app.logout();
}

// Initialize app
const app = new AppState();

// Offer Wall Integration (Simulated)
class OfferWallIntegration {
    constructor() {
        this.providers = ['AdGate', 'OfferToro', 'AdscendMedia', 'RevenueUniverse'];
        this.init();
    }

    init() {
        // Simulate offer wall integration
        this.loadOffers();
    }

    loadOffers() {
        // This would integrate with real offer wall providers
        const offers = [
            {
                id: 'offer_1',
                title: 'Download and Play Game X',
                description: 'Download, install and reach level 10',
                reward: 2500,
                provider: 'AdGate',
                category: 'mobile_game'
            },
            {
                id: 'offer_2',
                title: 'Sign up for Service Y',
                description: 'Create account and verify email',
                reward: 1800,
                provider: 'OfferToro',
                category: 'signup'
            }
        ];

        // Add offers to missions
        offers.forEach(offer => {
            app.missions.push({
                id: `offer_${offer.id}`,
                title: offer.title,
                description: offer.description,
                reward: offer.reward,
                rewardMoney: offer.reward / 100, // Convert points to money
                difficulty: 'medium',
                progress: 0,
                maxProgress: 1,
                type: 'offer',
                timeEstimate: '15 min',
                provider: offer.provider
            });
        });
    }
}

// Initialize Offer Wall
const offerWall = new OfferWallIntegration();

// Auto-save user data periodically
setInterval(() => {
    if (app.user) {
        app.saveToStorage();
    }
}, 30000); // Save every 30 seconds
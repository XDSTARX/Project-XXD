// Notification System for Super Surveys in the World
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.init();
    }

    init() {
        this.createContainer();
        this.setupEventListeners();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
            pointer-events: none;
        `;
        document.body.appendChild(this.container);
    }

    setupEventListeners() {
        // Check for new achievements every 5 seconds
        setInterval(() => {
            this.checkAchievements();
        }, 5000);

        // Check for withdrawal updates every 10 seconds
        setInterval(() => {
            this.checkWithdrawals();
        }, 10000);
    }

    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: ${this.getBackgroundColor(type)};
            color: ${this.getTextColor(type)};
            padding: 1rem 1.5rem;
            margin-bottom: 10px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            pointer-events: auto;
            position: relative;
            border-left: 4px solid ${this.getBorderColor(type)};
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="${this.getIcon(type)}" style="font-size: 1.2rem;"></i>
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">${this.getTitle(type)}</div>
                    <div style="font-size: 0.9rem; opacity: 0.9;">${message}</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    opacity: 0.7;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">&times;</button>
            </div>
        `;

        this.container.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        setTimeout(() => {
            this.remove(notification);
        }, duration);

        return notification;
    }

    remove(notification) {
        if (notification && notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }

    getBackgroundColor(type) {
        const colors = {
            success: '#d4edda',
            error: '#f8d7da',
            warning: '#fff3cd',
            info: '#d1ecf1',
            achievement: '#e2e3ff',
            withdrawal: '#d1f2eb'
        };
        return colors[type] || colors.info;
    }

    getTextColor(type) {
        const colors = {
            success: '#155724',
            error: '#721c24',
            warning: '#856404',
            info: '#0c5460',
            achievement: '#4c51bf',
            withdrawal: '#0f5132'
        };
        return colors[type] || colors.info;
    }

    getBorderColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8',
            achievement: '#667eea',
            withdrawal: '#20c997'
        };
        return colors[type] || colors.info;
    }

    getIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle',
            achievement: 'fas fa-trophy',
            withdrawal: 'fas fa-money-bill-wave'
        };
        return icons[type] || icons.info;
    }

    getTitle(type) {
        const titles = {
            success: 'Sucesso!',
            error: 'Erro!',
            warning: 'Atenção!',
            info: 'Informação',
            achievement: 'Nova Conquista!',
            withdrawal: 'Saque Atualizado!'
        };
        return titles[type] || titles.info;
    }

    checkAchievements() {
        if (!currentUser) return;

        const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        const newAchievements = achievements.filter(achievement => 
            achievement.completed && !achievement.notified
        );

        newAchievements.forEach(achievement => {
            this.show(
                `Você desbloqueou a conquista "${achievement.title}"! +${achievement.reward} pontos!`,
                'achievement',
                7000
            );
            achievement.notified = true;
        });

        if (newAchievements.length > 0) {
            localStorage.setItem('achievements', JSON.stringify(achievements));
        }
    }

    checkWithdrawals() {
        if (!currentUser) return;

        const withdrawals = JSON.parse(localStorage.getItem('withdrawals') || '[]');
        const updatedWithdrawals = withdrawals.filter(withdrawal => 
            withdrawal.status === 'completed' && !withdrawal.notified
        );

        updatedWithdrawals.forEach(withdrawal => {
            this.show(
                `Seu saque de R$ ${withdrawal.amount.toFixed(2)} foi processado com sucesso!`,
                'withdrawal',
                7000
            );
            withdrawal.notified = true;
        });

        if (updatedWithdrawals.length > 0) {
            localStorage.setItem('withdrawals', JSON.stringify(withdrawals));
        }
    }

    // Special notification methods
    showMissionComplete(missionTitle, reward, points) {
        this.show(
            `Missão "${missionTitle}" concluída! +R$ ${reward.toFixed(2)} e ${points} pontos!`,
            'success',
            6000
        );
    }

    showWithdrawalRequested(amount) {
        this.show(
            `Saque de R$ ${amount.toFixed(2)} solicitado! Processando...`,
            'info',
            5000
        );
    }

    showCheckinBonus(points, money) {
        this.show(
            `Check-in realizado! +${points} pontos e R$ ${money.toFixed(2)} de bônus!`,
            'success',
            5000
        );
    }

    showLevelUp(newLevel) {
        this.show(
            `Parabéns! Você subiu para o nível ${newLevel}!`,
            'achievement',
            7000
        );
    }

    showDailyBonus() {
        this.show(
            'Bônus diário disponível! Faça check-in para ganhar pontos extras!',
            'info',
            8000
        );
    }
}

// Initialize notification system
const notificationSystem = new NotificationSystem();

// Enhanced message function
function showMessage(message, type = 'info') {
    notificationSystem.show(message, type);
}

// Sound effects (optional)
class SoundEffects {
    constructor() {
        this.enabled = localStorage.getItem('soundEnabled') !== 'false';
        this.audioContext = null;
        this.init();
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    playTone(frequency, duration, type = 'sine') {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playSuccess() {
        this.playTone(523, 0.1); // C5
        setTimeout(() => this.playTone(659, 0.1), 100); // E5
        setTimeout(() => this.playTone(784, 0.2), 200); // G5
    }

    playError() {
        this.playTone(200, 0.3, 'sawtooth');
    }

    playAchievement() {
        this.playTone(523, 0.1); // C5
        setTimeout(() => this.playTone(659, 0.1), 100); // E5
        setTimeout(() => this.playTone(784, 0.1), 200); // G5
        setTimeout(() => this.playTone(1047, 0.3), 300); // C6
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('soundEnabled', this.enabled);
        return this.enabled;
    }
}

// Initialize sound effects
const soundEffects = new SoundEffects();

// Enhanced mission completion with sound
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

    // Show notification with sound
    notificationSystem.showMissionComplete(mission.title, mission.reward, mission.points);
    soundEffects.playSuccess();
    
    checkAchievements();
}

// Enhanced withdrawal request with sound
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
        notificationSystem.show('Valor deve estar entre R$ 0,10 e R$ 20,00', 'error');
        soundEffects.playError();
        return;
    }

    if (!bank) {
        notificationSystem.show('Selecione um banco', 'error');
        soundEffects.playError();
        return;
    }

    if (!pixKey) {
        notificationSystem.show('Digite sua chave PIX', 'error');
        soundEffects.playError();
        return;
    }

    if (!fullName) {
        notificationSystem.show('Digite seu nome completo', 'error');
        soundEffects.playError();
        return;
    }

    if (currentUser.balance < amount) {
        notificationSystem.show('Saldo insuficiente', 'error');
        soundEffects.playError();
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
        completedDate: null,
        notified: false
    };

    withdrawals.push(withdrawal);
    currentUser.balance -= amount;
    currentUser.points -= Math.floor(amount);

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('withdrawals', JSON.stringify(withdrawals));

    updateUserInterface();
    notificationSystem.showWithdrawalRequested(amount);
    soundEffects.playSuccess();

    // Simulate processing
    setTimeout(() => {
        processWithdrawal(withdrawal.id);
    }, 30000);

    // Clear form
    document.getElementById('withdrawAmount').value = '';
    document.getElementById('bankSelect').value = '';
    document.getElementById('pixKey').value = '';
    document.getElementById('fullName').value = '';
}

// Enhanced achievement check with sound
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
            achievement.notified = false; // Mark for notification
        }
    });

    if (newAchievements > 0) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('achievements', JSON.stringify(achievements));
        updateUserInterface();
        renderAchievements();
        soundEffects.playAchievement();
    }
}

// Daily bonus reminder
function showDailyBonusReminder() {
    const lastReminder = localStorage.getItem('lastBonusReminder');
    const today = new Date().toDateString();
    
    if (lastReminder !== today) {
        setTimeout(() => {
            notificationSystem.showDailyBonus();
            localStorage.setItem('lastBonusReminder', today);
        }, 10000); // Show after 10 seconds
    }
}

// Initialize daily bonus reminder
showDailyBonusReminder();
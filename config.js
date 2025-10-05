// Configuration file for Super Surveys in the World
const CONFIG = {
    // App Settings
    APP_NAME: 'Super Surveys in the World',
    VERSION: '1.0.0',
    
    // Financial Settings
    MIN_WITHDRAWAL: 0.10,
    MAX_WITHDRAWAL: 20.00,
    POINTS_TO_MONEY_RATIO: 1, // 1 ponto = R$ 1,00
    DAILY_CHECKIN_BONUS: 50, // pontos
    DAILY_CHECKIN_MONEY: 0.50, // reais
    
    // Mission Settings
    MISSION_CATEGORIES: [
        'Pesquisa',
        'Teste',
        'Review',
        'Questionário',
        'Avaliação',
        'Feedback'
    ],
    
    MISSION_DIFFICULTIES: [
        'Fácil',
        'Médio',
        'Difícil'
    ],
    
    // Supported Banks
    SUPPORTED_BANKS: [
        { id: 'picpay', name: 'PicPay', icon: '💳' },
        { id: 'nubank', name: 'Nubank', icon: '🟣' },
        { id: 'recargapay', name: 'RecargaPay', icon: '📱' },
        { id: 'pagbank', name: 'PagBank', icon: '🏦' },
        { id: 'infinitepay', name: 'InfinitePay', icon: '⚡' },
        { id: 'itau', name: 'Itaú', icon: '🔵' },
        { id: 'bradesco', name: 'Bradesco', icon: '🔴' },
        { id: 'santander', name: 'Santander', icon: '🔴' },
        { id: 'caixa', name: 'Caixa', icon: '🟡' },
        { id: 'banco_do_brasil', name: 'Banco do Brasil', icon: '🟡' }
    ],
    
    // Withdrawal Processing Times (in minutes)
    WITHDRAWAL_TIMES: {
        instant: 5,
        fast: 15,
        normal: 30,
        slow: 60
    },
    
    // Achievement Rewards
    ACHIEVEMENT_REWARDS: {
        first_mission: 100,
        earnings_50: 500,
        missions_25: 1000,
        earnings_200: 2000,
        checkin_7: 300,
        missions_100: 5000
    },
    
    // UI Settings
    ANIMATION_DURATION: 300,
    MESSAGE_DISPLAY_TIME: 5000,
    AUTO_SAVE_INTERVAL: 30000, // 30 seconds
    
    // Feature Flags
    FEATURES: {
        enableCheckin: true,
        enableAchievements: true,
        enableRanking: true,
        enableWithdrawals: true,
        enableMissions: true,
        enableNotifications: true
    },
    
    // API Endpoints (for future backend integration)
    API_ENDPOINTS: {
        base: 'https://api.supersurveys.com',
        auth: '/auth',
        missions: '/missions',
        withdrawals: '/withdrawals',
        achievements: '/achievements',
        users: '/users'
    },
    
    // Local Storage Keys
    STORAGE_KEYS: {
        currentUser: 'currentUser',
        withdrawals: 'withdrawals',
        missions: 'missions',
        achievements: 'achievements',
        checkinHistory: 'checkinHistory',
        welcomeShown: 'welcomeShown'
    },
    
    // Default User Settings
    DEFAULT_USER: {
        balance: 0,
        points: 0,
        level: 1,
        completedMissions: 0,
        totalEarnings: 0,
        checkinStreak: 0,
        joinDate: new Date().toISOString()
    },
    
    // Mission Templates
    MISSION_TEMPLATES: [
        {
            title: 'Pesquisa de Satisfação',
            description: 'Responda uma pesquisa rápida sobre produtos e serviços.',
            baseReward: 2.50,
            basePoints: 250,
            duration: '2 min',
            difficulty: 'Fácil',
            category: 'Pesquisa'
        },
        {
            title: 'Avaliação de App',
            description: 'Teste nosso novo aplicativo e nos dê sua opinião honesta.',
            baseReward: 5.00,
            basePoints: 500,
            duration: '5 min',
            difficulty: 'Fácil',
            category: 'Teste'
        },
        {
            title: 'Questionário de Hábitos',
            description: 'Compartilhe seus hábitos de consumo para ajudar em pesquisas de mercado.',
            baseReward: 8.75,
            basePoints: 875,
            duration: '8 min',
            difficulty: 'Médio',
            category: 'Pesquisa'
        },
        {
            title: 'Review de Produto',
            description: 'Escreva uma avaliação detalhada de um produto que você já usou.',
            baseReward: 12.00,
            basePoints: 1200,
            duration: '10 min',
            difficulty: 'Médio',
            category: 'Review'
        },
        {
            title: 'Pesquisa de Mercado',
            description: 'Participe de uma pesquisa abrangente sobre tendências de mercado.',
            baseReward: 15.50,
            basePoints: 1550,
            duration: '15 min',
            difficulty: 'Médio',
            category: 'Pesquisa'
        },
        {
            title: 'Teste de Usabilidade',
            description: 'Teste a usabilidade de um novo site e forneça feedback detalhado.',
            baseReward: 20.00,
            basePoints: 2000,
            duration: '20 min',
            difficulty: 'Difícil',
            category: 'Teste'
        }
    ],
    
    // Achievement Templates
    ACHIEVEMENT_TEMPLATES: [
        {
            id: 1,
            title: 'Primeira Missão',
            description: 'Complete sua primeira missão',
            icon: '🎯',
            condition: 'completedMissions > 0',
            reward: 100
        },
        {
            id: 2,
            title: 'Ganhador',
            description: 'Ganhe R$ 50,00 no total',
            icon: '💰',
            condition: 'totalEarnings >= 50',
            reward: 500
        },
        {
            id: 3,
            title: 'Veterano',
            description: 'Complete 25 missões',
            icon: '🏆',
            condition: 'completedMissions >= 25',
            reward: 1000
        },
        {
            id: 4,
            title: 'Milionário',
            description: 'Ganhe R$ 200,00 no total',
            icon: '💎',
            condition: 'totalEarnings >= 200',
            reward: 2000
        },
        {
            id: 5,
            title: 'Check-in Diário',
            description: 'Faça check-in por 7 dias seguidos',
            icon: '📅',
            condition: 'checkinStreak >= 7',
            reward: 300
        },
        {
            id: 6,
            title: 'Lenda',
            description: 'Complete 100 missões',
            icon: '👑',
            condition: 'completedMissions >= 100',
            reward: 5000
        }
    ],
    
    // Colors Theme
    COLORS: {
        primary: '#667eea',
        secondary: '#764ba2',
        success: '#28a745',
        warning: '#ffc107',
        danger: '#dc3545',
        info: '#17a2b8',
        light: '#f8f9fa',
        dark: '#343a40'
    },
    
    // Responsive Breakpoints
    BREAKPOINTS: {
        mobile: '480px',
        tablet: '768px',
        desktop: '1024px',
        large: '1200px'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
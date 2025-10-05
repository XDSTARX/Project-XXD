// Configuration file for Super Surveys in the World
const CONFIG = {
    // App Information
    APP_NAME: 'Super Surveys in the World',
    VERSION: '1.0.0',
    AUTHOR: 'Super Surveys Team',
    
    // Financial Settings
    MIN_WITHDRAWAL: 0.10,
    MAX_WITHDRAWAL: 20.00,
    WITHDRAWAL_FEE: 0.00, // Free withdrawals
    
    // Mission Settings
    MISSIONS: {
        MIN_REWARD: 0.10,
        MAX_REWARD: 20.00,
        POINTS_PER_REAL: 10, // 10 points = R$ 1.00
        TIME_LIMITS: {
            MIN: 2, // minutes
            MAX: 7  // minutes
        }
    },
    
    // Check-in Settings
    CHECKIN: {
        DAILY_REWARD: 2.00,
        DAILY_POINTS: 20,
        STREAK_BONUS: 5.00, // Bonus for 7-day streak
        STREAK_POINTS: 50
    },
    
    // Achievement Settings
    ACHIEVEMENTS: {
        FIRST_WITHDRAWAL: {
            reward: 5.00,
            points: 50,
            requirement: 1
        },
        FREQUENT_EARNER: {
            reward: 25.00,
            points: 250,
            requirement: 10
        },
        MASTER_SURVEYOR: {
            reward: 100.00,
            points: 1000,
            requirement: 50
        },
        DAILY_CHECKER: {
            reward: 15.00,
            points: 150,
            requirement: 7
        },
        BIG_WINNER: {
            reward: 50.00,
            points: 500,
            requirement: 500
        }
    },
    
    // PIX Settings
    PIX: {
        SUPPORTED_BANKS: [
            { code: 'picpay', name: 'PicPay', icon: 'fas fa-mobile-alt' },
            { code: 'nubank', name: 'Nubank', icon: 'fas fa-credit-card' },
            { code: 'recargapay', name: 'Recargapay', icon: 'fas fa-wallet' },
            { code: 'pagbank', name: 'PagBank', icon: 'fas fa-university' },
            { code: 'infinitepay', name: 'InfinitePay', icon: 'fas fa-infinity' },
            { code: 'bradesco', name: 'Bradesco', icon: 'fas fa-building' },
            { code: 'itau', name: 'Itaú', icon: 'fas fa-landmark' },
            { code: 'caixa', name: 'Caixa', icon: 'fas fa-piggy-bank' },
            { code: 'santander', name: 'Santander', icon: 'fas fa-bank' }
        ],
        PROCESSING_TIME: 5000, // 5 seconds
        PROCESSING_STEPS: [
            'Validando dados do usuário...',
            'Processando transferência PIX...',
            'Enviando para o banco selecionado...',
            'Finalizando transação...'
        ]
    },
    
    // UI Settings
    UI: {
        ANIMATION_DURATION: 300,
        NOTIFICATION_DURATION: 5000,
        LOADING_DELAY: 2000,
        THEME: {
            PRIMARY: '#667eea',
            SECONDARY: '#764ba2',
            SUCCESS: '#28a745',
            ERROR: '#dc3545',
            WARNING: '#ffc107',
            INFO: '#17a2b8'
        }
    },
    
    // Offer Wall Settings
    OFFER_WALLS: [
        {
            name: 'AdGate Media',
            minReward: 0.10,
            maxReward: 5.00,
            active: true
        },
        {
            name: 'OfferToro',
            minReward: 0.25,
            maxReward: 8.00,
            active: true
        },
        {
            name: 'CPX Research',
            minReward: 0.50,
            maxReward: 15.00,
            active: true
        },
        {
            name: 'AdscendMedia',
            minReward: 0.15,
            maxReward: 12.00,
            active: true
        }
    ],
    
    // Real-time Settings
    REALTIME: {
        BALANCE_UPDATE_INTERVAL: 30000, // 30 seconds
        BONUS_CHANCE: 0.1, // 10% chance
        MAX_BONUS: 2.00
    },
    
    // Performance Settings
    PERFORMANCE: {
        MEMORY_WARNING_THRESHOLD: 50, // MB
        LOAD_TIME_WARNING: 3000, // ms
        CACHE_DURATION: 300000 // 5 minutes
    },
    
    // Security Settings
    SECURITY: {
        MIN_PASSWORD_LENGTH: 6,
        MAX_LOGIN_ATTEMPTS: 5,
        SESSION_TIMEOUT: 3600000, // 1 hour
        ENCRYPTION_KEY: 'super_surveys_2024'
    },
    
    // Analytics Settings
    ANALYTICS: {
        TRACK_EVENTS: true,
        TRACK_PERFORMANCE: true,
        TRACK_ERRORS: true,
        SEND_ANONYMOUS_DATA: false
    },
    
    // Feature Flags
    FEATURES: {
        REAL_TIME_UPDATES: true,
        PUSH_NOTIFICATIONS: false,
        SOCIAL_SHARING: true,
        REFERRAL_SYSTEM: false,
        PREMIUM_MISSIONS: false,
        DAILY_BONUS: true,
        WEEKLY_EVENTS: true,
        MONTHLY_CHALLENGES: false
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}
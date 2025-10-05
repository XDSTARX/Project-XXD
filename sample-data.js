// Sample data for Super Surveys in the World
const SAMPLE_DATA = {
    // Sample missions with realistic data
    missions: [
        {
            id: 1,
            title: "Pesquisa de Satisfação - E-commerce",
            description: "Responda uma rápida pesquisa sobre sua experiência com compras online",
            reward: 2.50,
            points: 25,
            icon: "fas fa-shopping-cart",
            completed: false,
            timeRequired: "2 min",
            category: "E-commerce",
            difficulty: "Fácil",
            estimatedTime: 120, // seconds
            requirements: "Idade: 18-65 anos"
        },
        {
            id: 2,
            title: "Avaliação de Aplicativo Mobile",
            description: "Teste e avalie um novo aplicativo móvel de delivery",
            reward: 5.00,
            points: 50,
            icon: "fas fa-mobile-alt",
            completed: false,
            timeRequired: "3 min",
            category: "Tecnologia",
            difficulty: "Fácil",
            estimatedTime: 180,
            requirements: "Smartphone Android/iOS"
        },
        {
            id: 3,
            title: "Teste de Produto - Cosméticos",
            description: "Avalie a qualidade e embalagem de produtos de beleza",
            reward: 8.75,
            points: 87,
            icon: "fas fa-palette",
            completed: false,
            timeRequired: "5 min",
            category: "Beleza",
            difficulty: "Médio",
            estimatedTime: 300,
            requirements: "Interesse em cosméticos"
        },
        {
            id: 4,
            title: "Pesquisa de Mercado - Alimentação",
            description: "Compartilhe suas preferências alimentares e hábitos de consumo",
            reward: 12.00,
            points: 120,
            icon: "fas fa-utensils",
            completed: false,
            timeRequired: "7 min",
            category: "Alimentação",
            difficulty: "Médio",
            estimatedTime: 420,
            requirements: "Maior de 18 anos"
        },
        {
            id: 5,
            title: "Avaliação de Website - Turismo",
            description: "Navegue e avalie a usabilidade de um site de viagens",
            reward: 15.50,
            points: 155,
            icon: "fas fa-plane",
            completed: false,
            timeRequired: "4 min",
            category: "Turismo",
            difficulty: "Fácil",
            estimatedTime: 240,
            requirements: "Computador ou tablet"
        },
        {
            id: 6,
            title: "Pesquisa de Opinião - Sustentabilidade",
            description: "Compartilhe sua opinião sobre práticas sustentáveis",
            reward: 20.00,
            points: 200,
            icon: "fas fa-leaf",
            completed: false,
            timeRequired: "6 min",
            category: "Sustentabilidade",
            difficulty: "Médio",
            estimatedTime: 360,
            requirements: "Interesse em sustentabilidade"
        },
        {
            id: 7,
            title: "Teste de Interface - App Bancário",
            description: "Teste a usabilidade de um novo app bancário",
            reward: 7.25,
            points: 72,
            icon: "fas fa-university",
            completed: false,
            timeRequired: "4 min",
            category: "Financeiro",
            difficulty: "Fácil",
            estimatedTime: 240,
            requirements: "Conta bancária ativa"
        },
        {
            id: 8,
            title: "Pesquisa de Hábitos - Streaming",
            description: "Compartilhe seus hábitos de consumo de conteúdo online",
            reward: 9.50,
            points: 95,
            icon: "fas fa-play-circle",
            completed: false,
            timeRequired: "5 min",
            category: "Entretenimento",
            difficulty: "Fácil",
            estimatedTime: 300,
            requirements: "Usuário de streaming"
        }
    ],

    // Sample achievements
    achievements: [
        {
            id: 1,
            title: "Primeiro Saque",
            description: "Faça seu primeiro saque e ganhe um bônus especial",
            reward: 5.00,
            points: 50,
            icon: "fas fa-trophy",
            unlocked: false,
            requirement: 1,
            category: "Financeiro"
        },
        {
            id: 2,
            title: "Ganhador Frequente",
            description: "Complete 10 missões e prove sua dedicação",
            reward: 25.00,
            points: 250,
            icon: "fas fa-star",
            unlocked: false,
            requirement: 10,
            category: "Missões"
        },
        {
            id: 3,
            title: "Mestre das Pesquisas",
            description: "Complete 50 missões e torne-se um especialista",
            reward: 100.00,
            points: 1000,
            icon: "fas fa-crown",
            unlocked: false,
            requirement: 50,
            category: "Missões"
        },
        {
            id: 4,
            title: "Check-in Diário",
            description: "Faça check-in por 7 dias seguidos",
            reward: 15.00,
            points: 150,
            icon: "fas fa-calendar-check",
            unlocked: false,
            requirement: 7,
            category: "Frequência"
        },
        {
            id: 5,
            title: "Grande Ganhador",
            description: "Acumule R$ 500 em ganhos totais",
            reward: 50.00,
            points: 500,
            icon: "fas fa-gem",
            unlocked: false,
            requirement: 500,
            category: "Financeiro"
        },
        {
            id: 6,
            title: "Especialista em E-commerce",
            description: "Complete 5 missões de e-commerce",
            reward: 12.50,
            points: 125,
            icon: "fas fa-shopping-bag",
            unlocked: false,
            requirement: 5,
            category: "Categoria"
        },
        {
            id: 7,
            title: "Tech Lover",
            description: "Complete 3 missões de tecnologia",
            reward: 8.00,
            points: 80,
            icon: "fas fa-laptop-code",
            unlocked: false,
            requirement: 3,
            category: "Categoria"
        },
        {
            id: 8,
            title: "Saque Rápido",
            description: "Faça 5 saques em um dia",
            reward: 20.00,
            points: 200,
            icon: "fas fa-bolt",
            unlocked: false,
            requirement: 5,
            category: "Velocidade"
        }
    ],

    // Sample ranking data
    ranking: [
        { name: 'João Silva', earnings: 1250.50, avatar: 'JS', level: 'Diamante' },
        { name: 'Maria Santos', earnings: 980.75, avatar: 'MS', level: 'Ouro' },
        { name: 'Pedro Costa', earnings: 875.25, avatar: 'PC', level: 'Ouro' },
        { name: 'Ana Oliveira', earnings: 720.00, avatar: 'AO', level: 'Prata' },
        { name: 'Carlos Lima', earnings: 650.50, avatar: 'CL', level: 'Prata' },
        { name: 'Fernanda Rocha', earnings: 580.25, avatar: 'FR', level: 'Prata' },
        { name: 'Rafael Alves', earnings: 520.75, avatar: 'RA', level: 'Bronze' },
        { name: 'Juliana Pereira', earnings: 480.00, avatar: 'JP', level: 'Bronze' },
        { name: 'Lucas Mendes', earnings: 420.50, avatar: 'LM', level: 'Bronze' },
        { name: 'Camila Souza', earnings: 380.25, avatar: 'CS', level: 'Bronze' }
    ],

    // Sample withdrawal history
    withdrawals: [
        {
            id: 1,
            amount: 15.50,
            bank: 'nubank',
            status: 'completed',
            date: '2024-01-15T10:30:00Z',
            pixKey: '11999999999',
            fullName: 'João Silva'
        },
        {
            id: 2,
            amount: 8.75,
            bank: 'picpay',
            status: 'completed',
            date: '2024-01-14T15:45:00Z',
            pixKey: 'joao@email.com',
            fullName: 'João Silva'
        },
        {
            id: 3,
            amount: 25.00,
            bank: 'pagbank',
            status: 'processing',
            date: '2024-01-16T09:15:00Z',
            pixKey: '12345678901',
            fullName: 'João Silva'
        }
    ],

    // Sample mission history
    missionHistory: [
        {
            id: 1,
            title: 'Pesquisa de Satisfação - E-commerce',
            reward: 2.50,
            points: 25,
            completedAt: '2024-01-16T08:30:00Z',
            status: 'completed'
        },
        {
            id: 2,
            title: 'Avaliação de Aplicativo Mobile',
            reward: 5.00,
            points: 50,
            completedAt: '2024-01-15T14:20:00Z',
            status: 'completed'
        },
        {
            id: 3,
            title: 'Teste de Produto - Cosméticos',
            reward: 8.75,
            points: 87,
            completedAt: '2024-01-14T16:45:00Z',
            status: 'completed'
        }
    ],

    // Sample progress history
    progressHistory: [
        {
            title: 'Primeira missão concluída',
            description: 'Você completou sua primeira missão!',
            points: 25,
            date: '2024-01-16T08:30:00Z',
            type: 'mission'
        },
        {
            title: 'Check-in diário',
            description: 'Bônus por fazer check-in hoje',
            points: 20,
            date: '2024-01-16T00:00:00Z',
            type: 'checkin'
        },
        {
            title: 'Conquista desbloqueada',
            description: 'Primeiro Saque - R$ 5,00 de bônus!',
            points: 50,
            date: '2024-01-15T10:30:00Z',
            type: 'achievement'
        },
        {
            title: 'Saque processado',
            description: 'R$ 15,50 transferido para sua conta',
            points: 0,
            date: '2024-01-15T10:35:00Z',
            type: 'withdrawal'
        }
    ],

    // Sample events
    events: [
        {
            id: 1,
            title: 'Semana de Bônus Duplo',
            description: 'Ganhe o dobro de pontos em todas as missões',
            startDate: '2024-01-20',
            endDate: '2024-01-27',
            active: false,
            bonusMultiplier: 2
        },
        {
            id: 2,
            title: 'Missões Especiais de Fim de Semana',
            description: 'Missões exclusivas com recompensas maiores',
            startDate: '2024-01-20',
            endDate: '2024-01-21',
            active: true,
            bonusMultiplier: 1.5
        },
        {
            id: 3,
            title: 'Desafio Mensal',
            description: 'Complete 30 missões e ganhe R$ 100 de bônus',
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            active: true,
            bonusReward: 100.00
        }
    ],

    // Sample user profiles
    userProfiles: [
        {
            id: 1,
            name: 'João Silva',
            email: 'joao@email.com',
            level: 'Diamante',
            totalEarnings: 1250.50,
            completedMissions: 45,
            checkinStreak: 12,
            joinDate: '2023-12-01',
            avatar: 'JS'
        },
        {
            id: 2,
            name: 'Maria Santos',
            email: 'maria@email.com',
            level: 'Ouro',
            totalEarnings: 980.75,
            completedMissions: 38,
            checkinStreak: 8,
            joinDate: '2023-12-15',
            avatar: 'MS'
        }
    ],

    // Sample notifications
    notifications: [
        {
            id: 1,
            title: 'Missão Concluída!',
            message: 'Você ganhou R$ 5,00 e 50 pontos!',
            type: 'success',
            read: false,
            date: '2024-01-16T08:30:00Z'
        },
        {
            id: 2,
            title: 'Saque Processado',
            message: 'R$ 15,50 foi transferido para sua conta',
            type: 'info',
            read: false,
            date: '2024-01-15T10:35:00Z'
        },
        {
            id: 3,
            title: 'Conquista Desbloqueada',
            message: 'Primeiro Saque - R$ 5,00 de bônus!',
            type: 'achievement',
            read: true,
            date: '2024-01-15T10:30:00Z'
        }
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SAMPLE_DATA;
} else {
    window.SAMPLE_DATA = SAMPLE_DATA;
}
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(helmet({
    contentSecurityPolicy: false // Disable for development
}));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Database setup
const db = new sqlite3.Database(':memory:'); // Use file database in production

// Initialize database tables
db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password_hash TEXT NOT NULL,
        balance REAL DEFAULT 0,
        points INTEGER DEFAULT 0,
        total_earned REAL DEFAULT 0,
        missions_completed INTEGER DEFAULT 0,
        streak_days INTEGER DEFAULT 0,
        last_checkin TEXT,
        join_date TEXT DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1
    )`);

    // Missions table
    db.run(`CREATE TABLE missions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        reward_points INTEGER NOT NULL,
        reward_money REAL NOT NULL,
        difficulty TEXT DEFAULT 'easy',
        category TEXT,
        time_estimate TEXT,
        max_completions INTEGER DEFAULT 1,
        is_active BOOLEAN DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);

    // User missions progress table
    db.run(`CREATE TABLE user_missions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        mission_id INTEGER,
        progress INTEGER DEFAULT 0,
        max_progress INTEGER DEFAULT 1,
        completed BOOLEAN DEFAULT 0,
        completed_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (mission_id) REFERENCES missions (id)
    )`);

    // Withdrawals table
    db.run(`CREATE TABLE withdrawals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        amount REAL NOT NULL,
        bank TEXT NOT NULL,
        pix_key TEXT NOT NULL,
        pix_name TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        transaction_id TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        processed_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Achievements table
    db.run(`CREATE TABLE achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        reward_points INTEGER DEFAULT 0,
        condition_type TEXT NOT NULL,
        condition_value INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT 1
    )`);

    // User achievements table
    db.run(`CREATE TABLE user_achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        achievement_id INTEGER,
        unlocked_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (achievement_id) REFERENCES achievements (id)
    )`);

    // Events table
    db.run(`CREATE TABLE events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        rewards TEXT, -- JSON array
        start_date TEXT,
        end_date TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insert default missions
    const defaultMissions = [
        {
            title: 'Assistir 5 vídeos',
            description: 'Assista 5 vídeos curtos e ganhe pontos',
            reward_points: 500,
            reward_money: 5.00,
            difficulty: 'easy',
            category: 'video',
            time_estimate: '10 min'
        },
        {
            title: 'Completar 3 pesquisas',
            description: 'Responda 3 pesquisas rápidas sobre produtos',
            reward_points: 800,
            reward_money: 8.00,
            difficulty: 'easy',
            category: 'survey',
            time_estimate: '15 min'
        },
        {
            title: 'Instalar e testar app',
            description: 'Instale um aplicativo e use por 5 minutos',
            reward_points: 1200,
            reward_money: 12.00,
            difficulty: 'medium',
            category: 'app',
            time_estimate: '10 min'
        },
        {
            title: 'Compartilhar nas redes sociais',
            description: 'Compartilhe nossa plataforma em suas redes',
            reward_points: 300,
            reward_money: 3.00,
            difficulty: 'easy',
            category: 'social',
            time_estimate: '2 min'
        },
        {
            title: 'Cadastro em site parceiro',
            description: 'Faça cadastro em site parceiro e confirme email',
            reward_points: 1500,
            reward_money: 15.00,
            difficulty: 'medium',
            category: 'signup',
            time_estimate: '5 min'
        },
        {
            title: 'Jogar game por 20 min',
            description: 'Jogue um jogo mobile por 20 minutos',
            reward_points: 2000,
            reward_money: 20.00,
            difficulty: 'high',
            category: 'game',
            time_estimate: '20 min'
        }
    ];

    defaultMissions.forEach(mission => {
        db.run(`INSERT INTO missions (title, description, reward_points, reward_money, difficulty, category, time_estimate)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [mission.title, mission.description, mission.reward_points, mission.reward_money, 
                 mission.difficulty, mission.category, mission.time_estimate]);
    });

    // Insert default achievements
    const defaultAchievements = [
        {
            title: 'Primeiro Passo',
            description: 'Complete sua primeira missão',
            icon: '🎯',
            reward_points: 100,
            condition_type: 'missions_completed',
            condition_value: 1
        },
        {
            title: 'Dedicado',
            description: 'Complete 10 missões',
            icon: '⭐',
            reward_points: 500,
            condition_type: 'missions_completed',
            condition_value: 10
        },
        {
            title: 'Milionário',
            description: 'Acumule 10.000 pontos',
            icon: '💎',
            reward_points: 1000,
            condition_type: 'points',
            condition_value: 10000
        },
        {
            title: 'Fiel',
            description: 'Faça check-in por 7 dias consecutivos',
            icon: '🔥',
            reward_points: 750,
            condition_type: 'streak_days',
            condition_value: 7
        },
        {
            title: 'Primeiro Saque',
            description: 'Realize seu primeiro saque',
            icon: '💰',
            reward_points: 200,
            condition_type: 'withdrawals',
            condition_value: 1
        }
    ];

    defaultAchievements.forEach(achievement => {
        db.run(`INSERT INTO achievements (title, description, icon, reward_points, condition_type, condition_value)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [achievement.title, achievement.description, achievement.icon, achievement.reward_points,
                 achievement.condition_type, achievement.condition_value]);
    });

    // Insert sample events
    const sampleEvents = [
        {
            title: 'Fim de Semana Dourado',
            description: 'Ganhe 2x mais pontos em todas as missões durante o fim de semana!',
            rewards: JSON.stringify(['2x Pontos', 'Bônus Especial']),
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            title: 'Desafio dos 100 Saques',
            description: 'Seja um dos primeiros 100 usuários a sacar R$ 10,00 e ganhe bônus!',
            rewards: JSON.stringify(['R$ 5,00 Extra', '1000 Pontos']),
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];

    sampleEvents.forEach(event => {
        db.run(`INSERT INTO events (title, description, rewards, start_date, end_date)
                VALUES (?, ?, ?, ?, ?)`,
                [event.title, event.description, event.rewards, event.start_date, event.end_date]);
    });
});

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'super_surveys_secret_key_2024';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// PIX Payment Integration (Simulated)
class PIXPaymentProcessor {
    constructor() {
        this.apiKey = process.env.PIX_API_KEY || 'demo_key';
        this.baseUrl = 'https://api.pixpayment.com'; // Simulated endpoint
    }

    async processWithdrawal(withdrawalData) {
        try {
            // In a real implementation, this would call the actual PIX API
            // For demo purposes, we'll simulate the process
            
            console.log('Processing PIX withdrawal:', withdrawalData);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Simulate success/failure (95% success rate)
            const success = Math.random() > 0.05;
            
            if (success) {
                return {
                    success: true,
                    transactionId: `PIX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    status: 'completed',
                    message: 'PIX enviado com sucesso'
                };
            } else {
                return {
                    success: false,
                    status: 'failed',
                    message: 'Erro no processamento do PIX'
                };
            }
        } catch (error) {
            console.error('PIX processing error:', error);
            return {
                success: false,
                status: 'failed',
                message: 'Erro interno no processamento'
            };
        }
    }

    async validatePixKey(pixKey, bank) {
        // Simulate PIX key validation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Basic validation (in real implementation, this would validate with the bank)
        const isValid = pixKey.length > 5 && (
            pixKey.includes('@') || // Email
            /^\d{11}$/.test(pixKey) || // CPF
            /^\d{10,11}$/.test(pixKey) || // Phone
            /^[a-f0-9-]{36}$/.test(pixKey) // Random key
        );
        
        return {
            valid: isValid,
            bank: bank,
            message: isValid ? 'Chave PIX válida' : 'Chave PIX inválida'
        };
    }
}

const pixProcessor = new PIXPaymentProcessor();

// Offer Wall Integration
class OfferWallManager {
    constructor() {
        this.providers = {
            adgate: {
                apiKey: process.env.ADGATE_API_KEY || 'demo_key',
                baseUrl: 'https://api.adgatemedia.com'
            },
            offertoro: {
                apiKey: process.env.OFFERTORO_API_KEY || 'demo_key',
                baseUrl: 'https://api.offertoro.com'
            }
        };
    }

    async getOffers(userId) {
        try {
            // In production, this would fetch from real offer wall APIs
            const simulatedOffers = [
                {
                    id: 'offer_1',
                    title: 'Download Mobile Game X',
                    description: 'Download and reach level 10',
                    reward: 2500,
                    category: 'mobile_game',
                    provider: 'AdGate',
                    url: 'https://example.com/offer1'
                },
                {
                    id: 'offer_2',
                    title: 'Sign up for Service Y',
                    description: 'Create account and verify email',
                    reward: 1800,
                    category: 'signup',
                    provider: 'OfferToro',
                    url: 'https://example.com/offer2'
                },
                {
                    id: 'offer_3',
                    title: 'Complete Survey Z',
                    description: 'Answer questions about shopping habits',
                    reward: 1200,
                    category: 'survey',
                    provider: 'AdGate',
                    url: 'https://example.com/offer3'
                }
            ];

            return simulatedOffers;
        } catch (error) {
            console.error('Error fetching offers:', error);
            return [];
        }
    }

    async trackConversion(offerId, userId) {
        try {
            // Track offer completion
            console.log(`Tracking conversion for offer ${offerId} by user ${userId}`);
            
            // In production, this would notify the offer wall provider
            return {
                success: true,
                message: 'Conversion tracked successfully'
            };
        } catch (error) {
            console.error('Error tracking conversion:', error);
            return {
                success: false,
                message: 'Failed to track conversion'
            };
        }
    }
}

const offerWallManager = new OfferWallManager();

// Routes

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// User registration
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if user already exists
        db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (row) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, 10);
            const userUuid = uuidv4();

            // Insert new user
            db.run(`INSERT INTO users (uuid, name, email, phone, password_hash, points)
                    VALUES (?, ?, ?, ?, ?, ?)`,
                    [userUuid, name, email, phone, passwordHash, 1000], // Welcome bonus
                    function(err) {
                        if (err) {
                            return res.status(500).json({ error: 'Failed to create user' });
                        }

                        // Generate JWT token
                        const token = jwt.sign(
                            { userId: this.lastID, uuid: userUuid, email: email },
                            JWT_SECRET,
                            { expiresIn: '30d' }
                        );

                        res.json({
                            success: true,
                            token: token,
                            user: {
                                id: this.lastID,
                                uuid: userUuid,
                                name: name,
                                email: email,
                                phone: phone,
                                balance: 0,
                                points: 1000,
                                totalEarned: 0,
                                missionsCompleted: 0,
                                streakDays: 0
                            }
                        });
                    });
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        db.get('SELECT * FROM users WHERE email = ? AND is_active = 1', [email], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Verify password
            const validPassword = await bcrypt.compare(password, user.password_hash);
            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, uuid: user.uuid, email: user.email },
                JWT_SECRET,
                { expiresIn: '30d' }
            );

            res.json({
                success: true,
                token: token,
                user: {
                    id: user.id,
                    uuid: user.uuid,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    balance: user.balance,
                    points: user.points,
                    totalEarned: user.total_earned,
                    missionsCompleted: user.missions_completed,
                    streakDays: user.streak_days,
                    lastCheckin: user.last_checkin
                }
            });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user profile
app.get('/api/profile', authenticateToken, (req, res) => {
    db.get('SELECT * FROM users WHERE id = ?', [req.user.userId], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            id: user.id,
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            phone: user.phone,
            balance: user.balance,
            points: user.points,
            totalEarned: user.total_earned,
            missionsCompleted: user.missions_completed,
            streakDays: user.streak_days,
            lastCheckin: user.last_checkin,
            joinDate: user.join_date
        });
    });
});

// Get available missions
app.get('/api/missions', authenticateToken, (req, res) => {
    const query = `
        SELECT m.*, 
               COALESCE(um.progress, 0) as progress,
               COALESCE(um.max_progress, 1) as max_progress,
               COALESCE(um.completed, 0) as completed
        FROM missions m
        LEFT JOIN user_missions um ON m.id = um.mission_id AND um.user_id = ?
        WHERE m.is_active = 1
        ORDER BY m.reward_money DESC
    `;

    db.all(query, [req.user.userId], (err, missions) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        res.json(missions);
    });
});

// Start a mission
app.post('/api/missions/:id/start', authenticateToken, (req, res) => {
    const missionId = req.params.id;

    // Check if mission exists and is active
    db.get('SELECT * FROM missions WHERE id = ? AND is_active = 1', [missionId], (err, mission) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!mission) {
            return res.status(404).json({ error: 'Mission not found' });
        }

        // Check if user already has this mission
        db.get('SELECT * FROM user_missions WHERE user_id = ? AND mission_id = ?', 
               [req.user.userId, missionId], (err, userMission) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (userMission && userMission.completed) {
                return res.status(400).json({ error: 'Mission already completed' });
            }

            if (!userMission) {
                // Create new user mission
                db.run(`INSERT INTO user_missions (user_id, mission_id, progress, max_progress)
                        VALUES (?, ?, 0, ?)`,
                        [req.user.userId, missionId, mission.max_completions || 1], (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to start mission' });
                    }

                    res.json({ success: true, message: 'Mission started' });
                });
            } else {
                res.json({ success: true, message: 'Mission already in progress' });
            }
        });
    });
});

// Complete a mission
app.post('/api/missions/:id/complete', authenticateToken, (req, res) => {
    const missionId = req.params.id;

    db.serialize(() => {
        db.get('SELECT * FROM missions WHERE id = ?', [missionId], (err, mission) => {
            if (err || !mission) {
                return res.status(404).json({ error: 'Mission not found' });
            }

            db.get('SELECT * FROM user_missions WHERE user_id = ? AND mission_id = ?',
                   [req.user.userId, missionId], (err, userMission) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }

                if (!userMission) {
                    return res.status(400).json({ error: 'Mission not started' });
                }

                if (userMission.completed) {
                    return res.status(400).json({ error: 'Mission already completed' });
                }

                // Mark mission as completed
                db.run(`UPDATE user_missions SET completed = 1, progress = max_progress, completed_at = ?
                        WHERE user_id = ? AND mission_id = ?`,
                        [new Date().toISOString(), req.user.userId, missionId], (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to complete mission' });
                    }

                    // Update user stats
                    db.run(`UPDATE users SET 
                            points = points + ?,
                            balance = balance + ?,
                            total_earned = total_earned + ?,
                            missions_completed = missions_completed + 1
                            WHERE id = ?`,
                            [mission.reward_points, mission.reward_money, mission.reward_money, req.user.userId], (err) => {
                        if (err) {
                            return res.status(500).json({ error: 'Failed to update user stats' });
                        }

                        // Emit socket event
                        io.emit('mission_completed', {
                            userId: req.user.userId,
                            missionId: missionId,
                            reward: mission.reward_points,
                            rewardMoney: mission.reward_money
                        });

                        res.json({
                            success: true,
                            message: 'Mission completed',
                            reward: mission.reward_points,
                            rewardMoney: mission.reward_money
                        });
                    });
                });
            });
        });
    });
});

// Daily check-in
app.post('/api/checkin', authenticateToken, (req, res) => {
    const today = new Date().toDateString();

    db.get('SELECT last_checkin FROM users WHERE id = ?', [req.user.userId], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        const lastCheckin = user.last_checkin ? new Date(user.last_checkin).toDateString() : null;

        if (lastCheckin === today) {
            return res.status(400).json({ error: 'Already checked in today' });
        }

        const checkinReward = 75; // Base reward
        const now = new Date().toISOString();

        db.run(`UPDATE users SET 
                points = points + ?,
                streak_days = streak_days + 1,
                last_checkin = ?
                WHERE id = ?`,
                [checkinReward, now, req.user.userId], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to process check-in' });
            }

            res.json({
                success: true,
                message: 'Check-in successful',
                reward: checkinReward
            });
        });
    });
});

// Request withdrawal
app.post('/api/withdraw', authenticateToken, async (req, res) => {
    try {
        const { amount, bank, pixKey, pixName } = req.body;

        if (!amount || !bank || !pixKey || !pixName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate PIX key
        const pixValidation = await pixProcessor.validatePixKey(pixKey, bank);
        if (!pixValidation.valid) {
            return res.status(400).json({ error: 'Invalid PIX key' });
        }

        // Check user balance and points
        db.get('SELECT balance, points FROM users WHERE id = ?', [req.user.userId], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (user.balance < amount) {
                return res.status(400).json({ error: 'Insufficient balance' });
            }

            // Calculate required points (very low as requested)
            const requiredPoints = Math.floor(amount * 10); // 10 points per R$ 1.00
            if (user.points < requiredPoints) {
                return res.status(400).json({ error: 'Insufficient points' });
            }

            // Create withdrawal request
            db.run(`INSERT INTO withdrawals (user_id, amount, bank, pix_key, pix_name, status)
                    VALUES (?, ?, ?, ?, ?, 'processing')`,
                    [req.user.userId, amount, bank, pixKey, pixName], async function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to create withdrawal request' });
                }

                const withdrawalId = this.lastID;

                // Update user balance and points
                db.run(`UPDATE users SET balance = balance - ?, points = points - ?
                        WHERE id = ?`,
                        [amount, requiredPoints, req.user.userId], async (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to update user balance' });
                    }

                    // Process PIX payment asynchronously
                    setTimeout(async () => {
                        const pixResult = await pixProcessor.processWithdrawal({
                            amount,
                            bank,
                            pixKey,
                            pixName,
                            withdrawalId
                        });

                        // Update withdrawal status
                        db.run(`UPDATE withdrawals SET status = ?, transaction_id = ?, processed_at = ?
                                WHERE id = ?`,
                                [pixResult.status, pixResult.transactionId, new Date().toISOString(), withdrawalId]);

                        // Emit socket event
                        io.emit('withdrawal_processed', {
                            userId: req.user.userId,
                            withdrawalId: withdrawalId,
                            amount: amount,
                            status: pixResult.status,
                            message: pixResult.message
                        });
                    }, Math.random() * 30000 + 10000); // 10-40 seconds delay

                    res.json({
                        success: true,
                        message: 'Withdrawal request created',
                        withdrawalId: withdrawalId,
                        estimatedTime: '2-5 minutes'
                    });
                });
            });
        });
    } catch (error) {
        console.error('Withdrawal error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get withdrawal history
app.get('/api/withdrawals', authenticateToken, (req, res) => {
    db.all(`SELECT * FROM withdrawals WHERE user_id = ? ORDER BY created_at DESC`,
           [req.user.userId], (err, withdrawals) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        res.json(withdrawals);
    });
});

// Get achievements
app.get('/api/achievements', authenticateToken, (req, res) => {
    const query = `
        SELECT a.*, 
               CASE WHEN ua.id IS NOT NULL THEN 1 ELSE 0 END as unlocked,
               ua.unlocked_at
        FROM achievements a
        LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
        WHERE a.is_active = 1
        ORDER BY a.id
    `;

    db.all(query, [req.user.userId], (err, achievements) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        res.json(achievements);
    });
});

// Get events
app.get('/api/events', (req, res) => {
    db.all(`SELECT * FROM events WHERE is_active = 1 AND end_date > ? ORDER BY created_at DESC`,
           [new Date().toISOString()], (err, events) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        // Parse rewards JSON
        const eventsWithParsedRewards = events.map(event => ({
            ...event,
            rewards: JSON.parse(event.rewards || '[]')
        }));

        res.json(eventsWithParsedRewards);
    });
});

// Get ranking
app.get('/api/ranking', (req, res) => {
    db.all(`SELECT name, total_earned, missions_completed 
            FROM users 
            WHERE is_active = 1 
            ORDER BY total_earned DESC 
            LIMIT 100`, (err, users) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        const ranking = users.map((user, index) => ({
            position: index + 1,
            name: user.name,
            earnings: user.total_earned,
            missions: user.missions_completed,
            avatar: 'https://via.placeholder.com/50'
        }));

        res.json(ranking);
    });
});

// Get offer wall offers
app.get('/api/offers', authenticateToken, async (req, res) => {
    try {
        const offers = await offerWallManager.getOffers(req.user.userId);
        res.json(offers);
    } catch (error) {
        console.error('Error fetching offers:', error);
        res.status(500).json({ error: 'Failed to fetch offers' });
    }
});

// Track offer completion
app.post('/api/offers/:id/complete', authenticateToken, async (req, res) => {
    try {
        const offerId = req.params.id;
        const result = await offerWallManager.trackConversion(offerId, req.user.userId);
        
        if (result.success) {
            // Award points for offer completion
            const offerReward = 1500; // Example reward
            db.run(`UPDATE users SET points = points + ? WHERE id = ?`,
                   [offerReward, req.user.userId]);
        }

        res.json(result);
    } catch (error) {
        console.error('Error tracking offer:', error);
        res.status(500).json({ error: 'Failed to track offer completion' });
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

    socket.on('join_user_room', (userId) => {
        socket.join(`user_${userId}`);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Super Surveys in the World server running on port ${PORT}`);
    console.log(`📱 Access the app at: http://localhost:${PORT}`);
    console.log(`💰 Features: PIX withdrawals, missions, achievements, events, ranking`);
    console.log(`🎯 Low withdrawal thresholds: R$ 0.10 (10 points) to R$ 20.00 (200 points)`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed.');
        }
    });
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});
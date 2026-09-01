import express, { Request, Response } from 'express';
import cors from 'cors';
import { adminDb } from './firebaseAdmin';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Server Health Check Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    system: 'Matrix Finance Express Backend Authentication API',
    firebaseDatabase: 'https://finflow-aa069-default-rtdb.firebaseio.com',
    timestamp: new Date().toISOString()
  });
});

// User Registration Endpoint: Save User ID, Password & Profile to Database
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, role = 'Admin' } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ success: false, error: 'Full name, email, and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists in database
    const usersRef = adminDb.ref('users');
    const snapshot = await usersRef.once('value');
    const existingUsers = snapshot.val() || {};

    const existingUser = Object.values(existingUsers).find((u: any) => u.email?.toLowerCase() === cleanEmail);
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'An account with this email address already exists in database.' });
    }

    // Generate User ID & Create Record
    const userId = `USR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const userData = {
      id: userId,
      name: fullName.trim(),
      email: cleanEmail,
      password: password, // Saved in database
      role,
      avatar: '',
      phone: '',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    // Save User to Firebase Database (/users/{userId})
    await adminDb.ref(`users/${userId}`).set(userData);

    // Save Login Audit Log (/logins/{timestamp})
    await adminDb.ref(`logins/${Date.now()}`).set({
      userId,
      email: cleanEmail,
      name: fullName.trim(),
      action: 'Account Registration & Login',
      timestamp: new Date().toISOString()
    });

    console.log(`✅ Backend Database: Saved new user ID [${userId}] -> ${cleanEmail}`);

    res.json({
      success: true,
      user: {
        id: userId,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: userData.avatar
      }
    });
  } catch (err: any) {
    console.error('Register API Error:', err);
    res.status(500).json({ success: false, error: err.message || 'Database registration error.' });
  }
});

// User Login Endpoint: Verify Password & User ID in Database
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Query database for user
    const usersRef = adminDb.ref('users');
    const snapshot = await usersRef.once('value');
    const usersData = snapshot.val() || {};

    const foundUser: any = Object.values(usersData).find(
      (u: any) => u.email?.toLowerCase() === cleanEmail
    );

    if (!foundUser) {
      return res.status(401).json({ success: false, error: 'Account not found in database. Please register first.' });
    }

    // Verify Password match
    if (foundUser.password !== password) {
      return res.status(401).json({ success: false, error: 'Incorrect password. Access denied.' });
    }

    // Update lastLogin timestamp in database
    const lastLogin = new Date().toISOString();
    await adminDb.ref(`users/${foundUser.id}`).update({ lastLogin });

    // Record Login Activity
    await adminDb.ref(`logins/${Date.now()}`).set({
      userId: foundUser.id,
      email: cleanEmail,
      name: foundUser.name,
      action: 'Successful Password Login',
      timestamp: lastLogin
    });

    console.log(`✅ Backend Database: Authenticated user ID [${foundUser.id}] -> ${cleanEmail}`);

    res.json({
      success: true,
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        avatar: foundUser.avatar || ''
      }
    });
  } catch (err: any) {
    console.error('Login API Error:', err);
    res.status(500).json({ success: false, error: err.message || 'Database login error.' });
  }
});

// Get All Database Users Endpoint
app.get('/api/auth/users', async (req: Request, res: Response) => {
  try {
    const snapshot = await adminDb.ref('users').once('value');
    const usersData = snapshot.val() || {};
    const userList = Object.values(usersData).map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin
    }));

    res.json({ success: true, count: userList.length, users: userList });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fetch Realtime Database Summary Stats
app.get('/api/stats', async (req: Request, res: Response) => {
  try {
    const snapshot = await adminDb.ref().once('value');
    const data = snapshot.val() || {};

    const customerCount = data.customers ? Object.keys(data.customers).length : 0;
    const loanCount = data.loans ? Object.keys(data.loans).length : 0;
    const paymentCount = data.payments ? Object.keys(data.payments).length : 0;
    const userCount = data.users ? Object.keys(data.users).length : 0;

    res.json({
      success: true,
      stats: {
        customers: customerCount,
        loans: loanCount,
        payments: paymentCount,
        users: userCount
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Express Backend Server locally if not running on Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Dedicated Matrix Finance Express Backend running on http://localhost:${PORT}`);
  });
}

export default app;

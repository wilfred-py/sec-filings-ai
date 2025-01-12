import express, { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).json({ error: 'Error registering user', details: error.message });
    }
});

// Login
interface LoginRequest {
    username: string;
    password: string;
}

// Fix empty object types and specify proper response type
const loginHandler: RequestHandler<
    Record<string, never>,  // Params
    { token?: string; error?: string },  // Response
    LoginRequest  // Request body
> = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            res.status(400).json({ error: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ error: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
        res.status(500).json({ error: 'Error logging in' });
        return;
    }
};

router.post('/login', loginHandler);

export default router;
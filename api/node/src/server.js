import express from 'express';
import cookieParser from 'cookie-parser';
import { login, logout } from './routes/login.js';
import { forgotPassword, resetPassword } from './routes/reset-password.js';
import { startSignup, verifyPhone, finishSignup } from './routes/signup.js';
import { protectedRoutes } from './routes/protected.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    const corsWhitelist = ['https://leagueforecaster.com'];
    if (process.env.LOCALDEV) {
        corsWhitelist.push(process.env.LOCALDEV);
    }
    if (corsWhitelist.includes(req.headers.origin)) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
    }
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.post('/login', login);

app.post('/forgot-password', forgotPassword);

app.post('/reset-password', resetPassword);

app.get('/logout', logout);

app.post('/start-signup', startSignup);

app.post('/verify-phone', verifyPhone); // TODO: allow users to change phone number after account has already been created

app.post('/finish-signup', finishSignup);

// app.post('/logout', (req, res) => {}); // TODO: implement logout

app.use('/a', protectedRoutes);

export { app };

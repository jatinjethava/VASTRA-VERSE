import * as bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import packageInfo from '../package.json'
import { mongooseConnection } from './config/connection';
import { router } from './routes';
import { io } from './config/socket'
import { env } from './config/env';
import { registerChatHandlers } from './services/chatSocket';

const app = express();

app.set('trust proxy', true);
app.use(
    cors({
        origin: [
            "*"
        ],
        credentials: true,
    })
);
mongooseConnection();
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

const health = (req: Request, res: Response) => {
    return res.status(200).json({
        message: `Payment Exchange Server is Running, Server health is green`,
        app: packageInfo.name,
        version: packageInfo.version,
        description: packageInfo.description,
        author: packageInfo.author,
        license: packageInfo.license
    })
}

const bad_gateway = (req: Request, res: Response) => { return res.status(502).json({ status: 502, message: "Payment Exchange Backend API Bad Gate  way" }) }

app.get('/', health);
app.get('/health', health);
app.get('/isServerUp', (req: Request, res: Response) => {
    res.send('Server is running ');
});

app.use(router);

app.all(/.*/, bad_gateway);

const server = new http.Server(app);

io.attach(server);
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error("Authentication token is required"));
        }

        const decoded = jwt.verify(
            token,
            env.JWT_TOKEN_SECRET as string
        );

        (socket as any).user = decoded;

        next();
    } catch (err) {
        next(new Error("Invalid or expired token"));
    }
});

registerChatHandlers(io);

export default server;
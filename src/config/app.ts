import * as express from 'express'
import * as morgan from 'morgan'
import * as cors from 'cors'
import * as dotenv from "dotenv";
import WelcomeRoute from '../routes/route';
const app = express()
dotenv.config();
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use("/generate", WelcomeRoute)
export default app;
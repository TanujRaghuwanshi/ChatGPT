
import {OpenAI} from "openai";
import 'dotenv/config';

const openai = new OpenAI({
    apiKey: process.env.MONGODB_URI,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export default openai
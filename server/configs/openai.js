
import {OpenAI} from "openai";

const openai = new OpenAI({
    apiKey: "AIzaSyCoN8ytUQR8TVp1zFMxePOXvz83UZu2ev0",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export default openai
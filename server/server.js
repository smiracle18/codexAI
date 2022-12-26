import express from 'express';
import * as dotenv from 'dotenv';

import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
        

dotenv.config();

const OPENAI_API_KEY =process.env.OPENAI_API_KEY || "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"

console.log(OPENAI_API_KEY)
const configuration = new Configuration({
    apiKey: OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from Codex',
    })
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        });

    } catch (error) {
        console.log("Failed to load openAI chat api.");
    }
})

app.post('/draw', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const size = req.body.size || '256x256';
        const response = await openai.createImage({
            prompt: `${prompt}`,
            n: 1,
            size: `${size}`,
          });

        res.status(200).send({
            image_url: response.data.data[0].url
        });

    } catch (error) {
        console.log("Failed to load openAI draw api.");
    }
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('Server is running on port http://localhost:' + PORT));
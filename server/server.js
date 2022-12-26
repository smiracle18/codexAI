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
        // const response = await openai.createImage({
        //     prompt: `${prompt}`,
        //     n: 1,
        //     size: `${size}`,
        //   });

        res.status(200).send({
            image_url: "https://oaidalleapiprodscus.blob.core.windows.net/private/org-oO6pGXKOfK1KY1y05t9k1JbQ/user-2LdMABpWXfsrTpZx7frpRrof/img-DTCjogL816Yda0F8kuO0pDNW.png?st=2022-12-26T16%3A27%3A13Z&se=2022-12-26T18%3A27%3A13Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2022-12-26T10%3A20%3A00Z&ske=2022-12-27T10%3A20%3A00Z&sks=b&skv=2021-08-06&sig=oVMsSx2UPrGzFQVi10eOtkLGtmg5BpZQ4S0viE2L/cA%3D"
            // response.data.data[0].url
        });

    } catch (error) {
        console.log("Failed to load openAI draw api.");
    }
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('Server is running on port http://localhost:' + PORT));
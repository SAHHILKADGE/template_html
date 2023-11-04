const express = require('express');
const bodyParser = require('body-parser');
const { SpeechClient } = require('@google-cloud/speech');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Replace with your Google Cloud credentials JSON file
const googleCloudCredentials = require('./your-credentials.json');
const speechClient = new SpeechClient({ credentials: googleCloudCredentials });

app.post('/receive-voice-input', async (req, res) => {
    const { text } = req.body;

    try {
        const [response] = await speechClient.recognize({
            config: {
                encoding: 'LINEAR16',
                sampleRateHertz: 16000,
                languageCode: 'en-US',
            },
            audio: {
                content: Buffer.from(text, 'base64'),
            },
        });

        const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');

        res.json({ transcription });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Speech recognition failed.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

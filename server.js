import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'feedbacks_db.json');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function analyzeFeedback(feedbackText) {
  const schema = {
    type: "OBJECT",
    properties: {
      category: { type: "STRING", description: "food, service, hygiene, ambiance, price, or other" },
      sentiment: { type: "STRING", description: "positive, neutral, or negative" },
      summary: { type: "STRING", description: "Short 1-sentence summary" },
      suggestion: { type: "STRING", description: "Actionable suggestion for management" }
    },
    required: ["category", "sentiment", "summary", "suggestion"]
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Analyze the following canteen feedback: "${feedbackText}"`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
      temperature: 0.2
    }
  });

  if (!response.text) throw new Error("No response");
  return JSON.parse(response.text);
}

app.post('/api/feedbacks', (req, res) => {
  try {
    const { feedbackText } = req.body;
    if (!feedbackText) {
      return res.status(400).json({ error: 'feedbackText is required' });
    }

    const feedbacks = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    
    const newFeedback = {
      id: crypto.randomUUID(),
      originalText: feedbackText,
      timestamp: Date.now(),
      analyzed: false
    };

    feedbacks.push(newFeedback);
    fs.writeFileSync(DB_FILE, JSON.stringify(feedbacks, null, 2));

    res.status(201).json({ success: true, feedback: newFeedback });
    
    // Auto-analyze in background
    analyzeFeedback(feedbackText).then((result) => {
      const currentFeedbacks = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      const index = currentFeedbacks.findIndex(f => f.id === newFeedback.id);
      if (index !== -1) {
        currentFeedbacks[index] = {
          ...currentFeedbacks[index],
          analyzed: true,
          category: result.category,
          sentiment: result.sentiment,
          summary: result.summary,
          suggestion: result.suggestion
        };
        fs.writeFileSync(DB_FILE, JSON.stringify(currentFeedbacks, null, 2));
      }
    }).catch(err => console.error("Auto-analyze failed:", err));

  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

app.post('/api/analyze-pending', async (req, res) => {
  try {
    const feedbacks = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    const unanalyzed = feedbacks.filter(f => !f.analyzed);
    
    if (unanalyzed.length === 0) {
      return res.json({ success: true, count: 0 });
    }

    let processedCount = 0;
    for (const f of unanalyzed) {
      try {
        const result = await analyzeFeedback(f.originalText);
        f.analyzed = true;
        f.category = result.category;
        f.sentiment = result.sentiment;
        f.summary = result.summary;
        f.suggestion = result.suggestion;
        processedCount++;
      } catch (err) {
        console.error("Failed to analyze feedback ID:", f.id, err);
        break; // stop on first error
      }
    }

    fs.writeFileSync(DB_FILE, JSON.stringify(feedbacks, null, 2));
    res.json({ success: true, count: processedCount });
  } catch (error) {
    console.error('Error analyzing pending:', error);
    res.status(500).json({ error: 'Failed to analyze pending feedbacks' });
  }
});

app.get('/api/feedbacks', (req, res) => {
  try {
    const feedbacks = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

app.put('/api/feedbacks/:id', (req, res) => {
  try {
    const feedbacks = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    const index = feedbacks.findIndex(f => f.id === req.params.id);
    
    if (index !== -1) {
      feedbacks[index] = { ...feedbacks[index], ...req.body };
      fs.writeFileSync(DB_FILE, JSON.stringify(feedbacks, null, 2));
      res.json(feedbacks[index]);
    } else {
      res.status(404).json({ error: 'Feedback not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update feedback' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
});

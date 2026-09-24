/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client server-side lazily
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'ResolveIQ',
    hasGeminiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY',
  });
});

// Server-side AI Chatbot for basic Q&A & Support
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      const fallbackReply = getFallbackAnswer(message);
      return res.json({ reply: fallbackReply, source: 'knowledge-base' });
    }

    // Format chat contents
    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const h of history.slice(-8)) {
        if (h.role && h.text) {
          contents.push({
            role: h.role === 'assistant' || h.role === 'model' ? 'model' : 'user',
            parts: [{ text: h.text }],
          });
        }
      }
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const systemInstruction = `You are "ResolveIQ Support Assistant", an intelligent, empathetic, and concise customer support chatbot.
Your goal is to answer basic customer questions clearly and accurately.

Key company policies and knowledge base:
1. Returns & Refunds:
   - Full refunds for failed transactions or orders not fulfilled within 30 minutes.
   - For physical goods, 14-day return window in original packaging.
   - Verified automated refunds are processed in under 2 seconds to the original payment method; standard bank processing may take 2-4 business days.
2. Orders & Tracking:
   - Orders can be cancelled instantly before dispatch from the Customer Portal or by submitting an issue in Live Resolution.
   - Real-time tracking is available in the Orders tab with courier dispatch notifications.
3. Payments:
   - Supports UPI, Credit/Debit Cards (Visa, Mastercard, RuPay), Netbanking, and Digital Wallets.
   - Security: Zero-storage of raw CVV; 256-bit TLS encryption with automated fraud anomaly detection.
4. Human Agent Assistance:
   - If a customer needs manual assistance, complex dispute mediation, or human verification, they can switch to the "Human Agent Console" tab or ask for an escalation.
5. How ResolveIQ Works:
   - ResolveIQ uses an autonomous multi-agent system (Intent, Transaction, Policy/Refund, Security, and Verification agents) to inspect backend records and resolve issues directly.

Tone: Professional, warm, concise, and helpful. Keep answers to 2-4 sentences where possible, using bullet points for steps.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.4,
        maxOutputTokens: 600,
      },
    });

    const replyText = response.text || "I am here to help. Could you clarify your question?";
    return res.json({ reply: replyText, source: 'gemini-3.8-flash' });
  } catch (error: any) {
    console.error('Chat endpoint error, using fallback:', error);
    const fallbackReply = getFallbackAnswer(req.body?.message || '');
    return res.json({ reply: fallbackReply, source: 'knowledge-base-fallback' });
  }
});

// Built-in intelligent FAQ knowledge base matcher for offline / zero-key mode
function getFallbackAnswer(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('refund') || q.includes('money back') || q.includes('return policy')) {
    return "Our refund policy ensures automated refunds within 2 seconds for failed transactions, accidental duplicate charges, or verified order errors within 30 days. For returned items, refunds reflect on your original payment method in 2–4 business days.";
  }
  if (q.includes('cancel') || q.includes('order cancellation')) {
    return "You can cancel an active order anytime before fulfillment. Simply head to the Live Resolution panel, enter your Order ID, and our autonomous agent will inspect the order state and process the cancellation immediately.";
  }
  if (q.includes('track') || q.includes('where is my order') || q.includes('status') || q.includes('delivery')) {
    return "You can check your order status directly under your Customer Profile. Enter your Order ID (like ORD-4091 or ORD-3820) in the Live Resolution tab, and the Transaction Agent will display live courier coordinates and delivery status.";
  }
  if (q.includes('human') || q.includes('agent') || q.includes('representative') || q.includes('person') || q.includes('call') || q.includes('speak')) {
    return "You can connect with our human support team anytime! Visit the 'Human Agent Console' tab in the top navigation bar, where live specialists review escalated tickets and security verifications with full customer context dossiers.";
  }
  if (q.includes('payment') || q.includes('upi') || q.includes('card') || q.includes('wallet')) {
    return "We support all major payment methods including UPI (Google Pay, PhonePe, Paytm), Credit & Debit cards (Visa, Mastercard, RuPay), Netbanking, and Instant Wallets with bank-grade 256-bit encryption.";
  }
  if (q.includes('security') || q.includes('hack') || q.includes('fraud') || q.includes('unauthorized') || q.includes('safe')) {
    return "ResolveIQ uses real-time security anomaly detection. If an unauthorized charge or suspicious device login is detected, our Security Agent immediately blocks automated disbursements and routes the incident to our fraud team for manual inspection.";
  }
  if (q.includes('how does resolveiq work') || q.includes('what is this') || q.includes('how it works') || q.includes('autonomous')) {
    return "ResolveIQ is an autonomous customer resolution engine. Instead of answering with canned scripts, it coordinates specialized AI agents (Intent, Transaction, Policy, Verification) to check database records and execute verified resolutions in under 2 seconds.";
  }
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('who are you')) {
    return "Hello! I am the ResolveIQ Support Assistant. I can answer questions about refunds, order tracking, cancellation rules, payment methods, or guide you through autonomous issue resolution. What can I help you with today?";
  }

  return "I'm here to help with any questions regarding orders, refunds, cancellations, delivery tracking, payment methods, or platform support. You can also submit an issue in the Live Resolution tab for instant automated resolution!";
}
app.post('/api/ai/intent', async (req, res) => {
  try {
    const { userInput } = req.body;
    if (!userInput) {
      return res.status(400).json({ error: 'userInput is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Return null so client falls back gracefully to internal rule-based intent agent
      return res.json({ useFallback: true });
    }

    const prompt = `Analyze this customer support message for an autonomous resolution platform:
Message: "${userInput}"

Categorize the intent, identify urgency (LOW, MEDIUM, HIGH, URGENT), sentiment (POSITIVE, NEUTRAL, NEGATIVE, FRUSTRATED), recommend the specialized agent (Intent Agent, Transaction Agent, Refund Agent, Security Agent, Account Agent, General Agent), and extract entities like amount, currency, transaction ID, order ID.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an autonomous customer support intent classifier for ResolveIQ. Return strictly valid JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: { type: Type.STRING },
            category: { type: Type.STRING },
            urgency: { type: Type.STRING },
            sentiment: { type: Type.STRING },
            recommended_agent: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            entities: {
              type: Type.OBJECT,
              properties: {
                amount: { type: Type.NUMBER },
                currency: { type: Type.STRING },
                transaction_id: { type: Type.STRING },
                order_id: { type: Type.STRING },
              },
            },
          },
          required: ['intent', 'urgency', 'sentiment', 'recommended_agent', 'confidence', 'summary'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ useFallback: false, data: parsed });
  } catch (error: any) {
    console.error('Gemini API Error, falling back to local reasoning:', error);
    return res.json({ useFallback: true, error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ResolveIQ Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

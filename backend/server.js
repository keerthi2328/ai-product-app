require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const products = JSON.parse(fs.readFileSync("./products.json", "utf-8"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// GET products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// POST ask
app.post("/api/ask", async (req, res) => {
  try {
    const { query } = req.body;

    const prompt = `
User query: ${query}

Available products:
${JSON.stringify(products)}

Return JSON only:
{
 "productIds": [],
 "summary": ""
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const text = completion.choices[0].message.content;

    res.json({ result: text });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
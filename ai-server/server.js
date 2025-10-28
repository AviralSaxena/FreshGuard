const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; 

app.post("/api/recipes/generate", async (req, res) => {
  const { ingredients, mealType, cuisine, cookingTime, complexity } = req.body;

  const prompt = `Create a simple ${complexity} ${cuisine} recipe for ${mealType}.
Use the following ingredients: ${ingredients.join(", ")}.
It should take ${cookingTime} to cook.
Provide a recipe title, ingredients list, and step-by-step instructions.`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content;
    res.json({ content });
  } catch (error) {
    console.error("OpenAI Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to generate recipe",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Node AI server running at http://0.0.0.0:${PORT}`);
});

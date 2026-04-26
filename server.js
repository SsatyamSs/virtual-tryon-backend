require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("🚀 Server is running bro!");
});
// ✅ ENV TOKEN
const REPLICATE_TOKEN = process.env.REPLICATE_TOKEN;

// CREATE PREDICTION
app.post("/tryon", async (req, res) => {
    try {
        const { personURL, clothURL, description, category } = req.body;

        console.log("Incoming request:", req.body);

        const response = await axios.post(
            "https://api.replicate.com/v1/predictions",
            {
                version: "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
                input: {
                    human_img: personURL,
                    garm_img: clothURL,
                    garment_des: description || "shirt", // 🔥 FIX
                    category: category || "upper_body"
                }
            },
            {
                headers: {
                    Authorization: `Token ${REPLICATE_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json(response.data);

    } catch (error) {
        console.log("ERROR:", error.response?.data || error);
        res.status(500).json({ error: "Prediction failed" });
    }
});

// POLL RESULT
app.get("/result", async (req, res) => {
    try {
        const { url } = req.query;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Token ${REPLICATE_TOKEN}`
            }
        });

        res.json(response.data);

    } catch (error) {
        res.status(500).json({ error: "Polling failed" });
    }
});

// ✅ PORT FIX
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`🔥 Server running on port ${PORT}`);
}); 
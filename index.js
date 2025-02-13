import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the views directory
app.set("views", path.join(__dirname, "views"));

// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve static files from the "public" directory
app.use(express.static("public"));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

const JOKE_API_BASE_URL = "https://v2.jokeapi.dev/joke";

app.get("/", async (req, res) => {
    try {
        // Render the page with a default message and no joke initially
        res.render("index.ejs", { jokes: null });
    } catch (error) {
        res.status(500).send("Error loading the page.");
    }
});

app.post("/get-joke", async (req, res) => {
    try {
        // Get the selected categories and amount from the form input
        const categories = req.body.category || ["Any"]; // Default to "Any" if no category is selected
        const amount = req.body.amount || 1; // Default to 1 if no amount is provided

        // If multiple categories are selected, join them with a comma
        const categoryParam = Array.isArray(categories) ? categories.join(",") : categories;

        // Construct the URL with the selected categories and amount
        const url = `${JOKE_API_BASE_URL}/${categoryParam}?amount=${amount}`;

        // Fetch jokes from the Joke API
        const response = await axios.get(url);
        const jokes = response.data;

        console.log(url);

        // Render the page with the fetched jokes
        res.render("index.ejs", { jokes });
    } catch (error) {
        res.status(500).send("Error fetching the joke.");
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
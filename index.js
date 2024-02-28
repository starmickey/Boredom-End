import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Get a random activity
app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    const result = response.data;
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

// Get an activity acording to parameters
app.post("/", async (req, res) => {
  const type = req.body.type;
  const participants = req.body.participants;

  try {
    const response = await axios.get("https://bored-api.appbrewery.com/filter", {
      params: { type, participants }
    });
    const results = response.data;
    // Select a random element from the array
    const randomIndex = Math.floor(Math.random() * results.length);
    const result = results.at(randomIndex);
    // Rerender page
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    // Choose error message
    const message = error.response.status === 404?
      "No activities that match your criteria."
      : "Something went wrong, try again.";
    // Display error message
    res.render("index.ejs", {
      error: message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

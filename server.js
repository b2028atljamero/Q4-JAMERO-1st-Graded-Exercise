// Loads the express module
const express = require("express");
const hbs = require("hbs");

const bodyParser = require("body-parser");

const path = require("path");

//Creates our express server
const app = express();
const port = 3000;

//Serves static files (we need it to import a css file)
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "hbs");
app.use(bodyParser.urlencoded({ extended: true }));

//Sets a basic route

// Render the initial page with the number input form
app.get("/", (req, res) => {
  res.render("index");
});

// Create express route binder for draw.hbs and get the data from the url as parameters
// that came from index.hbs

//Makes the app listen to port 3000
app.listen(port, () => console.log(`App listening to port ${port}`));

//Routes
app.get("/happy", (req, res) => {
  res.render("happy");
});

const songWords = require("./song.json");

app.post("/happy", (req, res) => {
  const celebrant = req.body.name; // gets name of celebrant
  const guests = Object.keys(req.body) // gets the guests
    .filter(key => key.startsWith("name") && key !== "name") // gets the individual names
    .map(key => req.body[key].trim()) 
    .filter(Boolean);
  const songWordsFinal = songWords.map(word =>
    word.toLowerCase().includes("celebrant") ? word.replace(/celebrant,?/i, celebrant) : word // uses replace to have the name of the celebrant display
  );

  let totalWords = songWordsFinal.length; // counts the number of words
  while (totalWords < guests.length) { // loop that allows for the lyrics to continously display
    totalWords += songWordsFinal.length;
  }

  const songLines = [];
  for (let i = 0; i < totalWords; i++) {
    const singer = guests[i % guests.length]; // gets the index of the current singer
    const word = songWordsFinal[i % songWordsFinal.length];
    songLines.push({ singer, songline: word }); // assigns a guest to a specific guest
  }

// determine pronoun based on gender
const gender = req.body.gender;

if (gender ==="female"){
  pronoun = "she's";
} 
else if (gender === "male"){
  pronoun = "he's"; 
}

const lastLine = [
  `for ${pronoun} a jolly good fellow. for ${pronoun} a jolly good fellow. for ${pronoun} a jolly good fellow, which nobody can deny!`
];

let nextSingerIndex = songLines.length % guests.length; // determines the last singer
const singer = guests[nextSingerIndex];
for (let i = 0; i < lastLine.length; i++) {
  songLines.push({ singer, songline: lastLine[i] });
}

  res.render("happy", { songLines });
});

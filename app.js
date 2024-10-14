const port = 3000;
import express from "express";
import bodyParser from "body-parser";
import bibliotheekJSON from "./bibliotheek.json" assert { type: "json" };

const boeken = bibliotheekJSON.boeken;
var gevondenTitels = [];
var hoofdstukkenArray = [];

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.set("view engine", "ejs");

createHoofdstukkenArray();

app.get("/", function (req, res) {
  res.render("bibliotheek", {
    boeken: boeken,
    hoofdstukken: hoofdstukkenArray,
  });
});

app.get("/boek/", function (req, res) {
  const requestedTitle = req.query.boekName.toLocaleLowerCase();
  const requestedIndex = req.query.index;

  boeken.forEach(function (boek) {
    const storedTitle = boek.naam.toLowerCase();
    if (storedTitle === requestedTitle) {
      res.render("boek", { boek: boek, index: requestedIndex });
    }
  });
});

app.get("/zoek", function (req, res) {
  const query = req.query.query.toLowerCase();
  console.log(query);
  const filteredHoofdstukken = hoofdstukkenArray.filter((hoofdstuk) =>
    hoofdstuk.naam.toLowerCase().includes(query)
  );
  console.log(filteredHoofdstukken);
  res.json({ hoofdstukken: filteredHoofdstukken });
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});

function createHoofdstukkenArray() {
  bibliotheekJSON.boeken.forEach(function (boek) {
    var index = 1;
    boek.hoofdstukken.forEach(function (hoofdstuk) {
      const hoofdstukObject = {
        naam: hoofdstuk.naam,
        boekNr: boek.nummer,
        boekNaam: boek.naam,
        pagNr: index,
      };
      hoofdstukkenArray.push(hoofdstukObject);
      index += hoofdstuk.aantalPag;
    });
  });
  hoofdstukkenArray.sort((a, b) =>
    String(a.naam).localeCompare(String(b.naam))
  );
}

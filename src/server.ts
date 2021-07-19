import express from "express";
import ponyData from "../data/ponies.json";
import { seasonOneEpisodes } from "./episodes";
import { pickRandom } from "./random";

interface PonyShape {
  name: string;
  species: string;
  color: string;
  voice: string;
  element: string;
  cutie_mark: string;
}

const app = express();
const serverStartDate = new Date();
let serverHitCount = 0;
let history: string[] = [];

app.get("/", (req, res) => {
  res.send(
    "This is the default path - and it isn't very interesting, sorry. \nTry visiting localhost:4000/creation-time, localhost:4000/current-time"
  );
  history.push("/");
});

app.get("/hello-world", (req, res) => {
  res.send({
    english: "Hello world!",
    esperanto: "Saluton mondo!",
    hawaiian: "Aloha Honua",
    turkish: "Merhaba Dünya!",
  });
  history.push("/hello-world");
});

app.get("/creation-time", (req, res) => {
  res.json({
    message: `The server was started at ${serverStartDate.toTimeString()}`,
    utc: serverStartDate.toUTCString(),
    countedAsHit: false,
  });
  history.push("/creation-time");
});

app.get("/current-time", (req, res) => {
  const dateOfRequestHandling = new Date();

  res.json({
    message: `The current date is ${dateOfRequestHandling.toTimeString()}`,
    utc: dateOfRequestHandling.toUTCString(),
    countedAsHit: false,
  });
  history.push("/current-time");
});

app.get("/hits", (req, res) => {
  serverHitCount += 1;
  res.json({
    note: "We've registered your hit!",
    currentTotal: serverHitCount,
    countedAsHit: true,
  });
  history.push("/hits");
});

app.get("/hits-stealth", (req, res) => {
  res.json({
    note: "Oooh, you ninja. We didn't count that hit.",
    currentTotal: serverHitCount,
    countedAsHit: false,
  });
  history.push("/hits-stealth");
});

app.get("/ponies", (req, res) => {
  res.json({
    message: "Loaded dummy JSON data:",
    data: ponyData,
    countedAsHit: false,
  });
  history.push("/ponies");
});

app.get("/season-one", (req, res) => {
  res.json({
    countedAsHit: false,
    data: seasonOneEpisodes,
  });
  history.push("/season-one");
});

app.get("/season-one/random", (req, res) => {
  const randomEpisode = pickRandom(seasonOneEpisodes);
  res.json({
    countedAsHit: false,
    data: randomEpisode,
  });
  history.push("/season-one/random");
});

app.get("/ponies-random", (req, res) => {
  serverHitCount += 1;
  const randomPony = pickRandom(ponyData.members);
  res.json({
    currentTotal: serverHitCount,
    countedAsHit: true,
    data: randomPony,
  });
  history.push("/ponies-random");
});

app.get("/history", (req, res) => {
  res.json({
    routes: history,
  });
});

// using 4000 by convention, but could be changed
const PORT_NUMBER = 4000;

app.listen(PORT_NUMBER, () => {
  console.log(
    `If you can see this message in the console, this means that you successfully started the server! \n\nYou can see what comes back by visiting localhost:${PORT_NUMBER} in your browser. \n\nChanges will not be processed unless you restart your server (close and restart). \n\nThe server is currently listening for requests - press Ctrl + C to quit.`
  );
});

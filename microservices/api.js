//Orchestration Layer
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");

const getAllShows = () =>
  fetch(" http://localhost:3001/").then(res => res.json());
const getshow = id =>
  fetch(`http://localhost:3001/show/${id}`).then(res => res.json());
const holdSeats = (showID, count) =>
  fetch(" http://localhost:3001/hold-seats", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ count, showID })
  }).then(res => res.json());
const makeReservations = (name, count, showID) =>
  fetch(" http://localhost:3002/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, count, showID })
  }).then(res => res.json());

const app = express()
  .use(cors())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded())
  .post("/reserve", async (req, res) => {
    let count, show;
    if (!req.body.count) {
      res.status(500);
      return res.json({ error: `A ticket is required to reserve tickets` });
    }
    if (!req.body.name) {
      res.status(500);
      return res.json({ error: `A name is required to reserve tickets` });
    }
    count = parseInt(req.body.count);
    show=await getshow(req.body.showID);
    if (!show) {
      res.status(500);
      return res.json({
        error: `Cannot find show with showid ${req.body.showID}`
      });
    }
    const remainingSeats = show.houseSize - show.reserved;
    if (remainingSeats < count) {
      res.status(500);
      return res.json({
        error: `Cannot reserve ${count} seats. Only ${remainingSeats} remaining`
      });
    }

    console.log(`holding ${count} seats for ${req.body.name}`)
    await holdSeats(req.body.showID)

    console.log(`making reservation for ${req.body.name}`)
    const reservaion= await makeReservations(req.body.name,count,req.body.showID)

    res.json({success:true,showID:req.body.showID,...reservaion})

  })

  .get("/", async (req, res) => {
      console.log("requesting shows from show service")
      var shows=await getAllShows()
      res.json(shows)

  });
app.listen(3000,()=>console.log("Show ticket API running for all clients"))
const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

//Define paths
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join("__dirname", "../templates/views");
const partialsPath = path.join("__dirname", "../templates/partials");

// setup handlebars engine
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// setup static directory
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Mustafa Mufeed",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Mustafa Mufeed",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Mustafa Mufeed",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Address must be provided",
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({
          error,
        });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({
            error,
          });
        }

        res.send({
          forecast: forecastData,
          location: location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404 page",
    error: "help articles are not found!",
    name: "Mustafa Mufeed",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404 page",
    error: "Page not found",
    name: "Mustafa Mufeed",
  });
});

app.listen(3000, () => {
  console.log("Server is up on post 3000");
});

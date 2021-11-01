const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const Ders = require("./models/ders");
const uri = "mongodb://localhost:27017/NodeApp";

app.set("view engine", "ejs");
app.set("views", "htmls");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(uri, { useNewUrlParser: true, useUniFiedTopology: true })
  .then((result) => console.log("Databaseye baglandı"))
  .catch((err) => console.log("Databaseye baglanamadı " + err));

app.get("/", (req, res) => {
  res.redirect("/dersler");
});
//post

app.post("/dersler", (req, res) => {
  const ders = new Ders(req.body);
  ders
    .save()
    .then((result) => {
      res.redirect("/dersler");
    })
    .catch((err) => console.log(err));
});
app.get("/dersler", (req, res) => {
  Ders.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", { dersler: result });
    })
    .catch((err) => console.log(err));
});
app.get("/dersler/:id", (req, res) => {
  const id = req.params.id;
  Ders.findById(id)
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("detay", { ders: result });
    })
    .catch((err) => console.log(err));
});

app.delete("/dersler/:id", (req, res) => {
  const id = req.params.id;
  Ders.findByIdAndDelete(id)
    .then((result) => res.json({ redirect: "/dersler" }))
    .catch((err) => console.log(err));
});

app.get("/hakkimda", (req, res) => {
  res.render("hakkimda", { hakkimda: "Note App" });
});
app.get("/ders/ekle", (req, res) => {
  res.render("ekle");
});
app.use((req, res) => {
  res.status(404).render("404");
});
app.listen(port, () => console.log(`${port} ta çalısıyor`));

const express = require("express");
const path = require("path");
const app = express(), bodyParser = require("body-parser");
const { createProxyMiddleware } = require("http-proxy-middleware");

port = 3000;

app.use(
  "/mta-web/api",
  createProxyMiddleware({
    target: "http://localhost:8080",
    changeOrigin: true,
  })
);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  res.send(`<h1>API Running on the port ${port}</h1>`);
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});

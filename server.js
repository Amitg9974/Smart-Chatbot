const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json()); //body limit
app.use(cors());
require("dotenv").config();
const API_KEY = process.env.OPENAI_API_KEY;

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/chat", (req, res) => {
  const question = req.body.question;

  openai
    .createCompletion({
      model: "text-davinci-003",
      prompt: question,
      max_tokens: 4000,
      temperature: 0,
    })
    .then((response) => {
      console.log({ response });
      return response?.data?.choices?.[0]?.text;
    })
    .then((answer) => {
      console.log({ answer });
      const array = answer
        ?.split("\n")
        .filter((value) => value)
        .map((value) => value.trim());

      return array;
    })
    .then((answer) => {
      res.json({
        answer: answer,
        propt: question,
      });
    });
  console.log({ question });
});
const port = process.env.PORT || 3030;
const path = require("path");
const bodyParser = require("body-parser");
require("./backend/connection");

// server side
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routes
const userRouter = require("./backend/api/user.router");
app.use("/api/users", userRouter);

app.get("/api", (req, res) => {
  res.json({
    success: 1,
    message: "This is Rest API's Working",
  });
});

app.listen(port, () => {
  console.log(`server is running on: http://localhost:${port}`);
});

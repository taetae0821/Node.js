import express from "express";
import path from "path";
const { readFile } = require("fs/promises");

const app = express();
const PORT = 4400;
const PUBLIC_DIR = path.join(__dirname, "public");
const MESSAGES_FILE = path.join(__dirname, "data", "messages.json");

async function readMessages() {
  const text = await readFile(MESSAGES_FILE, "utf-8");

  return JSON.parse(text);
}

app.use(express.static(PUBLIC_DIR));

app.get("/api/messages", async (req, res, next) => {
  try {
    const messages = await readMessages();
    res.json(messages);
  } catch (error) {
    next(error);
  }
});

app.get("/api/messages/:id", async (req, res, next) => {
  try {
    const messageId = Number(req.params.id);
    const messages = await readMessages();
    const message = messages.find((item) => item.id === messageId);

    if (!message) {
      return res.status(404).json({
        message: `${messageId}번 메시지를 찾을 수 없습니다.`,
      });
    }

    res.json(message);
  } catch (error) {
    next(error);
  }
});

app.listen(PORT, () => {
  console.log(`익스프레스 fetch: http://localhost:${PORT}`);
});
import express from "express";
import { rmSync } from "fs";
const app = express();
app.get("/:file", (req, res) => {
    const file = req.params.file;
    if (!file.endsWith(".ogg") || file.includes("/")) {
        return res.status(400).json({ error: "Invalid file" });
    }
    const path = "/usr/src/app/audios/" + file;
    res.sendFile(path);
    rmSync(path);
});
app.listen(8000, () => {
    console.log("⚡ Listening on port 8000");
});

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Bot } from "grammy";
import { apiThrottler } from "@grammyjs/transformer-throttler";
import { autoRetry } from "@grammyjs/auto-retry";
import { hydrate } from "@grammyjs/hydrate";
import { I18n } from "@grammyjs/i18n";
import { hydrateReply } from "@grammyjs/parse-mode";
import { limit } from "@grammyjs/ratelimiter";
import { database } from "./middlewares/database.js";
import { statistics } from "./modules/statistics.js";
import { editOrReply } from "./middlewares/edit-or-reply.js";
import { menu } from "./modules/menu.js";
import { language } from "./modules/language.js";
import { inline } from "./modules/inline.js";
import { database as db } from "../database/database.js";
import { promises as fs } from "fs";
import dayjs from "dayjs";
import _ from "underscore";
const bot = new Bot("6048474579:AAHgFFIQqixf4TuU8vWIHdDNDURqaibyY4k");
const i18n = new I18n({
    defaultLocale: "en",
    directory: "/usr/src/app/locales",
    localeNegotiator: (ctx) => {
        return ctx.user.language;
    },
    globalTranslationContext: (ctx) => {
        return {
            mention: ctx.user.first_name,
            slow_mode: "",
            image: "<a href='https://i.imgur.com/t5z3GEu.png'>​</a>",
        };
    }
});
bot.api.config.use(apiThrottler());
bot.api.config.use(autoRetry());
bot.use(hydrateReply);
bot.use(hydrate());
bot.use(limit({
    timeFrame: 2000,
    limit: 3
}));
bot.use(database);
bot.use(editOrReply);
bot.use(i18n);
bot.use(statistics);
bot.use(language);
bot.use(inline);
bot.use(menu);
function importDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Importing files...");
        const audiosCSV = yield fs.readFile("/usr/src/app/csv/audios.csv", "utf-8");
        // const settingsCSV = await fs.readFile("/usr/src/app/csv/settings.csv", "utf-8");
        // const usersCSV = await fs.readFile("/usr/src/app/csv/tg.csv", "utf-8");
        console.log("Imported files!");
        const audios = [];
        // console.log("Reading settings...");
        //
        // for (const line of settingsCSV.split("\n")) {
        //     if (line.startsWith("account_id,")) {
        //         continue;
        //     }
        //
        //     const [account_id, name, value] = line.split(",");
        //
        //     if (name !== "language") {
        //         continue;
        //     }
        //
        //     settings.push({
        //         account_id: parseInt(account_id),
        //         name,
        //         value,
        //     });
        // }
        //
        // console.log("Read settings", settings.length);
        //
        // let amount = 0;
        //
        // for (const line of usersCSV.split("\n")) {
        //     if (line.startsWith("id,")) {
        //         continue;
        //     }
        //
        //     const [id, first_name, last_name, username, dc_id, action, last_update, creation_date, is_active] = line.split(",");
        //     let creationDate = dayjs(creation_date, {format: "YYYY-MM-DD HH:mm:ss.sss", utc: true}).toDate();
        //     let updatedAt = dayjs(last_update, {format: "YYYY-MM-DD HH:mm:ss.sss", utc: true}).toDate();
        //
        //     try {
        //         creationDate.toISOString();
        //     } catch (e) {
        //         creationDate = new Date(new Date(1970, 0, 1));
        //     }
        //
        //     try {
        //         updatedAt.toISOString();
        //     } catch (e) {
        //         updatedAt = new Date(new Date(1970, 0, 1));
        //     }
        //
        //     users.push({
        //         id: parseInt(id),
        //         first_name,
        //         last_name,
        //         username,
        //         created_at: creationDate,
        //         updated_at: updatedAt,
        //         language: "en",
        //     });
        //
        //     // const language = settings.find((setting) => setting.account_id === parseInt(id) && setting.name === "language");
        //     //
        //     // if (language) {
        //     //     users[users.length - 1].language = language.value;
        //     // }
        //
        //     amount++;
        //
        //     if (amount % 10000 === 0) {
        //         console.log("Read users", amount);
        //     }
        // }
        //
        // console.log("Read users", users.length);
        // console.log("User with invalid date", users.find((user) => user.created_at == null));
        // console.log("User with invalid date", users.find((user) => user.updated_at == null));
        let amount = 0;
        for (const line of audiosCSV.split("\n")) {
            if (line.startsWith("id,")) {
                continue;
            }
            if (line.split(",").length !== 5) {
                continue;
            }
            try {
                const [id, account_id, language, creation_date, text] = line.split(",");
                let creationDate = dayjs(creation_date, { format: "YYYY-MM-DD HH:mm:ss.sss", utc: true }).toDate();
                try {
                    creationDate.toISOString();
                }
                catch (e) {
                    creationDate = new Date(new Date(1970, 0, 1));
                }
                audios.push({
                    id: parseInt(id),
                    user_id: parseInt(account_id),
                    language,
                    created_at: creationDate,
                    length: text ? text.length : 0,
                });
            }
            catch (e) {
                console.log("Skipped line", line);
            }
            amount++;
            if (amount % 10000 === 0) {
                console.log("Read audios", amount);
            }
        }
        console.log("Read audios", audios.length);
        console.log("Audio with invalid date", audios.find((user) => user.created_at == null));
        // amount = 0;
        // for (const user of users) {
        //     try {
        //         await db.user.create({
        //             data: user,
        //         });
        //     } catch (e) {
        //         console.log("Error creating user", user);
        //     }
        //
        //     amount++;
        //
        //     if (amount % 10000 === 0) {
        //         console.log("Created users", amount);
        //     }
        // }
        // console.log("Imported users");
        amount = 0;
        delete audios[audios.length - 1];
        yield db.audio.deleteMany({
            where: {},
        });
        const chunks = _.chunk(audios, 10000);
        amount = 0;
        for (const chunk of chunks) {
            try {
                yield db.audio.createMany({
                    data: chunk,
                });
            }
            catch (e) {
                console.log("Error creating audio", chunk);
            }
            amount += chunk.length;
            console.log("Created audios", amount);
        }
        //
        // await db.audio.createMany({
        //     data: audios,
        // })
        // for (const audio of audios) {
        //     try {
        //         await db.audio.create({
        //             data: audio,
        //         });
        //     } catch (e) {
        //         console.log("Error creating audio", audio);
        //     }
        //
        //     amount++;
        //
        //     if (amount % 10000 === 0) {
        //         console.log("Created audios", amount);
        //     }
        // }
        console.log("Imported audios");
    });
}
bot.command("start", (ctx) => ctx.reply("Hello!"));
importDatabase().then(() => {
    console.log("Database imported");
});
// run(bot);

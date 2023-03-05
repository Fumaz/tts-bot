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
import { run } from "@grammyjs/runner";
import { audio } from "./modules/audio.js";
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
bot.use(audio);
run(bot);

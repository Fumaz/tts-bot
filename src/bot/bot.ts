import {Bot, Context} from "grammy";
import {apiThrottler} from "@grammyjs/transformer-throttler";
import {autoRetry} from "@grammyjs/auto-retry";
import {hydrate, HydrateFlavor} from "@grammyjs/hydrate";
import {I18n, I18nFlavor} from "@grammyjs/i18n";
import type {ParseModeFlavor} from "@grammyjs/parse-mode";
import {hydrateReply} from "@grammyjs/parse-mode";
import {limit} from "@grammyjs/ratelimiter";
import {User} from "@prisma/client";
import {database} from "./middlewares/database.js";
import {statistics} from "./modules/statistics.js";
import {editOrReply} from "./middlewares/edit-or-reply.js";
import {menu} from "./modules/menu.js";
import {language} from "./modules/language.js";
import {inline} from "./modules/inline.js";
import {run} from "@grammyjs/runner";
import {audio} from "./modules/audio.js";
import {removeAudios} from "./audios/audio.js";

type UserContext = {
    user: User;
}

type EditOrReplyContext = {
    editOrReplyWithHTML: (text: string, options: any) => Promise<any>;
}

export type TTSContext = ParseModeFlavor<HydrateFlavor<Context>> & I18nFlavor & UserContext & EditOrReplyContext;

const bot = new Bot<TTSContext>("YOUR TOKEN HERE");

const i18n = new I18n<TTSContext>({
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
        }
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

removeAudios().then(() => {
    console.log("🤖 Logged in as @TTSBot");
    run(bot);
});

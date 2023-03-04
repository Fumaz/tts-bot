import {Composer, InlineKeyboard} from "grammy";
import {TTSContext} from "../bot.js";
import {InlineQueryResult, InlineQueryResultArticle, InlineQueryResultVoice} from "@grammyjs/types";
import {nanoid} from "nanoid";
import {createAudioLink} from "../audios/audio.js";
import {database} from "../../database/database.js";

export const inline = new Composer<TTSContext>();

function createKeyboard(ctx: TTSContext) {
    return new InlineKeyboard()
        .switchInline(ctx.t("create_button"), "");
}

function createErrorResult(ctx: TTSContext, message: string): InlineQueryResultArticle {
    const translated = ctx.t(message);
    const keyboard = createKeyboard(ctx);

    return {
        type: "article",
        id: nanoid(64),
        title: translated,
        reply_markup: keyboard,
        thumb_url: "https://i.imgur.com/RARF2nv.png",
        input_message_content: {
            message_text: translated
        }
    }
}

async function createAudioResult(ctx: TTSContext, text: string, keyboard: boolean = true): Promise<InlineQueryResultVoice> {
    const language = ctx.user.language;
    const link = await createAudioLink(text, language);
    const title = ctx.t("inline_create");
    const caption = ctx.t("caption");
    const replyMarkup = keyboard ? createKeyboard(ctx) : undefined;

    return {
        type: "voice",
        id: nanoid(64),
        title,
        caption,
        voice_url: link,
        reply_markup: replyMarkup
    }
}

inline.inlineQuery(/^$/, async (ctx) => {
    const text = ctx.inlineQuery.query.replace(/[\n\r]/g, " ").trim();
    const switchPMText = ctx.t("inline_language");
    const switchPMParameter = "language";

    const results = [] as InlineQueryResult[];

    if (!text) {
        results.push(createErrorResult(ctx, "inline_empty"));
    } else {
        try {
            results.push(await createAudioResult(ctx, text));

            await database.audio.create({
                data: {
                    user_id: ctx.user.id,
                    language: ctx.user.language,
                    length: text.length,
                }
            })
        } catch (error) {
            results.push(createErrorResult(ctx, "inline_empty"));
        }
    }

    await ctx.answerInlineQuery(results, {
        switch_pm_text: switchPMText,
        switch_pm_parameter: switchPMParameter,
        cache_time: 0,
        is_personal: true
    });
});

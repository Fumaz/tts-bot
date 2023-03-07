import {TTSContext} from "../bot.js";
import {Composer, InputFile} from "grammy";
import {createAudio} from "../audios/audio.js";
import {rm} from "fs/promises";

export const audio = new Composer<TTSContext>();
const creating: number[] = [];

audio.on('message:text').hears(/^(?!\/)/, async (ctx) => {
    if (creating.includes(ctx.from.id)) {
        await ctx.replyWithHTML(ctx.t("already_creating"));
        return;
    }

    creating.push(ctx.from.id);
    const text = ctx.message.text.replace(/[\n\r]/g, " ").trim();

    if (text.length > 500) {
        await ctx.replyWithHTML(ctx.t("text_too_long"));
        creating.splice(creating.indexOf(ctx.from.id), 1);
        return;
    }

    const waitingMessage = await ctx.replyWithHTML(ctx.t("creating"));

    try {
        const audio = await createAudio(text, ctx.user.language);

        await ctx.replyWithAudio(new InputFile(audio));
        await rm(audio);
    } catch (e) {
        await ctx.replyWithHTML(ctx.t("error_try_again"));
    }

    await waitingMessage.delete();

    creating.splice(creating.indexOf(ctx.from.id), 1);
});

import {TTSContext} from "../bot.js";
import {Composer, InputFile} from "grammy";
import {createAudio} from "../audios/audio.js";
import {rm} from "fs/promises";

export const audio = new Composer<TTSContext>();

audio.hears(/^(?!\/)/, async (ctx) => {
    const text = ctx.match[1];
    const waitingMessage = await ctx.replyWithHTML(ctx.t("creating"));

    try {
        const audio = await createAudio(text, ctx.user.language);

        await ctx.replyWithAudio(new InputFile(audio));
        await rm(audio);
    } catch (e) {
        console.log(e);
        await ctx.replyWithHTML(ctx.t("error_try_again"));
    }

    await waitingMessage.delete();
});

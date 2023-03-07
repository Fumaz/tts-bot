import {NextFunction} from "grammy";
import {TTSContext} from "../bot.js";

export async function editOrReply(ctx: TTSContext, next: NextFunction) {
    ctx.editOrReplyWithHTML = async (text: string, options: any) => {
        if (ctx?.callbackQuery?.message?.from?.id === ctx.me.id && ctx.callbackQuery?.message?.text) {
            return ctx.editMessageText(text, {
                parse_mode: "HTML",
                ...options
            });
        } else {
            if (options.delete && ctx.message?.from?.id === ctx.me.id) {
                await ctx.deleteMessage();
            }

            return ctx.replyWithHTML(text, options);
        }
    };

    await next();
}

import {NextFunction} from "grammy";
import {database as db} from "../../database/database.js";
import {TTSContext} from "../bot.js";

export async function database(ctx: TTSContext, next: NextFunction) {
    if (!ctx.from) {
        return;
    }

    if (ctx.chat && ctx.chat?.type !== "private") {
        return;
    }

    let user = await db.user.findUnique({
        where: {
            id: ctx.from.id
        }
    });

    if (!user) {
        user = await db.user.create({
            data: {
                id: ctx.from.id,
                first_name: ctx.from.first_name,
                last_name: ctx.from.last_name,
                username: ctx.from.username,
                language: ctx.from.language_code?.substring(0, 2),
            }
        });
    } else {
        user = await db.user.update({
            where: {
                id: user.id
            },
            data: {
                first_name: ctx.from.first_name,
                last_name: ctx.from.last_name,
                username: ctx.from.username,
                active: true
            }
        });
    }

    ctx.user = user;
    await next();
}

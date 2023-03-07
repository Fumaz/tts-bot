import {Composer, InlineKeyboard} from "grammy";
import {TTSContext} from "../bot.js";
import {database} from "../../database/database.js";
import dayjs from "dayjs";
import {ChartJSNodeCanvas} from "chartjs-node-canvas";
import {Prisma} from "@prisma/client";
import {ChartConfiguration} from "chart.js";
import * as fs from "fs";
import {promisify} from "util";

export const statistics = new Composer<TTSContext>();
const cached = {
    timestamp: 0,
    users: 0,
    audios: 0,
    usersToday: 0,
    audiosToday: 0,
    activeToday: 0,
    characters: 0,
    charactersToday: 0,
    chart: "/usr/src/app/assets/chart.png"
};

statistics.callbackQuery("statistics", async (ctx) => {
    if (new Date(cached.timestamp) < dayjs().subtract(5, "minutes").toDate()) {
        cached.timestamp = dayjs().toDate().getTime();

        const users = await database.user.count();
        const audios = await database.audio.count();

        const usersToday = await database.user.count({
            where: {
                created_at: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
            }
        });

        const audiosToday = await database.audio.count({
            where: {
                created_at: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
            }
        });

        const activeToday = await database.user.count({
            where: {
                updated_at: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
            }
        });

        const characters = await database.audio.aggregate({
            _sum: {
                length: true
            }
        });

        const charactersToday = await database.audio.aggregate({
            _sum: {
                length: true
            },
            where: {
                created_at: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
            }
        });

        cached.users = users;
        cached.audios = audios;
        cached.usersToday = usersToday;
        cached.audiosToday = audiosToday;
        cached.activeToday = activeToday;
        cached.characters = characters._sum.length || 0;
        cached.charactersToday = charactersToday._sum.length || 0;

        const width = 800;
        const height = 400;
        const background = "white";
        const canvas = new ChartJSNodeCanvas({width, height, backgroundColour: background});

        const usersChartQueried = await database.$queryRaw<any[]>(Prisma.sql`SELECT created_at::DATE AS date, COUNT(id) AS count
FROM "User"
GROUP BY created_at::DATE;`);

        const audiosChartQueried = await database.$queryRaw<any[]>(Prisma.sql`SELECT created_at::DATE AS date, COUNT(id) AS count
FROM "Audio"
GROUP BY created_at::DATE;`);

//         const audiosCharactersChartQueried = await database.$queryRaw<any[]>(Prisma.sql`SELECT created_at::DATE AS date, SUM(length) AS sum
// FROM "Audio"
// GROUP BY created_at::DATE;`);

        const usersLabels = usersChartQueried.map((item: any) => dayjs(item.date).format("DD/MM/YYYY"));
        const audiosLabels = audiosChartQueried.map((item: any) => dayjs(item.date).format("DD/MM/YYYY"));
        const commonLabels = usersLabels.filter((item) => audiosLabels.includes(item));

        const usersData = [];
        let total = 0;

        for (const item of usersChartQueried) {
            total += item.count;

            if (!commonLabels.includes(dayjs(item.date).format("DD/MM/YYYY"))) {
                continue;
            }

            usersData.push(total);
        }

        const audiosData = [];
        total = 0;

        for (const item of audiosChartQueried) {
            total += item.count;

            if (!commonLabels.includes(dayjs(item.date).format("DD/MM/YYYY"))) {
                continue;
            }

            audiosData.push(total);
        }

        // const audiosCharactersLabels = audiosCharactersChartQueried.map((item: any) => dayjs(item.date).format("DD/MM/YYYY"));
        // const audiosCharactersData = [];
        // total = 0;
        //
        // for (const item of audiosCharactersChartQueried) {
        //     total += item.sum;
        //     audiosCharactersData.push(total);
        // }

        const configuration: ChartConfiguration = {
            type: "line",
            data: {
                labels: commonLabels,
                datasets: [
                    {
                        label: ctx.t("users"),
                        data: usersData,
                        borderColor: "rgb(255, 99, 132)",
                        backgroundColor: "rgb(255, 99, 132)",
                        radius: 0
                    },
                    {
                        label: ctx.t("audios"),
                        data: audiosData,
                        borderColor: "rgb(54, 162, 235)",
                        backgroundColor: "rgb(54, 162, 235)",
                        radius: 0,
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }
                }
            }
        };

        const image = await canvas.renderToBuffer(configuration);
        await promisify(fs.writeFile)(cached.chart, image);
    }

    const keyboard = new InlineKeyboard()
        .text(ctx.t("back_button"), "menu");

    await ctx.answerCallbackQuery();
    await ctx.deleteMessage();

    await ctx.replyWithPhoto(cached.chart, {
        caption: ctx.t("statistics", {
            users: cached.users,
            audios: cached.audios,
            usersToday: cached.usersToday,
            audiosToday: cached.audiosToday,
            activeToday: cached.activeToday,
            characters: cached.characters,
            charactersToday: cached.charactersToday
        }),
        reply_markup: keyboard,
        parse_mode: "HTML"
    });
});

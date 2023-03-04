import { Composer } from "grammy";
import { TTSContext } from "../bot.js";
export declare const settings: Composer<TTSContext>;
export declare function handle(ctx: TTSContext): Promise<void>;

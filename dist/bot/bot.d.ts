import { Context } from "grammy";
import { HydrateFlavor } from "@grammyjs/hydrate";
import { I18nFlavor } from "@grammyjs/i18n";
import type { ParseModeFlavor } from "@grammyjs/parse-mode";
import { User } from "@prisma/client";
type UserContext = {
    user: User;
};
type EditOrReplyContext = {
    editOrReplyWithHTML: (text: string, options: any) => Promise<any>;
};
export type TTSContext = ParseModeFlavor<HydrateFlavor<Context>> & I18nFlavor & UserContext & EditOrReplyContext;
export {};

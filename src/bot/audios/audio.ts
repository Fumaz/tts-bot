// @ts-ignore
import gTTS from 'gtts';
import {nanoid} from "nanoid";
import {exec} from "child_process";
import {rm} from "fs/promises";

async function createMP3(text: string, language: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const filename = "/usr/src/app/audios/" + nanoid(16) + ".mp3";
        const tts = new gTTS(text, language);

        tts.save(filename, (error: any, result: any) => {
            if (error) {
                reject(error);
            } else {
                resolve(filename);
            }
        });
    });
}

async function convertToOGG(filename: string) {
    const output = filename.replace(".mp3", ".ogg");

    await exec(`ffmpeg -i ${filename} -acodec libopus -b:a 64k -vbr on ${output}`);

    return output;
}

export async function createAudio(text: string, language: string) {
    const mp3 = await createMP3(text, language);
    const ogg = await convertToOGG(mp3);

    await rm(mp3);

    return ogg;
}


export async function createAudioLink(text: string, language: string) {
    const ogg = await createAudio(text, language);

    return ogg.replace("/usr/src/app/audios", "https://api.fumaz.dev/tts");
}

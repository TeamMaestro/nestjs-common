import { promises } from 'fs';

export async function writeJson(path: string, object: any) {
    const { writeFile } = promises;
    await writeFile(path, object);
}

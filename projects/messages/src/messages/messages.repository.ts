import { readFile, writeFile } from 'node:fs/promises';

export class MessagesRepository {
  private async readFileContent() {
    const contents = await readFile('messages.json', 'utf-8');
    return contents ? JSON.parse(contents) : {};
  }
  async findOne(id: string) {
    const messages = await this.readFileContent();
    return messages[id];
  }

  async findAll() {
    const messages = await this.readFileContent();
    return messages;
  }

  async create(message: string) {
    const messages = await this.readFileContent();
    const id = Math.floor(Math.random() * 9999) + 1;
    messages[id] = {
      id,
      content: message,
    };
    await writeFile('messages.json', JSON.stringify(messages));
  }
}

import { Collection } from 'discord.js';
import { Document, Model, Query } from 'mongoose';
import { Files } from '../models/Files';

export default class FileProvider {
    public model: Model<Document>;
    public items: Collection<string, Buffer>;

    public constructor() {
        this.model = Files;
        this.items = new Collection();
    }

    public async init(): Promise<void> {
        const files = await Files.find();
        for (const file of files) {
            this.items.set(file.id, file.data);
        }
    }

    public async get(id: string): Promise<any> {
        if (this.items.has(id)) {
            const data = this.items.get(id);
            return data;
        }

        this.items.clear();
        await this.init();

        return this.items.get(id);
    }

    public async set(id: string, data: Buffer): Promise<Query<Document>> {
        const file: any = this.items.get(id) || {};
        file.data = data;
        this.items.set(file.id, file.data);

        return await Files.updateOne({ id }, { data: data });
    }

    public async delete(id: string): Promise<any> {
        this.items.delete(id);

        return await Files.deleteOne({ id });
    }
}
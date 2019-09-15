import { Schema, model, Document } from 'mongoose';

export interface Tag extends Document {
    id: number,
    user: string,
    guild: string,
    name: string,
    aliases: [string],
    content: string,
    uses: number,
    last_modified: string,
    createdAt: Date,
    updatedAt: Date
}

const TagsModel = new Schema({
    id: Number,
    user: String,
    guild: String,
    name: String,
    aliases: [String],
    content: String,
    uses: Number,
    last_modified: String,
    createdAt: Date,
    updatedAt: Date
});

export const Tags = model<Tag>('Tags', TagsModel);
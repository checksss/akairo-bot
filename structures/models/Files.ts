import { Document, Schema, model } from 'mongoose';

interface File extends Document {
    id: string,
    user: string,
    filename: string,
    data: Buffer
}

const FileSchema = new Schema({
    id: String,
    user: String,
    filename: String,
    data: Buffer
});

export const Files = model<File>('Files', FileSchema);
import { Schema, model, Document } from 'mongoose';

export interface AudioClip extends Document {
    user: string,
    guild: string,
    type: string,
    data: Buffer
}

const AudioClipModel = new Schema({
    user: String,
    guild: String,
    type: String,
    data: Buffer
});

export const AudioClips = model<AudioClip>('AudioClips', AudioClipModel);
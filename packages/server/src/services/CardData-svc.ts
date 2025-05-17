import { Schema, model } from "mongoose";
import { CardData } from "../models/cardData";

const CardDataSchema = new Schema<CardData> ({
    id: {
        type: String,
        required: true,
        trim: true
    },
        title: {
        type: String,
        required: true,
        trim: true
    },
        href: {
        type: String,
        required: true,
        trim: true
    },
        linkText: {
        type: String,
        required: true,
        trim: true
    },
        description: {
        type: String,
        required: true,
        trim: true
    }
}, {collection: "dt_traders"})    

const CardDataModel = model<CardData>("CardData", CardDataSchema);

function index(): Promise<CardData[]> {
    return CardDataModel.find().exec();
}
  
function get(id: string): Promise<CardData | null> {
    return CardDataModel.findById({ id }).exec();
}

function create(json: CardData) {
    return new CardDataModel(json).save();
}

function update(id: string, json: CardData) {
    return CardDataModel.findByIdAndUpdate(id, json, {new:true}).exec();
}

function remove(id: string) {
    return CardDataModel.findByIdAndDelete(id).exec().then(() => {});
}
export default { index, get, create, update, remove };
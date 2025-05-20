import { Schema, model } from "mongoose";
import { CardData } from "../models/cardData";

const CardDataSchema = new Schema<CardData> ({
    id: {
        type: String,
        required: true,
        trim: true,
        unique: true
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

// get one by id
function get(id: string): Promise<CardData | null> {
    return CardDataModel.findOne({ id }).exec();
}

// create new doc 
function create(json: CardData) {
    return new CardDataModel(json).save();
}

function update(id: string, json: Partial<CardData>): Promise<CardData | null> {
    return CardDataModel.findOneAndUpdate({ id }, json, {new:true}).exec();
}

function remove(id: string): Promise<void> {
    return CardDataModel.findOneAndDelete({ id }).exec().then(() => {});
}
export default { index, get, create, update, remove };
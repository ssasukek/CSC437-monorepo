import { Schema, model } from "mongoose";
import { CardData } from "../models/cardData";

const CardDataSchema = new Schema<CardData> ({
    id: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
        name: {
        type: String,
        required: true,
        trim: true
    },
        bio: {
        type: String,
        required: true,
        trim: true
    },
        tradingStyle: {
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
    console.log(`Updating card for ${id}`, json);
    return CardDataModel.findOneAndUpdate(
      { id },
      { $set: json },
      { new: true, upsert: true },
    ).exec();
}

function remove(id: string): Promise<void> {
    return CardDataModel.findOneAndDelete({ id }).exec().then(() => {});
}
export default { index, get, create, update, remove };
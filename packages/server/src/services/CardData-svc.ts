import { Schema, model } from "mongoose";
import { CardData } from "../../models/cardData";

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


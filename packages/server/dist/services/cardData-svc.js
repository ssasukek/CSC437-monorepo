"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var CardData_svc_exports = {};
__export(CardData_svc_exports, {
  default: () => CardData_svc_default
});
module.exports = __toCommonJS(CardData_svc_exports);
var import_mongoose = require("mongoose");
const CardDataSchema = new import_mongoose.Schema({
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
}, { collection: "dt_traders" });
const CardDataModel = (0, import_mongoose.model)("CardData", CardDataSchema);
function index() {
  return CardDataModel.find().exec();
}
function get(id) {
  return CardDataModel.findById(id).exec();
}
var CardData_svc_default = { index, get };

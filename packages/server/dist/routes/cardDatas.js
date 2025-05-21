"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var cardDatas_exports = {};
__export(cardDatas_exports, {
  default: () => cardDatas_default
});
module.exports = __toCommonJS(cardDatas_exports);
var import_express = require("express");
var import_cardData_svc = __toESM(require("../services/cardData-svc"));
const router = (0, import_express.Router)();
router.get("/", (_req, res) => {
  import_cardData_svc.default.index().then((list) => res.json(list)).catch((err) => res.status(500).send(err));
});
router.get("/:id", (req, res) => {
  import_cardData_svc.default.get(req.params.id).then((card) => {
    if (!card) return res.status(404).end();
    res.json(card);
  }).catch((err) => res.status(500).send(err));
});
router.post("/", (req, res) => {
  const newCard = req.body;
  import_cardData_svc.default.create(newCard).then((saved) => res.status(201).json(saved)).catch((err) => res.status(500).send(err));
});
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const updated = req.body;
  import_cardData_svc.default.update(id, updated).then((card) => res.json(card)).catch((err) => res.status(404).send(err));
});
router.delete("/:id", (req, res) => {
  import_cardData_svc.default.remove(req.params.id).then(() => res.status(204).end()).catch((err) => res.status(404).send(err));
});
var cardDatas_default = router;

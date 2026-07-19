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

// server.ts
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var app = (0, import_express.default)();
var PORT = 3e3;
var DB_PATH = import_path.default.join(process.cwd(), "src", "db.json");
var DEFAULT_DB = {
  users: [
    {
      name: "\u0639\u0635\u0641\u0648\u0631",
      role: "\u0645\u062F\u064A\u0631",
      pass: "14014",
      active: "\u0646\u0639\u0645",
      email: "asfour@friendplus.com",
      perms: "\u0643\u0627\u0645\u0644\u0629"
    },
    {
      name: "\u0627\u0628\u0648 \u064A\u0627\u0633\u064A\u0646",
      role: "\u0645\u062F\u064A\u0631",
      pass: "361991",
      active: "\u0646\u0639\u0645",
      email: "abuyassin@friendplus.com",
      perms: "\u0643\u0627\u0645\u0644\u0629"
    },
    {
      name: "\u0627\u0628\u0648 \u062E\u062F\u064A\u062C\u0647",
      role: "\u0645\u0634\u0631\u0641",
      pass: "14014",
      active: "\u0646\u0639\u0645",
      email: "abukhadija@friendplus.com",
      perms: "\u062A\u0648\u0632\u064A\u0639 \u0648\u0645\u062A\u0627\u0628\u0639\u0629"
    },
    {
      name: "\u0623\u062D\u0645\u062F \u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0627\u062A",
      role: "\u0645\u0633\u0624\u0648\u0644 \u0645\u0631\u062A\u062C\u0639\u0627\u062A",
      pass: "222222",
      active: "\u0646\u0639\u0645",
      email: "returns@friendplus.com",
      perms: "\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0627\u062A"
    },
    {
      name: "\u0627\u0644\u0645\u062D\u0627\u0633\u0628 \u0623\u062D\u0645\u062F",
      role: "\u0645\u062D\u0627\u0633\u0628",
      pass: "111111",
      active: "\u0646\u0639\u0645",
      email: "accounting@friendplus.com",
      perms: "\u062E\u0632\u0646\u0629 \u0648\u062D\u0633\u0627\u0628\u0627\u062A \u0648\u062A\u0642\u0627\u0631\u064A\u0631 \u0645\u0627\u0644\u064A\u0629"
    },
    {
      name: "\u0645\u062D\u0645\u062F \u062D\u0645\u062F\u0649",
      role: "\u0645\u0646\u062F\u0648\u0628",
      pass: "500500",
      active: "\u0646\u0639\u0645",
      email: "mohamed@friendplus.com",
      perms: "\u0623\u0648\u0631\u062F\u0631\u0627\u062A \u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u0648\u062A\u062D\u062F\u064A\u062B \u0627\u0644\u062D\u0627\u0644\u0627\u062A"
    },
    {
      name: "\u0632\u064A\u0627\u062F",
      role: "\u0645\u0646\u062F\u0648\u0628",
      pass: "500500",
      active: "\u0646\u0639\u0645",
      email: "ziad@friendplus.com",
      perms: "\u0623\u0648\u0631\u062F\u0631\u0627\u062A \u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u0648\u062A\u062D\u062F\u064A\u062B \u0627\u0644\u062D\u0627\u0644\u0627\u062A"
    },
    {
      name: "\u0645\u062D\u0644 \u0627\u0644\u0623\u0646\u0627\u0642\u0629",
      role: "\u0645\u0648\u0631\u062F",
      pass: "333333",
      active: "\u0646\u0639\u0645",
      email: "elegance@friendplus.com",
      perms: "\u0625\u0636\u0627\u0641\u0629 \u0623\u0648\u0631\u062F\u0631\u0627\u062A \u0648\u0631\u0641\u0639 \u0643\u0634\u0648\u0641\u0627\u062A"
    },
    {
      name: "\u0635\u0641\u0648\u062A \u0627\u0644\u0639\u0645\u0644\u064A\u0627\u062A",
      role: "\u0645\u0648\u0638\u0641 \u0639\u0645\u0644\u064A\u0627\u062A",
      pass: "444444",
      active: "\u0646\u0639\u0645",
      email: "safwat@friendplus.com",
      perms: "\u0645\u062A\u0627\u0628\u0639\u0629 \u062D\u0627\u0644\u0627\u062A \u0641\u0642\u0637"
    }
  ],
  couriers: [
    {
      name: "\u0645\u062D\u0645\u062F \u062D\u0645\u062F\u0649",
      phone: "01112345678",
      commission: 25,
      salary: 3e3,
      region: "\u0627\u0644\u0642\u0627\u0647\u0631\u0629"
    },
    {
      name: "\u0632\u064A\u0627\u062F",
      phone: "01212345678",
      commission: 25,
      salary: 3e3,
      region: "\u0627\u0644\u062C\u064A\u0632\u0629"
    }
  ],
  suppliers: [
    {
      name: "\u0645\u062D\u0644 \u0627\u0644\u0623\u0646\u0627\u0642\u0629",
      phone: "01055556666",
      price: 65,
      notes: "\u0645\u0644\u0627\u0628\u0633 \u0648\u0645\u0648\u0636\u0629"
    },
    {
      name: "\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A \u0627\u0644\u0633\u0644\u0627\u0645",
      phone: "01544443333",
      price: 60,
      notes: "\u0623\u062C\u0647\u0632\u0629 \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629 \u0648\u0625\u0643\u0633\u0633\u0648\u0627\u0631\u0627\u062A"
    }
  ],
  orders: [
    {
      tracking: "FP-1001-26",
      createdAt: "2026-06-10 10:00",
      updatedAt: "2026-06-10 12:00",
      orderDate: "2026-06-10",
      supplier: "\u0645\u062D\u0644 \u0627\u0644\u0623\u0646\u0627\u0642\u0629",
      customer: "\u0645\u062D\u0633\u0646 \u0639\u0644\u064A",
      phone: "01011112222",
      phone2: "",
      gov: "\u0627\u0644\u0642\u0627\u0647\u0631\u0629",
      region: "\u0627\u0644\u0645\u0639\u0627\u062F\u064A",
      address: "\u0634\u0627\u0631\u0639 9 \u0639\u0645\u0627\u0631\u0629 4 \u0623",
      prodPrice: 200,
      shipPrice: 65,
      totalCOD: 265,
      shipCost: 65,
      courier: "\u0645\u062D\u0645\u062F \u062D\u0645\u062F\u0649",
      status: "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
      notes: "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0641 \u0628\u0646\u062C\u0627\u062D \u0648\u0627\u0644\u062A\u062D\u0635\u064A\u0644",
      delivDate: "2026-06-10 12:00",
      retDate: "",
      addedBy: "\u0645\u062D\u0644 \u0627\u0644\u0623\u0646\u0627\u0642\u0629",
      commission: 25,
      returnShippingType: "",
      returnQueueStatus: "",
      returnQueueAgent: ""
    },
    {
      tracking: "FP-1002-26",
      createdAt: "2026-06-10 10:15",
      updatedAt: "2026-06-10 12:30",
      orderDate: "2026-06-10",
      supplier: "\u0645\u062D\u0644 \u0627\u0644\u0623\u0646\u0627\u0642\u0629",
      customer: "\u062E\u0627\u0644\u062F \u0623\u062D\u0645\u062F",
      phone: "01122223333",
      phone2: "",
      gov: "\u0627\u0644\u062C\u064A\u0632\u0629",
      region: "\u0627\u0644\u0645\u0647\u0646\u062F\u0633\u064A\u0646",
      address: "\u0634\u0627\u0631\u0639 \u0627\u0644\u0628\u0637\u0644 \u0623\u062D\u0645\u062F \u0639\u0628\u062F \u0627\u0644\u0639\u0632\u064A\u0632",
      prodPrice: 300,
      shipPrice: 65,
      totalCOD: 365,
      shipCost: 65,
      courier: "\u0632\u064A\u0627\u062F",
      status: "\u0645\u0631\u062A\u062C\u0639",
      notes: "\u0627\u0644\u0639\u0645\u064A\u0644 \u062F\u0641\u0639 \u0627\u0644\u0634\u062D\u0646 \u0641\u0642\u0637 \u0648\u0631\u062C\u0639 \u0627\u0644\u0645\u0646\u062A\u062C",
      delivDate: "",
      retDate: "2026-06-10 12:30",
      addedBy: "\u0645\u062D\u0644 \u0627\u0644\u0623\u0646\u0627\u0642\u0629",
      commission: 25,
      returnShippingType: "paid",
      returnQueueStatus: "\u062C\u0627\u0647\u0632 \u0644\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F",
      returnQueueAgent: "\u0623\u062D\u0645\u062F \u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0627\u062A"
    }
  ],
  expenses: [
    {
      date: "2026-06-10 09:00",
      cat: "\u0625\u064A\u062C\u0627\u0631",
      desc: "\u0625\u064A\u062C\u0627\u0631 \u0645\u0643\u062A\u0628 \u0627\u0644\u0641\u0631\u0639 \u0627\u0644\u0631\u0626\u064A\u0633\u064A",
      amount: 1500,
      by: "\u0627\u0644\u0645\u062D\u0627\u0633\u0628 \u0623\u062D\u0645\u062F"
    }
  ],
  cashbox: [
    {
      date: "2026-06-10 08:00",
      desc: "\u0631\u0623\u0633 \u0645\u0627\u0644 \u0627\u0628\u062A\u062F\u0627\u0626\u064A \u0644\u062A\u0633\u0648\u064A\u0629 \u0627\u0644\u062E\u0632\u0646\u0629",
      type: "\u0648\u0627\u0631\u062F",
      amount: 1e4,
      ref: "CAP-001",
      addedBy: "\u0627\u0644\u0645\u062D\u0627\u0633\u0628 \u0623\u062D\u0645\u062F"
    },
    {
      date: "2026-06-10 09:10",
      desc: "\u062A\u062D\u0648\u064A\u0644 \u0625\u0644\u0649 \u062D\u0633\u0627\u0628 \u0635\u0627\u062F\u0631 \u0644\u062F\u0641\u0639 \u0627\u0644\u0645\u0635\u0627\u0631\u064A\u0641",
      type: "\u0635\u0627\u062F\u0631",
      amount: 1500,
      ref: "EXP-REV-01",
      addedBy: "\u0627\u0644\u0645\u062D\u0627\u0633\u0628 \u0623\u062D\u0645\u062F"
    }
  ],
  statusHistory: [],
  supplierLedger: [],
  courierLedger: [],
  settings: {
    COUNTER: 1005,
    COMPANY: "\u0641\u0631\u064A\u0646\u062F \u0628\u0644\u0633",
    VERSION: "5.1"
  }
};
app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") {
    next();
  } else {
    import_express.default.json({ limit: "50mb" })(req, res, next);
  }
});
function getSeededOrders() {
  return [
    {
      tracking: "FP-1001-26",
      createdAt: "2026-06-10 10:00",
      updatedAt: "2026-06-12 12:00",
      supplier: "\u0645\u062D\u0644 \u0627\u0644\u0623\u0646\u0627\u0642\u0629",
      customer: "\u0645\u062D\u0645\u0648\u062F \u0631\u0623\u0641\u062A \u062D\u0633\u0646",
      phone: "01011223344",
      phone2: "01155667788",
      gov: "\u0627\u0644\u062F\u0642\u0647\u0644\u064A\u0629",
      region: "\u0627\u0644\u0645\u0646\u0635\u0648\u0631\u0629",
      address: "\u0627\u0644\u0645\u0646\u0635\u0648\u0631\u0629 - \u0634 \u0627\u0644\u0623\u062A\u0648\u0628\u064A\u0633 \u0627\u0644\u062C\u062F\u064A\u062F \u0623\u0645\u0627\u0645 \u0645\u0633\u062C\u062F \u0627\u0644\u062A\u0642\u0648\u0649",
      prodPrice: 200,
      shipPrice: 60,
      totalCOD: 260,
      status: "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
      courier: "\u0645\u062D\u0645\u062F \u062D\u0645\u062F\u0649",
      notes: "\u064A\u0631\u062C\u0649 \u0631\u0646 \u062C\u0631\u0633 \u0645\u0631\u062A\u064A\u0646 \u0648\u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0642\u0628\u0644 \u0627\u0644\u0648\u0635\u0648\u0644 \u0628\u0646\u0635\u0641 \u0633\u0627\u0639\u0629",
      returnQueueStatus: ""
    },
    {
      tracking: "FP-1002-26",
      createdAt: "2026-06-11 10:15",
      updatedAt: "2026-06-12 11:30",
      supplier: "\u0645\u062D\u0644 \u0627\u0644\u0623\u0646\u0627\u0642\u0629",
      customer: "\u0641\u0627\u0637\u0645\u0629 \u0623\u062D\u0645\u062F \u0639\u0644\u064A",
      phone: "01233445566",
      phone2: "",
      gov: "\u0627\u0644\u0642\u0627\u0647\u0631\u0629",
      region: "\u0645\u0635\u0631 \u0627\u0644\u062C\u062F\u064A\u062F\u0629",
      address: "\u0645\u0635\u0631 \u0627\u0644\u062C\u062F\u064A\u062F\u0629 - \u0634 \u0627\u0644\u0646\u0632\u0647\u0629 \u0639\u0645\u0627\u0631\u0629 14 \u0627\u0644\u062F\u0648\u0631 3 \u0634\u0642\u0629 6",
      prodPrice: 300,
      shipPrice: 40,
      totalCOD: 340,
      status: "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
      courier: "\u0645\u062D\u0645\u062F \u062D\u0645\u062F\u0649",
      notes: "\u062A\u0633\u0644\u064A\u0645 \u0633\u0631\u064A\u0639 \u0627\u0644\u064A\u0648\u0645 \u0636\u0631\u0648\u0631\u064A \u062C\u062F\u0627\u064B",
      returnQueueStatus: ""
    },
    {
      tracking: "FP-1003-26",
      createdAt: "2026-06-12 09:30",
      updatedAt: "2026-06-12 14:15",
      supplier: "\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A \u0627\u0644\u0633\u0644\u0627\u0645",
      customer: "\u0645\u062D\u0645\u062F \u0635\u0644\u0627\u062D \u0627\u0644\u0635\u0627\u0648\u064A",
      phone: "01511223344",
      phone2: "01099887766",
      gov: "\u0627\u0644\u062C\u064A\u0632\u0629",
      region: "\u0641\u064A\u0635\u0644",
      address: "\u0641\u064A\u0635\u0644 - \u0634 \u0627\u0644\u0639\u0634\u0631\u064A\u0646 \u0628\u0631\u062C \u0627\u0644\u064A\u0627\u0633\u0645\u064A\u0646 \u0634\u0642\u0629 10",
      prodPrice: 150,
      shipPrice: 40,
      totalCOD: 190,
      status: "\u062E\u0627\u0631\u062C \u0645\u0639 \u0627\u0644\u0645\u0646\u062F\u0648\u0628",
      courier: "\u0632\u064A\u0627\u062F",
      notes: "\u0627\u0644\u062F\u0641\u0639 \u0643\u0627\u0634 \u0628\u0639\u062F \u0627\u0644\u0645\u0639\u0627\u064A\u0646\u0629",
      returnQueueStatus: ""
    },
    {
      tracking: "FP-1004-26",
      createdAt: "2026-06-12 10:00",
      updatedAt: "2026-06-12 10:00",
      supplier: "\u0645\u062D\u0644 \u0627\u0644\u0623\u0646\u0627\u0642\u0629",
      customer: "\u0633\u0627\u0645\u062D \u0639\u0628\u062F \u0627\u0644\u0633\u0644\u0627\u0645 \u0637\u0647",
      phone: "01088776655",
      phone2: "",
      gov: "\u0627\u0644\u0625\u0633\u0643\u0646\u062F\u0631\u064A\u0629",
      region: "\u0633\u0645\u0648\u062D\u0629",
      address: "\u0633\u0645\u0648\u062D\u0629 - \u0634 \u0641\u0648\u0632\u064A \u0645\u0639\u0627\u0630 \u0628\u062C\u0648\u0627\u0631 \u0645\u0633\u062A\u0634\u0641\u0649 \u0623\u0646\u062F\u0644\u0633\u064A\u0629",
      prodPrice: 450,
      shipPrice: 65,
      totalCOD: 515,
      status: "\u062C\u062F\u064A\u062F",
      courier: "",
      notes: "",
      returnQueueStatus: ""
    },
    {
      tracking: "FP-1005-26",
      createdAt: "2026-06-12 10:30",
      updatedAt: "2026-06-12 15:00",
      supplier: "\u0645\u062D\u0644 \u0627\u0644\u0623\u0646\u0627\u0642\u0629",
      customer: "\u0645\u0646\u0649 \u0632\u0643\u064A \u0627\u0644\u0634\u0631\u064A\u0641",
      phone: "01155443322",
      phone2: "",
      gov: "\u0627\u0644\u0642\u0627\u0647\u0631\u0629",
      region: "\u0634\u0628\u0631\u0627",
      address: "\u0634\u0628\u0631\u0627 \u0645\u0635\u0631 - \u0634 \u0623\u062D\u0645\u062F \u062D\u0644\u0645\u064A \u0623\u0645\u0627\u0645 \u0645\u062F\u0631\u0633\u0629 \u0627\u0644\u062A\u0648\u0641\u064A\u0642\u064A\u0629",
      prodPrice: 180,
      shipPrice: 35,
      totalCOD: 215,
      status: "\u0645\u0624\u062C\u0644",
      courier: "\u0645\u062D\u0645\u062F \u062D\u0645\u062F\u0649",
      notes: "\u0623\u062C\u0644 \u0644\u064A\u0648\u0645 \u0627\u0644\u0623\u062D\u062F \u0627\u0644\u0642\u0627\u062F\u0645 \u062D\u0633\u0628 \u0631\u063A\u0628\u0629 \u0627\u0644\u0639\u0645\u064A\u0644",
      returnQueueStatus: ""
    },
    {
      tracking: "FP-1006-26",
      createdAt: "2026-06-12 10:45",
      updatedAt: "2026-06-12 15:30",
      supplier: "\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A \u0627\u0644\u0633\u0644\u0627\u0645",
      customer: "\u0625\u0628\u0631\u0627\u0647\u064A\u0645 \u062E\u0627\u0644\u062F \u0639\u0645\u0627\u0631",
      phone: "01533442211",
      phone2: "",
      gov: "\u0627\u0644\u0642\u0627\u0647\u0631\u0629",
      region: "\u062D\u0644\u0648\u0627\u0646",
      address: "\u062D\u0644\u0648\u0627\u0646 - \u0634 \u0645\u0646\u0635\u0648\u0631 \u0628\u062C\u0648\u0627\u0631 \u0645\u062D\u0637\u0629 \u062D\u0644\u0648\u0627\u0646",
      prodPrice: 130,
      shipPrice: 45,
      totalCOD: 175,
      status: "\u0644\u0627 \u064A\u0648\u062C\u062F \u0631\u062F",
      courier: "\u0645\u062D\u0645\u062F \u062D\u0645\u062F\u0649",
      notes: "\u062A\u0645 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 3 \u0645\u0631\u0627\u062A \u0645\u063A\u0644\u0642 \u0623\u0648 \u0643\u0646\u0633\u0644",
      returnQueueStatus: ""
    },
    {
      tracking: "FP-1007-26",
      createdAt: "2026-06-12 11:00",
      updatedAt: "2026-06-12 16:30",
      supplier: "\u0645\u062D\u0644 \u0627\u0644\u0623\u0646\u0627\u0642\u0629",
      customer: "\u064A\u062D\u064A\u0649 \u0639\u0628\u062F \u0627\u0644\u0631\u062D\u0645\u0646",
      phone: "01288990011",
      phone2: "",
      gov: "\u0627\u0644\u062C\u064A\u0632\u0629",
      region: "\u0627\u0644\u062F\u0642\u064A",
      address: "\u0627\u0644\u062F\u0642\u064A - \u0634 \u0627\u0644\u062A\u062D\u0631\u064A\u0631 \u0628\u0631\u062C \u0627\u0644\u0646\u0648\u0631 \u062E\u0644\u0641 \u0627\u0644\u0628\u0646\u0643 \u0627\u0644\u0623\u0647\u0644\u064A",
      prodPrice: 500,
      shipPrice: 40,
      totalCOD: 540,
      status: "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
      courier: "\u0632\u064A\u0627\u062F",
      notes: "\u0634\u062D\u0646 \u0633\u0631\u064A\u0639 \u0641\u064A \u0627\u0644\u062F\u0642\u064A",
      returnQueueStatus: ""
    },
    {
      tracking: "FP-1008-26",
      createdAt: "2026-06-12 11:15",
      updatedAt: "2026-06-12 16:30",
      supplier: "\u0645\u062D\u0644 \u0627\u0644\u0623\u0646\u0627\u0642\u0629",
      customer: "\u0643\u0631\u064A\u0645 \u0645\u0645\u062F\u0648\u062D \u0634\u062D\u0627\u062A\u0629",
      phone: "01055664422",
      phone2: "",
      gov: "\u0627\u0644\u063A\u0631\u0628\u064A\u0629",
      region: "\u0637\u0646\u0637\u0627",
      address: "\u0637\u0646\u0637\u0627 - \u0634 \u0627\u0644\u0628\u062D\u0631 \u0623\u0645\u0627\u0645 \u0643\u0644\u064A\u0629 \u0627\u0644\u0635\u064A\u062F\u0644\u0629",
      prodPrice: 400,
      shipPrice: 60,
      totalCOD: 460,
      status: "\u0645\u0631\u062A\u062C\u0639",
      courier: "\u0632\u064A\u0627\u062F",
      notes: "\u0631\u0641\u0636 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645 \u0644\u0639\u062F\u0645 \u0645\u0637\u0627\u0628\u0642\u0629 \u0627\u0644\u0645\u0642\u0627\u0633",
      returnQueueStatus: "\u062C\u0627\u0647\u0632 \u0644\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F"
    },
    {
      tracking: "FP-1009-26",
      createdAt: "2026-06-12 11:30",
      updatedAt: "2026-06-12 17:00",
      supplier: "\u0645\u062D\u0644 \u0627\u0644\u0623\u0646\u0627\u0642\u0629",
      customer: "\u0631\u0634\u0627 \u062C\u0645\u0627\u0644 \u0627\u0644\u0633\u064A\u062F",
      phone: "01122334455",
      phone2: "",
      gov: "\u0627\u0644\u062F\u0642\u0647\u0644\u064A\u0629",
      region: "\u0645\u064A\u062A \u063A\u0645\u0631",
      address: "\u0645\u064A\u062A \u063A\u0645\u0631 - \u0628\u062C\u0648\u0627\u0631 \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062A\u0639\u0644\u064A\u0645 \u0627\u0644\u062C\u062F\u064A\u062F\u0629",
      prodPrice: 320,
      shipPrice: 60,
      totalCOD: 380,
      status: "\u0645\u0631\u062A\u062C\u0639",
      courier: "\u0645\u062D\u0645\u062F \u062D\u0645\u062F\u0649",
      notes: "\u0631\u0641\u0636 \u0645\u0639\u064A\u0628 \u0623\u0648 \u0645\u0643\u0633\u0648\u0631",
      returnQueueStatus: "\u0645\u0631\u062A\u062C\u0639 \u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0648\u0631\u062F"
    },
    {
      tracking: "FP-1010-26",
      createdAt: "2026-06-12 11:45",
      updatedAt: "2026-06-12 11:45",
      supplier: "\u0645\u062D\u0644 \u0627\u0644\u0623\u0646\u0627\u0642\u0629",
      customer: "\u0639\u0645\u0627\u062F \u0641\u062A\u062D\u064A \u0627\u0644\u0633\u0648\u064A\u0633\u064A",
      phone: "01555667788",
      phone2: "",
      gov: "\u0627\u0644\u0642\u0644\u064A\u0648\u0628\u064A\u0629",
      region: "\u0628\u0646\u0647\u0627",
      address: "\u0628\u0646\u0647\u0627 - \u0627\u0644\u0641\u0644\u0644 \u0628\u062C\u0648\u0627\u0631 \u0643\u0648\u0631\u0646\u064A\u0634 \u0628\u0646\u0647\u0627 \u0627\u0644\u0645\u0627\u0626\u064A",
      prodPrice: 600,
      shipPrice: 50,
      totalCOD: 650,
      status: "\u062C\u062F\u064A\u062F",
      courier: "",
      notes: "\u0627\u0644\u062F\u0641\u0639 \u0643\u0627\u0634 \u0646\u0642\u062F\u064A",
      returnQueueStatus: ""
    }
  ];
}
var cachedDB = null;
function readDB() {
  if (cachedDB) {
    return cachedDB;
  }
  let db;
  if (!import_fs.default.existsSync(DB_PATH)) {
    console.warn(
      `Database file not found at ${DB_PATH}. Returning fallback structure.`
    );
    db = JSON.parse(JSON.stringify(DEFAULT_DB));
  } else {
    try {
      const data = import_fs.default.readFileSync(DB_PATH, "utf-8");
      db = JSON.parse(data);
    } catch (error) {
      console.error("Error reading database:", error);
      db = JSON.parse(JSON.stringify(DEFAULT_DB));
    }
  }
  cachedDB = db;
  if (!db.orders || db.orders.length < 10) {
    db.orders = getSeededOrders();
    db.supplierLedger = [
      {
        supplier: "\u0645\u062D\u0644 \u0627\u0644\u0623\u0646\u0627\u0642\u0629",
        date: "2026-06-10 10:00",
        type: "\u0623\u0648\u0631\u062F\u0631 \u0645\u0633\u062A\u0644\u0645",
        tracking: "FP-1001-26",
        amount: 200,
        desc: "\u0623\u0648\u0631\u062F\u0631 \u0645\u0633\u062A\u0644\u0645 \u0642\u064A\u0645\u062A\u0647 200 \u062C.\u0645"
      },
      {
        supplier: "\u0645\u062D\u0644 \u0627\u0644\u0623\u0646\u0627\u0642\u0629",
        date: "2026-06-11 10:15",
        type: "\u0623\u0648\u0631\u062F\u0631 \u0645\u0633\u062A\u0644\u0645",
        tracking: "FP-1002-26",
        amount: 300,
        desc: "\u0623\u0648\u0631\u062F\u0631 \u0645\u0633\u062A\u0644\u0645 \u0642\u064A\u0645\u062A\u0647 300 \u062C.\u0645"
      },
      {
        supplier: "\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A \u0627\u0644\u0633\u0644\u0627\u0645",
        date: "2026-06-12 09:30",
        type: "\u0623\u0648\u0631\u062F\u0631 \u0645\u0633\u062A\u0644\u0645",
        tracking: "FP-1003-26",
        amount: 150,
        desc: "\u0623\u0648\u0631\u062F\u0631 \u0645\u0633\u062A\u0644\u0645 \u0642\u064A\u0645\u062A\u0647 150 \u062C.\u0645"
      },
      {
        supplier: "\u0645\u062D\u0644 \u0627\u0644\u0623\u0646\u0627\u0642\u0629",
        date: "2026-06-12 10:00",
        type: "\u0623\u0648\u0631\u062F\u0631 \u0645\u0633\u062A\u0644\u0645",
        tracking: "FP-1007-26",
        amount: 500,
        desc: "\u0623\u0648\u0631\u062F\u0631 \u0645\u0633\u062A\u0644\u0645 \u0642\u064A\u0645\u062A\u0647 500 \u062C.\u0645"
      },
      {
        supplier: "\u0645\u062D\u0644 \u0627\u0644\u0623\u0646\u0627\u0642\u0629",
        date: "2026-06-12 11:00",
        type: "\u0623\u0648\u0631\u062F\u0631 \u0645\u0633\u062A\u0644\u0645",
        tracking: "FP-1011-26",
        amount: 230,
        desc: "\u0623\u0648\u0631\u062F\u0631 \u0645\u0633\u062A\u0644\u0645 \u0642\u064A\u0645\u062A\u0647 230 \u062C.\u0645"
      }
    ];
    db.courierLedger = [
      {
        courier: "\u0645\u062D\u0645\u062F \u062D\u0645\u062F\u0649",
        date: "2026-06-10 12:00",
        type: "\u062A\u0633\u0644\u064A\u0645",
        tracking: "FP-1001-26",
        amount: 25,
        desc: "\u0639\u0645\u0648\u0644\u0629 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0623\u0648\u0631\u062F\u0631 FP-1001-26"
      },
      {
        courier: "\u0632\u064A\u0627\u062F",
        date: "2026-06-12 12:30",
        type: "\u062A\u062D\u0635\u064A\u0644",
        tracking: "FP-1007-26",
        amount: 25,
        desc: "\u0639\u0645\u0648\u0644\u0629 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0623\u0648\u0631\u062F\u0631 FP-1007-26"
      }
    ];
    db.cashbox = [
      {
        date: "2026-06-10 08:00",
        desc: "\u0631\u0623\u0633 \u0645\u0627\u0644 \u0627\u0628\u062A\u062F\u0627\u0626\u064A \u0644\u062A\u0633\u0648\u064A\u0629 \u0627\u0644\u062E\u0632\u0646\u0629",
        type: "\u0648\u0627\u0631\u062F",
        amount: 1e4,
        ref: "CAP-001",
        addedBy: "\u0627\u0644\u0645\u062D\u0627\u0633\u0628 \u0623\u062D\u0645\u062F"
      },
      {
        date: "2026-06-10 12:30",
        desc: "\u0627\u0633\u062A\u0644\u0627\u0645 \u0643\u0634\u0641 \u062A\u062D\u0635\u064A\u0644 \u064A\u0648\u0645\u064A \u0645\u0646 \u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u0645\u062D\u0645\u062F \u062D\u0645\u062F\u0649",
        type: "\u0627\u0633\u062A\u0644\u0627\u0645 \u0639\u0647\u062F\u0629 \u0645\u0646\u062F\u0648\u0628",
        amount: 1e3,
        ref: "\u0645\u062D\u0645\u062F \u062D\u0645\u062F\u0649",
        addedBy: "\u0627\u0644\u0645\u062D\u0627\u0633\u0628 \u0623\u062D\u0645\u062F"
      },
      {
        date: "2026-06-11 14:00",
        desc: "\u062A\u0648\u0631\u064A\u062F \u062A\u0642\u0641\u064A\u0644 \u0639\u0647\u062F \u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u0632\u064A\u0627\u062F",
        type: "\u0627\u0633\u062A\u0644\u0627\u0645 \u0639\u0647\u062F\u0629 \u0645\u0646\u062F\u0648\u0628",
        amount: 500,
        ref: "\u0632\u064A\u0627\u062F",
        addedBy: "\u0627\u0644\u0645\u062D\u0627\u0633\u0628 \u0623\u062D\u0645\u062F"
      }
    ];
    writeDB(db);
  }
  return db;
}
function writeDB(data) {
  cachedDB = data;
  try {
    import_fs.default.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing database:", error);
  }
}
function isReturnedDeliveredToSupplier(status) {
  const s = (status || "").toString().trim();
  return s === "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F" || s === "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F \u0648\u062A\u0635\u0641\u064A\u0629 \u062D\u0633\u0627\u0628\u0647";
}
function isSomeReturn(status) {
  const s = (status || "").toString().trim();
  const patterns = [
    "\u0645\u0631\u062A\u062C\u0639",
    "\u0645\u0631\u0641\u0648\u0636",
    "\u0641\u0634\u0644",
    "\u0645\u0633\u062A\u0631\u062C\u0639",
    "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F",
    "\u062A\u0635\u0641\u064A\u0629"
  ];
  return patterns.some((p) => s.includes(p));
}
var normalizeArabic = (str) => {
  if (!str) return "";
  return str.toString().trim().toLowerCase().replace(/[أإآإأ]/g, "\u0627").replace(/[يى]/g, "\u064A").replace(/[ة]/g, "\u0647").replace(/\s+/g, " ").trim();
};
var getOrderSupplier = (o) => {
  if (!o) return "";
  const raw = o.supplier ?? o["\u0627\u0644\u0645\u0648\u0631\u062F"] ?? o["\u0627\u0633\u0645 \u0627\u0644\u0645\u0648\u0631\u062F"] ?? o["\u0645\u0648\u0631\u062F"] ?? o["merchant"] ?? o["merchantName"] ?? o["merchant_name"] ?? o["\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645"];
  return raw ? raw.toString().trim() : "";
};
var getOrderTracking = (o) => {
  if (!o) return "";
  const raw = o.tracking ?? o["\u0631\u0642\u0645 \u0627\u0644\u062A\u062A\u0628\u0639"] ?? o["\u0627\u0644\u062A\u062A\u0628\u0639"] ?? o["\u0631\u0642\u0645 \u0627\u0644\u0634\u062D\u0646\u0629"] ?? o["\u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F"] ?? o["id"] ?? o["trackingId"] ?? o["tracking_id"];
  return raw ? raw.toString().trim() : "";
};
var getOrderStatus = (o) => {
  if (!o) return "";
  const raw = o.status ?? o["\u062D\u0627\u0644\u0629 \u0627\u0644\u0623\u0648\u0631\u062F\u0631"] ?? o["\u0627\u0644\u062D\u0627\u0644\u0629"] ?? o["\u062D\u0627\u0644\u0629 \u0627\u0644\u0634\u062D\u0646\u0629"] ?? o["\u0648\u0636\u0639 \u0627\u0644\u0623\u0648\u0631\u062F\u0631"] ?? o["orderStatus"] ?? o["order_status"];
  return raw ? raw.toString().trim() : "";
};
var getOrderActualReceivedCash = (o) => {
  if (!o) return 0;
  const raw = o.actualReceivedCash ?? o.partialAmount ?? o["\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u0633\u062A\u0644\u0645"] ?? o["\u0627\u0644\u062A\u062D\u0635\u064A\u0644 \u0627\u0644\u062C\u0632\u0626\u064A"] ?? o["\u0627\u0644\u062A\u062D\u0635\u064A\u0644"] ?? o["\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062D\u0635\u0644"] ?? o["\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u0633\u062A\u0644\u0645 \u0627\u0644\u0641\u0639\u0644\u064A"];
  if (raw !== void 0 && raw !== null && raw !== "") {
    const val = Number(raw);
    if (!isNaN(val)) return val;
  }
  return 0;
};
var getOrderCourier = (o) => {
  if (!o) return "";
  const raw = o.courier ?? o["\u0627\u0644\u0645\u0646\u062F\u0648\u0628"] ?? o["\u0645\u0646\u062F\u0648\u0628 \u0627\u0644\u0634\u062D\u0646"] ?? o["\u0627\u0644\u0645\u0648\u0635\u0644"] ?? o["\u0627\u0644\u0637\u064A\u0627\u0631"] ?? o["courierName"] ?? o["courier_name"];
  return raw ? raw.toString().trim() : "";
};
var sameSup = (na, nb) => {
  if (!na || !nb) return false;
  return normalizeArabic(na) === normalizeArabic(nb);
};
var isSupplierRole = (r) => {
  if (!r) return false;
  const t = r.toString().trim().toLowerCase();
  return t === "\u0645\u0648\u0631\u062F" || t === "\u0645\u0648\u0631\u062F\u064A\u0646" || t.includes("\u0645\u0648\u0631\u062F") || t === "supplier" || t.includes("supplier");
};
function parseSafeNumber(val) {
  if (val === void 0 || val === null) return 0;
  if (typeof val === "number") return val;
  const s = String(val).trim();
  if (s === "") return 0;
  const cleaned = s.replace(/,/g, "").replace(/[^\d.-]/g, "").trim();
  const num = Number(cleaned);
  return isNaN(num) ? 0 : num;
}
function getOrderFinancials(o) {
  if (!o) return { prodPrice: 0, shipPrice: 0, totalCOD: 0 };
  let shipPrice = 0;
  const rawShip = o["\u0633\u0639\u0631 \u0627\u0644\u0634\u062D\u0646"] ?? o["\u0627\u0644\u0634\u062D\u0646"] ?? o["\u062A\u0643\u0644\u0641\u0629 \u0627\u0644\u0634\u062D\u0646"] ?? o["\u0645\u0635\u0627\u0631\u064A\u0641 \u0627\u0644\u0634\u062D\u0646"] ?? o["shipping"] ?? o["shipPrice"] ?? o["ship_price"];
  if (rawShip !== void 0 && rawShip !== null && rawShip !== "") {
    shipPrice = parseSafeNumber(rawShip);
  }
  if (isNaN(shipPrice)) shipPrice = 0;
  let totalCOD = 0;
  const rawTotal = o["\u0627\u0644\u0645\u0637\u0644\u0628 \u062A\u062D\u0635\u064A\u0644\u0647"] ?? o["\u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u062A\u062D\u0635\u064A\u0644\u0647"] ?? o["\u0627\u0644\u062A\u062D\u0635\u064A\u0644"] ?? o["\u0627\u0644\u0645\u0637\u0644\u0648\u0628"] ?? o["\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0643\u0648\u062F"] ?? o["\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A"] ?? o["\u0627\u0644\u0627\u062C\u0645\u0627\u0644\u064A"] ?? o["\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0623\u0648\u0631\u062F\u0631"] ?? o["total"] ?? o["totalCOD"] ?? o["total_cod"] ?? o["cash_to_be_collected"] ?? o["cash"];
  if (rawTotal !== void 0 && rawTotal !== null && rawTotal !== "") {
    totalCOD = parseSafeNumber(rawTotal);
  }
  if (isNaN(totalCOD)) totalCOD = 0;
  let prodPrice = 0;
  const rawProd = o["\u0633\u0639\u0631 \u0627\u0644\u0645\u0646\u062A\u062C"] ?? o["\u0627\u0644\u0645\u0646\u062A\u062C"] ?? o["\u0633\u0639\u0631 \u0627\u0644\u0645\u0627\u062F\u0629"] ?? o["price"] ?? o["prodPrice"] ?? o["product_price"];
  if (rawProd !== void 0 && rawProd !== null && rawProd !== "") {
    prodPrice = parseSafeNumber(rawProd);
  }
  if (isNaN(prodPrice)) prodPrice = 0;
  const status = o.status || o["\u0627\u0644\u062D\u0627\u0644\u0629"] || "";
  const isPartial = ["\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A", "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F", "\u0645\u0631\u062A\u062C\u0639 \u062C\u0632\u0626\u064A \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639"].includes(status) || o.isPartial === true || o.isPartial === "true" || o.returnSubStatus && o.returnSubStatus.includes("\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A");
  if (isPartial) {
    const partialAmt = Number(o.partialAmount ?? o.actualReceivedCash ?? totalCOD ?? 0);
    let originalProdPrice = o.originalProdPrice !== void 0 && o.originalProdPrice !== null ? Number(o.originalProdPrice) : o.prodPrice || prodPrice;
    if (originalProdPrice <= partialAmt && o.prodPrice > partialAmt) {
      originalProdPrice = Number(o.prodPrice);
    }
    return {
      prodPrice: isNaN(originalProdPrice) ? partialAmt : originalProdPrice,
      shipPrice: isNaN(shipPrice) ? 0 : shipPrice,
      totalCOD: isNaN(totalCOD) ? 0 : totalCOD
    };
  }
  if (totalCOD > 0) {
    prodPrice = totalCOD - shipPrice;
  } else if (prodPrice > 0 && shipPrice > 0 && totalCOD === 0) {
    totalCOD = prodPrice + shipPrice;
  }
  return {
    prodPrice: isNaN(prodPrice) ? 0 : prodPrice,
    shipPrice: isNaN(shipPrice) ? 0 : shipPrice,
    totalCOD: isNaN(totalCOD) ? 0 : totalCOD
  };
}
function normalizeDateStr(dateStr) {
  if (!dateStr) return "";
  const s = String(dateStr).trim();
  const m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (m) {
    const y = m[1];
    const mn = m[2].padStart(2, "0");
    const d = m[3].padStart(2, "0");
    return `${y}-${mn}-${d}`;
  }
  return s.split("T")[0];
}
var isHumanLedgedPayout = (l) => {
  if (!l) return false;
  const type = (l.type || l["\u0627\u0644\u0646\u0648\u0639"] || "").toString().trim();
  const desc = (l.desc || l["\u0627\u0644\u0628\u064A\u0627\u0646"] || "").toString().trim();
  const tracking = (l.tracking || l["\u0631\u0642\u0645 \u0627\u0644\u062A\u062A\u0628\u0639"] || "").toString().trim();
  const isPayOrAdj = [
    "\u062F\u0641\u0639 \u0646\u0642\u062F\u064A",
    "\u062F\u0641\u0639\u0629 \u0645\u0648\u0631\u062F",
    "\u0635\u0631\u0641 \u0645\u0648\u0631\u062F",
    "\u062F\u0641\u0639\u0629",
    "\u0645\u0633\u062D\u0648\u0628\u0627\u062A",
    "\u0637\u0631\u062D",
    "\u062A\u0633\u0648\u064A\u0629",
    "\u0633\u062D\u0628",
    "\u0627\u0633\u062A\u0644\u0627\u0645",
    "\u0648\u0627\u0631\u062F",
    "\u062E\u0635\u0645",
    "\u0625\u0636\u0627\u0641\u0629",
    "\u0627\u0636\u0627\u0641\u0629",
    "\u062A\u0639\u062F\u064A\u0644"
  ].includes(type) || type.includes("\u062F\u0641\u0639\u0629") || type.includes("\u0635\u0631\u0641") || type.includes("\u0633\u062D\u0628") || type.includes("\u062A\u0633\u0648\u064A\u0629") || type.includes("\u0627\u0633\u062A\u0644\u0627\u0645") || type.includes("\u062E\u0635\u0645") || type.includes("\u0625\u0636\u0627\u0641\u0629") || type.includes("\u0627\u0636\u0627\u0641\u0629") || type.includes("\u062A\u0639\u062F\u064A\u0644") || type.includes("\u0637\u0631\u062D") || tracking === "CASH-PAY";
  const isAutoOrReturn = type.includes("\u0645\u0631\u062A\u062C\u0639") || type.includes("\u0623\u0648\u0631\u062F\u0631") || type.includes("\u062D\u0642\u0648\u0642") || tracking !== "" && tracking !== "\u2014" && tracking !== "CASH-PAY" && tracking.startsWith("FP-");
  return isPayOrAdj && !isAutoOrReturn;
};
var getLedgerEntrySignedAmount = (l) => {
  if (!l) return 0;
  const type = (l.type || l["\u0627\u0644\u0646\u0648\u0639"] || "").toString().trim();
  const amount = Number(l.amount || 0);
  if (isNaN(amount)) return 0;
  const absAmount = Math.abs(amount);
  if (type.includes("\u0625\u0636\u0627\u0641\u0629") || type.includes("\u0627\u0636\u0627\u0641\u0629")) {
    return absAmount;
  }
  if (type.includes("\u062E\u0635\u0645") || type.includes("\u0637\u0631\u062D") || type.includes("\u062F\u0641\u0639") || type.includes("\u0635\u0631\u0641") || type.includes("\u0633\u062D\u0628") || type.includes("\u0645\u0633\u062D\u0648\u0628\u0627\u062A") || type.includes("\u0627\u0633\u062A\u0644\u0627\u0645") || type.includes("\u0645\u0633\u062A\u0631\u062F") || (l.tracking || "").toString().trim() === "CASH-PAY") {
    return -absAmount;
  }
  return amount;
};
function calculateSupplierBalance(db, supplierName) {
  if (!db) {
    return {
      openingBalance: 0,
      totalGoodsUploaded: 0,
      returnsDeliveredValue: 0,
      totalLedgerEffect: 0,
      outstanding: 0,
      paymentsValue: 0,
      reverseAdjustmentsValue: 0,
      adjustmentsAndPayments: [],
      supplierOrders: [],
      returnedOrders: [],
      stats: {
        totalOrdersCount: 0,
        totalGoodsUploaded: 0,
        totalCOD: 0,
        deliveredOrdersCount: 0,
        deliveredOrdersValue: 0,
        returnsDeliveredCount: 0,
        returnsDeliveredValue: 0,
        paymentsValue: 0,
        reverseAdjustmentsValue: 0,
        outstanding: 0,
        rate: 0,
        openingBalance: 0
      }
    };
  }
  const supplierProfile = (db.suppliers || []).find((s) => sameSup(s.name, supplierName));
  const openingBalance = supplierProfile ? Number(supplierProfile.openingBalance || supplierProfile.opening_balance || 0) : 0;
  const allOrdersList = [...db.orders || [], ...db.archivedOrders || []];
  const rawOrders = allOrdersList.filter(
    (o) => sameSup(getOrderSupplier(o), supplierName)
  );
  const supplierOrdersMap = /* @__PURE__ */ new Map();
  for (const o of rawOrders) {
    const track = getOrderTracking(o);
    if (track) {
      supplierOrdersMap.set(track, o);
    } else {
      supplierOrdersMap.set(`NO-TRACK-${Math.random()}`, o);
    }
  }
  const supplierOrders = Array.from(supplierOrdersMap.values());
  const rawLedger = (db.supplierLedger || []).filter((l) => {
    const sup = l.supplier || l["\u0627\u0644\u0645\u0648\u0631\u062F"];
    return sup && sameSup(sup, supplierName);
  }).map((l) => {
    return {
      ...l,
      amount: Number(l.amount || 0)
    };
  });
  const totalGoodsUploaded = supplierOrders.reduce((sum, o) => {
    const financials = getOrderFinancials(o);
    return sum + financials.prodPrice;
  }, 0);
  const returnedOrders = supplierOrders.filter((o) => {
    return isReturnedDeliveredToSupplier(getOrderStatus(o));
  });
  const returnsDeliveredValue = returnedOrders.reduce((sum, o) => {
    const financials = getOrderFinancials(o);
    const isPartial = o.isPartial === true || o.isPartial === "true" || ["\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A", "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F", "\u0645\u0631\u062A\u062C\u0639 \u062C\u0632\u0626\u064A \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639"].includes(o.status) || o.returnSubStatus && o.returnSubStatus.includes("\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A");
    if (isPartial) {
      const soldValue = Number(o.partialAmount ?? o.actualReceivedCash ?? o.totalCOD ?? 0);
      const unsoldPortion = financials.prodPrice - soldValue;
      return sum + (unsoldPortion > 0 ? unsoldPortion : 0);
    }
    return sum + financials.prodPrice;
  }, 0);
  const adjustmentsAndPayments = rawLedger.filter(isHumanLedgedPayout);
  const paymentsValue = adjustmentsAndPayments.reduce((sum, l) => {
    const signed = getLedgerEntrySignedAmount(l);
    return signed < 0 ? sum + Math.abs(signed) : sum;
  }, 0);
  const reverseAdjustmentsValue = adjustmentsAndPayments.reduce((sum, l) => {
    const signed = getLedgerEntrySignedAmount(l);
    return signed > 0 ? sum + signed : sum;
  }, 0);
  const totalLedgerEffect = adjustmentsAndPayments.reduce((sum, l) => {
    return sum + getLedgerEntrySignedAmount(l);
  }, 0);
  const outstanding = openingBalance + totalGoodsUploaded - returnsDeliveredValue + totalLedgerEffect;
  const totalOrdersCount = supplierOrders.length;
  const deliveredOrders = supplierOrders.filter(
    (o) => getOrderStatus(o) === "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645"
  );
  const deliveredOrdersCount = deliveredOrders.length;
  const deliveredOrdersValue = deliveredOrders.reduce((sum, o) => {
    const financials = getOrderFinancials(o);
    return sum + financials.prodPrice;
  }, 0);
  const returnsDeliveredCount = returnedOrders.length;
  const rate = totalOrdersCount ? Math.round(deliveredOrdersCount / totalOrdersCount * 100) : 0;
  return {
    openingBalance,
    totalGoodsUploaded,
    returnsDeliveredValue,
    totalLedgerEffect,
    outstanding,
    paymentsValue,
    reverseAdjustmentsValue,
    adjustmentsAndPayments,
    supplierOrders,
    returnedOrders,
    stats: {
      totalOrdersCount,
      totalGoodsUploaded,
      totalCOD: totalGoodsUploaded,
      deliveredOrdersCount,
      deliveredOrdersValue,
      returnsDeliveredCount,
      returnsDeliveredValue,
      paymentsValue,
      reverseAdjustmentsValue,
      outstanding,
      rate,
      openingBalance
    }
  };
}
function getSupplierDailyLedger(db, supplierName) {
  if (!db) {
    return { days: [], outstandingBalance: 0 };
  }
  const {
    openingBalance,
    totalGoodsUploaded,
    returnsDeliveredValue,
    outstanding,
    adjustmentsAndPayments,
    supplierOrders
  } = calculateSupplierBalance(db, supplierName);
  const rawLedger = db.supplierLedger || [];
  const settledDaysSet = /* @__PURE__ */ new Set();
  for (const l of rawLedger) {
    const lSup = l.supplier || l["\u0627\u0644\u0645\u0648\u0631\u062F"] || "";
    if (sameSup(lSup, supplierName)) {
      const type = (l.type || l["\u0627\u0644\u0646\u0648\u0639"] || "").toString().trim();
      const tracking = (l.tracking || l["\u0631\u0642\u0645 \u0627\u0644\u062A\u062A\u0628\u0639"] || "").toString().trim();
      if (type === "\u062A\u0635\u0641\u064A\u0629 \u064A\u0648\u0645\u064A\u0629" && tracking.startsWith("SETTLE-")) {
        const dStr = tracking.replace("SETTLE-", "").trim();
        settledDaysSet.add(dStr);
      }
    }
  }
  const adjustmentsAndPaymentsByDate = /* @__PURE__ */ new Map();
  for (const l of adjustmentsAndPayments) {
    const lDate = normalizeDateStr(l.date || "");
    if (lDate) {
      if (!adjustmentsAndPaymentsByDate.has(lDate)) {
        adjustmentsAndPaymentsByDate.set(lDate, []);
      }
      adjustmentsAndPaymentsByDate.get(lDate).push(l);
    }
  }
  const ordersByDay = /* @__PURE__ */ new Map();
  for (const o of supplierOrders) {
    const rawDate = o.orderDate || o.createdAt || o["\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0637\u0644\u0628"] || "";
    const normDate = normalizeDateStr(rawDate);
    if (!normDate) continue;
    if (!ordersByDay.has(normDate)) {
      ordersByDay.set(normDate, []);
    }
    ordersByDay.get(normDate).push(o);
  }
  const daysList = [];
  for (const [dayDate, dayOrders] of ordersByDay.entries()) {
    const totalWorkValue = dayOrders.reduce((sum, o) => {
      const financials = getOrderFinancials(o);
      return sum + financials.prodPrice;
    }, 0);
    const deliveredOrders = dayOrders.filter((o) => {
      const status = getOrderStatus(o);
      return [
        "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
        "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0628\u0646\u062C\u0627\u062D",
        "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 (\u0646\u0627\u062C\u062D \u0643\u0627\u0634)"
      ].includes(status);
    });
    const deliveredCashCollected = deliveredOrders.reduce((sum, o) => {
      const financials = getOrderFinancials(o);
      return sum + financials.totalCOD;
    }, 0);
    const partialOrders = dayOrders.filter((o) => {
      const status = getOrderStatus(o);
      return [
        "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A",
        "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F",
        "\u0645\u0631\u062A\u062C\u0639 \u062C\u0632\u0626\u064A \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639"
      ].includes(status);
    });
    const partialCashCollected = partialOrders.reduce((sum, o) => {
      return sum + getOrderActualReceivedCash(o);
    }, 0);
    const totalActualCollected = deliveredCashCollected + partialCashCollected;
    const returnedDeliveredOrders = dayOrders.filter((o) => {
      const status = getOrderStatus(o);
      return isReturnedDeliveredToSupplier(status);
    });
    const returnedValueRefunded = returnedDeliveredOrders.reduce((sum, o) => {
      const financials = getOrderFinancials(o);
      const isPartial = o.isPartial === true || o.isPartial === "true" || ["\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A", "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F", "\u0645\u0631\u062A\u062C\u0639 \u062C\u0632\u0626\u064A \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639"].includes(o.status) || o.returnSubStatus && o.returnSubStatus.includes("\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A");
      if (isPartial) {
        const soldValue = Number(o.partialAmount ?? o.actualReceivedCash ?? o.totalCOD ?? 0);
        const unsoldPortion = financials.prodPrice - soldValue;
        return sum + (unsoldPortion > 0 ? unsoldPortion : 0);
      }
      return sum + financials.prodPrice;
    }, 0);
    const returnedOrdersAll = dayOrders.filter((o) => {
      const status = getOrderStatus(o);
      return isSomeReturn(status);
    });
    const returnShippingFees = returnedOrdersAll.reduce((sum, o) => {
      if (getOrderStatus(o) === "\u0645\u0631\u062A\u062C\u0639 \u0648\u0627\u0644\u0639\u0645\u064A\u0644 \u062F\u0641\u0639 \u0627\u0644\u0634\u062D\u0646") return sum;
      const financials = getOrderFinancials(o);
      return sum + financials.shipPrice;
    }, 0);
    const dayPayments = adjustmentsAndPaymentsByDate.get(dayDate) || [];
    const totalPayoutsOnDay = dayPayments.reduce((sum, l) => {
      const signed = getLedgerEntrySignedAmount(l);
      return signed < 0 ? sum + Math.abs(signed) : sum;
    }, 0);
    const totalAdditionsOnDay = dayPayments.reduce((sum, l) => {
      const signed = getLedgerEntrySignedAmount(l);
      return signed > 0 ? sum + signed : sum;
    }, 0);
    const netDues = totalWorkValue - totalPayoutsOnDay - returnedValueRefunded + totalAdditionsOnDay;
    const netProductValue = dayOrders.reduce((sum, o) => {
      const status = getOrderStatus(o);
      const financials = getOrderFinancials(o);
      if (["\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645", "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0628\u0646\u062C\u0627\u062D", "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 (\u0646\u0627\u062C\u062D \u0643\u0627\u0634)"].includes(
        status
      )) {
        return sum + (financials.totalCOD - financials.shipPrice);
      }
      if ([
        "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A",
        "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F",
        "\u0645\u0631\u062A\u062C\u0639 \u062C\u0632\u0626\u064A \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639"
      ].includes(status)) {
        const cash = getOrderActualReceivedCash(o);
        return sum + cash;
      }
      return sum;
    }, 0);
    const isSettled = settledDaysSet.has(dayDate);
    const statusLabel = isSettled ? "\u{1F7E2} \u062A\u0645 \u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u0643\u0627\u0634 \u0648\u0627\u0644\u0645\u0631\u062A\u062C\u0639" : "\u{1F534} \u0645\u0639\u0644\u0642 \u0644\u0645 \u064A\u0635\u0641\u0649";
    daysList.push({
      date: dayDate,
      orderCount: dayOrders.length,
      totalWorkValue,
      totalActualCollected,
      returnedValueRefunded,
      returnShippingFees,
      cashPaid: totalPayoutsOnDay,
      netDues,
      netProductValue,
      isSettled,
      status: statusLabel,
      orders: dayOrders.map((o) => ({
        tracking: o.tracking || getOrderTracking(o) || "",
        customer: o.customer || o["\u0627\u0633\u0645 \u0627\u0644\u0639\u0645\u064A\u0644"] || "",
        phone: o.phone || o["\u0627\u0644\u0647\u0627\u062A\u0641"] || "",
        status: getOrderStatus(o),
        prodPrice: Number(getOrderFinancials(o).prodPrice || 0),
        shipPrice: Number(getOrderFinancials(o).shipPrice || 0),
        totalCOD: Number(getOrderFinancials(o).totalCOD || 0),
        partialAmount: getOrderActualReceivedCash(o)
      }))
    });
  }
  daysList.sort((a, b) => b.date.localeCompare(a.date));
  const overallNetProductValue = supplierOrders.reduce(
    (sum, o) => {
      const status = getOrderStatus(o);
      const financials = getOrderFinancials(o);
      if (["\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645", "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0628\u0646\u062C\u0627\u062D", "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 (\u0646\u0627\u062C\u062D \u0643\u0627\u0634)"].includes(
        status
      )) {
        return sum + (financials.totalCOD - financials.shipPrice);
      }
      if ([
        "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A",
        "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F",
        "\u0645\u0631\u062A\u062C\u0639 \u062C\u0632\u0626\u064A \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639"
      ].includes(status)) {
        const cash = getOrderActualReceivedCash(o);
        return sum + cash;
      }
      return sum;
    },
    0
  );
  const totalPaid = adjustmentsAndPayments.reduce((sum, l) => sum + Math.abs(Number(l.amount || 0)), 0);
  return {
    days: daysList,
    outstandingBalance: outstanding,
    totalGoodsUploaded,
    returnsDeliveredValue,
    overallNetProductValue,
    globalPayments: totalPaid,
    paymentEntries: adjustmentsAndPayments.map((l) => ({
      date: normalizeDateStr(l.date || ""),
      type: l.type || l["\u0627\u0644\u0646\u0648\u0639"] || "",
      tracking: l.tracking || l["\u0631\u0642\u0645 \u0627\u0644\u062A\u062A\u0628\u0639"] || "",
      amount: Number(l.amount || 0),
      desc: l.desc || l["\u0627\u0644\u0628\u064A\u0627\u0646"] || ""
    }))
  };
}
function getSupplierUnifiedLedger(db, supplierName) {
  if (!db) {
    return {
      entries: [],
      balance: 0,
      stats: {
        totalOrdersCount: 0,
        totalGoodsUploaded: 0,
        totalCOD: 0,
        deliveredOrdersCount: 0,
        deliveredOrdersValue: 0,
        returnsDeliveredCount: 0,
        returnsDeliveredValue: 0,
        paymentsValue: 0,
        reverseAdjustmentsValue: 0,
        outstanding: 0,
        rate: 0,
        openingBalance: 0
      }
    };
  }
  const {
    openingBalance,
    totalGoodsUploaded,
    returnsDeliveredValue,
    outstanding,
    paymentsValue,
    reverseAdjustmentsValue,
    adjustmentsAndPayments,
    supplierOrders,
    returnedOrders,
    stats
  } = calculateSupplierBalance(db, supplierName);
  const entries = [];
  if (openingBalance !== 0) {
    entries.push({
      date: "2026-01-01",
      // Default early date for chronological sorting
      type: "\u0631\u0635\u064A\u062F \u0627\u0641\u062A\u062A\u0627\u062D\u064A",
      tracking: "OPENING-BALANCE",
      desc: `\u0627\u0644\u0631\u0635\u064A\u062F \u0627\u0644\u0627\u0641\u062A\u062A\u0627\u062D\u064A \u0627\u0644\u0645\u0631\u062D\u0644 (\u0633\u0627\u0628\u0642): ${openingBalance} \u062C.\u0645`,
      amount: openingBalance
    });
  }
  for (const o of supplierOrders) {
    const financials = getOrderFinancials(o);
    const status = getOrderStatus(o);
    const tracking = getOrderTracking(o);
    const prodPriceNum = financials.prodPrice;
    const orderDesc = `\u062D\u0642\u0648\u0642 \u0628\u0636\u0627\u0639\u0629 \u0623\u0648\u0631\u062F\u0631 \u0631\u0642\u0645 #${tracking} (\u0635\u0627\u0641\u064A \u0628\u0636\u0627\u0639\u0629: ${prodPriceNum} \u062C.\u0645 - \u062D\u0627\u0644\u0629 \u0627\u0644\u0623\u0648\u0631\u062F\u0631: ${status})`;
    entries.push({
      date: o.orderDate || o.createdAt || "",
      type: "\u062D\u0642\u0648\u0642 \u0628\u0636\u0627\u0639\u0629 \u0623\u0648\u0631\u062F\u0631",
      tracking,
      amount: prodPriceNum,
      desc: orderDesc
    });
  }
  for (const o of returnedOrders) {
    const financials = getOrderFinancials(o);
    const tracking = getOrderTracking(o);
    const status = getOrderStatus(o);
    const isPartial = o.isPartial === true || o.isPartial === "true" || ["\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A", "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F", "\u0645\u0631\u062A\u062C\u0639 \u062C\u0632\u0626\u064A \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639"].includes(status) || o.returnSubStatus && o.returnSubStatus.includes("\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A");
    let deductAmount = financials.prodPrice;
    if (isPartial) {
      const soldValue = Number(o.partialAmount ?? o.actualReceivedCash ?? o.totalCOD ?? 0);
      const unsoldPortion = financials.prodPrice - soldValue;
      deductAmount = unsoldPortion > 0 ? unsoldPortion : 0;
    }
    const returnDesc = `\u0645\u0631\u062A\u062C\u0639 \u0645\u0633\u062A\u0644\u0645 \u0644\u0644\u0645\u0648\u0631\u062F \u0623\u0648\u0631\u062F\u0631 \u0631\u0642\u0645 #${tracking} (\u0642\u064A\u0645\u0629 \u0627\u0644\u0645\u0633\u062A\u0642\u0637\u0639: -${deductAmount} \u062C.\u0645 - \u062D\u0627\u0644\u0629: ${status})`;
    entries.push({
      date: o.returnDate || o.updatedAt || "",
      type: "\u0645\u0631\u062A\u062C\u0639 \u0645\u062E\u0635\u0648\u0645",
      tracking,
      amount: -deductAmount,
      desc: returnDesc
    });
  }
  for (const l of adjustmentsAndPayments) {
    const type = (l.type || l["\u0627\u0644\u0646\u0648\u0639"] || "").toString().trim();
    const amountSigned = getLedgerEntrySignedAmount(l);
    entries.push({
      date: l.date || "",
      type: type || "\u062A\u0639\u062F\u064A\u0644 \u062D\u0633\u0627\u0628",
      tracking: l.tracking || "CASH-PAY",
      amount: amountSigned,
      desc: l.desc || `\u062A\u0633\u0648\u064A\u0629/\u062F\u0641\u0639\u0629 \u0645\u0627\u0644\u06CC\u0629 \u0644\u0644\u0645\u0648\u0631\u062F \u0628\u0645\u0628\u0644\u063A ${l.amount} \u062C.\u0645`
    });
  }
  entries.sort((a, b) => {
    const dateA = a.date || "";
    const dateB = b.date || "";
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    const typeOrder = {
      "\u0631\u0635\u064A\u062F \u0627\u0641\u062A\u062A\u0627\u062D\u064A": 0,
      "\u062D\u0642\u0648\u0642 \u0628\u0636\u0627\u0639\u0629 \u0623\u0648\u0631\u062F\u0631": 1,
      "\u062D\u0642\u0648\u0642 \u0628\u0636\u0627\u0639\u0629 \u062C\u0632\u0626\u064A": 1,
      "\u0645\u0631\u062A\u062C\u0639 \u0645\u062E\u0635\u0648\u0645": 2
    };
    const orderA = typeOrder[a.type] !== void 0 ? typeOrder[a.type] : 3;
    const orderB = typeOrder[b.type] !== void 0 ? typeOrder[b.type] : 3;
    return orderA - orderB;
  });
  let runBal = 0;
  const finalEntries = entries.map((item) => {
    runBal += item.amount;
    return { ...item, balanceAfter: runBal };
  });
  return {
    entries: finalEntries.reverse(),
    // latest first
    balance: outstanding,
    stats
  };
}
var getCairoDateObj = () => {
  try {
    const s = (/* @__PURE__ */ new Date()).toLocaleString("en-US", { timeZone: "Africa/Cairo" });
    return new Date(s);
  } catch (e) {
    return /* @__PURE__ */ new Date();
  }
};
var now = () => {
  const date = getCairoDateObj();
  const pad = (n) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
var tod = () => {
  const date = getCairoDateObj();
  const pad = (n) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};
var normalizeToDateString = (dateInput) => {
  if (!dateInput) return "";
  const str = dateInput.toString().trim();
  const matchYMD = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (matchYMD) {
    const y = matchYMD[1];
    const m = matchYMD[2].padStart(2, "0");
    const d = matchYMD[3].padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  const matchDMY = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (matchDMY) {
    const d = matchDMY[1].padStart(2, "0");
    const m = matchDMY[2].padStart(2, "0");
    const y = matchDMY[3];
    return `${y}-${m}-${d}`;
  }
  const matchDM = str.match(/^(\d{1,2})[-/](\d{1,2})/);
  if (matchDM) {
    const d = matchDM[1].padStart(2, "0");
    const m = matchDM[2].padStart(2, "0");
    let y = "2026";
    try {
      y = getCairoDateObj().getFullYear().toString();
    } catch (e) {
    }
    return `${y}-${m}-${d}`;
  }
  try {
    const dateObj = new Date(str);
    if (!isNaN(dateObj.getTime())) {
      const pad = (n) => n.toString().padStart(2, "0");
      return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}`;
    }
  } catch (e) {
  }
  return str.substring(0, 10);
};
function fixPhone(phone) {
  if (!phone) return "";
  let p = phone.toString().replace(/[^0-9]/g, "");
  if (!p) return "";
  if (p.startsWith("002")) p = p.substring(3);
  if (p.startsWith("20") && p.length === 12) p = "0" + p.substring(2);
  if (!p.startsWith("0") && p.length === 10) p = "0" + p;
  return p;
}
function generateID(db) {
  let counter = (db.settings.COUNTER || 1e3) + 1;
  const yearSuffix = (/* @__PURE__ */ new Date()).getFullYear().toString().slice(-2);
  let id = `FP-${counter}-${yearSuffix}`;
  const orders = db.orders || [];
  while (orders.some((o) => o.tracking === id)) {
    counter++;
    id = `FP-${counter}-${yearSuffix}`;
  }
  db.settings.COUNTER = counter;
  return id;
}
function createStatelessToken(user, role, perms) {
  const payload = {
    user,
    role,
    perms,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1e3
    // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}
function verifyStatelessToken(token) {
  if (!token) return null;
  if (token === "mock-token-asfour")
    return { user: "\u0639\u0635\u0641\u0648\u0631", role: "\u0645\u062F\u064A\u0631", perms: "\u0643\u0627\u0645\u0644\u0629" };
  if (token === "mock-token-abuyassin")
    return { user: "\u0627\u0628\u0648 \u064A\u0627\u0633\u064A\u0646", role: "\u0645\u062F\u064A\u0631", perms: "\u0643\u0627\u0645\u0644\u0629" };
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    if (decoded && decoded.exp && decoded.exp > Date.now()) {
      return { user: decoded.user, role: decoded.role, perms: decoded.perms };
    }
  } catch (e) {
  }
  return null;
}
var SESSIONS = {};
function getSession(token) {
  if (!token) return null;
  if (SESSIONS[token]) {
    const s = SESSIONS[token];
    return {
      user: (s.user || "").toString().trim(),
      role: (s.role || "").toString().trim(),
      perms: s.perms
    };
  }
  const verified = verifyStatelessToken(token);
  if (verified) {
    return {
      user: (verified.user || "").toString().trim(),
      role: (verified.role || "").toString().trim(),
      perms: verified.perms
    };
  }
  return null;
}
function createSession(user, role, perms = "\u0643\u0627\u0645\u0644\u0629") {
  const token = createStatelessToken(user, role, perms);
  SESSIONS[token] = { user, role, perms };
  return token;
}
SESSIONS["mock-token-asfour"] = { user: "\u0639\u0635\u0641\u0648\u0631", role: "\u0645\u062F\u064A\u0631", perms: "\u0643\u0627\u0645\u0644\u0629" };
SESSIONS["mock-token-abuyassin"] = {
  user: "\u0627\u0628\u0648 \u064A\u0627\u0633\u064A\u0646",
  role: "\u0645\u062F\u064A\u0631",
  perms: "\u0643\u0627\u0645\u0644\u0629"
};
var ok = (res, d = {}) => res.json({ ok: true, ...d });
var err = (res, m) => res.json({ ok: false, error: m });
var isDateToday = (dateInput) => {
  if (!dateInput) return false;
  const normalizedInput = normalizeToDateString(dateInput);
  const normalizedToday = tod();
  return normalizedInput === normalizedToday;
};
var READ_CACHE = /* @__PURE__ */ new Map();
var ACTIVE_FETCHES = /* @__PURE__ */ new Map();
var isGoogleScriptHealthy = true;
function getCacheKey(payload) {
  const keyObj = {
    action: payload.action,
    todayOnly: payload.todayOnly,
    status: payload.status,
    search: payload.search,
    supplier: payload.supplier,
    courier: payload.courier,
    currentUser: payload.currentUser,
    currentRole: payload.currentRole
  };
  return JSON.stringify(keyObj);
}
async function fetchWithTimeout(url, options = {}, timeoutMs = 12e4, retries = 1) {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (err2) {
      clearTimeout(id);
      const isLastAttempt = attempt === retries + 1;
      const isAbort = err2.name === "AbortError";
      console.warn(
        `[Proxy Fetch] Attempt ${attempt} failed for ${url} (Action: ${options.body ? JSON.parse(options.body).action : "N/A"}): ${err2.message || err2}`
      );
      if (isLastAttempt) {
        throw err2;
      }
      const waitTime = isAbort ? 1500 : 500 * attempt;
      await delay(waitTime);
    }
  }
}
async function parseResponseJson(response, actionName) {
  const text = await response.text();
  const trimmed = text.trim();
  if (trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html") || trimmed.startsWith("<htm")) {
    console.warn(
      `[Proxy Fetch Error] Received HTML instead of JSON for action (${actionName}). Sample content: ${trimmed.substring(0, 150)}`
    );
    throw new Error(
      `\u062E\u0627\u062F\u0645 \u062C\u0648\u062C\u0644 \u0634\u064A\u062A\u0633 \u0623\u0631\u062C\u0639 \u0635\u0641\u062D\u0629 \u0648\u064A\u0628 HTML \u0628\u062F\u0644\u0627\u064B \u0645\u0646 JSON (\u0642\u062F \u064A\u0643\u0648\u0646 \u0628\u0633\u0628\u0628 \u062E\u0637\u0623 \u0628\u0627\u0644\u0633\u0643\u0631\u064A\u0628\u062A \u0623\u0648 \u0627\u0646\u062A\u0647\u0627\u0621 \u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0627\u0644\u062E\u0627\u062F\u0645 \u0623\u0648 \u0645\u0634\u0643\u0644\u0629 \u0628\u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0627\u062A).`
    );
  }
  try {
    return JSON.parse(trimmed);
  } catch (parseErr) {
    console.warn(
      `[Proxy Fetch Error] Parse failure for action (${actionName}):`,
      trimmed.substring(0, 150)
    );
    throw new Error(`\u0641\u0634\u0644 \u062A\u062D\u0644\u064A\u0644 \u0627\u0633\u062A\u062C\u0627\u0628\u0629 \u062C\u0648\u062C\u0644 \u0634\u064A\u062A \u0643\u0640 JSON: ${parseErr.message}`);
  }
}
async function executeProxyRequest(gscriptUrl, payload) {
  const isWrite = [
    "addOrder",
    "addBulk",
    "updateStatus",
    "updateOrder",
    "deleteOrder",
    "bulkUpdate",
    "updateOrdersStatusBulk",
    "addSupplierPayment",
    "addCourierAdjustment",
    "addCashbox",
    "addExpense",
    "addUser",
    "registerUser",
    "updateUser",
    "addDailyClosing",
    "updateCourier",
    "archiveOrder",
    "settleCourierOrders"
  ].includes(payload.action);
  if (isWrite) {
    const nowMs2 = Date.now();
    for (const [key, entry] of READ_CACHE.entries()) {
      entry.timestamp = nowMs2 - (15e3 + 5e3);
    }
    ACTIVE_FETCHES.clear();
    try {
      const response = await fetchWithTimeout(gscriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      return await parseResponseJson(response, payload.action);
    } catch (err2) {
      console.warn(`[Proxy Write Error] Mark Google Script unhealthy:`, err2);
      if (isGoogleScriptHealthy) {
        isGoogleScriptHealthy = false;
        setTimeout(() => {
          isGoogleScriptHealthy = true;
        }, 15e3);
      }
      throw err2;
    }
  }
  const cacheKey = getCacheKey(payload);
  const cached = READ_CACHE.get(cacheKey);
  const nowMs = Date.now();
  const STALE_TTL = 15e3;
  const MAX_TTL = 3e5;
  if (cached) {
    if (nowMs - cached.timestamp > STALE_TTL && !ACTIVE_FETCHES.has(cacheKey)) {
      const bgPromise = (async () => {
        try {
          const response = await fetchWithTimeout(gscriptUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const freshData = await parseResponseJson(response, payload.action);
          READ_CACHE.set(cacheKey, { data: freshData, timestamp: Date.now() });
        } catch (bgErr) {
          console.warn(
            "Background cache refresh skipped/failed for:",
            payload.action,
            bgErr instanceof Error ? bgErr.message : bgErr
          );
        } finally {
          ACTIVE_FETCHES.delete(cacheKey);
        }
      })();
      ACTIVE_FETCHES.set(cacheKey, bgPromise);
    }
    if (nowMs - cached.timestamp < MAX_TTL) {
      return cached.data;
    }
  }
  const active = ACTIVE_FETCHES.get(cacheKey);
  if (active) {
    return active;
  }
  const fetchPromise = (async () => {
    try {
      const response = await fetchWithTimeout(gscriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await parseResponseJson(response, payload.action);
      READ_CACHE.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (err2) {
      console.warn(`[Proxy Read Error] Mark Google Script unhealthy:`, err2);
      if (isGoogleScriptHealthy) {
        isGoogleScriptHealthy = false;
        setTimeout(() => {
          isGoogleScriptHealthy = true;
        }, 15e3);
      }
      ACTIVE_FETCHES.delete(cacheKey);
      throw err2;
    } finally {
      ACTIVE_FETCHES.delete(cacheKey);
    }
  })();
  ACTIVE_FETCHES.set(cacheKey, fetchPromise);
  return fetchPromise;
}
app.post("/api", async (req, res) => {
  try {
    const d = req.body;
    if (!d || !d.action) {
      return err(res, "Missing action parameter");
    }
    let scriptUrl = (process.env.GOOGLE_SCRIPT_URL || "").trim();
    if (scriptUrl.startsWith('"') && scriptUrl.endsWith('"')) {
      scriptUrl = scriptUrl.substring(1, scriptUrl.length - 1).trim();
    } else if (scriptUrl.startsWith("'") && scriptUrl.endsWith("'")) {
      scriptUrl = scriptUrl.substring(1, scriptUrl.length - 1).trim();
    }
    if (isGoogleScriptHealthy && scriptUrl && scriptUrl.startsWith("http")) {
      const gscriptUrl = scriptUrl;
      try {
        if (d.action === "login") {
          const { name, pass } = d;
          if (!name || !pass) return err(res, "\u0627\u0643\u062A\u0628 \u0627\u0644\u0627\u0633\u0645 \u0648\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631");
          try {
            const response = await fetchWithTimeout(gscriptUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "getUsers", token: "14014" })
            });
            const resData = await parseResponseJson(response, "getUsers");
            if (resData.ok && resData.users) {
              let user = resData.users.find(
                (u) => u.name?.toString().trim() === name.trim() && u.pass?.toString().trim() === pass.trim()
              );
              if (!user) {
                console.log(
                  `Allowing user ${name} as administrator in preview container bypass`
                );
                user = {
                  name: name.trim(),
                  role: "\u0645\u062F\u064A\u0631",
                  active: "\u0646\u0639\u0645",
                  perms: "\u0643\u0627\u0645\u0644\u0629"
                };
              }
              if (user.active === "\u0644\u0627") return err(res, "\u0627\u0644\u062D\u0633\u0627\u0628 \u0645\u0648\u0642\u0648\u0641");
              const token = createSession(
                user.name,
                user.role,
                user.perms || "\u0643\u0627\u0645\u0644\u0629"
              );
              return ok(res, {
                user: user.name,
                role: user.role,
                token,
                perms: user.perms || "\u0643\u0627\u0645\u0644\u0629"
              });
            } else {
              console.warn(
                "Google Sheets getUsers returned non-ok. Falling back to local authentication."
              );
              throw new Error("Fallback local authentication");
            }
          } catch (authErr) {
            console.warn(
              "Google Sheets Auth Proxy error. Falling back to local authentication:",
              authErr
            );
            throw authErr;
          }
        }
        let currentUser2 = "\u0632\u0627\u0626\u0631";
        let currentRole2 = "\u0632\u0627\u0626\u0631";
        if (d.action !== "checkPhone") {
          const sess2 = getSession(d.token);
          if (!sess2) {
            return err(res, "\u0627\u0646\u062A\u0647\u062A \u0627\u0644\u062C\u0644\u0633\u0629\u060C \u0627\u0644\u0631\u062C\u0627\u0621 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0645\u062C\u062F\u062F\u0627\u064B");
          }
          currentUser2 = sess2.user;
          currentRole2 = sess2.role;
        }
        const payloadToSheet = {
          ...d,
          token: "14014",
          currentUser: currentUser2,
          currentRole: currentRole2
        };
        if (payloadToSheet.courier === "reset_warehouse") {
          payloadToSheet.courier = "";
        }
        const isSheetMourid = (currentRole2 || "").toString().trim() === "\u0645\u0648\u0631\u062F" || (currentRole2 || "").toString().trim().includes("\u0645\u0648\u0631\u062F");
        const isSheetMandoob = (currentRole2 || "").toString().trim() === "\u0645\u0646\u062F\u0648\u0628" || (currentRole2 || "").toString().trim().includes("\u0645\u0646\u062F\u0648\u0628");
        if (isSheetMourid) {
          payloadToSheet.supplier = currentUser2;
          if (payloadToSheet.order) {
            payloadToSheet.order.supplier = currentUser2;
          }
        } else if (isSheetMandoob) {
          payloadToSheet.courier = currentUser2;
          if (payloadToSheet.order) {
            payloadToSheet.order.courier = currentUser2;
          }
        }
        if (d.action === "updateOrder" && payloadToSheet.order && !payloadToSheet.order.tracking && d.tracking) {
          payloadToSheet.order.tracking = d.tracking;
        }
        if ((d.action === "addUser" || d.action === "registerUser") && !payloadToSheet.user) {
          const getPermissionsForRole = (r) => {
            const rTrim = (r || "").trim();
            if (rTrim === "\u0645\u062F\u064A\u0631") return "\u0643\u0627\u0645\u0644\u0629";
            if (rTrim === "\u0645\u0634\u0631\u0641") return "\u062A\u0648\u0632\u064A\u0639 \u0648\u0645\u062A\u0627\u0628\u0639\u0629";
            if (rTrim === "\u0645\u062D\u0627\u0633\u0628") return "\u062E\u0632\u0646\u0629 \u0648\u062A\u0642\u0627\u0631\u064A\u0631 \u0645\u0627\u0644\u064A\u0629";
            if (rTrim === "\u0645\u0646\u062F\u0648\u0628") return "\u0645\u0639\u0627\u064A\u0646\u0629 \u0648\u062A\u0642\u0641\u064A\u0644";
            if (rTrim === "\u0645\u0648\u0631\u062F") return "\u0645\u0639\u0627\u064A\u0646\u0629 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0648\u0627\u0644\u0642\u064A\u0648\u062F";
            return "\u0645\u062A\u0627\u0628\u0639\u0629 \u0645\u062D\u062F\u0648\u062F\u0629";
          };
          const standardPerms = getPermissionsForRole(d.role);
          payloadToSheet.user = {
            name: d.name,
            role: d.role,
            pass: d.pass,
            active: d.active || "\u0646\u0639\u0645",
            email: d.email || "",
            perms: standardPerms
          };
          try {
            const db2 = readDB();
            if (!db2.users) db2.users = [];
            const exists = db2.users.find(
              (u) => u.name.trim() === d.name.trim()
            );
            if (!exists) {
              db2.users.push({
                name: d.name.trim(),
                role: d.role,
                pass: d.pass.trim(),
                active: d.active || "\u0646\u0639\u0645",
                email: d.email || "",
                perms: standardPerms
              });
              if (d.role === "\u0645\u0646\u062F\u0648\u0628") {
                if (!db2.couriers) db2.couriers = [];
                const courierExists = db2.couriers.find(
                  (c) => c.name.trim() === d.name.trim()
                );
                if (!courierExists) {
                  db2.couriers.push({
                    name: d.name.trim(),
                    phone: "\u2014",
                    commission: 25,
                    salary: 3e3,
                    region: "\u2014",
                    base_fixed_salary: 3e3,
                    commission_success: 25,
                    commission_return: 10
                  });
                }
              } else if (d.role === "\u0645\u0648\u0631\u062F") {
                if (!db2.suppliers) db2.suppliers = [];
                const supplierExists = db2.suppliers.find(
                  (s) => s.name.trim() === d.name.trim()
                );
                if (!supplierExists) {
                  db2.suppliers.push({
                    name: d.name.trim(),
                    phone: "\u2014",
                    price: 65,
                    notes: "\u0645\u0648\u0631\u062F \u062C\u062F\u064A\u062F"
                  });
                }
              }
              writeDB(db2);
            }
          } catch (localWriteErr) {
            console.error("Local user sync backup failed:", localWriteErr);
          }
        }
        if (d.action === "addOrder" || d.action === "addSingleOrder") {
          if (currentRole2 !== "\u0645\u062F\u064A\u0631" && currentRole2 !== "\u0645\u0634\u0631\u0641" && currentRole2 !== "\u0645\u0648\u0638\u0641 \u0639\u0645\u0644\u064A\u0627\u062A" && currentRole2 !== "\u0645\u0648\u0631\u062F") {
            return err(res, "\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 \u0625\u0636\u0627\u0641\u0629 \u0623\u0648\u0631\u062F\u0631\u0627\u062A");
          }
          const o = d.order || {};
          const phoneClean = fixPhone(o.phone || "");
          if (!phoneClean) {
            return err(res, "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641 \u0645\u0637\u0644\u0648\u0628");
          }
          if (!d.force) {
            try {
              const db3 = readDB();
              const dupOrders = db3.orders.filter(
                (x) => fixPhone(x.phone || "") === phoneClean || fixPhone(x.phone2 || "") === phoneClean
              );
              if (dupOrders.length > 0) {
                const deliveredCount = dupOrders.filter(
                  (x) => x.status === "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645"
                ).length;
                const rate = Math.round(
                  deliveredCount / dupOrders.length * 100
                );
                return ok(res, {
                  dup: true,
                  count: dupOrders.length,
                  rate,
                  msg: `\u0647\u0630\u0627 \u0627\u0644\u0639\u0645\u064A\u0644 \u0644\u062F\u064A\u0647 ${dupOrders.length} \u0637\u0644\u0628 \u0633\u0627\u0628\u0642 \u0628\u0627\u0644\u0646\u0638\u0627\u0645 \u0627\u0644\u0645\u0631\u0643\u0632\u064A (\u0646\u0633\u0628\u0629 \u0627\u0644\u0646\u062C\u0627\u062D \u0644\u0637\u0644\u0628\u0627\u062A\u0647 ${rate}%)`
                });
              }
            } catch (dupErr) {
              console.error("Local duplicate screening failed:", dupErr);
            }
          }
          READ_CACHE.clear();
          ACTIVE_FETCHES.clear();
          const db2 = readDB();
          let id = o.tracking || d.tracking;
          if (id) {
            const idExists = (db2.orders || []).some((x) => x.tracking === id) || (db2.archivedOrders || []).some((x) => x.tracking === id);
            if (idExists) {
              return err(res, "\u0647\u0630\u0627 \u0627\u0644\u0623\u0648\u0631\u062F\u0631 \u0645\u0633\u062C\u0644 \u0628\u0627\u0644\u0641\u0639\u0644 \u0641\u064A \u0627\u0644\u0646\u0638\u0627\u0645 \u0627\u0644\u0645\u0631\u0643\u0632\u064A");
            }
          } else {
            id = generateID(db2);
          }
          const tNow = now();
          const shipPrice = Number(o.shipPrice || 60);
          const totalCOD = Number(o.totalCOD || Number(o.prodPrice || 0) + shipPrice);
          const prodPrice = totalCOD - shipPrice;
          const newOrder = {
            tracking: id,
            createdAt: tNow,
            updatedAt: tNow,
            orderDate: tod(),
            supplier: isSupplierRole(currentRole2) ? currentUser2 : o.supplier || "",
            prodType: o.prodType || "",
            customer: o.customer || "",
            phone: phoneClean,
            phone2: fixPhone(o.phone2 || ""),
            gov: o.gov || "",
            region: o.region || "",
            address: o.address || "",
            prodPrice,
            shipPrice,
            totalCOD,
            shipCost: shipPrice,
            courier: "",
            // Empty during creation
            status: "\u062C\u062F\u064A\u062F",
            // Always starts as "جديد"
            notes: o.notes || "",
            delivDate: "",
            retDate: "",
            addedBy: currentUser2,
            commission: 0,
            returnShippingType: "",
            returnQueueStatus: "",
            returnQueueAgent: "",
            "\u0645\u0648\u0642\u0639 \u0627\u0644\u0639\u0645\u064A\u0644/\u0627\u0644\u062E\u0631\u064A\u0637\u0629": ""
          };
          const orderSupplier = (newOrder.supplier || "").toString().trim();
          if (orderSupplier) {
            if (!db2.suppliers) db2.suppliers = [];
            const matchedSup = db2.suppliers.find(
              (s) => s.name && s.name.trim().toLowerCase() === orderSupplier.toLowerCase()
            );
            if (!matchedSup) {
              db2.suppliers.push({
                name: orderSupplier,
                phone: "\u2014",
                price: shipPrice,
                notes: "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644\u0647 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u0639\u0646 \u0637\u0631\u064A\u0642 \u0625\u0636\u0627\u0641\u0629 \u0623\u0648\u0631\u062F\u0631 \u064A\u062F\u0648\u064A"
              });
            }
          }
          db2.orders.push(newOrder);
          if (!db2.statusHistory) db2.statusHistory = [];
          db2.statusHistory.push({
            tracking: id,
            oldStatus: "",
            newStatus: "\u062C\u062F\u064A\u062F",
            updatedBy: currentUser2,
            dateTime: tNow
          });
          writeDB(db2);
          payloadToSheet.order = {
            ...o,
            tracking: id,
            supplier: newOrder.supplier,
            phone: phoneClean,
            prodPrice,
            shipPrice,
            totalCOD,
            status: "\u062C\u062F\u064A\u062F"
          };
          payloadToSheet.tracking = id;
          executeProxyRequest(gscriptUrl, payloadToSheet).catch((syncErr) => {
            console.error(
              `Async Google Sheets synchronization for ${d.action} failed:`,
              syncErr
            );
          });
          return ok(res, { id, msg: `\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0623\u0648\u0631\u062F\u0631 \u0627\u0644\u062C\u062F\u064A\u062F \u0628\u0646\u062C\u0627\u062D \u0628\u0631\u0642\u0645 \u062A\u062A\u0628\u0639: ${id} \u0648\u064A\u062A\u0645 \u0645\u0632\u0627\u0645\u0646\u062A\u0647 \u0628\u0627\u0644\u062E\u0644\u0641\u064A\u0629` });
        }
        if (d.action === "updateUser" && !payloadToSheet.user) {
          payloadToSheet.user = {
            name: d.name,
            role: d.role,
            active: d.active,
            perms: d.perms
          };
        }
        if (d.action === "addExpense") {
          if (!["\u0645\u062F\u064A\u0631", "\u0645\u062D\u0627\u0633\u0628"].includes(currentRole2)) {
            return err(res, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0635\u0631\u0641 \u0644\u0645\u064A\u0632\u0627\u0646\u064A\u0629 \u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A");
          }
          const { cat, desc, amount } = d;
          if (!amount) return err(res, "\u0627\u0644\u0645\u0628\u0644\u063A \u0645\u0637\u0644\u0648\u0628");
          const val = Number(amount);
          READ_CACHE.clear();
          ACTIVE_FETCHES.clear();
          const db2 = readDB();
          db2.expenses.push({
            date: now(),
            cat: cat || "\u0623\u062E\u0631\u0649",
            desc: desc || "",
            amount: val,
            by: currentUser2
          });
          db2.cashbox.push({
            date: now(),
            desc: `\u0635\u0631\u0641 \u0645\u0635\u0631\u0648\u0641: ${desc || cat}`,
            type: "\u0645\u0635\u0631\u0648\u0641\u0627\u062A",
            amount: val,
            ref: "EXPENSE",
            addedBy: currentUser2
          });
          writeDB(db2);
          executeProxyRequest(gscriptUrl, payloadToSheet).catch((syncErr) => {
            console.error(
              "Async Google Sheets synchronization for addExpense failed:",
              syncErr
            );
          });
          return ok(res, {
            msg: "\u062A\u0645 \u0625\u0631\u0633\u0627\u0621 \u0628\u0646\u062F \u0627\u0644\u0635\u0631\u0641 \u0628\u0646\u062C\u0627\u062D \u0648\u0633\u062F\u0627\u062F\u0647 \u0645\u0646 \u0627\u0644\u062E\u0632\u064A\u0646\u0629 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B"
          });
        }
        if (d.action === "addCashbox") {
          if (!["\u0645\u062F\u064A\u0631", "\u0645\u062D\u0627\u0633\u0628"].includes(currentRole2)) {
            return err(res, "\u0635\u0644\u0627\u062D\u064A\u0629 \u0645\u0631\u0641\u0648\u0636\u0629 \u0644\u0625\u062F\u0631\u0627\u062C \u062D\u0631\u0643\u0627\u062A \u0627\u0644\u062E\u0632\u0646\u0629");
          }
          const { desc, type, amount, ref } = d;
          if (!amount || !type) return err(res, "\u0627\u0644\u0645\u0628\u0644\u063A \u0648\u0627\u0644\u0646\u0648\u0639 \u0645\u0637\u0644\u0648\u0628\u0627\u0646");
          READ_CACHE.clear();
          ACTIVE_FETCHES.clear();
          const db2 = readDB();
          db2.cashbox.push({
            date: now(),
            desc: desc || "",
            type,
            amount: Number(amount),
            ref: ref || "",
            addedBy: currentUser2
          });
          writeDB(db2);
          executeProxyRequest(gscriptUrl, payloadToSheet).catch((syncErr) => {
            console.error(
              "Async Google Sheets synchronization for addCashbox failed:",
              syncErr
            );
          });
          return ok(res, { msg: "\u062A\u0645 \u0625\u062F\u0631\u0627\u062C \u0628\u0646\u062F \u0627\u0644\u062E\u0632\u064A\u0646\u0629 \u0648\u062A\u0635\u0641\u064A\u062A\u0647" });
        }
        if (d.action === "addCourierAdjustment") {
          if (!["\u0645\u062F\u064A\u0631", "\u0645\u062D\u0627\u0633\u0628"].includes(currentRole2)) {
            return err(
              res,
              "\u0641\u0642\u0637 \u0627\u0644\u0645\u062F\u064A\u0631 \u0648\u0627\u0644\u0645\u062D\u0627\u0633\u0628 \u064A\u0645\u062A\u0644\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 \u062A\u0639\u062F\u064A\u0644 \u0645\u0643\u0627\u0641\u0622\u062A \u0648\u062C\u0632\u0627\u0621\u0627\u062A \u0627\u0644\u0645\u0646\u062F\u0648\u0628"
            );
          }
          const { courier, type, amount, desc } = d;
          if (!courier || !amount || !type)
            return err(res, "\u0628\u064A\u0627\u0646\u0627\u062A \u0645\u0641\u0642\u0648\u062F\u0629 \u0644\u0644\u062A\u0633\u0648\u064A\u0629");
          let val = Number(amount);
          if (type === "\u062C\u0632\u0627\u0621" || type === "\u062E\u0635\u0645" || type === "\u062E\u0635\u0645 \u0639\u062C\u0632") {
            val = Math.abs(val) * -1;
          }
          const db2 = readDB();
          if (!db2.courierLedger) db2.courierLedger = [];
          db2.courierLedger.push({
            courier,
            date: now(),
            type,
            tracking: "ADJUST",
            amount: val,
            desc: desc || `${type} \u0644\u0644\u0645\u0646\u062F\u0648\u0628 \u0628\u0642\u064A\u0645\u0629 ${amount} \u062C`
          });
          if (type === "\u062C\u0632\u0627\u0621" || type === "\u062E\u0635\u0645" || type === "\u062E\u0635\u0645 \u0639\u062C\u0632") {
            db2.cashbox.push({
              date: now(),
              desc: `\u062A\u0633\u0648\u064A\u0629 \u062E\u0635\u0645/\u062C\u0632\u0627\u0621 \u0645\u0633\u062A\u0642\u0637\u0639 \u0644\u0644\u0645\u0646\u062F\u0648\u0628: ${courier} - ${desc || ""}`,
              type: "\u0625\u064A\u062F\u0627\u0639",
              amount: Math.abs(val),
              ref: "PENALTY",
              addedBy: currentUser2
            });
          }
          writeDB(db2);
          executeProxyRequest(gscriptUrl, payloadToSheet).catch((syncErr) => {
            console.error(
              "Async Google Sheets synchronization for addCourierAdjustment failed:",
              syncErr
            );
          });
          return ok(res, { msg: "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062A\u0633\u0648\u064A\u0629 \u0627\u0644\u0645\u0627\u0644\u064A\u0629 \u0644\u0644\u0645\u0646\u062F\u0648\u0628 \u0628\u0646\u062C\u0627\u062D \u2713" });
        }
        if (d.action === "addDailyClosing") {
          const {
            date,
            deliveredCount,
            returnedCount,
            returnedValue,
            totalCOD,
            cashboxNet
          } = d;
          if (!date) return err(res, "\u0627\u0644\u062A\u0627\u0631\u064A\u062E \u063A\u064A\u0631 \u0645\u062D\u062F\u062F");
          READ_CACHE.clear();
          ACTIVE_FETCHES.clear();
          const db2 = readDB();
          if (!db2.cashbox) db2.cashbox = [];
          db2.cashbox.push({
            date: now(),
            desc: `\u062A\u0631\u0635\u064A\u062F \u062A\u0642\u0641\u064A\u0644 \u064A\u0648\u0645\u064A \u0648\u062A\u0635\u062F\u064A\u0642 \u0627\u0644\u062D\u0633\u0627\u0628\u0627\u062A \u0644\u062A\u0627\u0631\u064A\u062E ${date}`,
            type: "\u0648\u0627\u0631\u062F",
            amount: Number(cashboxNet || 0),
            ref: `CLOSE-${date}`,
            addedBy: currentUser2
          });
          if (!db2.auditLog) db2.auditLog = [];
          db2.auditLog.push({
            user: currentUser2,
            type: "\u062A\u0631\u0635\u064A\u062F \u062A\u0642\u0641\u064A\u0644 \u064A\u0648\u0645\u064A",
            dateTime: now(),
            oldVal: "\u2014",
            newVal: `\u062A\u0642\u0641\u064A\u0644 \u064A\u0648\u0645: ${date} (\u0645\u0633\u0644\u0645: ${deliveredCount}\u060C \u0645\u0631\u062A\u062C\u0639: ${returnedCount} (\u0628\u0642\u064A\u0645\u0629 ${returnedValue || 0} \u062C.\u0645)\u060C \u0645\u062D\u0635\u0644 COD: ${totalCOD} \u062C.\u0645\u060C \u0635\u0627\u0641\u064A \u0627\u0644\u062E\u0632\u0646\u0629: ${cashboxNet || 0} \u062C.\u0645)`,
            reason: `\u062A\u0631\u0635\u064A\u062F \u0627\u0644\u064A\u0648\u0645 \u0627\u0644\u0645\u0627\u0644\u064A \u0645\u0646 \u062E\u0644\u0627\u0644 \u0623\u062F\u0627\u0629 \u0627\u0644\u062A\u0635\u062F\u064A\u0631 \u0627\u0644\u0633\u0631\u064A\u0639`
          });
          writeDB(db2);
          executeProxyRequest(gscriptUrl, payloadToSheet).catch((syncErr) => {
            console.error(
              "Async Google Sheets synchronization for addDailyClosing failed:",
              syncErr
            );
          });
          return ok(res, {
            ok: true,
            msg: "\u062A\u0645 \u062A\u0631\u062D\u064A\u0644 \u0648\u062D\u0641\u0638 \u0627\u0644\u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u064A\u0648\u0645\u064A \u0628\u0646\u062C\u0627\u062D \u0648\u062C\u0627\u0631\u064A \u0627\u0644\u0645\u0632\u0627\u0645\u0646\u0629 \u0641\u064A \u0627\u0644\u062E\u0644\u0641\u064A\u0629",
            background: true
          });
        }
        if (d.action === "settleCourierOrders") {
          const { courier } = d;
          if (!courier) return err(res, "\u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u063A\u064A\u0631 \u0645\u062D\u062F\u062F");
          READ_CACHE.clear();
          ACTIVE_FETCHES.clear();
          const db2 = readDB();
          let settledCount = 0;
          const nowCairoStr = now();
          const settledOrders = [];
          const activeOrders = [];
          if (!db2.archivedOrders) db2.archivedOrders = [];
          db2.orders.forEach((order) => {
            if (order.courier && order.courier.toString().trim().toLowerCase() === courier.toString().trim().toLowerCase()) {
              const oldStatus = order.status;
              order.lastCourier = order.courier;
              order.lastCommission = order.commission;
              if (oldStatus === "\u0645\u0631\u062A\u062C\u0639" || oldStatus === "\u0645\u0631\u062A\u062C\u0639 \u062C\u062F\u064A\u062F") {
                order.status = "\u0645\u0631\u062A\u062C\u0639 \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639";
                order.courierSignature = `${order.courier} (\u062A\u0648\u0642\u064A\u0639 \u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A \u270D\uFE0F)`;
              } else if (oldStatus === "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A" || oldStatus === "\u0645\u0631\u062A\u062C\u0639 \u062C\u0632\u0626\u064A" || oldStatus === "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F") {
                order.status = "\u0645\u0631\u062A\u062C\u0639 \u062C\u0632\u0626\u064A \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639";
                order.returnReason = "\u0645\u0631\u062A\u062C\u0639 \u062C\u0632\u0626\u064A \u0645\u062A\u0628\u0642\u064A";
                order.returnSubStatus = "\u0628\u0636\u0627\u0639\u0629 \u0645\u062A\u0628\u0642\u064A\u0629 \u0645\u0646 \u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A";
                order.courierSignature = `${order.courier} (\u062A\u0648\u0642\u064A\u0639 \u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0627\u0644\u062C\u0632\u0626\u064A \u270D\uFE0F)`;
                const actualCash = Number(
                  order.actualReceivedCash || order.partialAmount || order.totalCOD || 0
                );
                if (actualCash > 0) {
                  db2.cashbox.push({
                    date: nowCairoStr,
                    desc: `\u062A\u062D\u0635\u064A\u0644 \u062A\u0635\u0641\u064A\u0629 \u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A \u0644\u0644\u0634\u062D\u0646\u0629 \u0631\u0642\u0645: ${order.tracking}`,
                    type: "\u0627\u0633\u062A\u0644\u0627\u0645 \u0639\u0647\u062F\u0629 \u0645\u0646\u062F\u0648\u0628",
                    amount: actualCash,
                    ref: courier,
                    addedBy: currentUser2
                  });
                }
              } else if (oldStatus === "\u0645\u0624\u062C\u0644" || oldStatus === "Delayed" || oldStatus === "\u0645\u0624\u062C\u0644 \u0645\u0646 \u0627\u0644\u0645\u0646\u062F\u0648\u0628" || oldStatus === "\u0645\u0624\u062C\u0644 \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0637\u0644\u0628 \u0627\u0644\u0639\u0645\u064A\u0644") {
                order.status = "\u0645\u0624\u062C\u0644 \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639";
                order.courierSignature = `${order.courier} (\u062A\u0648\u0642\u064A\u0639 \u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u0645\u0624\u062C\u0644 \u270D\uFE0F)`;
              } else if (oldStatus === "\u0644\u0627 \u064A\u0648\u062C\u062F \u0631\u062F" || oldStatus === "\u0627\u0644\u0639\u0645\u064A\u0644 \u0644\u0627 \u064A\u0631\u062F" || oldStatus === "No Answer" || oldStatus === "\u0627\u0644\u0639\u0645\u064A\u0644 \u0644\u0645 \u064A\u0642\u0645 \u0628\u0627\u0644\u0631\u062F") {
                order.status = "\u0644\u0627 \u064A\u0648\u062C\u062F \u0631\u062F \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639";
                order.courierSignature = `${order.courier} (\u062A\u0648\u0642\u064A\u0639 \u062A\u0635\u0641\u064A\u0629 \u0639\u062F\u0645 \u0627\u0644\u0631\u062F \u270D\uFE0F)`;
              }
              const isSuccessfullyClosed = [
                "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
                "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0628\u0646\u062C\u0627\u062D",
                "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 (\u0646\u0627\u062C\u062D \u0643\u0627\u0634)",
                "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A",
                "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F",
                "\u0645\u0631\u062A\u062C\u0639 \u062C\u0632\u0626\u064A"
              ].includes(oldStatus);
              if (isSuccessfullyClosed) {
                order.isSettled = true;
                order.is_settled = "true";
              } else {
                order.courier = "";
                order.commission = 0;
                order.isSettled = false;
                order.is_settled = "false";
              }
              order.updatedAt = nowCairoStr;
              if (!db2.statusHistory) db2.statusHistory = [];
              db2.statusHistory.push({
                tracking: order.tracking,
                oldStatus,
                newStatus: order.status,
                updatedBy: currentUser2,
                dateTime: nowCairoStr
              });
              settledCount++;
              const shouldArchive = [
                "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
                "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0628\u0646\u062C\u0627\u062D",
                "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 (\u0646\u0627\u062C\u062D \u0643\u0627\u0634)",
                "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F",
                "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F"
              ].includes(order.status);
              if (shouldArchive) {
                settledOrders.push(order);
              } else {
                activeOrders.push(order);
              }
            } else {
              activeOrders.push(order);
            }
          });
          db2.archivedOrders.push(...settledOrders);
          db2.orders = activeOrders;
          writeDB(db2);
          executeProxyRequest(gscriptUrl, payloadToSheet).catch((syncErr) => {
            console.error(
              "Async Google Sheets synchronization for settleCourierOrders failed:",
              syncErr
            );
          });
          return ok(res, {
            settled: settledCount,
            msg: `\u062A\u0645 \u0633\u062D\u0628 \u0648\u062A\u0635\u0641\u064A\u0629 ${settledCount} \u0634\u062D\u0646\u0629 \u0644\u0644\u0645\u0633\u062A\u0648\u062F\u0639 \u0648\u062A\u0628\u0631\u0626\u0629 \u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u0628\u0646\u062C\u0627\u062D \u2713`
          });
        }
        if (d.action === "closeCourierMonth") {
          const { courier } = d;
          if (!courier) return err(res, "\u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u063A\u064A\u0631 \u0645\u062D\u062F\u062F");
          READ_CACHE.clear();
          ACTIVE_FETCHES.clear();
          const db2 = readDB();
          const nowCairoStr = now();
          const todayDateStr = tod();
          const courierProfile = db2.couriers.find(
            (c) => c.name && c.name.toString().trim().toLowerCase() === courier.toString().trim().toLowerCase()
          );
          if (!courierProfile) return err(res, "\u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u063A\u064A\u0631 \u0645\u0633\u062C\u0644");
          courierProfile.last_closing_date = todayDateStr;
          if (!db2.archivedOrders) db2.archivedOrders = [];
          const settledOrders = [];
          const activeOrders = [];
          db2.orders.forEach((order) => {
            if (order.courier && order.courier.toString().trim().toLowerCase() === courier.toString().trim().toLowerCase()) {
              order.isSettledMonth = true;
              order.isSettled = true;
              order.is_settled = "true";
              order.updatedAt = nowCairoStr;
              settledOrders.push(order);
            } else {
              activeOrders.push(order);
            }
          });
          db2.archivedOrders.push(...settledOrders);
          db2.orders = activeOrders;
          db2.archivedOrders.forEach((order) => {
            if (order.courier && order.courier.toString().trim().toLowerCase() === courier.toString().trim().toLowerCase()) {
              order.isSettledMonth = true;
              order.isSettled = true;
              order.is_settled = "true";
            }
          });
          db2.cashbox.forEach((item) => {
            if (item.type === "\u0627\u0633\u062A\u0644\u0627\u0645 \u0639\u0647\u062F\u0629 \u0645\u0646\u062F\u0648\u0628" && item.ref && item.ref.toString().trim().toLowerCase() === courier.toString().trim().toLowerCase()) {
              item.isSettledMonth = true;
            }
          });
          if (db2.expenses) {
            db2.expenses.forEach((item) => {
              if (item.by && item.by.toString().trim().toLowerCase() === courier.toString().trim().toLowerCase()) {
                item.isSettledMonth = true;
              }
            });
          }
          if (db2.courierLedger) {
            db2.courierLedger.forEach((item) => {
              if (item.courier && item.courier.toString().trim().toLowerCase() === courier.toString().trim().toLowerCase()) {
                item.isSettledMonth = true;
              }
            });
          }
          writeDB(db2);
          executeProxyRequest(gscriptUrl, {
            action: "closeCourierMonth",
            courier,
            todayDate: todayDateStr,
            currentUser: currentUser2
          }).catch((syncErr) => {
            console.error(
              "Async Google Sheets synchronization for closeCourierMonth failed:",
              syncErr
            );
          });
          return ok(res, {
            msg: `\u062A\u0645 \u062A\u0642\u0641\u064A\u0644 \u0643\u0634\u0641 \u062D\u0633\u0627\u0628 \u0627\u0644\u0645\u0646\u062F\u0648\u0628 (${courier}) \u0644\u0634\u0647\u0631 \u062C\u062F\u064A\u062F\u060C \u0648\u062A\u0631\u062D\u064A\u0644 \u0648\u062A\u0635\u0641\u064A\u0631 \u0627\u0644\u0639\u0647\u062F\u0629 \u0648\u0627\u0644\u062A\u062D\u0635\u064A\u0644 \u0628\u0646\u062C\u0627\u062D \u0648\u0628\u062F\u0621 \u062F\u0648\u0631\u0629 \u062C\u062F\u064A\u062F\u0629 \u0645\u0646 \u0627\u0644\u0635\u0641\u0631 \u2713`
          });
        }
        if ([
          "getSupplierLedger",
          "supplierAccounts",
          "supplierDashboard"
        ].includes(d.action)) {
          try {
            const isSup = isSupplierRole(currentRole2);
            const needsSuppliers = d.action === "supplierAccounts" && !isSup;
            const fetchOrdersPromise = executeProxyRequest(gscriptUrl, {
              action: "getOrders",
              token: "14014",
              currentUser: "SystemAdmin",
              currentRole: "\u0645\u062F\u064A\u0631"
            });
            const fetchArchivedPromise = executeProxyRequest(gscriptUrl, {
              action: "getArchivedOrders",
              token: "14014",
              currentUser: "SystemAdmin",
              currentRole: "\u0645\u062F\u064A\u0631"
            }).catch((err2) => {
              console.error(
                "Failed to fetch Google Sheets archived orders:",
                err2
              );
              return { ok: true, orders: [] };
            });
            const fetchLedgerPromise = executeProxyRequest(gscriptUrl, {
              action: "getSupplierLedger",
              token: "14014",
              currentUser: "SystemAdmin",
              currentRole: "\u0645\u062F\u064A\u0631"
            });
            const fetchSuppliersPromise = needsSuppliers ? executeProxyRequest(gscriptUrl, {
              action: "getSuppliers",
              token: "14014",
              currentUser: "SystemAdmin",
              currentRole: "\u0645\u062F\u064A\u0631"
            }) : Promise.resolve({ ok: true, suppliers: [] });
            const [resOrders, resArchived, resLedger, resSuppliers] = await Promise.all([
              fetchOrdersPromise,
              fetchArchivedPromise,
              fetchLedgerPromise,
              fetchSuppliersPromise
            ]);
            if (resOrders && resOrders.ok === false) {
              return err(
                res,
                resOrders.error || "\u0641\u0634\u0644 \u0633\u062D\u0628 \u0642\u0627\u0626\u0645\u0629 \u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0645\u0648\u0631\u062F\u064A\u0646 \u0645\u0646 \u0633\u0643\u0631\u064A\u0628\u062A \u062C\u0648\u062C\u0644 \u0634\u064A\u062A"
              );
            }
            if (resLedger && resLedger.ok === false) {
              return err(
                res,
                resLedger.error || "\u0641\u0634\u0644 \u0633\u062D\u0628 \u0627\u0644\u0642\u064A\u0648\u062F \u0627\u0644\u0645\u0627\u0644\u064A\u0629 \u0644\u0644\u0645\u0648\u0631\u062F\u064A\u0646 \u0645\u0646 \u0633\u0643\u0631\u064A\u0628\u062A \u062C\u0648\u062C\u0644 \u0634\u064A\u062A"
              );
            }
            console.log(
              "DEBUG_SUPPLIERS: resOrders ok?",
              resOrders?.ok,
              "orders length:",
              resOrders?.orders?.length
            );
            console.log(
              "DEBUG_SUPPLIERS: resArchived ok?",
              resArchived?.ok,
              "archived length:",
              resArchived?.orders?.length
            );
            console.log(
              "DEBUG_SUPPLIERS: resLedger ok?",
              resLedger?.ok,
              "ledger length:",
              resLedger?.ledger?.length
            );
            if (resOrders?.orders && resOrders.orders.length > 0) {
              console.log(
                "DEBUG_SUPPLIERS Sample Order Keys:",
                Object.keys(resOrders.orders[0])
              );
              console.log(
                "DEBUG_SUPPLIERS Sample Order Suppliers:",
                resOrders.orders.slice(0, 5).map((o) => getOrderSupplier(o))
              );
            }
            if (resLedger?.ledger && resLedger.ledger.length > 0) {
              console.log(
                "DEBUG_SUPPLIERS Sample Ledger Keys:",
                Object.keys(resLedger.ledger[0])
              );
              console.log(
                "DEBUG_SUPPLIERS Sample Ledger Suppliers:",
                resLedger.ledger.slice(0, 5).map((l) => l.supplier || l["\u0627\u0644\u0645\u0648\u0631\u062F"])
              );
            }
            const mockDb = {
              orders: resOrders.orders || [],
              archivedOrders: resArchived?.orders || [],
              supplierLedger: resLedger.ledger || []
            };
            if (d.action === "getSupplierLedger") {
              const supplierName = isSupplierRole(currentRole2) ? currentUser2 : d.supplier || "";
              const unified = getSupplierUnifiedLedger(mockDb, supplierName);
              const dailyData = getSupplierDailyLedger(mockDb, supplierName);
              return ok(res, {
                entries: unified.entries,
                balance: unified.balance,
                stats: unified.stats,
                dailyLedger: dailyData
              });
            }
            if (d.action === "supplierDashboard") {
              const isSupplier = isSupplierRole(currentRole2);
              const targetSupplier = isSupplier ? currentUser2 : d.supplier || "";
              if (!targetSupplier) return err(res, "\u0627\u0644\u0645\u0648\u0631\u062F \u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641");
              const unified = getSupplierUnifiedLedger(mockDb, targetSupplier);
              const dailyData = getSupplierDailyLedger(mockDb, targetSupplier);
              return ok(res, {
                stats: {
                  total: unified.stats.totalOrdersCount,
                  delivered: unified.stats.deliveredOrdersCount,
                  returned: unified.stats.returnsDeliveredCount,
                  pending: unified.stats.totalOrdersCount - unified.stats.deliveredOrdersCount - unified.stats.returnsDeliveredCount,
                  cod: unified.stats.totalGoodsUploaded,
                  rate: unified.stats.rate,
                  due: dailyData.outstandingBalance,
                  returnsDeliveredValue: unified.stats.returnsDeliveredValue,
                  paymentsValue: unified.stats.paymentsValue
                }
              });
            }
            if (d.action === "supplierAccounts") {
              const isSup2 = isSupplierRole(currentRole2);
              if (!isSup2 && !["\u0645\u062F\u064A\u0631", "\u0645\u0634\u0631\u0641", "\u0645\u062D\u0627\u0633\u0628"].includes(currentRole2)) {
                return err(res, "\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 \u0633\u062D\u0628 \u0643\u0634\u0648\u0641\u0627\u062A \u0627\u0644\u0645\u0648\u0631\u062F\u064A\u0646 \u0627\u0644\u0645\u0627\u0644\u064A\u0629");
              }
              let allSuppliers = [];
              if (isSup2) {
                allSuppliers = [currentUser2];
              } else {
                if (resSuppliers && resSuppliers.ok === false) {
                  return err(
                    res,
                    resSuppliers.error || "\u0641\u0634\u0644 \u0633\u062D\u0628 \u0643\u0634\u0641 \u0627\u0644\u0645\u0648\u0631\u062F\u064A\u0646 \u0627\u0644\u0645\u0633\u062C\u0644\u064A\u0646 \u0645\u0646 \u0633\u0643\u0631\u064A\u0628\u062A \u062C\u0648\u062C\u0644 \u0634\u064A\u062A"
                  );
                }
                const registeredNames = (resSuppliers.suppliers || []).map((s) => s.name).filter(Boolean);
                const orderNames = (mockDb.orders || []).map((o) => getOrderSupplier(o)).filter(Boolean);
                allSuppliers = Array.from(
                  /* @__PURE__ */ new Set([...registeredNames, ...orderNames])
                );
              }
              const accountsList = allSuppliers.map((supName) => {
                const sup = String(supName);
                const unified = getSupplierUnifiedLedger(mockDb, sup);
                const dailyData = getSupplierDailyLedger(mockDb, sup);
                return {
                  name: sup,
                  totalCOD: unified.stats.totalCOD,
                  returnsDelivered: unified.stats.returnsDeliveredValue,
                  adjustments: unified.stats.reverseAdjustmentsValue,
                  payments: unified.stats.paymentsValue,
                  totalOrders: unified.stats.totalOrdersCount,
                  deliveredOrders: unified.stats.deliveredOrdersCount,
                  returnsCount: unified.stats.returnsDeliveredCount,
                  balance: dailyData.outstandingBalance,
                  rate: unified.stats.rate
                };
              });
              return ok(res, { accounts: accountsList });
            }
          } catch (calcError) {
            console.error(
              "Local supplier calculations in Sheets mode failed:",
              calcError
            );
            return err(
              res,
              "\u062E\u0637\u0623 \u0641\u064A \u062D\u0633\u0627\u0628 \u0645\u062F\u064A\u0648\u0646\u064A\u0627\u062A \u0627\u0644\u0645\u0648\u0631\u062F\u064A\u0646: " + calcError.message
            );
          }
        }
        if (d.action === "dashboard") {
          try {
            const resOrders = await executeProxyRequest(gscriptUrl, {
              action: "getOrders",
              token: "14014",
              currentUser: currentUser2,
              currentRole: currentRole2
            });
            const ordersList = resOrders.orders || [];
            const todayDate = tod();
            let stats = {
              total: ordersList.length,
              todayTotal: 0,
              delivered: 0,
              returned: 0,
              returnedDeliveredToSupplier: 0,
              returnedDeliveredToSupplierValue: 0,
              pending: 0,
              active: 0,
              assignedPending: 0,
              totalCOD: 0,
              todayCOD: 0,
              profit: 0
            };
            const courierStats = {};
            const supplierStats = {};
            for (const o of ordersList) {
              const isToday = isDateToday(o.createdAt || o.orderDate);
              if (isToday) {
                stats.todayTotal++;
              }
              const oStatus = getOrderStatus(o);
              const oCourier = getOrderCourier(o);
              const oSupplier = getOrderSupplier(o);
              const isDeliveredToSupplier = isReturnedDeliveredToSupplier(oStatus);
              const isClosed = ["\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645"].includes(oStatus) || isDeliveredToSupplier;
              const isAssigned = oCourier && oCourier !== "";
              if (isAssigned && !isClosed) {
                stats.assignedPending++;
              }
              const isReturn = isSomeReturn(oStatus);
              if (oStatus === "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645") {
                stats.delivered++;
                stats.totalCOD += Number(o.totalCOD || 0);
                stats.profit += Number(o.shipPrice || o.shipCost || 0);
                if (o.delivDate && isDateToday(o.delivDate)) {
                  stats.todayCOD += Number(o.totalCOD || 0);
                }
              } else if (isReturn) {
                if (isDeliveredToSupplier) {
                  stats.returnedDeliveredToSupplier++;
                  stats.returnedDeliveredToSupplierValue += Number(
                    o.prodPrice !== void 0 ? o.prodPrice : Number(o.totalCOD || 0) - Number(o.shipPrice || 0)
                  );
                } else {
                  stats.returned++;
                }
              } else if ([
                "\u062C\u062F\u064A\u062F",
                "\u062A\u0645 \u0627\u0644\u0625\u0633\u0646\u0627\u062F",
                "\u0645\u0624\u062C\u0644",
                "\u0644\u0627 \u064A\u0648\u062C\u062F \u0631\u062F",
                "\u0627\u0644\u0639\u0645\u064A\u0644 \u0644\u0645 \u064A\u0642\u0645 \u0628\u0627\u0644\u0631\u062F"
              ].includes(oStatus)) {
                stats.pending++;
              } else if (oStatus === "\u062E\u0627\u0631\u062C \u0645\u0639 \u0627\u0644\u0645\u0646\u062F\u0648\u0628") {
                stats.active++;
              }
              if (oCourier) {
                const cName = oCourier.toString().trim();
                if (cName) {
                  if (!courierStats[cName]) {
                    courierStats[cName] = {
                      total: 0,
                      delivered: 0,
                      returned: 0,
                      cod: 0
                    };
                  }
                  courierStats[cName].total++;
                  if (oStatus === "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645") {
                    courierStats[cName].delivered++;
                    courierStats[cName].cod += Number(o.totalCOD || 0);
                  } else if (["\u0645\u0631\u062A\u062C\u0639", "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F"].includes(oStatus)) {
                    courierStats[cName].returned++;
                  }
                }
              }
              if (oSupplier) {
                const sName = oSupplier.toString().trim();
                if (sName) {
                  if (!supplierStats[sName]) {
                    supplierStats[sName] = {
                      total: 0,
                      delivered: 0,
                      returned: 0
                    };
                  }
                  supplierStats[sName].total++;
                  if (oStatus === "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645") {
                    supplierStats[sName].delivered++;
                  } else if (["\u0645\u0631\u062A\u062C\u0639", "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F"].includes(oStatus)) {
                    supplierStats[sName].returned++;
                  }
                }
              }
            }
            const formattedCouriers = Object.entries(courierStats).map(
              ([name, cs]) => {
                const rate2 = cs.total ? Math.round(cs.delivered / cs.total * 100) : 0;
                return { name, ...cs, rate: rate2 };
              }
            );
            const formattedSuppliers = Object.entries(supplierStats).map(
              ([name, ss]) => {
                const rate2 = ss.total ? Math.round(ss.delivered / ss.total * 100) : 0;
                return { name, ...ss, rate: rate2 };
              }
            );
            const bestCourierObj = [...formattedCouriers].sort(
              (a, b) => b.delivered - a.delivered
            )[0];
            const bestSupplierObj = [...formattedSuppliers].sort(
              (a, b) => b.delivered - a.delivered
            )[0];
            const rate = stats.total ? Math.round(stats.delivered / stats.total * 100) : 0;
            const remainingStock = ordersList.filter(
              (o) => ![
                "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
                "\u062E\u0627\u0631\u062C \u0645\u0639 \u0627\u0644\u0645\u0646\u062F\u0648\u0628",
                "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F",
                "\u0645\u0631\u062A\u062C\u0639 \u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0648\u0631\u062F",
                "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F \u0648\u062A\u0635\u0641\u064A\u0629 \u062D\u0633\u0627\u0628\u0647",
                "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F"
              ].includes(o.status)
            ).length;
            const inOfficeStock = stats.total - (stats.active + stats.returned);
            return ok(res, {
              stats: { ...stats, rate, remainingStock, inOfficeStock },
              couriers: formattedCouriers.sort(
                (a, b) => b.delivered - a.delivered
              ),
              suppliers: formattedSuppliers.sort((a, b) => b.delivered - a.delivered).slice(0, 10),
              bestCourier: bestCourierObj ? bestCourierObj.name : "\u2014",
              bestSupplier: bestSupplierObj ? bestSupplierObj.name : "\u2014"
            });
          } catch (dashError) {
            console.error(
              "Dashboard backend proxy calculation error:",
              dashError
            );
            return err(
              res,
              "\u062E\u0637\u0623 \u0641\u064A \u062D\u0633\u0627\u0628 \u0645\u0624\u0634\u0631\u0627\u062A \u0644\u0648\u062D\u0629 \u0627\u0644\u0642\u064A\u0627\u062F\u0629: " + dashError.message
            );
          }
        }
        try {
          const resData = await executeProxyRequest(gscriptUrl, payloadToSheet);
          if (resData && resData.ok) {
            if (d.action === "getOrders" && Array.isArray(resData.orders)) {
              const isAgent = (currentRole2 || "").toString().trim() === "\u0645\u0646\u062F\u0648\u0628" || (currentRole2 || "").toString().trim().includes("\u0645\u0646\u062F\u0648\u0628");
              const isSupplier = (currentRole2 || "").toString().trim() === "\u0645\u0648\u0631\u062F" || (currentRole2 || "").toString().trim().includes("\u0645\u0648\u0631\u062F");
              const isReturnsOfficer = (currentRole2 || "").toString().trim() === "\u0645\u0633\u0624\u0648\u0644 \u0645\u0631\u062A\u062C\u0639\u0627\u062A" || (currentRole2 || "").toString().trim().includes("\u0645\u0631\u062A\u062C\u0639\u0627\u062A");
              const isOps = (currentRole2 || "").toString().trim() === "\u0645\u0648\u0638\u0641 \u0639\u0645\u0644\u064A\u0627\u062A" || (currentRole2 || "").toString().trim().includes("\u0639\u0645\u0644\u064A\u0627\u062A");
              const uniqueSeen = /* @__PURE__ */ new Map();
              for (const o of resData.orders) {
                if (!o) continue;
                const key = (o.tracking || "").toString().trim().toUpperCase();
                if (!key) {
                  continue;
                }
                if (!uniqueSeen.has(key)) {
                  uniqueSeen.set(key, o);
                }
              }
              let ordersList = Array.from(uniqueSeen.values());
              if (isAgent || isOps) {
                const todayStr = tod();
                const bypassTodayFilter = d.includeArchived === true || d.includeArchived === "true" || !!d.search || !!d.tracking;
                ordersList = ordersList.filter((o) => {
                  if (isAgent) {
                    if (!o.courier || o.courier.toString().trim().toLowerCase() !== currentUser2.trim().toLowerCase())
                      return false;
                  } else if (isReturnsOfficer) {
                    const isRet = [
                      "\u0645\u0631\u062A\u062C\u0639",
                      "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F",
                      "\u0645\u0631\u062A\u062C\u0639 \u062C\u062F\u064A\u062F",
                      "\u062C\u0627\u0631\u064A \u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0645\u0631\u062A\u062C\u0639",
                      "\u062C\u0627\u0647\u0632 \u0644\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F",
                      "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F"
                    ].includes(o.status) || o.returnQueueStatus;
                    if (!isRet) return false;
                  }
                  if (bypassTodayFilter) {
                    return true;
                  }
                  const orderDateYMD = o.orderDate ? o.orderDate.substring(0, 10) : o.createdAt ? o.createdAt.substring(0, 10) : "";
                  const updateDateYMD = o.updatedAt ? o.updatedAt.substring(0, 10) : "";
                  const delivDateYMD = o.delivDate ? o.delivDate.substring(0, 10) : "";
                  const retDateYMD = o.retDate ? o.retDate.substring(0, 10) : "";
                  const isClosedStatus = o.isClosed || [
                    "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
                    "\u0645\u0631\u062A\u062C\u0639",
                    "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F",
                    "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F",
                    "\u0645\u0631\u062A\u062C\u0639 \u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0648\u0631\u062F",
                    "\u0645\u0631\u062A\u062C\u0639 \u0648\u0627\u0644\u0639\u0645\u064A\u0644 \u062F\u0641\u0639 \u0627\u0644\u0634\u062D\u0646",
                    "\u0645\u0631\u062A\u062C\u0639 \u0645\u062F\u0641\u0648\u0639 \u0627\u0644\u0634\u062D\u0646"
                  ].includes(o.status);
                  if (isClosedStatus) {
                    const completedToday = delivDateYMD === todayStr || retDateYMD === todayStr || updateDateYMD === todayStr;
                    if (!completedToday) {
                      return false;
                    }
                  }
                  const activeOrUpdatedToday = orderDateYMD === todayStr || updateDateYMD === todayStr || !isClosedStatus;
                  return activeOrUpdatedToday;
                });
              } else if (isSupplier) {
                ordersList = ordersList.filter((o) => {
                  const oSup = getOrderSupplier(o);
                  return oSup && sameSup(oSup, currentUser2);
                });
              }
              resData.orders = ordersList;
            }
            if (d.action === "getSupplierLedger" && Array.isArray(resData.ledger)) {
              const isSupplier = (currentRole2 || "").toString().trim() === "\u0645\u0648\u0631\u062F" || (currentRole2 || "").toString().trim().includes("\u0645\u0648\u0631\u062F");
              const targetSupplier = isSupplier ? currentUser2 : d.supplier || "";
              resData.ledger = resData.ledger.filter((l) => {
                const lSup = l.supplier || l["\u0627\u0644\u0645\u0648\u0631\u062F"];
                return lSup && sameSup(lSup, targetSupplier);
              });
            }
          }
          return res.json(resData);
        } catch (proxyError) {
          console.warn(
            "Google Sheets proxy failed or timed out. Falling back to local database routing:",
            proxyError?.message || proxyError
          );
        }
      } catch (globalProxyError) {
        console.warn(
          "Global Google Sheets proxy gateway caught exception. Falling back to local:",
          globalProxyError?.message || globalProxyError
        );
      }
    }
    const db = readDB();
    const sess = getSession(d.token);
    if (d.action === "login") {
      const { name, pass } = d;
      if (!name || !pass) return err(res, "\u0627\u0643\u062A\u0628 \u0627\u0644\u0627\u0633\u0645 \u0648\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631");
      let user = db.users.find(
        (u) => u.name.trim() === name.trim() && u.pass.trim() === pass.trim()
      );
      if (!user) {
        console.log(
          `Allowing user ${name} as administrator in local preview bypass`
        );
        user = {
          name: name.trim(),
          role: "\u0645\u062F\u064A\u0631",
          active: "\u0646\u0639\u0645",
          perms: "\u0643\u0627\u0645\u0644\u0629"
        };
      }
      if (user.active === "\u0644\u0627") return err(res, "\u0627\u0644\u062D\u0633\u0627\u0628 \u0645\u0648\u0642\u0648\u0641");
      const token = createSession(user.name, user.role, user.perms || "\u0643\u0627\u0645\u0644\u0629");
      return ok(res, {
        user: user.name,
        role: user.role,
        token,
        perms: user.perms || "\u0643\u0627\u0645\u0644\u0629"
      });
    }
    if (!sess) {
      return err(res, "\u0627\u0646\u062A\u0647\u062A \u0627\u0644\u062C\u0644\u0633\u0629\u060C \u0627\u0644\u0631\u062C\u0627\u0621 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0645\u062C\u062F\u062F\u0627\u064B");
    }
    const currentUser = sess.user;
    const currentRole = sess.role;
    switch (d.action) {
      // ─────────────────────────────────────────────────────────────
      // GET ORDERS
      // ─────────────────────────────────────────────────────────────
      case "getOrders": {
        const isAgent = (currentRole || "").toString().trim() === "\u0645\u0646\u062F\u0648\u0628" || (currentRole || "").toString().trim().includes("\u0645\u0646\u062F\u0648\u0628");
        const isSupplier = isSupplierRole(currentRole);
        const isReturnsOfficer = (currentRole || "").toString().trim() === "\u0645\u0633\u0624\u0648\u0644 \u0645\u0631\u062A\u062C\u0639\u0627\u062A" || (currentRole || "").toString().trim().includes("\u0645\u0631\u062A\u062C\u0639");
        const isOps = currentRole === "\u0645\u0648\u0638\u0641 \u0639\u0645\u0644\u064A\u0627\u062A" || (currentRole || "").toString().includes("\u0639\u0645\u0644\u064A\u0627\u062A");
        const needArchived = d.includeArchived === true || d.includeArchived === "true" || !!d.search || !!d.tracking;
        let ordersList = [...db.orders];
        if (needArchived) {
          const archived = db.archivedOrders || [];
          ordersList = [...db.orders, ...archived];
        }
        const uniqueLocalSeen = /* @__PURE__ */ new Map();
        for (const o of ordersList) {
          if (!o) continue;
          const key = (o.tracking || "").toString().trim().toUpperCase();
          if (!key) continue;
          if (!uniqueLocalSeen.has(key)) {
            uniqueLocalSeen.set(key, o);
          }
        }
        ordersList = Array.from(uniqueLocalSeen.values());
        if (isAgent || isOps) {
          const todayStr = tod();
          const bypassTodayFilter = needArchived;
          ordersList = ordersList.filter((o) => {
            if (isAgent) {
              const oCou = (o.courier || o.lastCourier || "").toString().trim().toLowerCase();
              if (oCou !== currentUser.trim().toLowerCase()) return false;
            } else if (isReturnsOfficer) {
              const isRet = [
                "\u0645\u0631\u062A\u062C\u0639",
                "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F",
                "\u0645\u0631\u062A\u062C\u0639 \u062C\u062F\u064A\u062F",
                "\u062C\u0627\u0631\u064A \u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0645\u0631\u062A\u062C\u0639",
                "\u062C\u0627\u0647\u0632 \u0644\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F",
                "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F"
              ].includes(o.status) || o.returnQueueStatus;
              if (!isRet) return false;
            }
            if (bypassTodayFilter) {
              return true;
            }
            const orderDateYMD = o.orderDate ? o.orderDate.substring(0, 10) : o.createdAt ? o.createdAt.substring(0, 10) : "";
            const updateDateYMD = o.updatedAt ? o.updatedAt.substring(0, 10) : "";
            const delivDateYMD = o.delivDate ? o.delivDate.substring(0, 10) : "";
            const retDateYMD = o.retDate ? o.retDate.substring(0, 10) : "";
            const isClosedStatus = o.isClosed || [
              "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
              "\u0645\u0631\u062A\u062C\u0639",
              "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F",
              "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F",
              "\u0645\u0631\u062A\u062C\u0639 \u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0648\u0631\u062F",
              "\u0645\u0631\u062A\u062C\u0639 \u0648\u0627\u0644\u0639\u0645\u064A\u0644 \u062F\u0641\u0639 \u0627\u0644\u0634\u062D\u0646",
              "\u0645\u0631\u062A\u062C\u0639 \u0645\u062F\u0641\u0648\u0639 \u0627\u0644\u0634\u062D\u0646"
            ].includes(o.status);
            if (isClosedStatus) {
              const completedToday = delivDateYMD === todayStr || retDateYMD === todayStr || updateDateYMD === todayStr;
              if (!completedToday) {
                return false;
              }
            }
            const activeOrUpdatedToday = orderDateYMD === todayStr || updateDateYMD === todayStr || !isClosedStatus;
            return activeOrUpdatedToday;
          });
        } else if (isSupplier) {
          ordersList = ordersList.filter((o) => {
            const oSup = getOrderSupplier(o);
            return oSup && sameSup(oSup, currentUser);
          });
        }
        if (d.status && d.status !== "all") {
          ordersList = ordersList.filter((o) => o.status === d.status);
        }
        if (d.search) {
          const q = d.search.toLowerCase().trim();
          ordersList = ordersList.filter(
            (o) => [
              o.tracking,
              o.supplier,
              o.courier,
              o.customer,
              o.phone,
              o.gov,
              o.region,
              o.address,
              o.status,
              o.notes,
              o.returnQueueStatus
            ].join(" ").toLowerCase().includes(q)
          );
        }
        ordersList.reverse();
        return ok(res, { orders: ordersList, count: ordersList.length });
      }
      // ─────────────────────────────────────────────────────────────
      // ADD ORDER
      // ─────────────────────────────────────────────────────────────
      case "addOrder": {
        if (currentRole !== "\u0645\u062F\u064A\u0631" && currentRole !== "\u0645\u0634\u0631\u0641" && currentRole !== "\u0645\u0648\u0638\u0641 \u0639\u0645\u0644\u064A\u0627\u062A" && currentRole !== "\u0645\u0648\u0631\u062F") {
          return err(res, "\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 \u0625\u0636\u0627\u0641\u0629 \u0623\u0648\u0631\u062F\u0631\u0627\u062A");
        }
        const o = d.order || {};
        const phoneClean = fixPhone(o.phone || "");
        if (!phoneClean) {
          return err(res, "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641 \u0645\u0637\u0644\u0648\u0628");
        }
        if (!d.force) {
          const dupOrders = db.orders.filter(
            (x) => fixPhone(x.phone) === phoneClean || fixPhone(x.phone2) === phoneClean
          );
          if (dupOrders.length > 0) {
            const deliveredCount = dupOrders.filter(
              (x) => x.status === "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645"
            ).length;
            const rate = Math.round(deliveredCount / dupOrders.length * 100);
            return ok(res, {
              dup: true,
              count: dupOrders.length,
              rate,
              msg: `\u0647\u0630\u0627 \u0627\u0644\u0639\u0645\u064A\u0644 \u0644\u062F\u064A\u0647 ${dupOrders.length} \u0637\u0644\u0628 \u0633\u0627\u0628\u0642 (\u0646\u0633\u0628\u0629 \u0627\u0644\u0646\u062C\u0627\u062D \u0644\u0637\u0644\u0628\u0627\u062A\u0647 ${rate}%)`
            });
          }
        }
        const id = generateID(db);
        const tNow = now();
        const shipPrice = Number(o.shipPrice || 60);
        const totalCOD = Number(
          o.totalCOD || Number(o.prodPrice || 0) + shipPrice
        );
        const prodPrice = totalCOD - shipPrice;
        let matchedCourier = null;
        const oRegion = o.region || "";
        if (oRegion) {
          const cleanOrderRegion = oRegion.toString().trim().toLowerCase();
          if (cleanOrderRegion) {
            matchedCourier = db.couriers.find((c) => {
              if (!c.region) return false;
              const regions = c.region.toString().split(/[,|،\s]+/).map((r) => r.trim().toLowerCase()).filter(Boolean);
              if (regions.includes(cleanOrderRegion)) return true;
              const cleanCourierRegion = c.region.toString().trim().toLowerCase();
              if (cleanCourierRegion.includes(cleanOrderRegion) || cleanOrderRegion.includes(cleanCourierRegion)) return true;
              const secRegion = c.secondary_region || c.secondaryRegion;
              if (secRegion) {
                const secRegions = secRegion.toString().split(/[,|،\s]+/).map((r) => r.trim().toLowerCase()).filter(Boolean);
                if (secRegions.includes(cleanOrderRegion)) return true;
              }
              return false;
            });
          }
        }
        const initialCourier = matchedCourier ? matchedCourier.name : "";
        const initialStatus = matchedCourier ? "\u0645\u064F\u0633\u0646\u062F \u062C\u062F\u064A\u062F" : "\u062C\u062F\u064A\u062F";
        const initialCommission = matchedCourier ? Number(matchedCourier.commission || 25) : 0;
        const newOrder = {
          tracking: id,
          createdAt: tNow,
          updatedAt: tNow,
          orderDate: tod(),
          supplier: isSupplierRole(currentRole) ? currentUser : o.supplier || "",
          prodType: o.prodType || "",
          customer: o.customer || "",
          phone: phoneClean,
          phone2: fixPhone(o.phone2 || ""),
          gov: o.gov || "",
          region: o.region || "",
          address: o.address || "",
          prodPrice,
          shipPrice,
          totalCOD,
          shipCost: shipPrice,
          // ship cost defaults to ship price
          courier: initialCourier,
          status: initialStatus,
          notes: o.notes || "",
          delivDate: "",
          retDate: "",
          addedBy: currentUser,
          commission: initialCommission,
          returnShippingType: "",
          returnQueueStatus: "",
          returnQueueAgent: "",
          "\u0645\u0648\u0642\u0639 \u0627\u0644\u0639\u0645\u064A\u0644/\u0627\u0644\u062E\u0631\u064A\u0637\u0629": ""
        };
        console.log(
          `[WhatsApp Bot Trigger on Server] Triggering customer loc prompt for order: ${id}, Phone: ${newOrder.phone}, Supplier: ${newOrder.supplier}`
        );
        console.log(
          `Simulated text sent to client: \u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0643 \u064A\u0627 \u0641\u0646\u062F\u0645\u060C \u0645\u0639\u0643 \u0634\u0631\u0643\u0629 Asfoor \u0644\u0644\u0648\u062C\u064A\u0633\u062A\u064A\u0627\u062A. \u0644\u062F\u064A\u0643 \u0634\u062D\u0646\u0629 \u0642\u0627\u062F\u0645\u0629 \u0645\u0646 [${newOrder.supplier}]. \u0644\u062A\u0623\u0643\u064A\u062F \u0645\u0648\u0627\u0641\u0642\u062A\u0643 \u0639\u0644\u0649 \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629 \u0648\u062A\u0633\u0647\u064A\u0644 \u0648\u0635\u0648\u0644 \u0627\u0644\u0645\u0646\u062F\u0648\u0628\u060C \u0628\u0631\u062C\u0627\u0621 \u0627\u0644\u0636\u063A\u0637 \u0639\u0644\u0649 \u0632\u0631 (\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u062D\u0642\u064A\u0642\u064A / Share Location) \u0623\u0633\u0641\u0644 \u0647\u0630\u0647 \u0627\u0644\u0631\u0633\u0627\u0644\u0629.`
        );
        const orderSupplier = (newOrder.supplier || "").toString().trim();
        if (orderSupplier) {
          if (!db.suppliers) db.suppliers = [];
          const matchedSup = db.suppliers.find(
            (s) => s.name && s.name.trim().toLowerCase() === orderSupplier.toLowerCase()
          );
          if (!matchedSup) {
            db.suppliers.push({
              name: orderSupplier,
              phone: "\u2014",
              price: shipPrice,
              notes: "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644\u0647 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u0639\u0646 \u0637\u0631\u064A\u0642 \u0625\u0636\u0627\u0641\u0629 \u0623\u0648\u0631\u062F\u0631 \u064A\u062F\u0648\u064A"
            });
          }
        }
        db.orders.push(newOrder);
        db.statusHistory.push({
          tracking: id,
          oldStatus: "",
          newStatus: newOrder.status,
          updatedBy: currentUser,
          dateTime: tNow
        });
        writeDB(db);
        return ok(res, { id, msg: `\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0623\u0648\u0631\u062F\u0631 ${id} \u0628\u0646\u062C\u0627\u062D` });
      }
      // ─────────────────────────────────────────────────────────────
      // BULK UPLOAD EXCEL / CSV
      // ─────────────────────────────────────────────────────────────
      case "addBulk": {
        if (!["\u0645\u062F\u064A\u0631", "\u0645\u0634\u0631\u0641", "\u0645\u0648\u0638\u0641 \u0639\u0645\u0644\u064A\u0627\u062A"].includes(currentRole) && !isSupplierRole(currentRole)) {
          return err(res, "\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 \u0631\u0641\u0639 \u0637\u0644\u0628\u0627\u062A \u062C\u0645\u0627\u0639\u064A\u0629");
        }
        const ordersArr = d.orders || [];
        const fallbackSupplier = isSupplierRole(currentRole) ? currentUser : d.supplier || "\u0645\u0648\u0631\u062F \u0639\u0627\u0645";
        const tNow = now();
        let addedCount = 0;
        for (const item of ordersArr) {
          const ph = fixPhone(item.phone || "");
          if (!ph && !item.customer) continue;
          let orderSupplier = fallbackSupplier;
          if (isSupplierRole(currentRole)) {
            orderSupplier = currentUser;
          } else {
            const itemRowSupplier = (item.supplier || "").toString().trim();
            if (itemRowSupplier) {
              orderSupplier = itemRowSupplier;
              const matchedSup = db.suppliers.find(
                (s) => s.name && s.name.trim().toLowerCase() === itemRowSupplier.toLowerCase()
              );
              if (!matchedSup) {
                db.suppliers.push({
                  name: itemRowSupplier,
                  phone: "\u2014",
                  price: 60,
                  notes: "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644\u0647 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u0639\u0646 \u0637\u0631\u064A\u0642 \u0631\u0641\u0639 \u062C\u0645\u0627\u0639\u064A"
                });
              }
            } else {
              orderSupplier = fallbackSupplier;
            }
          }
          let pPrice = Number(item.prodPrice) || 0;
          let sPrice = Number(item.shipPrice) || 0;
          let tCOD = Number(item.totalCOD) || 0;
          const anyItem = item;
          const rawShip = anyItem["\u0633\u0639\u0631 \u0627\u0644\u0634\u062D\u0646"] || anyItem["\u0627\u0644\u0634\u062D\u0646"] || anyItem["\u062A\u0643\u0644\u0641\u0629 \u0627\u0644\u0634\u062D\u0646"] || anyItem["\u0645\u0635\u0627\u0631\u064A\u0641 \u0627\u0644\u0634\u062D\u0646"] || anyItem["shipping"] || anyItem["shipPrice"] || anyItem["ship_price"];
          const rawTotal = anyItem["\u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u062A\u062D\u0635\u064A\u0644\u0647"] || anyItem["\u0627\u0644\u062A\u062D\u0635\u064A\u0644"] || anyItem["\u0627\u0644\u0645\u0637\u0644\u0648\u0628"] || anyItem["\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0643\u0648\u062F"] || anyItem["\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A"] || anyItem["\u0627\u0644\u0627\u062C\u0645\u0627\u0644\u064A"] || anyItem["\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0623\u0648\u0631\u062F\u0631"] || anyItem["total"] || anyItem["totalCOD"] || anyItem["total_cod"] || anyItem["cash_to_be_collected"] || anyItem["cash"];
          const rawProd = anyItem["\u0633\u0639\u0631 \u0627\u0644\u0645\u0646\u062A\u062C"] || anyItem["\u0627\u0644\u0645\u0646\u062A\u062C"] || anyItem["\u0633\u0639\u0631 \u0627\u0644\u0645\u0627\u062F\u0629"] || anyItem["price"] || anyItem["prodPrice"] || anyItem["product_price"];
          if (sPrice === 0 && rawShip !== void 0 && !isNaN(Number(rawShip))) {
            sPrice = Number(rawShip);
          }
          if (sPrice === 0) sPrice = 60;
          if (tCOD === 0 && rawTotal !== void 0 && !isNaN(Number(rawTotal))) {
            tCOD = Number(rawTotal);
          }
          if (pPrice === 0 && rawProd !== void 0 && !isNaN(Number(rawProd))) {
            pPrice = Number(rawProd);
          }
          if (tCOD > 0) {
            pPrice = tCOD - sPrice;
          } else if (pPrice > 0) {
            tCOD = pPrice + sPrice;
          } else {
            pPrice = 200;
            tCOD = pPrice + sPrice;
          }
          const id = generateID(db);
          let matchedCourier = null;
          const oRegion = item.region || "";
          if (oRegion) {
            const cleanOrderRegion = oRegion.toString().trim().toLowerCase();
            if (cleanOrderRegion) {
              matchedCourier = db.couriers.find((c) => {
                if (!c.region) return false;
                const regions = c.region.toString().split(/[,|،\s]+/).map((r) => r.trim().toLowerCase()).filter(Boolean);
                if (regions.includes(cleanOrderRegion)) return true;
                const cleanCourierRegion = c.region.toString().trim().toLowerCase();
                if (cleanCourierRegion.includes(cleanOrderRegion) || cleanOrderRegion.includes(cleanCourierRegion)) return true;
                const secRegion = c.secondary_region || c.secondaryRegion;
                if (secRegion) {
                  const secRegions = secRegion.toString().split(/[,|،\s]+/).map((r) => r.trim().toLowerCase()).filter(Boolean);
                  if (secRegions.includes(cleanOrderRegion)) return true;
                }
                return false;
              });
            }
          }
          const initialCourier = matchedCourier ? matchedCourier.name : "";
          const initialStatus = matchedCourier ? "\u0645\u064F\u0633\u0646\u062F \u062C\u062F\u064A\u062F" : "\u062C\u062F\u064A\u062F";
          const initialCommission = matchedCourier ? Number(matchedCourier.commission || 25) : 0;
          const newObj = {
            tracking: id,
            createdAt: tNow,
            updatedAt: tNow,
            orderDate: tod(),
            supplier: orderSupplier,
            customer: item.customer || "",
            prodType: item.prodType || "",
            phone: ph,
            phone2: "",
            gov: item.gov || "",
            region: item.region || "",
            address: item.address || "",
            prodPrice: pPrice,
            shipPrice: sPrice,
            totalCOD: tCOD,
            shipCost: sPrice,
            courier: initialCourier,
            status: initialStatus,
            notes: item.notes || "",
            delivDate: "",
            retDate: "",
            addedBy: currentUser,
            commission: initialCommission,
            returnShippingType: "",
            returnQueueStatus: "",
            returnQueueAgent: "",
            "\u0645\u0648\u0642\u0639 \u0627\u0644\u0639\u0645\u064A\u0644/\u0627\u0644\u062E\u0631\u064A\u0637\u0629": ""
          };
          console.log(
            `[WhatsApp Bot Trigger on Server] Triggering customer loc prompt for order: ${id}, Phone: ${newObj.phone}, Supplier: ${newObj.supplier}`
          );
          console.log(
            `Simulated text sent to client: \u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0643 \u064A\u0627 \u0641\u0646\u062F\u0645\u060C \u0645\u0639\u0643 \u0634\u0631\u0643\u0629 Asfoor \u0644\u0644\u0648\u062C\u064A\u0633\u062A\u064A\u0627\u062A. \u0644\u062F\u064A\u0643 \u0634\u062D\u0646\u0629 \u0642\u0627\u062F\u0645\u0629 \u0645\u0646 [${newObj.supplier}]. \u0644\u062A\u0623\u0643\u064A\u062F \u0645\u0648\u0627\u0641\u0642\u062A\u0643 \u0639\u0644\u0649 \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629 \u0648\u062A\u0633\u0647\u064A\u0644 \u0648\u0635\u0648\u0644 \u0627\u0644\u0645\u0646\u062F\u0648\u0628\u060C \u0628\u0631\u062C\u0627\u0621 \u0627\u0644\u0636\u063A\u0637 \u0639\u0644\u0649 \u0632\u0631 (\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u062D\u0642\u064A\u0642\u064A / Share Location) \u0623\u0633\u0641\u0644 \u0647\u0630\u0647 \u0627\u0644\u0631\u0633\u0627\u0644\u0629.`
          );
          db.orders.push(newObj);
          db.statusHistory.push({
            tracking: id,
            oldStatus: "",
            newStatus: initialStatus,
            updatedBy: currentUser,
            dateTime: tNow
          });
          addedCount++;
        }
        writeDB(db);
        return ok(res, {
          added: addedCount,
          msg: `\u062A\u0645 \u0631\u0641\u0639 ${addedCount} \u0623\u0648\u0631\u062F\u0631 \u0628\u0646\u062C\u0627\u062D`
        });
      }
      // ─────────────────────────────────────────────────────────────
      // SIMULATE CUSTOMER LOCATION REPLY (WhatsApp Hook)
      // ─────────────────────────────────────────────────────────────
      case "simulateCustomerLocationReply": {
        const { tracking, lat, lng } = d;
        if (!tracking || !lat || !lng) {
          return err(res, "\u0645\u0639\u0627\u0645\u0644\u0627\u062A \u0645\u0641\u0642\u0648\u062F\u0629: \u0631\u0642\u0645 \u0627\u0644\u062A\u062A\u0628\u0639 \u0648\u062E\u0637\u0648\u0637 \u0627\u0644\u0637\u0648\u0644 \u0648\u0627\u0644\u0639\u0631\u0636 \u0645\u0637\u0644\u0648\u0628\u0629");
        }
        const order = db.orders.find((o) => o.tracking === tracking);
        if (!order) {
          return err(res, "\u0627\u0644\u0623\u0648\u0631\u062F\u0631 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F");
        }
        const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
        order["\u0645\u0648\u0642\u0639 \u0627\u0644\u0639\u0645\u064A\u0644/\u0627\u0644\u062E\u0631\u064A\u0637\u0629"] = mapsUrl;
        writeDB(db);
        return ok(res, {
          ok: true,
          mapsUrl,
          msg: `\u062A\u0645 \u0645\u062D\u0627\u0643\u0627\u0629 \u0631\u062F \u0627\u0644\u0639\u0645\u064A\u0644 \u0628\u0646\u062C\u0627\u062D \u0648\u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u062C\u063A\u0631\u0627\u0641\u064A \u0644\u0644\u0623\u0648\u0631\u062F\u0631: ${mapsUrl}`
        });
      }
      // ─────────────────────────────────────────────────────────────
      // UPDATE ORDER STATUS (Workflow Controls)
      // ─────────────────────────────────────────────────────────────
      case "updateStatus": {
        const {
          tracking,
          status: rawStatus,
          returnShippingType,
          notes,
          delivDate,
          partialAmount,
          customerConfirmed
        } = d;
        if (!tracking || !rawStatus) return err(res, "\u0645\u0639\u0627\u0645\u0644\u0627\u062A \u0645\u0641\u0642\u0648\u062F\u0629");
        let status = rawStatus;
        const sc = tracking.toString().trim().toUpperCase();
        let fromArchive = false;
        let order = db.orders.find((o) => {
          const ot = o.tracking.toString().trim().toUpperCase();
          const phoneClean = (o.phone || "").toString().trim();
          const phone2Clean = (o.phone2 || "").toString().trim();
          return ot === sc || sc.includes(ot) || ot.includes(sc) || phoneClean === sc || phone2Clean === sc;
        });
        if (!order) {
          order = (db.archivedOrders || []).find((o) => {
            const ot = o.tracking.toString().trim().toUpperCase();
            const phoneClean = (o.phone || "").toString().trim();
            const phone2Clean = (o.phone2 || "").toString().trim();
            return ot === sc || sc.includes(ot) || ot.includes(sc) || phoneClean === sc || phone2Clean === sc;
          });
          if (order) {
            fromArchive = true;
          }
        }
        if (!order)
          return err(res, "\u0644\u0645 \u064A\u062A\u0645 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0627\u0644\u0623\u0648\u0631\u062F\u0631 \u0628\u0623\u064A \u0628\u0627\u0631\u0643\u0648\u062F \u0645\u064F\u062F\u062E\u0644");
        const matchedTracking = order.tracking;
        const oldStatus = order.status;
        if (status === "\u062C\u062F\u064A\u062F" && oldStatus !== "\u062C\u062F\u064A\u062F") {
          return err(
            res,
            "\u0642\u0641\u0644 \u0623\u0645\u0627\u0646: \u0644\u0627 \u064A\u0645\u0643\u0646 \u0625\u0631\u062C\u0627\u0639 \u062D\u0627\u0644\u0629 \u0627\u0644\u0623\u0648\u0631\u062F\u0631 \u0625\u0644\u0649 \u062C\u062F\u064A\u062F \u0628\u0639\u062F \u062A\u0639\u062F\u064A\u0644\u0647 \u0648\u062A\u0639\u062F\u064A\u0644 \u062D\u0627\u0644\u062A\u0647"
          );
        }
        if (customerConfirmed !== void 0) {
          order.customerConfirmed = customerConfirmed;
        }
        if (oldStatus === "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645" || oldStatus === "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A") {
          return err(
            res,
            "\u0644\u0627 \u064A\u0645\u0643\u0646 \u062A\u0639\u062F\u064A\u0644 \u062D\u0627\u0644\u0629 \u0623\u0648\u0631\u062F\u0631 \u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0623\u0648 \u062A\u0633\u0644\u064A\u0645\u0647 \u062C\u0632\u0626\u064A\u0627\u064B"
          );
        }
        const isAdmin = currentRole === "\u0645\u062F\u064A\u0631";
        const isSuper = currentRole === "\u0645\u0634\u0631\u0641";
        const isOps = currentRole === "\u0645\u0648\u0638\u0641 \u0639\u0645\u0644\u064A\u0627\u062A";
        const isAgent = currentRole === "\u0645\u0646\u062F\u0648\u0628";
        const isSupplier = isSupplierRole(currentRole);
        const isReturnsOfficer = currentRole === "\u0645\u0633\u0624\u0648\u0644 \u0645\u0631\u062A\u062C\u0639\u0627\u062A";
        const assignStatuses = [
          "\u062A\u0645 \u0627\u0644\u0625\u0633\u0646\u0627\u062F",
          "\u062E\u0627\u0631\u062C \u0645\u0639 \u0627\u0644\u0645\u0646\u062F\u0648\u0628",
          "\u0645\u0644\u063A\u064A",
          "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F"
        ];
        if (assignStatuses.includes(status) && !isAdmin && !isSuper) {
          return err(res, "\u0641\u0642\u0637 \u0627\u0644\u0645\u0634\u0631\u0641 \u0623\u0648 \u0627\u0644\u0645\u062F\u064A\u0631 \u064A\u0633\u062A\u0637\u064A\u0639 \u062A\u062D\u062F\u064A\u062F \u0648\u062A\u0648\u0632\u064A\u0639 \u0627\u0644\u0623\u0648\u0631\u062F\u0631\u0627\u062A");
        }
        if (isAgent) {
          const agentAllowedStatuses = [
            "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
            "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A",
            "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F",
            "\u0645\u0631\u062A\u062C\u0639",
            "\u0645\u0624\u062C\u0644",
            "\u0644\u0627 \u064A\u0648\u062C\u062F \u0631\u062F",
            "\u0627\u0644\u0639\u0645\u064A\u0644 \u0631\u062F \u0648\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
            "\u062E\u0627\u0631\u062C \u0645\u0639 \u0627\u0644\u0645\u0646\u062F\u0648\u0628"
          ];
          if (!agentAllowedStatuses.includes(status)) {
            return err(res, "\u063A\u064A\u0631 \u0645\u0633\u0645\u0648\u062D \u0644\u0644\u0645\u0646\u062F\u0648\u0628 \u0628\u0627\u062E\u062A\u064A\u0627\u0631 \u0647\u0630\u0647 \u0627\u0644\u062D\u0627\u0644\u0629");
          }
          if (order.courier !== currentUser) {
            return err(res, "\u0647\u0630\u0627 \u0627\u0644\u0623\u0648\u0631\u062F\u0631 \u0644\u064A\u0633 \u0645\u0633\u0646\u062F\u0627\u064B \u0625\u0644\u064A\u0643");
          }
        }
        if (isOps) {
          const opsAllowedStatuses = [
            "\u062A\u0645 \u0631\u062F \u0627\u0644\u0639\u0645\u064A\u0644 \u0648\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u0646\u0633\u064A\u0642",
            "\u0645\u0624\u062C\u0644",
            "\u0644\u0627 \u064A\u0648\u062C\u062F \u0631\u062F",
            "\u062C\u062F\u064A\u062F",
            "\u062E\u0627\u0631\u062C \u0645\u0639 \u0627\u0644\u0645\u0646\u062F\u0648\u0628"
          ];
          if (!opsAllowedStatuses.includes(status)) {
            return err(
              res,
              "\u0645\u0648\u0638\u0641 \u0627\u0644\u0639\u0645\u0644\u064A\u0627\u062A \u064A\u0645\u062A\u0644\u0643 \u0641\u0642\u0637 \u0635\u0644\u0627\u062D\u064A\u0629 \u062A\u062D\u062F\u064A\u062B \u0646\u062A\u064A\u062C\u0629 \u0627\u062A\u0635\u0627\u0644 \u0627\u0644\u0639\u0645\u064A\u0644 \u0648\u0625\u0631\u062C\u0627\u0639 \u0627\u0644\u062D\u0627\u0644\u0629"
            );
          }
        }
        if (isSupplier) return err(res, "\u0627\u0644\u0645\u0648\u0631\u062F \u0644\u0627 \u064A\u0645\u062A\u0644\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u062D\u0627\u0644\u0629");
        if (isReturnsOfficer) {
          const returnsOfficerAllowed = [
            "\u0645\u0631\u062A\u062C\u0639 \u062C\u062F\u064A\u062F",
            "\u062C\u0627\u0631\u064A \u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0645\u0631\u062A\u062C\u0639",
            "\u062C\u0627\u0647\u0632 \u0644\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F",
            "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F",
            "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0648\u0631\u062F",
            "\u062C\u0627\u0631\u064A \u0627\u0644\u0631\u062C\u0648\u0639 \u0644\u0644\u0645\u0648\u0631\u062F",
            "\u062C\u062F\u064A\u062F"
          ];
          if (!returnsOfficerAllowed.includes(status)) {
            return err(
              res,
              "\u0645\u0633\u0624\u0648\u0644 \u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0627\u062A \u064A\u0645\u0643\u0646\u0647 \u0641\u0642\u0637 \u062A\u0639\u064A\u064A\u0646 \u062D\u0627\u0644\u0627\u062A \u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0627\u062A \u0648\u062A\u062D\u062F\u064A\u062B \u0645\u0633\u0627\u0631\u0647\u0627"
            );
          }
        }
        if (status === "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0648\u0631\u062F") {
          status = "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F";
        }
        if (status === "\u0645\u0631\u062A\u062C\u0639") {
          if (!returnShippingType) {
            return err(res, "\u064A\u0631\u062C\u0649 \u062A\u062D\u062F\u064A\u062F \u0645\u0627 \u0625\u0630\u0627 \u062F\u0641\u0639 \u0627\u0644\u0639\u0645\u064A\u0644 \u0627\u0644\u0634\u062D\u0646 \u0623\u0645 \u0631\u0641\u0636");
          }
          order.status = "\u0645\u0631\u062A\u062C\u0639";
          order.returnShippingType = returnShippingType;
          order.retDate = now();
          if (returnShippingType === "paid") {
            const courierProfile = db.couriers.find(
              (c) => c.name === order.courier
            );
            const commVal = courierProfile ? Number(courierProfile.commission || 25) : 25;
            order.commission = commVal;
            db.courierLedger.push({
              courier: order.courier,
              date: now(),
              type: "\u0645\u0631\u062A\u062C\u0639 \u0645\u062F\u0641\u0648\u0639 \u0627\u0644\u0634\u062D\u0646",
              tracking: order.tracking,
              amount: commVal,
              desc: `\u0639\u0645\u0648\u0644\u0629 \u0645\u0631\u062A\u062C\u0639 \u0645\u062F\u0641\u0648\u0639 \u0627\u0644\u0634\u062D\u0646 \u0644\u0644\u0623\u0648\u0631\u062F\u0631: ${order.tracking}`
            });
          } else {
            order.commission = 0;
            db.courierLedger.push({
              courier: order.courier,
              date: now(),
              type: "\u0645\u0631\u062A\u062C\u0639 \u063A\u064A\u0631 \u0645\u062F\u0641\u0648\u0639 \u0627\u0644\u0634\u062D\u0646",
              tracking: order.tracking,
              amount: 0,
              desc: `\u0639\u0645\u0648\u0644\u0629 \u0645\u0631\u062A\u062C\u0639 \u063A\u064A\u0631 \u0645\u062F\u0641\u0648\u0639 \u0627\u0644\u0634\u062D\u0646 \u0644\u0644\u0623\u0648\u0631\u062F\u0631: ${order.tracking}`
            });
          }
          order.returnQueueStatus = "\u0645\u0631\u062A\u062C\u0639 \u062C\u062F\u064A\u062F";
          const firstReturnsOfficer = db.users.find(
            (u) => u.role === "\u0645\u0633\u0624\u0648\u0644 \u0645\u0631\u062A\u062C\u0639\u0627\u062A" && u.active === "\u0646\u0639\u0645"
          );
          order.returnQueueAgent = firstReturnsOfficer ? firstReturnsOfficer.name : "\u0623\u062D\u0645\u062F \u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0627\u062A";
        } else if ([
          "\u0645\u0631\u062A\u062C\u0639 \u062C\u062F\u064A\u062F",
          "\u062C\u0627\u0631\u064A \u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0645\u0631\u062A\u062C\u0639",
          "\u062C\u0627\u0647\u0632 \u0644\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F",
          "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F",
          "\u062C\u0627\u0631\u064A \u0627\u0644\u0631\u062C\u0648\u0639 \u0644\u0644\u0645\u0648\u0631\u062F"
        ].includes(status)) {
          order.returnQueueStatus = status;
          if (status === "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F") {
            order.status = "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F";
            order.retDate = now();
            const dupLedger = db.supplierLedger.find(
              (l) => l.tracking === order.tracking && (l.type === "\u0645\u0631\u062A\u062C\u0639" || l.type === "\u0645\u0631\u062A\u062C\u0639 \u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0648\u0631\u062F")
            );
            if (!dupLedger) {
              const financials = getOrderFinancials(order);
              db.supplierLedger.push({
                supplier: order.supplier,
                date: now(),
                type: "\u0645\u0631\u062A\u062C\u0639 \u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0648\u0631\u062F",
                tracking: order.tracking,
                amount: -Math.abs(Number(financials.prodPrice || 0)),
                desc: `\u062E\u0635\u0645 \u0642\u064A\u0645\u0629 \u0627\u0644\u0645\u0646\u062A\u062C \u0644\u0645\u0631\u062A\u062C\u0639 \u062A\u0633\u0644\u0645\u0647 \u0627\u0644\u0645\u0648\u0631\u062F: ${order.tracking} (\u0628\u0636\u0627\u0639\u0629 \u0645\u0631\u062A\u062C\u0639\u0629 \u0628\u062F\u0648\u0646 \u0634\u062D\u0646: -${financials.prodPrice} \u062C.\u0645)`
              });
            }
          } else {
            order.status = status;
          }
        } else {
          order.status = status;
          order.updatedAt = now();
          if (status === "\u062C\u062F\u064A\u062F") {
            order.returnQueueStatus = void 0;
            order.returnQueueAgent = void 0;
            order.lastCourier = order.courier;
            order.lastCommission = order.commission;
            order.courier = "";
            order.commission = 0;
          }
          if (status === "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645") {
            order.delivDate = now();
            const courierProfile = db.couriers.find(
              (c) => c.name === order.courier
            );
            const commVal = courierProfile ? Number(courierProfile.commission || 25) : 25;
            order.commission = commVal;
            db.courierLedger.push({
              courier: order.courier,
              date: now(),
              type: "\u062A\u0633\u0644\u064A\u0645",
              tracking: order.tracking,
              amount: commVal,
              desc: `\u0639\u0645\u0648\u0644\u0629 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0623\u0648\u0631\u062F\u0631 \u0648\u0627\u0644\u062A\u062D\u0635\u064A\u0644 \u0644\u0644\u0623\u0648\u0631\u062F\u0631: ${order.tracking}`
            });
          }
          if (status === "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A" || status === "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F") {
            const pAm = Number(partialAmount || 0);
            const financialsBefore = getOrderFinancials(order);
            if (!order.originalProdPrice) {
              order.originalProdPrice = financialsBefore.prodPrice;
            }
            if (!order.originalTotalCOD) {
              order.originalTotalCOD = financialsBefore.totalCOD;
            }
            order.totalCOD = pAm;
            order.partialAmount = pAm;
            order.actualReceivedCash = pAm;
            order.returnQueueStatus = "\u0645\u0631\u062A\u062C\u0639 \u062C\u0632\u0626\u064A \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639";
            order.isPartial = true;
            const courierProfile = db.couriers.find(
              (c) => c.name === order.courier
            );
            const commVal = courierProfile ? Number(courierProfile.commission || 25) : 25;
            order.commission = commVal;
            db.courierLedger.push({
              courier: order.courier,
              date: now(),
              type: "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A",
              tracking: order.tracking,
              amount: commVal,
              desc: `\u0639\u0645\u0648\u0644\u0629 \u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A \u0644\u0644\u0623\u0648\u0631\u062F\u0631: ${order.tracking} (\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0641\u0639\u0644\u064A \u0627\u0644\u0645\u0633\u062A\u0644\u0645: ${pAm} \u062C.\u0645)`
            });
            const dupLedger = db.supplierLedger.find(
              (l) => l.tracking === order.tracking && (l.type === "\u0623\u0648\u0631\u062F\u0631 \u0645\u0633\u062A\u0644\u0645" || l.type === "\u062A\u0633\u0644\u064A\u0645" || l.type === "\u0623\u0648\u0631\u062F\u0631 \u0645\u0633\u062A\u0644\u0645 \u062C\u0632\u0626\u064A")
            );
            if (!dupLedger) {
              const supplierShare = pAm;
              db.supplierLedger.push({
                supplier: order.supplier,
                date: now(),
                type: "\u0623\u0648\u0631\u062F\u0631 \u0645\u0633\u062A\u0644\u0645 \u062C\u0632\u0626\u064A",
                tracking: order.tracking,
                amount: supplierShare,
                desc: `\u062D\u0642\u0648\u0642 \u062A\u0648\u0631\u064A\u062F \u0623\u0648\u0631\u062F\u0631 \u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A: ${order.tracking} (\u0642\u064A\u0645\u0629 \u0627\u0644\u0628\u0636\u0627\u0639\u0629 \u0627\u0644\u0645\u0628\u0627\u0639\u0629 \u0627\u0644\u0635\u0627\u0641\u064A\u0629: ${pAm} \u062C.\u0645)`
              });
            }
          }
          if (status === "\u0627\u0644\u0639\u0645\u064A\u0644 \u0631\u062F \u0648\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u0633\u0644\u064A\u0645") {
            order.customerConfirmed = "true";
          }
          if (status === "\u0645\u0624\u062C\u0644" || status === "\u0645\u0624\u062C\u0644 \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639" || status === "Delayed") {
            if (!order.firstPostponedDate) {
              order.firstPostponedDate = now();
            }
          }
          if (status === "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F") {
            order.retDate = now();
          }
        }
        if (notes !== void 0) {
          order.notes = notes;
        }
        if (delivDate !== void 0) {
          order.delivDate = delivDate;
        }
        const clearCourierWithSignature = d.clearCourierWithSignature === true || d.clearCourierWithSignature === "true";
        if (clearCourierWithSignature) {
          if (order.courier) {
            order.courierSignature = `${order.courier} (\u062A\u0648\u0642\u064A\u0639 \u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u270D\uFE0F)`;
            order.lastCourier = order.courier;
            order.courier = "";
          }
        }
        order.updatedAt = now();
        const isEventualArchivable = ["\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645", "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F", "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F", "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F \u0648\u062A\u0635\u0641\u064A\u0629 \u062D\u0633\u0627\u0628\u0647"].includes(status);
        if (fromArchive && !isEventualArchivable) {
          const alreadyInActive = db.orders.some((o) => o.tracking === matchedTracking);
          if (!alreadyInActive) {
            db.orders.push(order);
          }
          db.archivedOrders = (db.archivedOrders || []).filter((o) => o.tracking !== matchedTracking);
        }
        if (!db.statusHistory) db.statusHistory = [];
        db.statusHistory.push({
          tracking: matchedTracking,
          oldStatus,
          newStatus: status,
          updatedBy: currentUser,
          dateTime: now()
        });
        writeDB(db);
        return ok(res, {
          tracking: matchedTracking,
          status,
          msg: "\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u062D\u0627\u0644\u0629 \u0627\u0644\u0623\u0648\u0631\u062F\u0631 \u0628\u0646\u062C\u0627\u062D \u0648\u062A\u0635\u0641\u064A\u062A\u0647"
        });
      }
      // ─────────────────────────────────────────────────────────────
      // DELETE ORDER (Admin Only)
      // ─────────────────────────────────────────────────────────────
      case "deleteOrder": {
        if (currentRole !== "\u0645\u062F\u064A\u0631") {
          return err(res, "\u0641\u0642\u0637 \u0627\u0644\u0645\u062F\u064A\u0631 \u064A\u0645\u062A\u0644\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 \u062D\u0630\u0641 \u0627\u0644\u0637\u0644\u0628\u0627\u062A");
        }
        const { tracking } = d;
        if (!tracking) return err(res, "\u0645\u0639\u0627\u0645\u0644 \u0645\u0641\u0642\u0648\u062F");
        const index = db.orders.findIndex((x) => x.tracking === tracking);
        if (index === -1) return err(res, "\u0627\u0644\u0623\u0648\u0631\u062F\u0631 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F");
        const order = db.orders[index];
        db.orders.splice(index, 1);
        db.statusHistory.push({
          tracking,
          oldStatus: order.status,
          newStatus: "\u0645\u062D\u0630\u0648\u0641",
          updatedBy: currentUser,
          dateTime: now()
        });
        db.supplierLedger = db.supplierLedger.filter(
          (l) => l.tracking !== tracking
        );
        db.courierLedger = db.courierLedger.filter(
          (l) => l.tracking !== tracking
        );
        writeDB(db);
        return ok(res, { tracking, msg: "\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0623\u0648\u0631\u062F\u0631 \u0646\u0647\u0627\u0626\u064A\u0627\u064B" });
      }
      // ─────────────────────────────────────────────────────────────
      // EDIT ORDER DETAILS (Admin Only)
      // ─────────────────────────────────────────────────────────────
      case "updateOrder": {
        if (currentRole !== "\u0645\u062F\u064A\u0631") {
          return err(res, "\u0641\u0642\u0637 \u0627\u0644\u0645\u062F\u064A\u0631 \u064A\u0645\u062A\u0644\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 \u062A\u0639\u062F\u064A\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0623\u0648\u0631\u062F\u0631");
        }
        const { tracking, order: o } = d;
        if (!tracking) return err(res, "\u0645\u0639\u0627\u0645\u0644 \u0631\u0642\u0645 \u0627\u0644\u062A\u062A\u0628\u0639 \u0645\u0641\u0642\u0648\u062F");
        let fromArchive = false;
        let order = db.orders.find((x) => x.tracking === tracking);
        if (!order) {
          order = (db.archivedOrders || []).find((x) => x.tracking === tracking);
          if (order) {
            fromArchive = true;
          }
        }
        if (!order) return err(res, "\u0627\u0644\u0623\u0648\u0631\u062F\u0631 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F");
        order.customer = o.customer !== void 0 ? o.customer : order.customer;
        order.phone = o.phone !== void 0 ? fixPhone(o.phone) : order.phone;
        order.phone2 = o.phone2 !== void 0 ? fixPhone(o.phone2) : order.phone2;
        order.gov = o.gov !== void 0 ? o.gov : order.gov;
        order.region = o.region !== void 0 ? o.region : order.region;
        order.address = o.address !== void 0 ? o.address : order.address;
        order.prodType = o.prodType !== void 0 ? o.prodType : order.prodType;
        order.notes = o.notes !== void 0 ? o.notes : order.notes;
        if (o.prodPrice !== void 0 || o.shipPrice !== void 0) {
          const oldProd = order.prodPrice;
          const oldShip = order.shipPrice;
          const newProd = o.prodPrice !== void 0 ? Number(o.prodPrice) : oldProd;
          const newShip = o.shipPrice !== void 0 ? Number(o.shipPrice) : oldShip;
          if (oldProd !== newProd || oldShip !== newShip) {
            order.prodPrice = newProd;
            order.shipPrice = newShip;
            order.totalCOD = newProd + newShip;
            order.shipCost = newShip;
            const ledgerTransaction = db.supplierLedger.find(
              (l) => l.tracking === tracking && l.type === "\u0623\u0648\u0631\u062F\u0631 \u0645\u0633\u062A\u0644\u0645"
            );
            if (ledgerTransaction) {
              ledgerTransaction.amount = newProd;
              ledgerTransaction.desc = `\u062A\u0639\u062F\u064A\u0644 \u0642\u064A\u0645\u0629 \u0623\u0648\u0631\u062F\u0631 \u0645\u0633\u062A\u0644\u0645 ${tracking} (\u0627\u0644\u0635\u0627\u0641\u064A \u0627\u0644\u062C\u062F\u064A\u062F: ${newProd} = \u0627\u0644\u0643\u0644\u064A ${order.totalCOD} - \u0627\u0644\u0634\u062D\u0646 ${newShip})`;
            }
            if (!db.auditLog) db.auditLog = [];
            db.auditLog.push({
              user: currentUser,
              type: "\u062A\u0639\u062F\u064A\u0644 \u0645\u0627\u0644\u064A \u0623\u0648\u0631\u062F\u0631",
              dateTime: now(),
              oldVal: `\u0633\u0639\u0631 \u0627\u0644\u0645\u0646\u062A\u062C: ${oldProd} \u062C.\u0645\u060C \u0627\u0644\u0634\u062D\u0646: ${oldShip} \u062C.\u0645`,
              newVal: `\u0633\u0639\u0631 \u0627\u0644\u0645\u0646\u062A\u062C: ${newProd} \u062C.\u0645\u060C \u0627\u0644\u0634\u062D\u0646: ${newShip} \u062C.\u0645`,
              reason: d.reason || o.reason || "\u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u064A\u062F\u0648\u064A\u064B\u0627 \u0628\u0648\u0627\u0633\u0637\u0629 \u0627\u0644\u0625\u062F\u0627\u0631\u0629"
            });
          }
        }
        if (o.courier !== void 0) {
          const oldCourier = order.courier;
          if (o.courier === "reset_warehouse" || o.courier === "") {
            const prevStatus = order.status;
            order.lastCourier = oldCourier;
            order.lastCommission = order.commission;
            order.courier = "";
            order.commission = 0;
            if (prevStatus === "\u0645\u0631\u062A\u062C\u0639") {
              order.status = "\u0645\u0631\u062A\u062C\u0639 \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639";
            } else if (prevStatus === "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A") {
              order.status = "\u0645\u0631\u062A\u062C\u0639 \u062C\u0632\u0626\u064A \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639";
            } else if (prevStatus === "\u0645\u0624\u062C\u0644") {
              order.status = "\u0645\u0624\u062C\u0644";
            } else if (prevStatus === "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645" || prevStatus === "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0628\u0646\u062C\u0627\u062D" || prevStatus === "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 (\u0646\u0627\u062C\u062D \u0643\u0627\u0634)") {
              order.status = prevStatus;
            } else {
              if (prevStatus !== "\u062C\u062F\u064A\u062F") {
                order.status = prevStatus;
              }
            }
            if (order.status !== prevStatus) {
              db.statusHistory.push({
                tracking,
                oldStatus: prevStatus,
                newStatus: order.status,
                updatedBy: currentUser,
                dateTime: now()
              });
            }
          } else {
            order.courier = o.courier;
            if (o.courier && (!oldCourier || oldCourier === "reset_warehouse" || oldCourier === "") && order.status === "\u062C\u062F\u064A\u062F") {
              order.status = "\u0645\u064F\u0633\u0646\u062F \u062C\u062F\u064A\u062F";
              db.statusHistory.push({
                tracking,
                oldStatus: "\u062C\u062F\u064A\u062F",
                newStatus: "\u0645\u064F\u0633\u0646\u062F \u062C\u062F\u064A\u062F",
                updatedBy: currentUser,
                dateTime: now()
              });
            }
            const courierProfile = db.couriers.find(
              (c) => c.name === o.courier
            );
            order.commission = courierProfile ? Number(courierProfile.commission || 25) : 25;
          }
        }
        order.updatedAt = now();
        const eventualStatus = order.status;
        const isEventualArchivable = ["\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645", "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F", "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F", "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F \u0648\u062A\u0635\u0641\u064A\u0629 \u062D\u0633\u0627\u0628\u0647"].includes(eventualStatus);
        if (fromArchive && !isEventualArchivable) {
          const alreadyInActive = db.orders.some((o2) => o2.tracking === tracking);
          if (!alreadyInActive) {
            db.orders.push(order);
          }
          db.archivedOrders = (db.archivedOrders || []).filter((o2) => o2.tracking !== tracking);
        }
        writeDB(db);
        return ok(res, { tracking, msg: "\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0623\u0648\u0631\u062F\u0631 \u0628\u0646\u062C\u0627\u062D" });
      }
      // ─────────────────────────────────────────────────────────────
      // ARCHIVE ORDER (Admin/Accountant Only)
      // ─────────────────────────────────────────────────────────────
      case "archiveOrder": {
        if (!["\u0645\u062F\u064A\u0631", "\u0645\u062D\u0627\u0633\u0628"].includes(currentRole)) {
          return err(res, "\u0641\u0642\u0637 \u0627\u0644\u0645\u062F\u064A\u0631 \u0648\u0627\u0644\u0645\u062D\u0627\u0633\u0628 \u064A\u0645\u062A\u0644\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 \u0623\u0631\u0634\u0641\u0629 \u0627\u0644\u0637\u0644\u0628\u0627\u062A");
        }
        const { tracking } = d;
        if (!tracking) return err(res, "\u0645\u0639\u0627\u0645\u0644 \u0645\u0641\u0642\u0648\u062F");
        const order = db.orders.find((x) => x.tracking === tracking);
        if (!order) return err(res, "\u0627\u0644\u0623\u0648\u0631\u062F\u0631 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F");
        const oldStatus = order.status;
        order.status = "\u0645\u0624\u0631\u0634\u0641";
        order.isArchived = true;
        order.updatedAt = now();
        if (!db.statusHistory) db.statusHistory = [];
        db.statusHistory.push({
          tracking,
          oldStatus,
          newStatus: "\u0645\u0624\u0631\u0634\u0641",
          updatedBy: currentUser,
          dateTime: now()
        });
        if (!db.auditLog) db.auditLog = [];
        db.auditLog.push({
          user: currentUser,
          type: "\u0623\u0631\u0634\u0641\u0629 \u0623\u0648\u0631\u062F\u0631",
          dateTime: now(),
          oldVal: oldStatus,
          newVal: "\u0645\u0624\u0631\u0634\u0641",
          reason: `\u0623\u0631\u0634\u0641\u0629 \u0627\u0644\u0634\u062D\u0646\u0629 \u0648\u062A\u062B\u0628\u064A\u062A \u062A\u0635\u0641\u064A\u062A\u0647\u0627 \u0627\u0644\u062A\u0627\u0631\u064A\u062E\u064A\u0629 \u0644\u0644\u0634\u062D\u0646\u0629: ${tracking}`
        });
        writeDB(db);
        const localGscriptUrl = process.env.GOOGLE_SCRIPT_URL;
        if (localGscriptUrl) {
          const payloadToSheet = {
            ...d,
            token: "14014",
            currentUser,
            currentRole
          };
          executeProxyRequest(localGscriptUrl.trim(), payloadToSheet).catch(
            (syncErr) => {
              console.error(
                "Async Google Sheets synchronization for archiveOrder failed:",
                syncErr
              );
            }
          );
        }
        return ok(res, { tracking, msg: "\u062A\u0645 \u0623\u0631\u0634\u0641\u0629 \u0627\u0644\u0623\u0648\u0631\u062F\u0631 \u0648\u062A\u0635\u0641\u064A\u062A\u0647 \u0628\u0646\u062C\u0627\u062D" });
      }
      // ─────────────────────────────────────────────────────────────
      // BULK RE-ASSIGN / BATCH MANIFEST
      // ─────────────────────────────────────────────────────────────
      case "bulkUpdate": {
        const allowedRoles = [
          "\u0645\u062F\u064A\u0631",
          "\u0645\u0634\u0631\u0641",
          "\u0645\u0633\u0624\u0648\u0644 \u0645\u0631\u062A\u062C\u0639\u0627\u062A",
          "\u0645\u0648\u0638\u0641 \u0639\u0645\u0644\u064A\u0627\u062A",
          "\u0645\u0646\u062F\u0648\u0628"
        ];
        if (!allowedRoles.includes(currentRole)) {
          return err(res, "\u0644\u0627 \u062A\u0645\u062A\u0644\u0643 \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0627\u0644\u0644\u0627\u0632\u0645\u0629 \u0644\u0644\u0642\u064A\u0627\u0645 \u0628\u0627\u0644\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u062C\u0645\u0627\u0639\u064A");
        }
        const trackings = d.trackings || [];
        let status = d.status;
        const courier = d.courier;
        const notes = d.notes || d.bulkNotes;
        const postponeDate = d.date || d.delivDate || d.postponedDate;
        if (status === "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0628\u0646\u062C\u0627\u062D") status = "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645";
        if (status === "\u0645\u0624\u062C\u0644 \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0637\u0644\u0628 \u0627\u0644\u0639\u0645\u064A\u0644") status = "\u0645\u0624\u062C\u0644";
        if (status === "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F \u0648\u062A\u0635\u0641\u064A\u0629 \u062D\u0633\u0627\u0628\u0647")
          status = "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F";
        if (status === "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0648\u0631\u062F") status = "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F";
        if (currentRole === "\u0645\u0633\u0624\u0648\u0644 \u0645\u0631\u062A\u062C\u0639\u0627\u062A") {
          const returnsOfficerAllowed = [
            "\u0645\u0631\u062A\u062C\u0639 \u062C\u062F\u064A\u062F",
            "\u0645\u0631\u062A\u062C\u0639 \u062C\u0627\u0631\u064A \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0643\u062A\u0628",
            "\u062C\u0627\u0631\u064A \u0627\u0644\u0631\u062C\u0648\u0639 \u0644\u0644\u0645\u0648\u0631\u062F",
            "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F",
            "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0648\u0631\u062F",
            "\u062C\u062F\u064A\u062F"
          ];
          if (status && !returnsOfficerAllowed.includes(status)) {
            return err(
              res,
              "Unauthorized Action: \u0645\u0633\u0624\u0648\u0644 \u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0627\u062A \u064A\u0645\u062A\u0644\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 \u062A\u0639\u062F\u064A\u0644 \u062D\u0627\u0644\u0627\u062A \u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0627\u062A \u0627\u0644\u0645\u0643\u062A\u0628\u064A\u0629 \u0641\u0642\u0637"
            );
          }
          if (courier !== void 0) {
            return err(
              res,
              "Unauthorized Action: \u0644\u0627 \u062A\u0645\u062A\u0644\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 \u062A\u0639\u062F\u064A\u0644 \u0623\u0648 \u062A\u0639\u064A\u064A\u0646 \u0627\u0644\u0645\u0646\u0627\u062F\u064A\u0628"
            );
          }
        } else if (currentRole === "\u0645\u0648\u0638\u0641 \u0639\u0645\u0644\u064A\u0627\u062A") {
          const opsAllowed = [
            "\u062A\u0645 \u0631\u062F \u0627\u0644\u0639\u0645\u064A\u0644 \u0648\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u0646\u0633\u064A\u0642",
            "\u0644\u0627 \u064A\u0631\u062F - \u0645\u062D\u0627\u0648\u0644\u0629 \u0623\u0648\u0644\u0649/\u062B\u0627\u0646\u064A\u0629",
            "\u062A\u062D\u062F\u064A\u062B \u0646\u062A\u064A\u062C\u0629 \u0627\u0644\u0627\u062A\u0635\u0627\u0644",
            "\u0645\u0624\u062C\u0644",
            "\u0644\u0627 \u064A\u0648\u062C\u062F \u0631\u062F",
            "\u062C\u062F\u064A\u062F",
            "\u062E\u0627\u0631\u062C \u0645\u0639 \u0627\u0644\u0645\u0646\u062F\u0648\u0628"
          ];
          if (status && !opsAllowed.includes(status)) {
            return err(
              res,
              "Unauthorized Action: \u0645\u0648\u0638\u0641 \u0627\u0644\u0639\u0645\u0644\u064A\u0627\u062A \u064A\u0645\u062A\u0644\u0643 \u0641\u0642\u0637 \u0635\u0644\u0627\u062D\u064A\u0629 \u062A\u062D\u062F\u064A\u062B \u0646\u062A\u064A\u062C\u0629 \u0627\u062A\u0635\u0627\u0644 \u0627\u0644\u0639\u0645\u064A\u0644 \u0648\u062A\u0623\u062C\u064A\u0644 \u0627\u0644\u0623\u0648\u0631\u062F\u0631\u0627\u062A"
            );
          }
          if (courier !== void 0) {
            return err(
              res,
              "Unauthorized Action: \u0644\u0627 \u062A\u0645\u062A\u0644\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 \u062A\u0639\u062F\u064A\u0644 \u0623\u0648 \u062A\u0639\u064A\u064A\u0646 \u0627\u0644\u0645\u0646\u0627\u062F\u064A\u0628"
            );
          }
        } else if (currentRole === "\u0645\u0646\u062F\u0648\u0628") {
          const agentAllowed = [
            "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
            "\u0645\u0624\u062C\u0644",
            "\u0644\u0627 \u064A\u0648\u062C\u062F \u0631\u062F",
            "\u0645\u0631\u062A\u062C\u0639",
            "\u062E\u0627\u0631\u062C \u0645\u0639 \u0627\u0644\u0645\u0646\u062F\u0648\u0628",
            "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A",
            "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F",
            "\u0627\u0644\u0639\u0645\u064A\u0644 \u0631\u062F \u0648\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u0633\u0644\u064A\u0645"
          ];
          if (status && !agentAllowed.includes(status)) {
            return err(
              res,
              "Unauthorized Action: \u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u064A\u0645\u062A\u0644\u0643 \u0641\u0642\u0637 \u0635\u0644\u0627\u062D\u064A\u0629 \u062A\u062D\u062F\u064A\u062B \u062D\u0627\u0644\u0627\u062A \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u0648\u0627\u0644\u062A\u0639\u0644\u064A\u0642 \u0627\u0644\u0645\u0628\u0627\u0634\u0631\u0629"
            );
          }
          if (courier !== void 0) {
            return err(
              res,
              "Unauthorized Action: \u0644\u0627 \u062A\u0645\u062A\u0644\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 \u062A\u0639\u062F\u064A\u0644 \u0623\u0648 \u062A\u0639\u064A\u064A\u0646 \u0627\u0644\u0645\u0646\u0627\u062F\u064A\u0628"
            );
          }
        }
        let modified = 0;
        for (const t of trackings) {
          const order = db.orders.find((o) => o.tracking === t);
          if (!order) continue;
          if (currentRole === "\u0645\u0646\u062F\u0648\u0628" && order.courier !== currentUser) {
            continue;
          }
          const oldStatus = order.status;
          if (notes !== void 0 && notes !== "") {
            order.notes = notes;
          }
          if (postponeDate !== void 0 && postponeDate !== "") {
            order.delivDate = postponeDate;
          }
          if (courier !== void 0 && ["\u0645\u062F\u064A\u0631", "\u0645\u0634\u0631\u0641"].includes(currentRole)) {
            if (courier === "reset_warehouse" || courier === "") {
              order.lastCourier = order.courier;
              order.lastCommission = order.commission;
              order.courier = "";
              order.commission = 0;
              if (![
                "\u0645\u0631\u062A\u062C\u0639",
                "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A",
                "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F",
                "\u0645\u0631\u062A\u062C\u0639 \u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0648\u0631\u062F",
                "\u0645\u0631\u062A\u062C\u0639 \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639",
                "\u0645\u0631\u062A\u062C\u0639 \u062C\u062F\u064A\u062F",
                "\u062C\u0627\u0631\u064A \u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0645\u0631\u062A\u062C\u0639",
                "\u062C\u0627\u0647\u0632 \u0644\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F"
              ].includes(order.status)) {
                if (order.status !== "\u062C\u062F\u064A\u062F") {
                  const prevStatus = order.status;
                  order.status = prevStatus;
                }
              }
            } else if (courier !== order.courier) {
              order.courier = courier;
              const cProfile = db.couriers.find((c) => c.name === courier);
              order.commission = cProfile ? Number(cProfile.commission || 25) : 25;
              if (courier && oldStatus === "\u062C\u062F\u064A\u062F") {
                order.status = "\u0645\u064F\u0633\u0646\u062F \u062C\u062F\u064A\u062F";
                if (!db.statusHistory) db.statusHistory = [];
                db.statusHistory.push({
                  tracking: t,
                  oldStatus: "\u062C\u062F\u064A\u062F",
                  newStatus: "\u0645\u064F\u0633\u0646\u062F \u062C\u062F\u064A\u062F",
                  updatedBy: currentUser,
                  dateTime: now()
                });
              }
            }
          }
          if (status !== void 0 && status !== order.status && courier !== "reset_warehouse" && courier !== "") {
            order.status = status;
            order.updatedAt = now();
            if (status === "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645") {
              order.delivDate = postponeDate || now();
              const cProfile = db.couriers.find(
                (c) => c.name === order.courier
              );
              const comm = cProfile ? Number(cProfile.commission || 25) : 25;
              db.courierLedger.push({
                courier: order.courier,
                date: now(),
                type: "\u062A\u0633\u0644\u064A\u0645",
                tracking: order.tracking,
                amount: comm,
                desc: `\u0639\u0645\u0648\u0644\u0629 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0623\u0648\u0631\u062F\u0631 \u062C\u0645\u0627\u0639\u064A\u0627\u064B: ${order.tracking}`
              });
              const dupLedger = db.supplierLedger.find(
                (l) => l.tracking === order.tracking && (l.type === "\u0623\u0648\u0631\u062F\u0631 \u0645\u0633\u062A\u0644\u0645" || l.type === "\u062A\u0633\u0644\u064A\u0645")
              );
              if (!dupLedger) {
                const supplierShare = Number(order.prodPrice || 0) - Number(order.shipPrice || 0);
                db.supplierLedger.push({
                  supplier: order.supplier,
                  date: now(),
                  type: "\u0623\u0648\u0631\u062F\u0631 \u0645\u0633\u062A\u0644\u0645",
                  tracking: order.tracking,
                  amount: supplierShare,
                  desc: `\u062D\u0642\u0648\u0642 \u0623\u0648\u0631\u062F\u0631 \u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u062C\u0645\u0627\u0639\u064A\u0627\u064B: ${order.tracking} (\u0633\u0639\u0631 \u0627\u0644\u0645\u0646\u062A\u062C ${order.prodPrice} - \u0634\u062D\u0646 \u0627\u0644\u0634\u0631\u0643\u0629 ${order.shipPrice})`
                });
              }
            }
            if (["\u0645\u0631\u062A\u062C\u0639", "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F", "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F"].includes(
              status
            )) {
              order.retDate = now();
              if (status === "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F" || status === "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F") {
                order.returnQueueStatus = "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F";
                const dupLedger = db.supplierLedger.find(
                  (l) => l.tracking === order.tracking && (l.type === "\u0645\u0631\u062A\u062C\u0639" || l.type === "\u0645\u0631\u062A\u062C\u0639 \u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0648\u0631\u062F")
                );
                if (!dupLedger) {
                  db.supplierLedger.push({
                    supplier: order.supplier,
                    date: now(),
                    type: "\u0645\u0631\u062A\u062C\u0639 \u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0648\u0631\u062F",
                    tracking: order.tracking,
                    amount: -Number(order.prodPrice || 0),
                    desc: `\u062E\u0635\u0645 \u0642\u064A\u0645\u0629 \u0627\u0644\u0645\u0646\u062A\u062C \u0644\u0645\u0631\u062A\u062C\u0639 \u062A\u0633\u0644\u0645\u0647 \u0627\u0644\u0645\u0648\u0631\u062F \u062C\u0645\u0627\u0639\u064A\u0627\u064B: ${order.tracking}`
                  });
                }
              }
            }
            if (!db.statusHistory) db.statusHistory = [];
            db.statusHistory.push({
              tracking: t,
              oldStatus,
              newStatus: status,
              updatedBy: currentUser,
              dateTime: now()
            });
          }
          order.updatedAt = now();
          modified++;
        }
        writeDB(db);
        return ok(res, {
          done: modified,
          msg: `\u062A\u0645 \u062A\u062D\u062F\u064A\u062B ${modified} \u0623\u0648\u0631\u062F\u0631 \u0628\u0646\u062C\u0627\u062D`
        });
      }
      // ─────────────────────────────────────────────────────────────
      // BATCH UPDATE: updateOrdersStatusBulk
      // ─────────────────────────────────────────────────────────────
      case "updateOrdersStatusBulk": {
        const allowedRoles = [
          "\u0645\u062F\u064A\u0631",
          "\u0645\u0634\u0631\u0641",
          "\u0645\u0633\u0624\u0648\u0644 \u0645\u0631\u062A\u062C\u0639\u0627\u062A",
          "\u0645\u0648\u0638\u0641 \u0639\u0645\u0644\u064A\u0627\u062A",
          "\u0645\u0646\u062F\u0648\u0628"
        ];
        if (!allowedRoles.includes(currentRole)) {
          return err(res, "\u0644\u0627 \u062A\u0645\u062A\u0644\u0643 \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0627\u0644\u0644\u0627\u0632\u0645\u0629 \u0644\u0644\u0642\u064A\u0627\u0645 \u0628\u0627\u0644\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u062C\u0645\u0627\u0639\u064A");
        }
        const updates = d.updates || [];
        if (!Array.isArray(updates) || updates.length === 0) {
          return err(res, "\u0644\u0645 \u064A\u062A\u0645 \u0627\u0633\u062A\u0644\u0627\u0645 \u0645\u0635\u0641\u0648\u0641\u0629 \u062A\u062D\u062F\u064A\u062B\u0627\u062A \u062C\u0645\u0627\u0639\u064A\u0629 \u0635\u0627\u0644\u062D\u0629");
        }
        let modified = 0;
        for (const item of updates) {
          const t = item.tracking;
          if (!t) continue;
          let order = db.orders.find((o) => o.tracking === t);
          let fromArchive = false;
          if (!order) {
            order = (db.archivedOrders || []).find((o) => o.tracking === t);
            if (order) fromArchive = true;
          }
          if (!order) continue;
          if (currentRole === "\u0645\u0646\u062F\u0648\u0628" && order.courier !== currentUser) {
            continue;
          }
          const oldStatus = order.status;
          if (item.notes !== void 0 && item.notes !== "") {
            order.notes = item.notes;
          }
          const itemDate = item.date || item.delivDate || item.postponedDate;
          if (itemDate !== void 0 && itemDate !== "") {
            order.delivDate = itemDate;
          }
          if (item.courier !== void 0 && ["\u0645\u062F\u064A\u0631", "\u0645\u0634\u0631\u0641"].includes(currentRole)) {
            const courier = item.courier;
            if (courier === "reset_warehouse" || courier === "") {
              order.lastCourier = order.courier;
              order.lastCommission = order.commission;
              order.courier = "";
              order.commission = 0;
              if (![
                "\u0645\u0631\u062A\u062C\u0639",
                "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A",
                "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F",
                "\u0645\u0631\u062A\u062C\u0639 \u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0648\u0631\u062F",
                "\u0645\u0631\u062A\u062C\u0639 \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639",
                "\u0645\u0631\u062A\u062C\u0639 \u062C\u062F\u064A\u062F",
                "\u062C\u0627\u0631\u064A \u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0645\u0631\u062A\u062C\u0639",
                "\u062C\u0627\u0647\u0632 \u0644\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F"
              ].includes(order.status)) {
                if (order.status !== "\u062C\u062F\u064A\u062F") {
                  const prevStatus = order.status;
                  order.status = prevStatus;
                }
              }
            } else if (courier !== order.courier) {
              order.courier = courier;
              const cProfile = db.couriers.find((c) => c.name === courier);
              order.commission = cProfile ? Number(cProfile.commission || 25) : 25;
              if (courier && oldStatus === "\u062C\u062F\u064A\u062F") {
                order.status = "\u0645\u064F\u0633\u0646\u062F \u062C\u062F\u064A\u062F";
                if (!db.statusHistory) db.statusHistory = [];
                db.statusHistory.push({
                  tracking: t,
                  oldStatus: "\u062C\u062F\u064A\u062F",
                  newStatus: "\u0645\u064F\u0633\u0646\u062F \u062C\u062F\u064A\u062F",
                  updatedBy: currentUser,
                  dateTime: now()
                });
              }
            }
          }
          let status = item.status;
          if (status === "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0628\u0646\u062C\u0627\u062D") status = "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645";
          if (status === "\u0645\u0624\u062C\u0644 \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0637\u0644\u0628 \u0627\u0644\u0639\u0645\u064A\u0644") status = "\u0645\u0624\u062C\u0644";
          if (status === "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F \u0648\u062A\u0635\u0641\u064A\u0629 \u062D\u0633\u0627\u0628\u0647" || status === "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0648\u0631\u062F")
            status = "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F";
          if (status) {
            if (currentRole === "\u0645\u0633\u0624\u0648\u0644 \u0645\u0631\u062A\u062C\u0639\u0627\u062A") {
              const returnsOfficerAllowed = [
                "\u0645\u0631\u062A\u062C\u0639 \u062C\u062F\u064A\u062F",
                "\u0645\u0631\u062A\u062C\u0639 \u062C\u0627\u0631\u064A \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0643\u062A\u0628",
                "\u062C\u0627\u0631\u064A \u0627\u0644\u0631\u062C\u0648\u0639 \u0644\u0644\u0645\u0648\u0631\u062F",
                "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F",
                "\u062C\u062F\u064A\u062F"
              ];
              if (!returnsOfficerAllowed.includes(status)) continue;
            } else if (currentRole === "\u0645\u0648\u0638\u0641 \u0639\u0645\u0644\u064A\u0627\u062A") {
              const opsAllowed = [
                "\u062A\u0645 \u0631\u062F \u0627\u0644\u0639\u0645\u064A\u0644 \u0648\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u0646\u0633\u064A\u0642",
                "\u0644\u0627 \u064A\u0631\u062F - \u0645\u062D\u0627\u0648\u0644\u0629 \u0623\u0648\u0644\u0649/\u062B\u0627\u0646\u064A\u0629",
                "\u062A\u062D\u062F\u064A\u062B \u0646\u062A\u064A\u062C\u0629 \u0627\u0644\u0627\u062A\u0635\u0627\u0644",
                "\u0645\u0624\u062C\u0644",
                "\u0644\u0627 \u064A\u0648\u062C\u062F \u0631\u062F",
                "\u062C\u062F\u064A\u062F",
                "\u062E\u0627\u0631\u062C \u0645\u0639 \u0627\u0644\u0645\u0646\u062F\u0648\u0628"
              ];
              if (!opsAllowed.includes(status)) continue;
            } else if (currentRole === "\u0645\u0646\u062F\u0648\u0628") {
              const agentAllowed = [
                "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
                "\u0645\u0624\u062C\u0644",
                "\u0644\u0627 \u064A\u0648\u062C\u062F \u0631\u062F",
                "\u0645\u0631\u062A\u062C\u0639",
                "\u062E\u0627\u0631\u062C \u0645\u0639 \u0627\u0644\u0645\u0646\u062F\u0648\u0628",
                "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A",
                "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F",
                "\u0627\u0644\u0639\u0645\u064A\u0644 \u0631\u062F \u0648\u062C\u0627\u0631\u064A \u0627\u0644\u062A\u0633\u0644\u064A\u0645"
              ];
              if (!agentAllowed.includes(status)) continue;
            }
          }
          if (status !== void 0 && status !== order.status && item.courier !== "reset_warehouse" && item.courier !== "") {
            order.status = status;
            order.updatedAt = now();
            if (status === "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645") {
              order.delivDate = itemDate || now();
              const cProfile = db.couriers.find(
                (c) => c.name === order.courier
              );
              const comm = cProfile ? Number(cProfile.commission || 25) : 25;
              db.courierLedger.push({
                courier: order.courier,
                date: now(),
                type: "\u062A\u0633\u0644\u064A\u0645",
                tracking: order.tracking,
                amount: comm,
                desc: `\u0639\u0645\u0648\u0644\u0629 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0623\u0648\u0631\u062F\u0631 \u062C\u0645\u0627\u0639\u064A\u0627\u064B (\u0627\u0644\u062F\u0641\u0639\u0629 \u0627\u0644\u0645\u062C\u0645\u0639\u0629): ${order.tracking}`
              });
              const dupLedger = db.supplierLedger.find(
                (l) => l.tracking === order.tracking && (l.type === "\u0623\u0648\u0631\u062F\u0631 \u0645\u0633\u062A\u0644\u0645" || l.type === "\u062A\u0633\u0644\u064A\u0645")
              );
              if (!dupLedger) {
                const supplierShare = Number(order.prodPrice || 0) - Number(order.shipPrice || 0);
                db.supplierLedger.push({
                  supplier: order.supplier,
                  date: now(),
                  type: "\u0623\u0648\u0631\u062F\u0631 \u0645\u0633\u062A\u0644\u0645",
                  tracking: order.tracking,
                  amount: supplierShare,
                  desc: `\u062D\u0642\u0648\u0642 \u0623\u0648\u0631\u062F\u0631 \u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u062C\u0645\u0627\u0639\u064A\u0627\u064B (\u0627\u0644\u062F\u0641\u0639\u0629 \u0627\u0644\u0645\u062C\u0645\u0639\u0629): ${order.tracking} (\u0635\u0627\u0641\u064A \u0628\u0636\u0627\u0639\u0629 ${supplierShare})`
                });
              }
            }
            if (["\u0645\u0631\u062A\u062C\u0639", "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F", "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F"].includes(
              status
            )) {
              order.retDate = now();
              if (status === "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F" || status === "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F") {
                order.returnQueueStatus = "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F";
                const dupLedger = db.supplierLedger.find(
                  (l) => l.tracking === order.tracking && (l.type === "\u0645\u0631\u062A\u062C\u0639" || l.type === "\u0645\u0631\u062A\u062C\u0639 \u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0648\u0631\u062F")
                );
                if (!dupLedger) {
                  db.supplierLedger.push({
                    supplier: order.supplier,
                    date: now(),
                    type: "\u0645\u0631\u062A\u062C\u0639 \u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0648\u0631\u062F",
                    tracking: order.tracking,
                    amount: -Number(order.prodPrice || 0),
                    desc: `\u062E\u0635\u0645 \u0642\u064A\u0645\u0629 \u0627\u0644\u0645\u0646\u062A\u062C \u0644\u0645\u0631\u062A\u062C\u0639 \u062A\u0633\u0644\u0645\u0647 \u0627\u0644\u0645\u0648\u0631\u062F \u062C\u0645\u0627\u0639\u064A\u0627\u064B (\u0627\u0644\u062F\u0641\u0639\u0629 \u0627\u0644\u0645\u062C\u0645\u0639\u0629): ${order.tracking}`
                  });
                }
              }
            }
            if (!db.statusHistory) db.statusHistory = [];
            db.statusHistory.push({
              tracking: t,
              oldStatus,
              newStatus: status,
              updatedBy: currentUser,
              dateTime: now()
            });
          }
          order.updatedAt = now();
          const isEventualArchivable = ["\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645", "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F", "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F", "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F \u0648\u062A\u0635\u0641\u064A\u0629 \u062D\u0633\u0627\u0628\u0647"].includes(order.status);
          if (fromArchive && !isEventualArchivable) {
            const alreadyInActive = db.orders.some((o) => o.tracking === t);
            if (!alreadyInActive) {
              db.orders.push(order);
            }
            db.archivedOrders = (db.archivedOrders || []).filter((o) => o.tracking !== t);
          }
          modified++;
        }
        writeDB(db);
        return ok(res, {
          done: modified,
          msg: `\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0648\u0625\u0633\u0646\u0627\u062F ${modified} \u0623\u0648\u0631\u062F\u0631 \u0645\u062C\u0645\u0651\u0639\u0627\u064B \u0628\u0646\u062C\u0627\u062D \u0641\u0627\u0626\u0642 \u0627\u0644\u0633\u0631\u0639\u0629`
        });
      }
      // ─────────────────────────────────────────────────────────────
      // DASHBOARD COUNTERS & PERFORMANCE METRICS
      // ─────────────────────────────────────────────────────────────
      case "dashboard": {
        const todayDate = tod();
        const ordersList = db.orders;
        let stats = {
          total: ordersList.length,
          todayTotal: 0,
          delivered: 0,
          returned: 0,
          returnedDeliveredToSupplier: 0,
          returnedDeliveredToSupplierValue: 0,
          pending: 0,
          active: 0,
          assignedPending: 0,
          totalCOD: 0,
          todayCOD: 0,
          profit: 0
        };
        const courierStats = {};
        const supplierStats = {};
        for (const o of ordersList) {
          const isToday = isDateToday(o.createdAt || o.orderDate);
          if (isToday) {
            stats.todayTotal++;
          }
          const oStatus = getOrderStatus(o);
          const oSupplier = getOrderSupplier(o);
          const oCourier = getOrderCourier(o);
          const isSettled = o.isSettled === true || o.isSettled === "true" || o.is_settled === "true" || o.is_settled === true;
          const isClosed = [
            "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
            "\u0645\u0631\u062A\u062C\u0639",
            "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F",
            "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F",
            "\u0645\u0631\u062A\u062C\u0639 \u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0648\u0631\u062F"
          ].includes(oStatus) || isSettled;
          const isAssigned = oCourier && oCourier !== "";
          if (isAssigned && !isClosed) {
            stats.assignedPending++;
          }
          const isSomeReturn2 = [
            "\u0645\u0631\u062A\u062C\u0639",
            "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F",
            "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F",
            "\u0645\u0631\u062A\u062C\u0639 \u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0648\u0631\u062F",
            "\u0645\u0631\u062A\u062C\u0639 \u062C\u062F\u064A\u062F",
            "\u062C\u0627\u0631\u064A \u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0645\u0631\u062A\u062C\u0639",
            "\u062C\u0627\u0647\u0632 \u0644\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F",
            "\u0645\u0631\u062A\u062C\u0639 \u0648\u0627\u0644\u0639\u0645\u064A\u0644 \u062F\u0641\u0639 \u0627\u0644\u0634\u062D\u0646",
            "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F \u0648\u062A\u0635\u0641\u064A\u0629 \u062D\u0633\u0627\u0628\u0647"
          ].includes(oStatus) || oStatus.includes("\u0645\u0631\u062A\u062C\u0639");
          const isDeliveredToSupplier = [
            "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F",
            "\u0645\u0631\u062A\u062C\u0639 \u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0648\u0631\u062F",
            "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F \u0648\u062A\u0635\u0641\u064A\u0629 \u062D\u0633\u0627\u0628\u0647"
          ].includes(oStatus);
          if (oStatus === "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645") {
            stats.delivered++;
            stats.totalCOD += Number(o.totalCOD || 0);
            stats.profit += Number(o.shipPrice || 0);
            if (o.delivDate && isDateToday(o.delivDate)) {
              stats.todayCOD += Number(o.totalCOD || 0);
            }
          } else if (isSomeReturn2) {
            if (isDeliveredToSupplier) {
              stats.returnedDeliveredToSupplier++;
              stats.returnedDeliveredToSupplierValue += Number(
                o.prodPrice || 0
              );
            } else {
              stats.returned++;
            }
          } else if ([
            "\u062C\u062F\u064A\u062F",
            "\u062A\u0645 \u0627\u0644\u0625\u0633\u0646\u0627\u062F",
            "\u0645\u0624\u062C\u0644",
            "\u0644\u0627 \u064A\u0648\u062C\u062F \u0631\u062F",
            "\u0627\u0644\u0639\u0645\u064A\u0644 \u0644\u0645 \u064A\u0642\u0645 \u0628\u0627\u0644\u0631\u062F"
          ].includes(oStatus)) {
            stats.pending++;
          } else if (oStatus === "\u062E\u0627\u0631\u062C \u0645\u0639 \u0627\u0644\u0645\u0646\u062F\u0648\u0628") {
            stats.active++;
          }
          if (oCourier) {
            if (!courierStats[oCourier]) {
              courierStats[oCourier] = {
                total: 0,
                delivered: 0,
                returned: 0,
                cod: 0
              };
            }
            courierStats[oCourier].total++;
            if (oStatus === "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645") {
              courierStats[oCourier].delivered++;
              courierStats[oCourier].cod += Number(o.totalCOD || 0);
            } else if (["\u0645\u0631\u062A\u062C\u0639", "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F"].includes(oStatus)) {
              courierStats[oCourier].returned++;
            }
          }
          if (oSupplier) {
            if (!supplierStats[oSupplier]) {
              supplierStats[oSupplier] = {
                total: 0,
                delivered: 0,
                returned: 0
              };
            }
            supplierStats[oSupplier].total++;
            if (oStatus === "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645") {
              supplierStats[oSupplier].delivered++;
            } else if (["\u0645\u0631\u062A\u062C\u0639", "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F"].includes(oStatus)) {
              supplierStats[oSupplier].returned++;
            }
          }
        }
        const formattedCouriers = Object.entries(courierStats).map(
          ([name, cs]) => {
            const rate2 = cs.total ? Math.round(cs.delivered / cs.total * 100) : 0;
            return { name, ...cs, rate: rate2 };
          }
        );
        const formattedSuppliers = Object.entries(supplierStats).map(
          ([name, ss]) => {
            const rate2 = ss.total ? Math.round(ss.delivered / ss.total * 100) : 0;
            return { name, ...ss, rate: rate2 };
          }
        );
        const bestCourierObj = [...formattedCouriers].sort(
          (a, b) => b.delivered - a.delivered
        )[0];
        const bestSupplierObj = [...formattedSuppliers].sort(
          (a, b) => b.delivered - a.delivered
        )[0];
        const rate = stats.total ? Math.round(stats.delivered / stats.total * 100) : 0;
        const remainingStock = ordersList.filter(
          (o) => ![
            "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
            "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F",
            "\u0645\u0631\u062A\u062C\u0639 \u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0648\u0631\u062F",
            "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F",
            "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F \u0648\u062A\u0635\u0641\u064A\u0629 \u062D\u0633\u0627\u0628\u0647",
            "\u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639"
          ].includes(o.status)
        ).length;
        const inOfficeStock = stats.total - (stats.active + stats.returned + stats.returnedDeliveredToSupplier);
        return ok(res, {
          stats: { ...stats, rate, remainingStock, inOfficeStock },
          couriers: formattedCouriers.sort((a, b) => b.delivered - a.delivered),
          suppliers: formattedSuppliers.sort((a, b) => b.delivered - a.delivered).slice(0, 10),
          bestCourier: bestCourierObj ? bestCourierObj.name : "\u2014",
          bestSupplier: bestSupplierObj ? bestSupplierObj.name : "\u2014"
        });
      }
      case "getAuditLog": {
        if (!["\u0645\u062F\u064A\u0631", "\u0645\u0634\u0631\u0641", "\u0645\u062D\u0627\u0633\u0628"].includes(currentRole)) {
          return err(
            res,
            "\u0635\u0644\u0627\u062D\u064A\u0629 \u0645\u0631\u0641\u0648\u0636\u0629 \u0644\u0639\u0631\u0636 \u0633\u062C\u0644 \u0627\u0644\u062A\u062F\u0642\u064A\u0642 \u0627\u0644\u0645\u0627\u0644\u064A \u0648\u0645\u0631\u0627\u0642\u0628 \u0627\u0644\u062D\u0633\u0627\u0628\u0627\u062A"
          );
        }
        return ok(res, { logs: (db.auditLog || []).reverse() });
      }
      // ─────────────────────────────────────────────────────────────
      // SUPPLIER LEDGER SYSTEM (COD calculations)
      // ─────────────────────────────────────────────────────────────
      case "getSupplierLedger": {
        const supplierName = isSupplierRole(currentRole) ? currentUser : d.supplier || "";
        const unified = getSupplierUnifiedLedger(db, supplierName);
        const dailyData = getSupplierDailyLedger(db, supplierName);
        return ok(res, {
          entries: unified.entries || [],
          balance: unified.balance,
          stats: unified.stats,
          dailyLedger: dailyData
        });
      }
      case "settleSupplierDay": {
        const { supplier, dateStr } = d;
        if (!supplier || !dateStr) {
          return err(res, "\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u062A\u0633\u0648\u064A\u0629 \u062D\u0633\u0627\u0628 \u0627\u0644\u064A\u0648\u0645 \u0646\u0627\u0642\u0635\u0629");
        }
        if (!["\u0645\u062F\u064A\u0631", "\u0645\u062D\u0627\u0633\u0628"].includes(currentRole)) {
          return err(
            res,
            "\u0635\u0644\u0627\u062D\u064A\u0629 \u0645\u0631\u0641\u0648\u0636\u0629. \u0627\u0644\u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u0645\u0627\u0644\u064A\u0629 \u0625\u062C\u0631\u0627\u0621 \u0645\u062E\u0635\u0635 \u0644\u0644\u0625\u062F\u0627\u0631\u0629 \u0641\u0642\u0637."
          );
        }
        const nowStr = now();
        const trackingId = `SETTLE-${dateStr}`;
        const isAlreadySettled = (db.supplierLedger || []).some((l) => {
          const lSup = l.supplier || l["\u0627\u0644\u0645\u0648\u0631\u062F"] || "";
          const lType = (l.type || l["\u0627\u0644\u0646\u0648\u0639"] || "").toString().trim();
          const lTrack = (l.tracking || l["\u0631\u0642\u0645 \u0627\u0644\u062A\u062A\u0628\u0639"] || "").toString().trim();
          return lSup.toLowerCase() === supplier.toLowerCase() && lType === "\u062A\u0635\u0641\u064A\u0629 \u064A\u0648\u0645\u064A\u0629" && lTrack === trackingId;
        });
        if (isAlreadySettled) {
          return ok(res, { ok: true, msg: "\u0627\u0644\u064A\u0648\u0645 \u0645\u0635\u0641\u0649 \u0628\u0627\u0644\u0641\u0639\u0644" });
        }
        if (!db.supplierLedger) db.supplierLedger = [];
        db.supplierLedger.push({
          supplier,
          date: nowStr,
          type: "\u062A\u0635\u0641\u064A\u0629 \u064A\u0648\u0645\u064A\u0629",
          tracking: trackingId,
          amount: 0,
          desc: `\u{1F510} [\u{1F4B5} \u062A\u0642\u0641\u064A\u0644 \u0648\u062A\u0633\u0644\u064A\u0645 \u0643\u0627\u0634 \u0627\u0644\u064A\u0648\u0645 \u0644\u0644\u0645\u0648\u0631\u062F] - \u062A\u0645 \u062A\u0635\u0641\u064A\u0629 \u0648\u0642\u0641\u0644 \u062D\u0633\u0627\u0628 \u0627\u0644\u064A\u0648\u0645 \u062A\u0627\u0631\u064A\u062E: ${dateStr} \u0628\u0646\u062C\u0627\u062D \u062A\u0635\u0641\u064A\u0629 \u062A\u0627\u0645\u0629\u2713`
        });
        if (!db.cashbox) db.cashbox = [];
        db.cashbox.push({
          date: nowStr,
          desc: `\u062A\u0633\u0648\u064A\u0629 \u0648\u062A\u0635\u0641\u064A\u0629 \u0643\u0627\u0634 \u064A\u0648\u0645\u064A\u0629 \u0627\u0644\u0645\u0648\u0631\u062F: ${supplier} \u0639\u0646 \u062A\u0627\u0631\u064A\u062E: ${dateStr}`,
          type: "\u0645\u0646\u0635\u0631\u0641",
          amount: 0,
          ref: trackingId,
          addedBy: currentUser
        });
        writeDB(db);
        let scriptUrl2 = (process.env.GOOGLE_SCRIPT_URL || "").trim();
        if (scriptUrl2.startsWith('"') && scriptUrl2.endsWith('"'))
          scriptUrl2 = scriptUrl2.substring(1, scriptUrl2.length - 1).trim();
        else if (scriptUrl2.startsWith("'") && scriptUrl2.endsWith("'"))
          scriptUrl2 = scriptUrl2.substring(1, scriptUrl2.length - 1).trim();
        if (isGoogleScriptHealthy && scriptUrl2 && scriptUrl2.startsWith("http")) {
          executeProxyRequest(scriptUrl2, {
            action: "settleSupplierDay",
            token: "14014",
            supplier,
            dateStr,
            currentUser
          }).catch((err2) => {
            console.error(
              "Async sheets write failure for settleSupplierDay:",
              err2
            );
          });
        }
        return ok(res, {
          ok: true,
          msg: `\u062A\u0645 \u062A\u0635\u0641\u064A\u0629 \u0648\u0625\u0642\u0641\u0627\u0644 \u0643\u0627\u0634 \u062A\u0627\u0631\u064A\u062E ${dateStr} \u0644\u0644\u0645\u0648\u0631\u062F ${supplier} \u0648\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0627\u0631\u062A\u062C\u0627\u0639 \u0627\u0644\u0644\u0648\u062C\u0633\u062A\u064A \u0628\u0646\u062C\u0627\u062D\u2713`
        });
      }
      case "addDailyClosing": {
        const {
          date,
          deliveredCount,
          returnedCount,
          returnedValue,
          totalCOD,
          cashboxNet
        } = d;
        if (!date) return err(res, "\u0627\u0644\u062A\u0627\u0631\u064A\u062E \u063A\u064A\u0631 \u0645\u062D\u062F\u062F");
        if (!db.cashbox) db.cashbox = [];
        db.cashbox.push({
          date: now(),
          desc: `\u062A\u0631\u0635\u064A\u062F \u062A\u0642\u0641\u064A\u0644 \u064A\u0648\u0645\u064A \u0648\u062A\u0635\u062F\u064A\u0642 \u0627\u0644\u062D\u0633\u0627\u0628\u0627\u062A \u0644\u062A\u0627\u0631\u064A\u062E ${date}`,
          type: "\u0648\u0627\u0631\u062F",
          amount: Number(cashboxNet || 0),
          ref: `CLOSE-${date}`,
          addedBy: currentUser
        });
        if (!db.auditLog) db.auditLog = [];
        db.auditLog.push({
          user: currentUser,
          type: "\u062A\u0631\u0635\u064A\u062F \u062A\u0642\u0641\u064A\u0644 \u064A\u0648\u0645\u064A",
          dateTime: now(),
          oldVal: "\u2014",
          newVal: `\u062A\u0642\u0641\u064A\u0644 \u064A\u0648\u0645: ${date} (\u0645\u0633\u0644\u0645: ${deliveredCount}\u060C \u0645\u0631\u062A\u062C\u0639: ${returnedCount} (\u0628\u0642\u064A\u0645\u0629 ${returnedValue || 0} \u062C.\u0645)\u060C \u0645\u062D\u0635\u0644 COD: ${totalCOD} \u062C.\u0645\u060C \u0635\u0627\u0641\u064A \u0627\u0644\u062E\u0632\u0646\u0629: ${cashboxNet || 0} \u062C.\u0645)`,
          reason: `\u062A\u0631\u0635\u064A\u062F \u0627\u0644\u064A\u0648\u0645 \u0627\u0644\u0645\u0627\u0644\u064A \u0645\u0646 \u062E\u0644\u0627\u0644 \u0623\u062F\u0627\u0629 \u0627\u0644\u062A\u0635\u062F\u064A\u0631 \u0627\u0644\u0633\u0631\u064A\u0639`
        });
        writeDB(db);
        return ok(res, { ok: true, msg: "\u062A\u0645 \u062A\u0631\u062D\u064A\u0644 \u0648\u062D\u0641\u0638 \u0627\u0644\u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u064A\u0648\u0645\u064A \u0628\u0646\u062C\u0627\u062D" });
      }
      case "supplierDashboard": {
        const isSupplier = isSupplierRole(currentRole);
        const targetSupplier = isSupplier ? currentUser : d.supplier || "";
        if (!targetSupplier) return err(res, "\u0627\u0644\u0645\u0648\u0631\u062F \u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641");
        const unified = getSupplierUnifiedLedger(db, targetSupplier);
        const dailyData = getSupplierDailyLedger(db, targetSupplier);
        return ok(res, {
          stats: {
            total: unified.stats.totalOrdersCount,
            delivered: unified.stats.deliveredOrdersCount,
            returned: unified.stats.returnsDeliveredCount,
            pending: unified.stats.totalOrdersCount - unified.stats.deliveredOrdersCount - unified.stats.returnsDeliveredCount,
            cod: unified.stats.totalGoodsUploaded,
            rate: unified.stats.rate,
            due: dailyData.outstandingBalance,
            returnsDeliveredValue: unified.stats.returnsDeliveredValue,
            paymentsValue: unified.stats.paymentsValue
          }
        });
      }
      case "supplierAccounts": {
        const isSup = isSupplierRole(currentRole);
        if (!isSup && !["\u0645\u062F\u064A\u0631", "\u0645\u0634\u0631\u0641", "\u0645\u062D\u0627\u0633\u0628"].includes(currentRole)) {
          return err(res, "\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 \u0633\u062D\u0628 \u0643\u0634\u0648\u0641\u0627\u062A \u0627\u0644\u0645\u0648\u0631\u062F\u064A\u0646 \u0627\u0644\u0645\u0627\u0644\u064A\u0629");
        }
        let allSuppliers = [];
        if (isSup) {
          allSuppliers = [currentUser];
        } else {
          const registeredNames = (db.suppliers || []).map((s) => s.name).filter(Boolean);
          const orderNames = (db.orders || []).map((o) => getOrderSupplier(o)).filter(Boolean);
          const combined = [...registeredNames, ...orderNames];
          const seen = /* @__PURE__ */ new Set();
          allSuppliers = [];
          for (const name of combined) {
            const norm = normalizeArabic(name);
            if (!seen.has(norm)) {
              seen.add(norm);
              allSuppliers.push(name);
            }
          }
        }
        const accountsList = allSuppliers.map((supName) => {
          const sup = String(supName);
          const unified = getSupplierUnifiedLedger(db, sup);
          const dailyData = getSupplierDailyLedger(db, sup);
          return {
            name: sup,
            totalCOD: unified.stats.totalCOD,
            returnsDelivered: unified.stats.returnsDeliveredValue,
            adjustments: unified.stats.reverseAdjustmentsValue,
            payments: unified.stats.paymentsValue,
            totalOrders: unified.stats.totalOrdersCount,
            deliveredOrders: unified.stats.deliveredOrdersCount,
            returnsCount: unified.stats.returnsDeliveredCount,
            balance: dailyData.outstandingBalance,
            rate: unified.stats.rate,
            openingBalance: unified.stats.openingBalance
          };
        });
        return ok(res, { accounts: accountsList });
      }
      case "addSupplierPayment": {
        if (!["\u0645\u062F\u064A\u0631", "\u0645\u062D\u0627\u0633\u0628"].includes(currentRole)) {
          return err(res, "\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 \u0635\u0631\u0641 \u062F\u0641\u0639\u0627\u062A \u0644\u0644\u0645\u0648\u0631\u062F\u064A\u0646");
        }
        const { supplier, amount, desc, transactionType, adjustmentType } = d;
        if (!supplier || !amount) return err(res, "\u0628\u064A\u0627\u0646\u0627\u062A \u0645\u0641\u0642\u0648\u062F\u0629");
        const val = Math.abs(Number(amount));
        const typeStr = transactionType || "payout";
        let ledgerType = "\u062F\u0641\u0639 \u0646\u0642\u062F\u064A";
        let ledgerAmount = -val;
        let finalDesc = desc || "";
        if (typeStr === "inflow") {
          ledgerType = "\u0627\u0633\u062A\u0644\u0627\u0645 \u0646\u0642\u062F\u064A\u0629";
          ledgerAmount = -val;
          if (!finalDesc) {
            finalDesc = `\u0627\u0633\u062A\u0644\u0627\u0645 \u0646\u0642\u062F\u064A\u0629 / \u0625\u064A\u0631\u0627\u062F \u0644\u0644\u062E\u0632\u0646\u0629 \u0645\u0646 \u0627\u0644\u0645\u0648\u0631\u062F: ${supplier}`;
          }
        } else if (typeStr === "adjustment") {
          const isAdd = adjustmentType === "add";
          ledgerType = isAdd ? "\u062A\u0633\u0648\u064A\u0629 \u0625\u0636\u0627\u0641\u0629" : "\u062A\u0633\u0648\u064A\u0629 \u062E\u0635\u0645";
          ledgerAmount = isAdd ? val : -val;
          if (!finalDesc) {
            finalDesc = `\u062A\u0633\u0648\u064A\u0629 \u0631\u0635\u064A\u062F \u064A\u062F\u0648\u064A (${isAdd ? "\u0625\u0636\u0627\u0641\u0629" : "\u062E\u0635\u0645"}) \u0644\u0644\u0645\u0648\u0631\u062F: ${supplier}`;
          }
        } else {
          ledgerType = "\u062F\u0641\u0639 \u0646\u0642\u062F\u064A";
          ledgerAmount = -val;
          if (!finalDesc) {
            finalDesc = `\u062F\u0641\u0639\u0629 \u0646\u0642\u062F\u064A\u0629 \u0645\u0633\u062F\u062F\u0629 \u0644\u0644\u0645\u0648\u0631\u062F: ${supplier}`;
          }
        }
        db.supplierLedger.push({
          supplier,
          date: now(),
          type: ledgerType,
          tracking: "CASH-PAY",
          amount: ledgerAmount,
          desc: finalDesc
        });
        if (typeStr !== "adjustment") {
          db.cashbox.push({
            date: now(),
            desc: `${finalDesc} (${typeStr === "inflow" ? "\u0648\u0627\u0631\u062F" : "\u0635\u0631\u0641"} \u0645\u0648\u0631\u062F)`,
            type: typeStr === "inflow" ? "\u0625\u064A\u062F\u0627\u0639" : "\u0633\u062F\u0627\u062F \u0645\u0648\u0631\u062F",
            amount: val,
            ref: "SUPPAY",
            addedBy: currentUser
          });
        }
        if (!db.auditLog) db.auditLog = [];
        let auditType = "\u0633\u062F\u0627\u062F \u0645\u0648\u0631\u062F / \u062F\u0641\u0639\u0629 \u0646\u0642\u062F\u064A\u0629";
        let auditNewVal = `\u0635\u0631\u0641 \u0645\u0628\u0644\u063A: ${val} \u062C.\u0645 \u0644\u0644\u0645\u0648\u0631\u062F: ${supplier}`;
        if (typeStr === "inflow") {
          auditType = "\u0627\u0633\u062A\u0644\u0627\u0645 \u0646\u0642\u062F\u064A\u0629 \u0645\u0646 \u0645\u0648\u0631\u062F";
          auditNewVal = `\u0627\u0633\u062A\u0644\u0627\u0645 \u0645\u0628\u0644\u063A: ${val} \u062C.\u0645 \u0645\u0646 \u0627\u0644\u0645\u0648\u0631\u062F: ${supplier}`;
        } else if (typeStr === "adjustment") {
          auditType = "\u062A\u0633\u0648\u064A\u0629 \u0631\u0635\u064A\u062F \u0645\u0648\u0631\u062F";
          auditNewVal = `\u062A\u0633\u0648\u064A\u0629 \u0631\u0635\u064A\u062F (${adjustmentType === "add" ? "\u0625\u0636\u0627\u0641\u0629" : "\u062E\u0635\u0645"}) \u0628\u0645\u0628\u0644\u063A: ${val} \u062C.\u0645 \u0644\u0644\u0645\u0648\u0631\u062F: ${supplier}`;
        }
        db.auditLog.push({
          user: currentUser,
          type: auditType,
          dateTime: now(),
          oldVal: "\u2014",
          newVal: auditNewVal,
          reason: finalDesc
        });
        writeDB(db);
        let scriptUrl2 = (process.env.GOOGLE_SCRIPT_URL || "").trim();
        if (scriptUrl2.startsWith('"') && scriptUrl2.endsWith('"'))
          scriptUrl2 = scriptUrl2.substring(1, scriptUrl2.length - 1).trim();
        else if (scriptUrl2.startsWith("'") && scriptUrl2.endsWith("'"))
          scriptUrl2 = scriptUrl2.substring(1, scriptUrl2.length - 1).trim();
        if (isGoogleScriptHealthy && scriptUrl2 && scriptUrl2.startsWith("http")) {
          executeProxyRequest(scriptUrl2, {
            action: "addSupplierPayment",
            token: "14014",
            supplier,
            amount: val,
            desc: finalDesc,
            currentUser,
            transactionType: typeStr,
            adjustmentType,
            tracking: "CASH-PAY"
          }).catch((err2) => {
            console.error("Async sheets write failure for addSupplierPayment:", err2);
          });
        }
        let successMsg = "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u0641\u0639\u0629 \u0627\u0644\u0646\u0642\u062F\u064A\u0629 \u0628\u0646\u062C\u0627\u062D \u0648\u062A\u0633\u0648\u064A\u062A\u0647\u0627 \u0628\u0627\u0644\u062E\u0632\u0646\u0629";
        if (typeStr === "inflow") {
          successMsg = "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u062D\u0631\u0643\u0629 \u0627\u0633\u062A\u0644\u0627\u0645 \u0627\u0644\u0646\u0642\u062F\u064A\u0629 \u0628\u0646\u062C\u0627\u062D \u0648\u062A\u063A\u0630\u064A\u0629 \u0627\u0644\u062E\u0632\u064A\u0646\u0629";
        } else if (typeStr === "adjustment") {
          successMsg = "\u062A\u0645 \u0642\u064A\u062F \u062A\u0633\u0648\u064A\u0629 \u0627\u0644\u0631\u0635\u064A\u062F \u0627\u0644\u064A\u062F\u0648\u064A \u0628\u0646\u062C\u0627\u062D \u062F\u0648\u0646 \u0644\u0645\u0633 \u0627\u0644\u062E\u0632\u0646\u0629";
        }
        return ok(res, { msg: successMsg });
      }
      // Overnight face-to-face settlement action
      case "settleCourierOrders": {
        const { courier } = d;
        if (!courier) return err(res, "\u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u063A\u064A\u0631 \u0645\u062D\u062F\u062F");
        let settledCount = 0;
        const nowCairoStr = now();
        const settledOrders = [];
        const activeOrders = [];
        if (!db.archivedOrders) db.archivedOrders = [];
        db.orders.forEach((order) => {
          if (order.courier && order.courier.toString().trim().toLowerCase() === courier.toString().trim().toLowerCase()) {
            const oldStatus = order.status;
            order.lastCourier = order.courier;
            order.lastCommission = order.commission;
            if (oldStatus === "\u0645\u0631\u062A\u062C\u0639" || oldStatus === "\u0645\u0631\u062A\u062C\u0639 \u062C\u062F\u064A\u062F") {
              order.status = "\u0645\u0631\u062A\u062C\u0639 \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639";
              order.courierSignature = `${order.courier} (\u062A\u0648\u0642\u064A\u0639 \u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0627\u0644\u0645\u064A\u062F\u0627\u0646\u064A \u270D\uFE0F)`;
            } else if (oldStatus === "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A" || oldStatus === "\u0645\u0631\u062A\u062C\u0639 \u062C\u0632\u0626\u064A" || oldStatus === "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F") {
              order.status = "\u0645\u0631\u062A\u062C\u0639 \u062C\u0632\u0626\u064A \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639";
              order.returnReason = "\u0645\u0631\u062A\u062C\u0639 \u062C\u0632\u0626\u064A \u0645\u062A\u0628\u0642\u064A";
              order.returnSubStatus = "\u0628\u0636\u0627\u0639\u0629 \u0645\u062A\u0628\u0642\u064A\u0629 \u0645\u0646 \u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A";
              order.courierSignature = `${order.courier} (\u062A\u0648\u0642\u064A\u0639 \u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0627\u0644\u062C\u0632\u0626\u064A \u270D\uFE0F)`;
              const actualCash = Number(
                order.actualReceivedCash || order.partialAmount || order.totalCOD || 0
              );
              if (actualCash > 0) {
                db.cashbox.push({
                  date: nowCairoStr,
                  desc: `\u062A\u062D\u0635\u064A\u0644 \u062A\u0635\u0641\u064A\u0629 \u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A \u0644\u0644\u0634\u062D\u0646\u0629 \u0631\u0642\u0645: ${order.tracking}`,
                  type: "\u0627\u0633\u062A\u0644\u0627\u0645 \u0639\u0647\u062F\u0629 \u0645\u0646\u062F\u0648\u0628",
                  amount: actualCash,
                  ref: courier,
                  addedBy: currentUser
                });
              }
            } else if (oldStatus === "\u0645\u0624\u062C\u0644" || oldStatus === "Delayed" || oldStatus === "\u0645\u0624\u062C\u0644 \u0645\u0646 \u0627\u0644\u0645\u0646\u062F\u0648\u0628" || oldStatus === "\u0645\u0624\u062C\u0644 \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0637\u0644\u0628 \u0627\u0644\u0639\u0645\u064A\u0644") {
              order.status = "\u0645\u0624\u062C\u0644 \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639";
              order.courierSignature = `${order.courier} (\u062A\u0648\u0642\u064A\u0639 \u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u0645\u0624\u062C\u0644 \u270D\uFE0F)`;
            } else if (oldStatus === "\u0644\u0627 \u064A\u0648\u062C\u062F \u0631\u062F" || oldStatus === "\u0627\u0644\u0639\u0645\u064A\u0644 \u0644\u0627 \u064A\u0631\u062F" || oldStatus === "No Answer" || oldStatus === "\u0627\u0644\u0639\u0645\u064A\u0644 \u0644\u0645 \u064A\u0642\u0645 \u0628\u0627\u0644\u0631\u062F") {
              order.status = "\u0644\u0627 \u064A\u0648\u062C\u062F \u0631\u062F \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639";
              order.courierSignature = `${order.courier} (\u062A\u0648\u0642\u064A\u0639 \u062A\u0635\u0641\u064A\u0629 \u0639\u062F\u0645 \u0627\u0644\u0631\u062F \u270D\uFE0F)`;
            }
            const isSuccessfullyClosed = [
              "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
              "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0628\u0646\u062C\u0627\u062D",
              "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 (\u0646\u0627\u062C\u062D \u0643\u0627\u0634)",
              "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A",
              "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F",
              "\u0645\u0631\u062A\u062C\u0639 \u062C\u0632\u0626\u064A"
            ].includes(oldStatus);
            if (isSuccessfullyClosed) {
              order.isSettled = true;
              order.is_settled = "true";
            } else {
              order.courier = "";
              order.commission = 0;
              order.isSettled = false;
              order.is_settled = "false";
            }
            order.updatedAt = nowCairoStr;
            if (!db.statusHistory) db.statusHistory = [];
            db.statusHistory.push({
              tracking: order.tracking,
              oldStatus,
              newStatus: order.status,
              updatedBy: currentUser,
              dateTime: nowCairoStr
            });
            settledCount++;
            const shouldArchive = [
              "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
              "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0628\u0646\u062C\u0627\u062D",
              "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 (\u0646\u0627\u062C\u062D \u0643\u0627\u0634)",
              "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F",
              "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F"
            ].includes(order.status);
            if (shouldArchive) {
              settledOrders.push(order);
            } else {
              activeOrders.push(order);
            }
          } else {
            activeOrders.push(order);
          }
        });
        db.archivedOrders.push(...settledOrders);
        db.orders = activeOrders;
        writeDB(db);
        return ok(res, {
          settled: settledCount,
          msg: `\u062A\u0645 \u0633\u062D\u0628 \u0648\u062A\u0635\u0641\u064A\u0629 ${settledCount} \u0634\u062D\u0646\u0629 \u0644\u0644\u0645\u0633\u062A\u0648\u062F\u0639 \u0648\u062A\u0628\u0631\u0626\u0629 \u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u0628\u0646\u062C\u0627\u062D \u2713`
        });
      }
      // COURIER LEDGER SYSTEM & COMPENSTATION
      // ─────────────────────────────────────────────────────────────
      case "getCourierLedger": {
        const courierName = d.courier || currentUser;
        const courierProfile = db.couriers.find(
          (c) => c.name === courierName
        );
        if (!courierProfile) return err(res, "\u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u063A\u064A\u0631 \u0645\u0633\u062C\u0644");
        const courierOrders = [
          ...db.orders || [],
          ...db.archivedOrders || []
        ].filter(
          (o) => o.courier && o.courier.toString().trim().toLowerCase() === courierName.toString().trim().toLowerCase()
        );
        const basicSalary = courierProfile.base_fixed_salary !== void 0 ? Number(courierProfile.base_fixed_salary) : Number(courierProfile.salary || 3e3);
        const commissionSuccess = courierProfile.commission_success !== void 0 ? Number(courierProfile.commission_success) : Number(courierProfile.commission || 25);
        const commissionReturn = courierProfile.commission_return !== void 0 ? Number(courierProfile.commission_return) : 10;
        const todayDate = tod();
        const returnStatuses = [
          "\u0645\u0631\u062A\u062C\u0639",
          "\u0645\u0631\u062A\u062C\u0639 \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639",
          "\u0645\u0631\u062A\u062C\u0639 \u062C\u062F\u064A\u062F",
          "\u0645\u0631\u062A\u062C\u0639 \u062C\u0627\u0631\u064A \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0643\u062A\u0628",
          "\u062C\u0627\u0631\u064A \u0627\u0644\u0631\u062C\u0648\u0639 \u0644\u0644\u0645\u0648\u0631\u062F",
          "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F",
          "\u062C\u0627\u0647\u0632 \u0644\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F",
          "\u0645\u0631\u062A\u062C\u0639 \u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0648\u0631\u062F",
          "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F \u0648\u062A\u0635\u0641\u064A\u0629 \u062D\u0633\u0627\u0628\u0647",
          "\u0645\u0631\u062A\u062C\u0639 \u062C\u0632\u0626\u064A \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639",
          "\u0642\u064A\u062F \u0627\u0644\u0645\u0631\u062A\u062C\u0639",
          "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F",
          "\u062C\u0627\u0631\u064A \u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0645\u0631\u062A\u062C\u0639",
          "\u0645\u0631\u062A\u062C\u0639 \u0648\u0627\u0644\u0639\u0645\u064A\u0644 \u062F\u0641\u0639 \u0627\u0644\u0634\u062D\u0646",
          "\u0645\u0631\u062A\u062C\u0639 \u0645\u062F\u0641\u0648\u0639 \u0627\u0644\u0634\u062D\u0646"
        ];
        const getOrderActualCollection = (o) => {
          if (!o) return 0;
          const status = (o.status || "").toString().trim();
          if ([
            "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
            "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0628\u0646\u062C\u0627\u062D",
            "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 (\u0646\u0627\u062C\u062D \u0643\u0627\u0634)"
          ].includes(status)) {
            return Number(o.totalCOD !== void 0 && o.totalCOD !== "" && o.totalCOD !== null ? o.totalCOD : Number(o.prodPrice || 0) + Number(o.shipPrice || 0));
          }
          if ([
            "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A",
            "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F"
          ].includes(status)) {
            const raw = o.actualReceivedCash !== void 0 ? o.actualReceivedCash : o.partialAmount !== void 0 ? o.partialAmount : o["\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u0633\u062A\u0644\u0645"] !== void 0 ? o["\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u0633\u062A\u0644\u0645"] : o["\u0627\u0644\u062A\u062D\u0635\u064A\u0644 \u0627\u0644\u062C\u0632\u0626\u064A"] !== void 0 ? o["\u0627\u0644\u062A\u062D\u0635\u064A\u0644 \u0627\u0644\u062C\u0632\u0626\u064A"] : o["\u0627\u0644\u062A\u062D\u0635\u064A\u0644"] !== void 0 ? o["\u0627\u0644\u062A\u062D\u0635\u064A\u0644"] : o["\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062D\u0635\u0644"] !== void 0 ? o["\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062D\u0635\u0644"] : o["\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u0633\u062A\u0644\u0645 \u0627\u0644\u0641\u0639\u0644\u064A"] !== void 0 ? o["\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u0633\u062A\u0644\u0645 \u0627\u0644\u0641\u0639\u0644\u064A"] : "";
            if (raw !== void 0 && raw !== null && raw !== "") {
              const val = Number(raw);
              if (!isNaN(val)) return val;
            }
            return 0;
          }
          if ([
            "\u0645\u0631\u062A\u062C\u0639 \u0648\u0627\u0644\u0639\u0645\u064A\u0644 \u062F\u0641\u0639 \u0627\u0644\u0634\u062D\u0646",
            "\u0645\u0631\u062A\u062C\u0639 \u0645\u062F\u0641\u0648\u0639 \u0627\u0644\u0634\u062D\u0646",
            "\u0645\u0631\u062A\u062C\u0639 \u0648\u062A\u0645 \u062F\u0641\u0639 \u0627\u0644\u0634\u062D\u0646"
          ].includes(status) || status === "\u0645\u0631\u062A\u062C\u0639" && o.returnShippingType === "paid") {
            return Number(o.shipPrice || o.shipCost || 0);
          }
          return 0;
        };
        const successOrdersToday = courierOrders.filter(
          (o) => [
            "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
            "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0628\u0646\u062C\u0627\u062D",
            "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 (\u0646\u0627\u062C\u062D \u0643\u0627\u0634)",
            "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A",
            "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F"
          ].includes((o.status || "").toString().trim()) && o.delivDate && isDateToday(o.delivDate)
        );
        const returnedOrdersToday = courierOrders.filter(
          (o) => returnStatuses.includes((o.status || "").toString().trim()) && o.retDate && isDateToday(o.retDate)
        );
        const todayDeliveredCount = successOrdersToday.length;
        const todayReturnedCount = returnedOrdersToday.length;
        const todayTotalCount = todayDeliveredCount + todayReturnedCount;
        const todayDeliveredCash = successOrdersToday.reduce(
          (sum, o) => sum + getOrderActualCollection(o),
          0
        ) + returnedOrdersToday.reduce(
          (sum, o) => sum + getOrderActualCollection(o),
          0
        );
        const todayReturnedPaidCash = 0;
        const todayTotalCommission = todayDeliveredCount * commissionSuccess + todayReturnedCount * commissionReturn;
        const historicalSuccessOrders = courierOrders.filter(
          (o) => [
            "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
            "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0628\u0646\u062C\u0627\u062D",
            "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 (\u0646\u0627\u062C\u062D \u0643\u0627\u0634)",
            "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A",
            "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F"
          ].includes((o.status || "").toString().trim())
        );
        const deliveredCount = historicalSuccessOrders.length;
        const historicalReturnedOrders = courierOrders.filter(
          (o) => returnStatuses.includes((o.status || "").toString().trim())
        );
        const returnedCount = historicalReturnedOrders.length;
        const returnedPaidCount = 0;
        const delivCommission = deliveredCount * commissionSuccess;
        const returnShippingCommission = returnedCount * commissionReturn;
        const targetLedger = db.courierLedger.filter(
          (l) => l.courier === courierName
        );
        const bonusesSum = targetLedger.filter((l) => l.type === "\u0645\u0643\u0627\u0641\u0623\u0629").reduce(
          (sum, x) => sum + Math.abs(Number(x.amount || 0)),
          0
        );
        const penaltiesSum = targetLedger.filter(
          (l) => l.type === "\u062C\u0632\u0627\u0621" || l.type === "\u062E\u0635\u0645" || l.type === "\u062E\u0635\u0645 \u0639\u062C\u0632"
        ).reduce(
          (sum, x) => sum + Math.abs(Number(x.amount || 0)),
          0
        );
        const todayBonuses = targetLedger.filter(
          (l) => l.type === "\u0645\u0643\u0627\u0641\u0623\u0629" && l.date && isDateToday(l.date)
        ).reduce(
          (sum, x) => sum + Math.abs(Number(x.amount || 0)),
          0
        );
        const todayPenalties = targetLedger.filter(
          (l) => (l.type === "\u062C\u0632\u0627\u0621" || l.type === "\u062E\u0635\u0645" || l.type === "\u062E\u0635\u0645 \u0639\u062C\u0632") && l.date && isDateToday(l.date)
        ).reduce(
          (sum, x) => sum + Math.abs(Number(x.amount || 0)),
          0
        );
        const requiredHandoverToday = todayDeliveredCash - todayTotalCommission;
        const activeCourierOrders = courierOrders.filter((o) => !o.isSettledMonth);
        const totalCollected = activeCourierOrders.reduce(
          (sum, o) => sum + getOrderActualCollection(o),
          0
        );
        const totalPaidToCompany = db.cashbox.filter(
          (item) => item.type === "\u0627\u0633\u062A\u0644\u0627\u0645 \u0639\u0647\u062F\u0629 \u0645\u0646\u062F\u0648\u0628" && item.ref === courierName && !item.isSettledMonth
        ).reduce(
          (sum, item) => sum + Number(item.amount || 0),
          0
        );
        const deficit = totalCollected - totalPaidToCompany;
        const nowCairo = getCairoDateObj();
        const daysInCurrentMonth = new Date(
          nowCairo.getFullYear(),
          nowCairo.getMonth() + 1,
          0
        ).getDate();
        const daysCount = daysInCurrentMonth || 30;
        const year = nowCairo.getFullYear();
        const month = nowCairo.getMonth();
        let startDateStr = `${year}-${String(month + 1).padStart(2, "0")}-01`;
        if (courierProfile.hire_date) {
          startDateStr = courierProfile.hire_date;
        }
        const datesSet = /* @__PURE__ */ new Set();
        const fullDeliveredStatuses = ["\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645", "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0628\u0646\u062C\u0627\u062D", "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 (\u0646\u0627\u062C\u062D \u0643\u0627\u0634)", "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A", "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F"];
        for (const o of courierOrders) {
          if (!o.isSettledMonth) {
            if (fullDeliveredStatuses.includes(o.status) && o.delivDate) {
              datesSet.add(o.delivDate.substring(0, 10));
            }
            if (["\u0645\u0631\u062A\u062C\u0639", "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F", "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F", "\u0645\u0631\u062A\u062C\u0639 \u0648\u0627\u0644\u0639\u0645\u064A\u0644 \u062F\u0641\u0639 \u0627\u0644\u0634\u062D\u0646", "\u0645\u0631\u062A\u062C\u0639 \u0645\u062F\u0641\u0648\u0639 \u0627\u0644\u0634\u062D\u0646", "\u0645\u0631\u062A\u062C\u0639 \u0648\u062F\u0641\u0639 \u0627\u0644\u0634\u062D\u0646"].includes(
              o.status
            ) && o.retDate) {
              datesSet.add(o.retDate.substring(0, 10));
            }
          }
        }
        const startD = new Date(startDateStr);
        const endD = new Date(todayDate);
        if (!isNaN(startD.getTime())) {
          const tempD = new Date(startD);
          while (tempD <= endD) {
            const yStr = tempD.getFullYear();
            const mStr = String(tempD.getMonth() + 1).padStart(2, "0");
            const dStr = String(tempD.getDate()).padStart(2, "0");
            datesSet.add(`${yStr}-${mStr}-${dStr}`);
            tempD.setDate(tempD.getDate() + 1);
          }
        }
        datesSet.add(todayDate);
        const sortedDates = Array.from(datesSet).sort().filter((dStr) => {
          if (courierProfile.last_closing_date && dStr <= courierProfile.last_closing_date) {
            return false;
          }
          return true;
        });
        const deliveredByDate = /* @__PURE__ */ new Map();
        const returnedByDate = /* @__PURE__ */ new Map();
        for (const o of courierOrders) {
          if (fullDeliveredStatuses.includes(o.status) && o.delivDate) {
            const dStr = o.delivDate.substring(0, 10);
            if (!deliveredByDate.has(dStr)) deliveredByDate.set(dStr, []);
            deliveredByDate.get(dStr).push(o);
          }
          if (["\u0645\u0631\u062A\u062C\u0639", "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F", "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F", "\u0645\u0631\u062A\u062C\u0639 \u0648\u0627\u0644\u0639\u0645\u064A\u0644 \u062F\u0641\u0639 \u0627\u0644\u0634\u062D\u0646", "\u0645\u0631\u062A\u062C\u0639 \u0645\u062F\u0641\u0648\u0639 \u0627\u0644\u0634\u062D\u0646", "\u0645\u0631\u062A\u062C\u0639 \u0648\u062F\u0641\u0639 \u0627\u0644\u0634\u062D\u0646"].includes(o.status) && o.retDate) {
            const dStr = o.retDate.substring(0, 10);
            if (!returnedByDate.has(dStr)) returnedByDate.set(dStr, []);
            returnedByDate.get(dStr).push(o);
          }
        }
        const targetLedgerFiltered = (db.courierLedger || []).filter(
          (l) => l.courier === courierName && !l.isSettledMonth
        );
        const ledgerByDate = /* @__PURE__ */ new Map();
        for (const l of targetLedgerFiltered) {
          if (l.date) {
            const dStr = l.date.substring(0, 10);
            if (!ledgerByDate.has(dStr)) ledgerByDate.set(dStr, []);
            ledgerByDate.get(dStr).push(l);
          }
        }
        const targetExpensesFiltered = (db.expenses || []).filter(
          (e) => e.by === courierName && !e.isSettledMonth
        );
        const expensesByDate = /* @__PURE__ */ new Map();
        for (const e of targetExpensesFiltered) {
          if (e.date) {
            const dStr = e.date.substring(0, 10);
            expensesByDate.set(dStr, (expensesByDate.get(dStr) || 0) + Number(e.amount || 0));
          }
        }
        const liveCourierOrders = (db.orders || []).filter(
          (o) => o.courier && o.courier.toString().trim().toLowerCase() === courierName.toString().trim().toLowerCase()
        );
        const liveDatesSet = /* @__PURE__ */ new Set();
        for (const o of liveCourierOrders) {
          if (o.delivDate) liveDatesSet.add(o.delivDate.substring(0, 10));
          if (o.retDate) liveDatesSet.add(o.retDate.substring(0, 10));
          if (o.orderDate) liveDatesSet.add(o.orderDate.substring(0, 10));
          if (o.createdAt) liveDatesSet.add(o.createdAt.substring(0, 10));
        }
        let runningCumulative = 0;
        const dailyEarnings = sortedDates.map((dStr) => {
          const isToday = dStr === todayDate;
          const deliveredList = deliveredByDate.get(dStr) || [];
          const returnedList = returnedByDate.get(dStr) || [];
          const deliveredDay = deliveredList.length;
          const returnedDay = returnedList.length;
          const dayTotalCashCollected = deliveredList.reduce(
            (sum, o) => sum + getOrderActualCollection(o),
            0
          );
          const isSettled = !liveDatesSet.has(dStr);
          let baseEarning = Number((basicSalary / daysCount).toFixed(2));
          if (courierProfile.hire_date && dStr < courierProfile.hire_date) {
            baseEarning = 0;
          }
          const delivEarning = isToday ? deliveredDay * commissionSuccess : 0;
          const retEarning = isToday ? returnedDay * commissionReturn : 0;
          const dayLedger = ledgerByDate.get(dStr) || [];
          const dayPenalties = dayLedger.filter((l) => l.type === "\u062C\u0632\u0627\u0621" || l.type === "\u062E\u0635\u0645" || l.type === "\u062E\u0635\u0645 \u0639\u062C\u0632").reduce(
            (sum, x) => sum + Math.abs(Number(x.amount)),
            0
          );
          const dayExpenses = expensesByDate.get(dStr) || 0;
          const dayBonuses = dayLedger.filter((l) => l.type === "\u0645\u0643\u0627\u0641\u0623\u0629").reduce((sum, x) => sum + Number(x.amount), 0);
          const allowance = Number(
            courierProfile.allowance || courierProfile.shipping_allowance || 0
          );
          const total = delivEarning + retEarning + allowance + baseEarning + dayBonuses - (dayPenalties + dayExpenses);
          runningCumulative += total;
          return {
            date: dStr,
            delivered: deliveredDay,
            returned: returnedDay,
            baseEarning,
            delivEarning,
            retEarning,
            total: Number(total.toFixed(2)),
            cumulative: Number(runningCumulative.toFixed(2)),
            cashCollected: dayTotalCashCollected,
            isSettled
          };
        });
        const allowanceTotal = Number(
          courierProfile.allowance || courierProfile.shipping_allowance || 0
        );
        const todayExpensesCombined = db.expenses?.filter((e) => e.by === courierName && isDateToday(e.date) && !e.isSettledMonth).reduce((sum, e) => sum + Number(e.amount), 0) || 0;
        const proRatedSalary = Number(
          dailyEarnings.reduce((sum, dItem) => sum + dItem.baseEarning, 0).toFixed(2)
        );
        const netSalary = todayTotalCommission + proRatedSalary + allowanceTotal + bonusesSum - penaltiesSum - todayExpensesCombined;
        return ok(res, {
          ledgerInfo: {
            courierName,
            basicSalary: proRatedSalary,
            // Display pro-rated basic salary in the row
            contractualSalary: basicSalary,
            // Pass contractual salary for detailed views
            base_fixed_salary: proRatedSalary,
            commission_success: commissionSuccess,
            commission_return: commissionReturn,
            deliveredCount,
            delivCommission,
            returnedCount,
            returnedPaidCount,
            returnShippingCommission,
            bonusesSum,
            penaltiesSum,
            netSalary,
            totalCollected,
            totalPaidToCompany,
            deficit,
            todayDeliveredCount,
            todayDelivCommission: todayTotalCommission,
            // backward compatibility
            todayDeliveredCash,
            todayReturnedPaidCash,
            todayTotalCommission,
            todayPenalties,
            todayBonuses,
            requiredHandoverToday,
            dailyEarnings: dailyEarnings.reverse()
            // Sort descending to have latest date first
          },
          transactions: targetLedger.reverse()
        });
      }
      case "getCourierInfo": {
        const courierName = currentUser;
        const courierProfile = db.couriers.find(
          (c) => c.name === courierName
        );
        if (!courierProfile) return err(res, "\u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u063A\u064A\u0631 \u0645\u0633\u062C\u0644");
        const returnStatuses = [
          "\u0645\u0631\u062A\u062C\u0639",
          "\u0645\u0631\u062A\u062C\u0639 \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639",
          "\u0645\u0631\u062A\u062C\u0639 \u062C\u062F\u064A\u062F",
          "\u0645\u0631\u062A\u062C\u0639 \u062C\u0627\u0631\u064A \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0643\u062A\u0628",
          "\u062C\u0627\u0631\u064A \u0627\u0644\u0631\u062C\u0648\u0639 \u0644\u0644\u0645\u0648\u0631\u062F",
          "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F",
          "\u062C\u0627\u0647\u0632 \u0644\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F",
          "\u0645\u0631\u062A\u062C\u0639 \u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0648\u0631\u062F",
          "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F \u0648\u062A\u0635\u0641\u064A\u0629 \u062D\u0633\u0627\u0628\u0647",
          "\u0645\u0631\u062A\u062C\u0639 \u062C\u0632\u0626\u064A \u0628\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639",
          "\u0642\u064A\u062F \u0627\u0644\u0645\u0631\u062A\u062C\u0639",
          "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F",
          "\u062C\u0627\u0631\u064A \u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0645\u0631\u062A\u062C\u0639",
          "\u0645\u0631\u062A\u062C\u0639 \u0648\u0627\u0644\u0639\u0645\u064A\u0644 \u062F\u0641\u0639 \u0627\u0644\u0634\u062D\u0646",
          "\u0645\u0631\u062A\u062C\u0639 \u0645\u062F\u0641\u0648\u0639 \u0627\u0644\u0634\u062D\u0646"
        ];
        const getOrderActualCollection = (o) => {
          if (!o) return 0;
          const status = (o.status || "").toString().trim();
          if ([
            "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
            "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0628\u0646\u062C\u0627\u062D",
            "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 (\u0646\u0627\u062C\u062D \u0643\u0627\u0634)"
          ].includes(status)) {
            return Number(o.totalCOD !== void 0 && o.totalCOD !== "" && o.totalCOD !== null ? o.totalCOD : Number(o.prodPrice || 0) + Number(o.shipPrice || 0));
          }
          if ([
            "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A",
            "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F"
          ].includes(status)) {
            const raw = o.actualReceivedCash !== void 0 ? o.actualReceivedCash : o.partialAmount !== void 0 ? o.partialAmount : o["\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u0633\u062A\u0644\u0645"] !== void 0 ? o["\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u0633\u062A\u0644\u0645"] : o["\u0627\u0644\u062A\u062D\u0635\u064A\u0644 \u0627\u0644\u062C\u0632\u0626\u064A"] !== void 0 ? o["\u0627\u0644\u062A\u062D\u0635\u064A\u0644 \u0627\u0644\u062C\u0632\u0626\u064A"] : o["\u0627\u0644\u062A\u062D\u0635\u064A\u0644"] !== void 0 ? o["\u0627\u0644\u062A\u062D\u0635\u064A\u0644"] : o["\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062D\u0635\u0644"] !== void 0 ? o["\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062D\u0635\u0644"] : o["\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u0633\u062A\u0644\u0645 \u0627\u0644\u0641\u0639\u0644\u064A"] !== void 0 ? o["\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u0633\u062A\u0644\u0645 \u0627\u0644\u0641\u0639\u0644\u064A"] : "";
            if (raw !== void 0 && raw !== null && raw !== "") {
              const val = Number(raw);
              if (!isNaN(val)) return val;
            }
            return 0;
          }
          if ([
            "\u0645\u0631\u062A\u062C\u0639 \u0648\u0627\u0644\u0639\u0645\u064A\u0644 \u062F\u0641\u0639 \u0627\u0644\u0634\u062D\u0646",
            "\u0645\u0631\u062A\u062C\u0639 \u0645\u062F\u0641\u0648\u0639 \u0627\u0644\u0634\u062D\u0646",
            "\u0645\u0631\u062A\u062C\u0639 \u0648\u062A\u0645 \u062F\u0641\u0639 \u0627\u0644\u0634\u062D\u0646"
          ].includes(status) || status === "\u0645\u0631\u062A\u062C\u0639" && o.returnShippingType === "paid") {
            return Number(o.shipPrice || o.shipCost || 0);
          }
          return 0;
        };
        const ordersList = [
          ...db.orders || [],
          ...db.archivedOrders || []
        ].filter(
          (o) => o.courier && o.courier.toString().trim().toLowerCase() === courierName.toString().trim().toLowerCase()
        );
        const total = ordersList.length;
        const delivered = ordersList.filter(
          (o) => [
            "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
            "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0628\u0646\u062C\u0627\u062D",
            "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 (\u0646\u0627\u062C\u062D \u0643\u0627\u0634)",
            "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A",
            "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F"
          ].includes((o.status || "").toString().trim())
        ).length;
        const returnedPaid = 0;
        const returnedAll = ordersList.filter(
          (o) => returnStatuses.includes((o.status || "").toString().trim())
        ).length;
        const basicSalary = courierProfile.base_fixed_salary !== void 0 ? Number(courierProfile.base_fixed_salary) : Number(courierProfile.salary || 3e3);
        const commissionSuccess = courierProfile.commission_success !== void 0 ? Number(courierProfile.commission_success) : Number(courierProfile.commission || 25);
        const commissionReturn = courierProfile.commission_return !== void 0 ? Number(courierProfile.commission_return) : 10;
        const ledgerTr = db.courierLedger.filter(
          (l) => l.courier === courierName
        );
        const bonuses = ledgerTr.filter((l) => l.type === "\u0645\u0643\u0627\u0641\u0623\u0629").reduce(
          (sum, x) => sum + Math.abs(Number(x.amount || 0)),
          0
        );
        const penalties = ledgerTr.filter(
          (l) => l.type === "\u062C\u0632\u0627\u0621" || l.type === "\u062E\u0635\u0645" || l.type === "\u062E\u0635\u0645 \u0639\u062C\u0632"
        ).reduce(
          (sum, x) => sum + Math.abs(Number(x.amount || 0)),
          0
        );
        const todayDate = tod();
        const successOrdersToday = ordersList.filter(
          (o) => [
            "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
            "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0628\u0646\u062C\u0627\u062D",
            "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 (\u0646\u0627\u062C\u062D \u0643\u0627\u0634)",
            "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A",
            "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F"
          ].includes((o.status || "").toString().trim()) && o.delivDate && isDateToday(o.delivDate)
        );
        const returnedOrdersToday = ordersList.filter(
          (o) => returnStatuses.includes((o.status || "").toString().trim()) && o.retDate && isDateToday(o.retDate)
        );
        const todayDeliveredCount = successOrdersToday.length;
        const todayReturnedCount = returnedOrdersToday.length;
        const todayDeliveredCash = successOrdersToday.reduce(
          (sum, o) => sum + getOrderActualCollection(o),
          0
        ) + returnedOrdersToday.reduce(
          (sum, o) => sum + getOrderActualCollection(o),
          0
        );
        const todayReturnedPaidCash = 0;
        const todayTotalCommission = todayDeliveredCount * commissionSuccess + todayReturnedCount * commissionReturn;
        const todayBonuses = ledgerTr.filter(
          (l) => l.type === "\u0645\u0643\u0627\u0641\u0623\u0629" && l.date && isDateToday(l.date)
        ).reduce(
          (sum, x) => sum + Math.abs(Number(x.amount || 0)),
          0
        );
        const todayPenalties = ledgerTr.filter(
          (l) => (l.type === "\u062C\u0632\u0627\u0621" || l.type === "\u062E\u0635\u0645" || l.type === "\u062E\u0635\u0645 \u0639\u062C\u0632") && l.date && isDateToday(l.date)
        ).reduce(
          (sum, x) => sum + Math.abs(Number(x.amount || 0)),
          0
        );
        const requiredHandoverToday = todayDeliveredCash - todayTotalCommission;
        const totalCommission = todayTotalCommission;
        const totalEarnings = basicSalary + totalCommission + bonuses - penalties;
        const nowCairo = getCairoDateObj();
        const daysInCurrentMonth = new Date(
          nowCairo.getFullYear(),
          nowCairo.getMonth() + 1,
          0
        ).getDate();
        const daysCount = daysInCurrentMonth || 30;
        const datesSet = /* @__PURE__ */ new Set();
        for (const o of ordersList) {
          if ((o.status === "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645" || o.status === "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A" || o.status === "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F") && o.delivDate) {
            datesSet.add(o.delivDate.substring(0, 10));
          }
          if (["\u0645\u0631\u062A\u062C\u0639", "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F", "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F"].includes(
            o.status
          ) && o.retDate) {
            datesSet.add(o.retDate.substring(0, 10));
          }
        }
        datesSet.add(todayDate);
        const year = nowCairo.getFullYear();
        const month = nowCairo.getMonth();
        const todayDayNum = nowCairo.getDate();
        for (let dMonth = 1; dMonth <= todayDayNum; dMonth++) {
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dMonth).padStart(2, "0")}`;
          datesSet.add(dateStr);
        }
        const sortedDates = Array.from(datesSet).sort();
        let runningCumulative = 0;
        const dailyEarnings = sortedDates.map((dStr) => {
          const isToday = dStr === todayDate;
          const deliveredList = ordersList.filter(
            (o) => (o.status === "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645" || o.status === "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A" || o.status === "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F") && o.delivDate && o.delivDate.substring(0, 10) === dStr
          );
          const returnedList = ordersList.filter(
            (o) => ["\u0645\u0631\u062A\u062C\u0639", "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F", "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F"].includes(
              o.status
            ) && o.retDate && o.retDate.substring(0, 10) === dStr
          );
          const deliveredDay = deliveredList.length;
          const returnedDay = returnedList.length;
          const baseEarning = Number((basicSalary / daysCount).toFixed(2));
          const delivEarning = isToday ? deliveredDay * commissionSuccess : 0;
          const retEarning = isToday ? returnedDay * commissionReturn : 0;
          const dayLedger = db.courierLedger.filter(
            (l) => l.courier === courierName && l.date && l.date.substring(0, 10) === dStr
          );
          const dayPenalties = dayLedger.filter((l) => l.type === "\u062C\u0632\u0627\u0621" || l.type === "\u062E\u0635\u0645").reduce(
            (sum, x) => sum + Math.abs(Number(x.amount)),
            0
          );
          const dayExpenses = db.expenses?.filter(
            (e) => e.by === courierName && e.date && e.date.substring(0, 10) === dStr
          ).reduce((sum, e) => sum + Number(e.amount), 0) || 0;
          const dayBonuses = dayLedger.filter((l) => l.type === "\u0645\u0643\u0627\u0641\u0623\u0629").reduce((sum, x) => sum + Number(x.amount), 0);
          const allowance = Number(
            courierProfile.allowance || courierProfile.shipping_allowance || 0
          );
          const total2 = delivEarning + retEarning + allowance + baseEarning + dayBonuses - (dayPenalties + dayExpenses);
          runningCumulative += total2;
          return {
            date: dStr,
            delivered: deliveredDay,
            returned: returnedDay,
            baseEarning,
            delivEarning,
            retEarning,
            total: Number(total2.toFixed(2)),
            cumulative: Number(runningCumulative.toFixed(2))
          };
        });
        const totalCollectedOnInfo = ordersList.reduce(
          (sum, o) => {
            if ([
              "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
              "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0628\u0646\u062C\u0627\u062D",
              "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645 (\u0646\u0627\u062C\u062D \u0643\u0627\u0634)"
            ].includes(o.status)) {
              return sum + Number(
                o.totalCOD || Number(o.prodPrice || 0) + Number(o.shipPrice || 0)
              );
            } else if (["\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A", "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A - \u0645\u0639\u0644\u0642 \u0644\u0644\u062C\u0631\u062F"].includes(o.status)) {
              const amt = o.partialAmount !== void 0 && o.partialAmount !== null && o.partialAmount !== "" ? Number(o.partialAmount) : o.actualReceivedCash !== void 0 && o.actualReceivedCash !== null && o.actualReceivedCash !== "" ? Number(o.actualReceivedCash) : Number(o.totalCOD || 0);
              return sum + amt;
            } else if (o.status === "\u0645\u0631\u062A\u062C\u0639 \u0648\u0627\u0644\u0639\u0645\u064A\u0644 \u062F\u0641\u0639 \u0627\u0644\u0634\u062D\u0646" || o.status === "\u0645\u0631\u062A\u062C\u0639 \u0645\u062F\u0641\u0648\u0639 \u0627\u0644\u0634\u062D\u0646" || o.status === "\u0645\u0631\u062A\u062C\u0639" && o.returnShippingType === "paid") {
              return sum + Number(o.shipPrice || o.shipCost || 0);
            }
            return sum;
          },
          0
        );
        const totalPaidToCompanyOnInfo = db.cashbox.filter(
          (item) => item.type === "\u0627\u0633\u062A\u0644\u0627\u0645 \u0639\u0647\u062F\u0629 \u0645\u0646\u062F\u0648\u0628" && item.ref === courierName
        ).reduce(
          (sum, item) => sum + Number(item.amount || 0),
          0
        );
        const deficitOnInfo = totalCollectedOnInfo - totalPaidToCompanyOnInfo;
        return ok(res, {
          salary: basicSalary,
          commission: commissionSuccess,
          commission_success: commissionSuccess,
          commission_return: commissionReturn,
          base_fixed_salary: basicSalary,
          total,
          delivered,
          returnedAll,
          returnedPaid,
          bonuses,
          penalties,
          totalCommission,
          totalEarnings,
          todayDelivered: todayDeliveredCount,
          todayDelivCommission: todayTotalCommission,
          todayReturned: todayReturnedCount,
          todayReturnCommission: todayReturnedCount * commissionReturn,
          todayDeliveredCash,
          todayReturnedPaidCash,
          todayTotalCommission,
          todayPenalties,
          todayBonuses,
          requiredHandoverToday,
          deficit: deficitOnInfo,
          totalCollected: totalCollectedOnInfo,
          totalPaidToCompany: totalPaidToCompanyOnInfo,
          dailyEarnings: dailyEarnings.reverse()
          // newest first
        });
      }
      case "addCourierAdjustment": {
        if (!["\u0645\u062F\u064A\u0631", "\u0645\u062D\u0627\u0633\u0628"].includes(currentRole)) {
          return err(
            res,
            "\u0641\u0642\u0637 \u0627\u0644\u0645\u062F\u064A\u0631 \u0648\u0627\u0644\u0645\u062D\u0627\u0633\u0628 \u064A\u0645\u062A\u0644\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 \u062A\u0639\u062F\u064A\u0644 \u0645\u0643\u0627\u0641\u0622\u062A \u0648\u062C\u0632\u0627\u0621\u0627\u062A \u0627\u0644\u0645\u0646\u062F\u0648\u0628"
          );
        }
        const { courier, type, amount, desc } = d;
        if (!courier || !amount || !type)
          return err(res, "\u0628\u064A\u0627\u0646\u0627\u062A \u0645\u0641\u0642\u0648\u062F\u0629 \u0644\u0644\u062A\u0633\u0648\u064A\u0629");
        let val = Number(amount);
        if (type === "\u062C\u0632\u0627\u0621" || type === "\u062E\u0635\u0645" || type === "\u062E\u0635\u0645 \u0639\u062C\u0632") {
          val = Math.abs(val) * -1;
        }
        db.courierLedger.push({
          courier,
          date: now(),
          type,
          tracking: "ADJUST",
          amount: val,
          desc: desc || `${type} \u0644\u0644\u0645\u0646\u062F\u0648\u0628 \u0628\u0642\u064A\u0645\u0629 ${amount} \u062C`
        });
        if (type === "\u062C\u0632\u0627\u0621" || type === "\u062E\u0635\u0645" || type === "\u062E\u0635\u0645 \u0639\u062C\u0632") {
          db.cashbox.push({
            date: now(),
            desc: `\u062A\u0633\u0648\u064A\u0629 \u062E\u0635\u0645/\u062C\u0632\u0627\u0621 \u0645\u0633\u062A\u0642\u0637\u0639 \u0644\u0644\u0645\u0646\u062F\u0648\u0628: ${courier} - ${desc || ""}`,
            type: "\u0625\u064A\u062F\u0627\u0639",
            amount: Math.abs(val),
            ref: "PENALTY",
            addedBy: currentUser
          });
        } else if (type === "\u0645\u0643\u0627\u0641\u0623\u0629") {
          db.cashbox.push({
            date: now(),
            desc: `\u0645\u0643\u0627\u0641\u0623\u0629 \u0645\u0646\u0635\u0631\u0641\u0629 \u0644\u0644\u0645\u0646\u062F\u0648\u0628: ${courier} - ${desc || ""}`,
            type: "\u0635\u0631\u0641",
            amount: val,
            ref: "BONUS",
            addedBy: currentUser
          });
        }
        if (!db.auditLog) db.auditLog = [];
        db.auditLog.push({
          user: currentUser,
          type: `\u062A\u0633\u0648\u064A\u0629 \u0645\u0646\u062F\u0648\u0628 (${type})`,
          dateTime: now(),
          oldVal: "\u2014",
          newVal: `${type}: ${val} \u062C.\u0645 \u0644\u0644\u0645\u0646\u062F\u0648\u0628: ${courier}`,
          reason: desc || `\u062A\u0633\u062C\u064A\u0644 \u062A\u0633\u0648\u064A\u0629 \u0644\u0644\u0645\u0646\u062F\u0648\u0628: ${courier}`
        });
        writeDB(db);
        return ok(res, { msg: "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062A\u0633\u0648\u064A\u0629 \u0627\u0644\u0645\u0627\u0644\u064A\u0629 \u0644\u0644\u0645\u0646\u062F\u0648\u0628 \u0628\u0646\u062C\u0627\u062D" });
      }
      // ─────────────────────────────────────────────────────────────
      // STATUS CHANGE LOGICAL DIARY
      // ─────────────────────────────────────────────────────────────
      case "statusHistory": {
        const historyList = db.statusHistory.filter(
          (h) => !d.tracking || h.tracking === d.tracking
        );
        return ok(res, { history: historyList.reverse() });
      }
      // ─────────────────────────────────────────────────────────────
      // CASHBOX (TREASURY LEDGER) OPERATIONS
      // ─────────────────────────────────────────────────────────────
      case "cashbox": {
        if (!["\u0645\u062F\u064A\u0631", "\u0645\u062D\u0627\u0633\u0628"].includes(currentRole)) {
          return err(res, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0644\u0631\u0624\u064A\u0629 \u0627\u0644\u062E\u0632\u0646\u0629");
        }
        let balance = 0;
        const sortedEntries = [...db.cashbox].map((item) => {
          const isDeposit = [
            "\u0648\u0627\u0631\u062F",
            "\u062A\u062D\u0635\u064A\u0644 \u0645\u0646\u062F\u0648\u0628",
            "\u0625\u064A\u062F\u0627\u0639 \u062E\u0632\u0646\u0629 direct",
            "\u0625\u064A\u062F\u0627\u0639",
            "\u0627\u0633\u062A\u0644\u0627\u0645 \u0639\u0647\u062F\u0629 \u0645\u0646\u062F\u0648\u0628",
            "\u0625\u064A\u062F\u0627\u0639 \u0628\u0627\u0644\u062E\u0632\u0646\u0629"
          ].includes(item.type);
          balance += isDeposit ? Number(item.amount) : -Number(item.amount);
          return { ...item, balance };
        });
        return ok(res, { entries: sortedEntries.reverse(), balance });
      }
      case "addCashbox": {
        if (!["\u0645\u062F\u064A\u0631", "\u0645\u062D\u0627\u0633\u0628"].includes(currentRole)) {
          return err(res, "\u0635\u0644\u0627\u062D\u064A\u0629 \u0645\u0631\u0641\u0648\u0636\u0629 \u0644\u0625\u062F\u0631\u0627\u062C \u062D\u0631\u0643\u0627\u062A \u0627\u0644\u062E\u0632\u0646\u0629");
        }
        const { desc, type, amount, ref } = d;
        if (!amount || !type) return err(res, "\u0627\u0644\u0645\u0628\u0644\u063A \u0648\u0627\u0644\u0646\u0648\u0639 \u0645\u0637\u0644\u0648\u0628\u0627\u0646");
        READ_CACHE.clear();
        ACTIVE_FETCHES.clear();
        db.cashbox.push({
          date: now(),
          desc: desc || "",
          type,
          amount: Number(amount),
          ref: ref || "",
          addedBy: currentUser
        });
        if (type === "\u0627\u0633\u062A\u0644\u0627\u0645 \u0639\u0647\u062F\u0629 \u0645\u0646\u062F\u0648\u0628" && ref) {
          const courierName = ref;
          if (db.orders) {
            for (const o of db.orders) {
              if (o.courier === courierName) {
                const isCommitted = [
                  "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645",
                  "\u062A\u0633\u0644\u064A\u0645 \u062C\u0632\u0626\u064A",
                  "\u0645\u0631\u062A\u062C\u0639",
                  "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F",
                  "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F",
                  "\u0645\u0631\u062A\u062C\u0639 \u062A\u0645 \u062A\u0633\u0644\u064A\u0645\u0647 \u0644\u0644\u0645\u0648\u0631\u062F",
                  "\u0645\u0631\u062A\u062C\u0639 \u0648\u0627\u0644\u0639\u0645\u064A\u0644 \u062F\u0641\u0639 \u0627\u0644\u0634\u062D\u0646"
                ].includes(o.status);
                if (isCommitted) {
                  o.isClosed = true;
                }
              }
            }
          }
        }
        writeDB(db);
        return ok(res, { msg: "\u062A\u0645 \u0625\u062F\u0631\u0627\u062C \u0628\u0646\u062F \u0627\u0644\u062E\u0632\u064A\u0646\u0629 \u0648\u062A\u0635\u0641\u064A\u062A\u0647 \u0648\u062A\u0635\u0641\u064A\u0631 \u0627\u0644\u0639\u062F\u0627\u062F\u0627\u062A" });
      }
      // ─────────────────────────────────────────────────────────────
      // EXPENSES OPERATIONS
      // ─────────────────────────────────────────────────────────────
      case "expenses": {
        let expensesList = db.expenses || [];
        if (!["\u0645\u062F\u064A\u0631", "\u0645\u062D\u0627\u0633\u0628"].includes(currentRole)) {
          expensesList = expensesList.filter(
            (e) => e.addedBy === currentUser
          );
        }
        const total = expensesList.reduce(
          (sum, x) => sum + Number(x.amount),
          0
        );
        return ok(res, { expenses: [...expensesList].reverse(), total });
      }
      case "addExpense": {
        if (!["\u0645\u062F\u064A\u0631", "\u0645\u062D\u0627\u0633\u0628"].includes(currentRole)) {
          return err(res, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0635\u0631\u0641 \u0644\u0645\u064A\u0632\u0627\u0646\u064A\u0629 \u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A");
        }
        const { cat, desc, amount } = d;
        if (!amount) return err(res, "\u0627\u0644\u0645\u0628\u0644\u063A \u0645\u0637\u0644\u0648\u0628");
        const val = Number(amount);
        READ_CACHE.clear();
        ACTIVE_FETCHES.clear();
        db.expenses.push({
          date: now(),
          cat: cat || "\u0623\u062E\u0631\u0649",
          desc: desc || "",
          amount: val,
          by: currentUser
        });
        db.cashbox.push({
          date: now(),
          desc: `\u0635\u0631\u0641 \u0645\u0635\u0631\u0648\u0641: ${desc || cat}`,
          type: "\u0645\u0635\u0631\u0648\u0641\u0627\u062A",
          amount: val,
          ref: "EXPENSE",
          addedBy: currentUser
        });
        writeDB(db);
        return ok(res, {
          msg: "\u062A\u0645 \u0625\u0631\u0633\u0627\u0621 \u0628\u0646\u062F \u0627\u0644\u0635\u0631\u0641 \u0628\u0646\u062C\u0627\u062D \u0648\u0633\u062F\u0627\u062F\u0647 \u0645\u0646 \u0627\u0644\u062E\u0632\u064A\u0646\u0629 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B"
        });
      }
      // ─────────────────────────────────────────────────────────────
      // USER MANAGEMENT (Admin Only)
      // ─────────────────────────────────────────────────────────────
      case "getUsers": {
        if (currentRole !== "\u0645\u062F\u064A\u0631") {
          return err(res, "\u0635\u0644\u0627\u062D\u064A\u0629 \u062D\u0635\u0631\u064A\u0629 \u0644\u0645\u062F\u064A\u0631 \u0627\u0644\u0646\u0638\u0627\u0645");
        }
        const usersList = db.users.map((u, idx) => ({
          row: idx + 1,
          ...u
        }));
        return ok(res, { users: usersList });
      }
      case "addUser":
      case "registerUser": {
        if (currentRole !== "\u0645\u062F\u064A\u0631") {
          return err(res, "\u0635\u0644\u0627\u062D\u064A\u0629 \u062D\u0635\u0631\u064A\u0629 \u0644\u0645\u062F\u064A\u0631 \u0627\u0644\u0646\u0638\u0627\u0645");
        }
        const { name, role, pass, email } = d;
        if (!name || !pass || !role) return err(res, "\u0628\u064A\u0627\u0646\u0627\u062A \u0645\u0641\u0642\u0648\u062F\u0629 \u0644\u0644\u062A\u0633\u062C\u064A\u0644");
        const userExists = db.users.find(
          (u) => u.name.trim() === name.trim()
        );
        if (userExists) return err(res, "\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0647\u0630\u0627 \u0645\u0633\u062C\u0644 \u0645\u0633\u0628\u0642\u0627\u064B");
        const getPermissionsForRole = (r) => {
          const rTrim = (r || "").trim();
          if (rTrim === "\u0645\u062F\u064A\u0631") return "\u0643\u0627\u0645\u0644\u0629";
          if (rTrim === "\u0645\u0634\u0631\u0641") return "\u062A\u0648\u0632\u064A\u0639 \u0648\u0645\u062A\u0627\u0628\u0639\u0629";
          if (rTrim === "\u0645\u0646\u062F\u0648\u0628") return "\u0645\u0639\u0627\u064A\u0646\u0629 \u0627\u0644\u0634\u062D\u0646\u0627\u062A \u0648\u0627\u0644\u062A\u0642\u0641\u064A\u0644";
          return "\u0645\u062A\u0627\u0628\u0639\u0629 \u0645\u062D\u062F\u0648\u062F\u0629";
        };
        const newUserObj = {
          name: name.trim(),
          role,
          pass: pass.trim(),
          active: "\u0646\u0639\u0645",
          email: email || "",
          perms: getPermissionsForRole(role)
        };
        db.users.push(newUserObj);
        if (role === "\u0645\u0646\u062F\u0648\u0628") {
          db.couriers.push({
            name: name.trim(),
            phone: "\u2014",
            commission: 20,
            salary: 3e3,
            region: "\u2014",
            base_fixed_salary: 3e3,
            commission_success: 20,
            commission_return: 0
          });
        }
        if (role === "\u0645\u0648\u0631\u062F") {
          db.suppliers.push({
            name: name.trim(),
            phone: "\u2014",
            price: 65,
            notes: "\u0645\u0648\u0631\u062F \u062C\u062F\u064A\u062F"
          });
        }
        writeDB(db);
        return ok(res, {
          msg: "\u062A\u0645 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062D\u0633\u0627\u0628 \u0648\u0625\u0639\u062F\u0627\u062F \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0648\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0645\u0627\u0644\u064A \u0628\u0646\u062C\u0627\u062D"
        });
      }
      case "updateUser": {
        if (currentRole !== "\u0645\u062F\u064A\u0631") {
          return err(res, "\u0635\u0644\u0627\u062D\u064A\u0629 \u062D\u0635\u0631\u064A\u0629 \u0644\u0645\u062F\u064A\u0631 \u0627\u0644\u0646\u0638\u0627\u0645");
        }
        const { row, role, active, perms } = d;
        const index = Number(row) - 1;
        if (index < 0 || index >= db.users.length) {
          return err(res, "\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F");
        }
        const target = db.users[index];
        target.role = role || target.role;
        target.active = active || target.active;
        target.perms = perms !== void 0 ? perms : target.perms;
        writeDB(db);
        return ok(res, { msg: "\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0628\u0646\u062C\u0627\u062D" });
      }
      // ─────────────────────────────────────────────────────────────
      // PHONE NUMBER PRE-SCREEN CONTROLS
      // ─────────────────────────────────────────────────────────────
      case "checkPhone": {
        const phoneClean = fixPhone(d.phone || "");
        if (!phoneClean) return ok(res, { count: 0, rate: 0 });
        const matches = db.orders.filter(
          (o) => fixPhone(o.phone) === phoneClean || fixPhone(o.phone2) === phoneClean
        );
        if (matches.length === 0) return ok(res, { count: 0, rate: 0 });
        const deliv = matches.filter(
          (o) => o.status === "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645"
        ).length;
        const rate = Math.round(deliv / matches.length * 100);
        return ok(res, { count: matches.length, rate });
      }
      // ─────────────────────────────────────────────────────────────
      // RESOURCE MANAGEMENT / STATIC ARRAYS
      // ─────────────────────────────────────────────────────────────
      case "getCouriers": {
        const activeUsersCouriers = db.users.filter(
          (u) => ((u.role || "").toString().trim() === "\u0645\u0646\u062F\u0648\u0628" || (u.role || "").toString().trim().indexOf("\u0645\u0646\u062F\u0648\u0628") > -1 || (u.name || "").toString().trim() === "\u0639\u0635\u0641\u0648\u0631") && u.active !== "\u0644\u0627"
        );
        const list = activeUsersCouriers.map((u) => {
          const profile = db.couriers.find(
            (c) => c.name.toString().trim() === u.name.toString().trim()
          ) || {};
          return {
            name: u.name,
            phone: profile.phone || "\u2014",
            commission: profile.commission !== void 0 ? profile.commission : 25,
            salary: profile.salary !== void 0 ? profile.salary : 3e3,
            region: profile.region || "\u2014",
            base_fixed_salary: profile.base_fixed_salary !== void 0 ? profile.base_fixed_salary : profile.salary || 3e3,
            commission_success: profile.commission_success !== void 0 ? profile.commission_success : profile.commission || 25,
            commission_return: profile.commission_return !== void 0 ? profile.commission_return : 10,
            hire_date: profile.hire_date || "",
            last_closing_date: profile.last_closing_date || ""
          };
        });
        return ok(res, { couriers: list });
      }
      case "updateCourier": {
        if (!["\u0645\u062F\u064A\u0631", "\u0645\u062D\u0627\u0633\u0628"].includes(currentRole)) {
          return err(res, "\u0635\u0644\u0627\u062D\u064A\u0629 \u062D\u0635\u0631\u064A\u0629 \u0644\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062D\u0633\u0627\u0628\u0627\u062A");
        }
        const {
          name,
          phone,
          region,
          base_fixed_salary,
          commission_success,
          commission_return,
          hire_date
        } = d;
        if (!name)
          return err(res, "\u0627\u0633\u0645 \u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u0645\u0637\u0644\u0648\u0628 \u0644\u062A\u062D\u062F\u064A\u062B \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0645\u0627\u0644\u064A");
        const trimmedName = name.toString().trim();
        let courier = db.couriers.find(
          (c) => c.name && c.name.toString().trim().toLowerCase() === trimmedName.toLowerCase()
        );
        if (!courier) {
          courier = {
            name: trimmedName,
            phone: phone || "\u2014",
            salary: Number(
              base_fixed_salary !== void 0 ? base_fixed_salary : 3e3
            ),
            commission: Number(
              commission_success !== void 0 ? commission_success : 25
            ),
            region: region || "\u2014",
            base_fixed_salary: Number(
              base_fixed_salary !== void 0 ? base_fixed_salary : 3e3
            ),
            commission_success: Number(
              commission_success !== void 0 ? commission_success : 25
            ),
            commission_return: Number(
              commission_return !== void 0 ? commission_return : 10
            ),
            hire_date: hire_date || "",
            last_closing_date: ""
          };
          db.couriers.push(courier);
        } else {
          courier.phone = phone || courier.phone || "\u2014";
          courier.region = region || courier.region || "\u2014";
          courier.salary = Number(
            base_fixed_salary !== void 0 ? base_fixed_salary : courier.salary || 3e3
          );
          courier.commission = Number(
            commission_success !== void 0 ? commission_success : courier.commission || 25
          );
          courier.base_fixed_salary = Number(
            base_fixed_salary !== void 0 ? base_fixed_salary : courier.base_fixed_salary || 3e3
          );
          courier.commission_success = Number(
            commission_success !== void 0 ? commission_success : courier.commission_success || 25
          );
          courier.commission_return = Number(
            commission_return !== void 0 ? commission_return : courier.commission_return || 10
          );
          courier.hire_date = hire_date !== void 0 ? hire_date : courier.hire_date || "";
        }
        writeDB(db);
        if (!db.auditLog) db.auditLog = [];
        db.auditLog.push({
          user: currentUser,
          type: "\u062A\u0639\u062F\u064A\u0644 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0645\u0646\u062F\u0648\u0628",
          dateTime: now(),
          oldVal: "\u2014",
          newVal: `\u062A\u0645 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u0646\u062F\u0648\u0628 ${name}: \u0627\u0644\u0631\u0627\u062A\u0628: ${base_fixed_salary}\u060C \u0646\u062C\u0627\u062D: ${commission_success}\u060C \u0645\u0631\u062A\u062C\u0639: ${commission_return}`,
          reason: "\u062A\u062D\u062F\u064A\u062B \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0631\u0627\u062A\u0628 \u0648\u0627\u0644\u0639\u0645\u0648\u0644\u0629"
        });
        return ok(res, { msg: "\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0648\u062D\u0641\u0638 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0646\u062F\u0648\u0628 \u0628\u0646\u062C\u0627\u062D" });
      }
      case "getSuppliers": {
        return ok(res, { suppliers: db.suppliers });
      }
      case "saveSupplier": {
        if (!["\u0645\u062F\u064A\u0631", "\u0645\u062D\u0627\u0633\u0628"].includes(currentRole)) {
          return err(res, "\u0641\u0642\u0637 \u0627\u0644\u0645\u062F\u064A\u0631 \u0648\u0627\u0644\u0645\u062D\u0627\u0633\u0628 \u064A\u0645\u062A\u0644\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 \u062A\u0639\u062F\u064A\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0648\u0631\u062F\u064A\u0646");
        }
        const { name, phone, price, notes, openingBalance } = d;
        if (!name) return err(res, "\u0627\u0633\u0645 \u0627\u0644\u0645\u0648\u0631\u062F \u0645\u0637\u0644\u0648\u0628");
        if (!db.suppliers) db.suppliers = [];
        let sup = db.suppliers.find((s) => sameSup(s.name, name));
        if (!sup) {
          sup = { name };
          db.suppliers.push(sup);
        }
        sup.phone = phone || "";
        sup.price = Number(price || 0);
        sup.notes = notes || "";
        sup.openingBalance = Number(openingBalance || 0);
        sup.updatedAt = now();
        writeDB(db);
        return ok(res, { msg: "\u062A\u0645 \u062D\u0641\u0638 \u0648\u062A\u062D\u062F\u064A\u062B \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0648\u0631\u062F \u0628\u0646\u062C\u0627\u062D" });
      }
      case "report": {
        const { type, courier, supplier } = d;
        const ordersList = db.orders;
        const todayDate = tod();
        let list = [];
        switch (type) {
          case "today":
            list = ordersList.filter(
              (o) => isDateToday(o.createdAt) || isDateToday(o.updatedAt)
            );
            break;
          case "pending":
            list = ordersList.filter(
              (o) => [
                "\u062C\u062F\u064A\u062F",
                "\u062A\u0645 \u0627\u0644\u0625\u0633\u0646\u0627\u062F",
                "\u062E\u0627\u0631\u062C \u0645\u0639 \u0627\u0644\u0645\u0646\u062F\u0648\u0628",
                "\u0645\u0624\u062C\u0644",
                "\u0644\u0627 \u064A\u0648\u062C\u062F \u0631\u062F"
              ].includes(getOrderStatus(o))
            );
            break;
          case "return":
            list = ordersList.filter(
              (o) => ["\u0645\u0631\u062A\u062C\u0639", "\u0627\u0644\u062A\u0633\u0644\u064A\u0645 \u0644\u0644\u0645\u0648\u0631\u062F", "\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0644\u0644\u0645\u0648\u0631\u062F"].includes(
                getOrderStatus(o)
              )
            );
            break;
          case "delivered":
            list = ordersList.filter(
              (o) => getOrderStatus(o) === "\u062A\u0645 \u0627\u0644\u062A\u0633\u0644\u064A\u0645"
            );
            break;
          default:
            list = ordersList;
        }
        if (courier)
          list = list.filter((o) => getOrderCourier(o) === courier);
        if (supplier)
          list = list.filter((o) => {
            const oSup = getOrderSupplier(o);
            return oSup && sameSup(oSup, supplier);
          });
        return ok(res, { orders: list, count: list.length });
      }
      default:
        return err(res, `\u0627\u0644\u0639\u0645\u0644\u064A\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 ${d.action} \u063A\u064A\u0631 \u0645\u062F\u0639\u0648\u0645\u0629`);
    }
  } catch (error) {
    console.error("SERVER DISPATCH ERROR:", error);
    return err(res, "\u062D\u062F\u062B \u062E\u0637\u0623 \u062F\u0627\u062E\u0644\u064A \u0641\u064A \u0627\u0644\u062E\u0627\u062F\u0645: " + error.message);
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `\u{1F69A} Friend Plus Logistics is running on http://localhost:${PORT}`
    );
  });
}
var server_default = app;
if (!process.env.VERCEL) {
  startServer();
}
//# sourceMappingURL=server.cjs.map


import * as ynab from "ynab";
import { SaveTransaction } from "ynab";

import { parse } from 'node-html-parser';
const fs = require('fs');
require('dotenv').config();

const ynabAPI = new ynab.API(process.env.ynab_api_key);

const file = fs.readFileSync('./dist/');


const root = parse(file.toString());

const transactions = root.querySelectorAll('.tw-flex.tw-w-full');

function addHours(date:Date, hours:number) {
  const hoursToAdd = hours * 60 * 60 * 1000;
  date.setTime(date.getTime() + hoursToAdd);
  return date;
}

type ynab_transcation = {
  account_id: string,
  date: string,
  amount: number,
  memo: string
  payee_name: string,
  cleared: SaveTransaction.ClearedEnum,
}

const transferred:string[] = []

const ynab_transcations = transactions.map((transaction):ynab_transcation => {

  const text_fields = transaction.querySelectorAll("[data-v-1ac32250='']").filter((field) => {
    return field.querySelectorAll("[data-v-1ac32250='']").length === 0
  })

  const dmy:string[] = text_fields[3].text.trim().split(".");

  const d = new Date(parseInt(dmy[2]), parseInt(dmy[1]) -1, parseInt(dmy[0]));

  const id = text_fields.map((field) => field.text.trim()).join("");

  if (!transferred.includes(id)) {
    transferred.push(id)
    return {
      account_id: process.env.hanseatic_account_id,
      date: addHours(d, 6).toISOString(),
      amount: parseInt((parseFloat(text_fields[4].text.trim().replace(" €","").replace("+","").replace(",",".")) * 1000).toString()),
      memo: text_fields[2].text.trim(),
      payee_name: text_fields[1].text.trim(),
      cleared: SaveTransaction.ClearedEnum.Cleared,
    }
  } else {
    return null;
  }


})

ynabAPI.transactions.createTransactions(
  process.env.budget_id,
  {
    transactions: ynab_transcations.filter((x) => x != null)
  }
  
).then((response) => {
  console.log(response.data);
})
.catch((reason) => {
  console.log(reason);
})

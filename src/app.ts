import { Client } from "kontist";
import { Transaction } from "kontist/dist/lib/graphql/schema";
import * as ynab from "ynab";
import { SaveTransaction } from "ynab";
require('dotenv').config();

const username = process.env.kontist_user;
const password = process.env.kontist_password;
const ynabAPI = new ynab.API(process.env.ynab_api_key);

// create a client
const client = new Client({
  clientId: process.env.CLIENT_ID,
  scopes: ["transactions", "transfers"],
  clientSecret: process.env.APP_SECRET
});


client.auth.tokenManager.fetchTokenFromCredentials({ username, password })
  .then((tokenData) => {
      console.log("Your unconfirmed access token is:", tokenData.accessToken);
      console.log("Starting MFA...");
      return client.auth.push.getConfirmedToken();
  })
  .then((confirmed) => {
      console.log("Your confirmed access token is:", confirmed.accessToken);
      console.log("Fetching latest transactions...");
      const result =  client.models.transaction.fetch();
      result.then((transactions) => {
          ynabAPI.transactions.createTransactions(
            process.env.budget_id,
            {
              transactions: transactions.items.map((item:Transaction) => {
                return {
                  account_id: process.env.account_id,
                  date: item.valutaDate,
                  amount: item.amount * 10,
                  memo: item.purpose,
                  import_id: item.id.slice(1,35) + '1',
                  payee_name: item.name,
                  cleared: SaveTransaction.ClearedEnum.Cleared,
                }
              })
            }
            
          ).then((response) => {
            console.log(response.data);
          })
          .catch((reason) => {
            console.log(reason);
          })
    })
  })
  .catch((err:string) => console.log(err));


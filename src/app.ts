// src/app.ts
import express from 'express';
import { Request, Response } from 'express';
import { Client } from "kontist";
import { Transaction } from "kontist/dist/lib/graphql/schema";
import * as ynab from "ynab";
import { SaveTransaction } from "ynab";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

async function syncTransactions() {
  const username = process.env.kontist_user;
  const password = process.env.kontist_password;
  const ynabAPI = new ynab.API(process.env.ynab_api_key);
  
  const client = new Client({
    clientId: process.env.CLIENT_ID,
    scopes: ["transactions", "transfers"],
    clientSecret: process.env.APP_SECRET
  });

  try {
    const tokenData = await client.auth.tokenManager.fetchTokenFromCredentials({ username, password });
    console.log("Your unconfirmed access token is:", tokenData.accessToken);
    console.log("Starting MFA...");

    const confirmed = await client.auth.push.getConfirmedToken();

    console.log("Your confirmed access token is:", confirmed.accessToken);
    const transactions = await client.models.transaction.fetch();

    const kontist_transaction = transactions.items
      .map((item: Transaction) => {
        if (item.valutaDate) {
          return {
            account_id: process.env.account_id,
            date: item.valutaDate,
            amount: item.amount * 10,
            memo: item.purpose,
            import_id: item.id.slice(1,35) + '1',
            payee_name: item.name,
            cleared: SaveTransaction.ClearedEnum.Cleared,
          };
        }
        return null;
      })
      .filter((x) => x !== null);

    const response = await ynabAPI.transactions.createTransactions(
      process.env.budget_id,
      { transactions: kontist_transaction }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

app.get('/sync', async (req: express.Request, res: express.Response) => {
  try {
    const result = await syncTransactions();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.post('/sync', async (req: express.Request, res: express.Response) => {
  try {
    const result = await syncTransactions();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
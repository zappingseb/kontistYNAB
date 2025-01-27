# Kontist - YNAB Connector

This Node tool that allows you to send your last
50 [Kontist](https://kontist.com) transactions to [YNAB](https://www.ynab.com)

## Prerequisites

- Create a Kontist API Cient at: https://kontist.dev/client-management/clients - define a random secret

- Create a YNAB personal access token via: https://api.youneedabudget.com/

- Install Node: https://nodejs.org/en/

## Install dependencies

Install Node dependencies by this command

```sh
npm install
```

## Create `.env` file

Create a file with all these secrets
inside the main directory and call it `.env`

```
CLIENT_ID='<Kontist API Client ID>'
APP_SECRET='<Kontist API Client Secret>'
kontist_user=<Kontist User Email>
kontist_password='<Kontist Password>'
ynab_api_key='<YNAB Personal Access Token>'
budget_id='<Budget ID>'
account_id='<Account ID>'
# Feature coming soon:
hanseatic_account_id='<Account for Hanseatic credit card>'
```

## Run the synchronization

```
npm run fullstart
```

## Dockerized setup

Run this and replace `$(pwd)` by the directory where your `.env` file is located.

```sh
docker build -t kontist-ynab .
docker run -v $(pwd)/.env:/app/.env -p 3000:3000 kontist-ynab
```

After that you can open `localhost:3000/sync` inside any Web-Browser to sync your latest transactions.

# Kontist - YNAB Connector

This Node tool that allows you to send your last
50 Kontist transactions to [YNAB](https://www.ynab.com)


## Prerequisites

* Create a Kontist API Cient at: https://kontist.dev/client-management/clients - define a random secret

* Create a YNAB personal access token via: https://api.youneedabudget.com/

* Install Node: https://nodejs.org/en/

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
```

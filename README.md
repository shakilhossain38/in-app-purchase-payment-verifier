# Apple In-App Purchase Payment Verifier

This repository provides a complete, end-to-end Node.js solution for verifying Apple App Store In-App Purchases (IAP) using the App Store Server API.

## Overview
This guide explains how to:
- Generate a Bearer Token (JWT) using your Apple Developer keys
- Use that token to call Apple’s App Store Server API
- Decode the response (JWS) to retrieve readable payment information

## Prerequisites
- **Node.js** installed on your system
- Your Apple Developer credentials:
  - **Issuer ID**
  - **Key ID**
  - **Private Key** (`.p8` file downloaded from App Store Connect)

## Required Files
All required scripts are included in this repository:
- `jwt.js` → Generates the Bearer Token.
- `fetch_transaction.js` → Calls the Apple API.
- `jws_to_data.js` → Decodes the JWS returned by Apple.
- `AuthKey_example.p8` → Example of where your private key goes.

## Setup Commands

**1. Clone the repository and navigate into it**
```bash
git clone https://github.com/shakilhossain38/in-app-purchase-payment-verifier.git
cd in-app-purchase-payment-verifier
```

**2. Install Required Dependencies**
```bash
npm install
```
*(This installs `jsonwebtoken`. Ensure your `package.json` includes `"type": "module"` as this project uses ES modules).*

**3. Configure your keys**
- Rename `AuthKey_example.p8` to `AuthKey.p8` and paste your actual private key inside.
- Open `jwt.js` and replace `YOUR_KEY_ID` and `YOUR_ISSUER_ID` with your actual Apple developer credentials.

## Run the Full Flow

Execute the following command:
```bash
node fetch_transaction.js
```

### What Happens Internally
1. `fetch_transaction.js` runs `jwt.js`.
2. Generates a Bearer Token.
3. Uses the token to call the Apple API (e.g., `https://api.storekit.itunes.apple.com/inApps/v1/transactions/{transactionId}`).
4. Receives a response containing `signedTransactionInfo` (a JWS string).
5. Passes the JWS to `jws_to_data.js`.
6. `jws_to_data.js` decodes the payload and prints the JSON data.

## Output

After running the command, you will get the decoded transaction data in JSON format printed in the terminal.

**Success:**
```json
{
  "transactionId": "360003053412814",
  "originalTransactionId": "360003053412814",
  "bundleId": "com.smartsohay.education",
  "productId": "275",
  "purchaseDate": 1776395809000,
  "originalPurchaseDate": 1776395809000,
  "quantity": 1,
  "type": "Consumable",
  "inAppOwnershipType": "PURCHASED",
  "signedDate": 1776437603358,
  "environment": "Production",
  "transactionReason": "PURCHASE",
  "storefront": "USA",
  "storefrontId": "143441",
  "price": 290,
  "currency": "USD",
  "appTransactionId": "705456937445059527"
}
```

**Fail:**
```json
{ "errorCode": 4040010, "errorMessage": "Transaction id not found." }
```

## Security Notes
- **Bearer Token Lifespan:** The Bearer Token is valid for a short duration (maximum 60 minutes). Always generate a new token before making API requests.
- **Keep Keys Secret:** Do not expose your private key (`.p8`), Key ID, or Issuer ID in frontend applications or public repositories. (This repo uses `.gitignore` to prevent tracking `AuthKey.p8`).
- **Backend Only:** Always perform decoding and validation on a secure backend server.

## Conclusion
By running a single command, the system automatically generates a Bearer Token, fetches transaction data from Apple, and decodes it into readable JSON format.

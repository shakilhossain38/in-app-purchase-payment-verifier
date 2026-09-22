import { generateToken } from './jwt.js';
import { decodeJWS } from './jws_to_data.js';

// The transaction ID to query (from your example)
const TRANSACTION_ID = '360003053412814'; 
const ENVIRONMENT = 'Production'; // Change to 'Sandbox' if testing with sandbox transactions

const API_BASE_URL = ENVIRONMENT === 'Production' 
    ? 'https://api.storekit.itunes.apple.com' 
    : 'https://api.storekit-sandbox.itunes.apple.com';

async function fetchTransaction() {
    try {
        // 1. Generate the Bearer Token
        const token = generateToken();
        
        const url = `${API_BASE_URL}/inApps/v1/transactions/${TRANSACTION_ID}`;
        
        // 2. Call Apple's App Store Server API
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Fail:\n', errorData);
            return;
        }

        const data = await response.json();
        
        if (data && data.signedTransactionInfo) {
            // 3. Decode the returned JWS string to readable JSON
            const decodedTransaction = decodeJWS(data.signedTransactionInfo);
            console.log('Success:\n', JSON.stringify(decodedTransaction, null, 2));
        } else {
            console.log('Unexpected response format:', data);
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Execute the flow
fetchTransaction();

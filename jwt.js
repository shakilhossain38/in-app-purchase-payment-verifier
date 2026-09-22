import jwt from 'jsonwebtoken';
import fs from 'fs';

// ⚠️ Replace these with your actual Apple developer credentials
const KEY_ID = 'YOUR_KEY_ID'; 
const ISSUER_ID = 'YOUR_ISSUER_ID';
const BUNDLE_ID = 'com.smartsohay.education'; // Based on your previous output

// Path to your downloaded private key from App Store Connect
const PRIVATE_KEY_PATH = './AuthKey.p8'; 

export function generateToken() {
    try {
        const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
        
        const payload = {
            iss: ISSUER_ID,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour validity (maximum allowed by Apple)
            aud: 'appstoreconnect-v1',
            bid: BUNDLE_ID
        };

        const header = {
            alg: 'ES256',
            kid: KEY_ID,
            typ: 'JWT'
        };

        // Sign the token using ES256 algorithm
        const token = jwt.sign(payload, privateKey, { algorithm: 'ES256', header });
        return token;
    } catch (error) {
        console.error('Error generating token:', error.message);
        throw error;
    }
}

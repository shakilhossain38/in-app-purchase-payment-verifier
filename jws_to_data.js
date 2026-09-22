export function decodeJWS(jwsToken) {
    try {
        // A JWS consists of 3 parts separated by dots: header.payload.signature
        const parts = jwsToken.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWS format');
        }

        const payloadBase64Url = parts[1];
        
        // Convert Base64Url to Base64
        const base64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
        
        // Decode the base64 payload to string, then parse as JSON
        const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWS:', error.message);
        return null;
    }
}

import crypto, { randomBytes } from 'crypto';
const SECRETE = 'ELITEFREELANCER-API';
export const random = () => randomBytes(128).toString('base64');
export const authentication = (salt, password) => {
    // Return the hashed password as a string (hex)
    return crypto.createHmac('sha256', [salt, password].join('/'))
        .update(SECRETE)
        .digest('hex'); // Digest the HMAC and convert it to a string
};
//# sourceMappingURL=helpers.js.map
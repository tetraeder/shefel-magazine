/**
 * Sets the 'admin' custom claim on a Firebase Auth user.
 * Usage: node scripts/set-admin-claim.mjs <uid>
 *
 * Reads the Firebase CLI refresh token and exchanges it for an access token,
 * then calls the Identity Toolkit REST API to set custom claims.
 */
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const uid = process.argv[2];
if (!uid) {
  console.error('Usage: node scripts/set-admin-claim.mjs <uid>');
  process.exit(1);
}

const PROJECT_ID = 'shefelstudio';

// Read Firebase CLI stored credentials
const configPath = join(homedir(), '.config', 'configstore', 'firebase-tools.json');
if (!existsSync(configPath)) {
  console.error('Firebase CLI config not found. Run: npx firebase login');
  process.exit(1);
}
const config = JSON.parse(readFileSync(configPath, 'utf-8'));
const refreshToken = config.tokens?.refresh_token;
const clientId = config.tokens?.client_id || '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
const clientSecret = config.tokens?.client_secret || 'j9iVZfS8kkCEFUPaAeJV0sAi';

if (!refreshToken) {
  console.error('No refresh token found. Run: npx firebase login');
  process.exit(1);
}

// Exchange refresh token for access token
const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  }),
});
const tokenData = await tokenRes.json();
if (!tokenData.access_token) {
  console.error('Failed to get access token:', tokenData);
  process.exit(1);
}
const accessToken = tokenData.access_token;

// Set custom claims via Identity Toolkit REST API
const claimsRes = await fetch(
  `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/accounts:update`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      localId: uid,
      customAttributes: JSON.stringify({ admin: true }),
    }),
  }
);

if (!claimsRes.ok) {
  const err = await claimsRes.json();
  console.error('Failed to set claims:', err);
  process.exit(1);
}

console.log(`✔ Set admin:true claim on UID ${uid}`);

// Verify by looking up the user
const lookupRes = await fetch(
  `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/accounts:lookup`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ localId: [uid] }),
  }
);
const lookupData = await lookupRes.json();
const user = lookupData.users?.[0];
console.log(`  Email: ${user?.email}`);
console.log(`  Custom claims: ${user?.customAttributes}`);
console.log('\n⚠ The user must sign out and back in for the claim to take effect.');

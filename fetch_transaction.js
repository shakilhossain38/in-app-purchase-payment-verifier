import { execSync } from "child_process";
import https from "https";

// 1. Get Bearer Token from jwt.js
function getBearerToken() {
  try {
    const token = execSync("node jwt.js").toString().trim();
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    process.exit(1);
  }
}

// 2. Call Apple API
function fetchTransaction(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.storekit.itunes.apple.com",
      path: "/inApps/v1/transactions/360003053412814",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (err) {
          reject("Invalid JSON response: " + data);
        }
      });
    });

    req.on("error", (e) => reject(e));
    req.end();
  });
}

// 3. Main flow
async function main() {
  const token = getBearerToken();
  console.log("Bearer Token received");

  try {
    const response = await fetchTransaction(token);

    if (!response.signedTransactionInfo) {
      console.error("No signedTransactionInfo found");
      console.log(response);
      return;
    }

    const signedInfo = response.signedTransactionInfo;

    console.log("JWS received, decoding...");

    // 4. Pass to jws_to_data.js
    // assuming jws_to_data.js accepts argument
    execSync(`node jws_to_data.js "${signedInfo}"`, {
      stdio: "inherit",
    });

  } catch (error) {
    console.error("Error:", error);
  }
}

main();

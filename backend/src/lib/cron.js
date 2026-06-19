import { CronJob } from 'cron';
import http from 'node:http';
import https from 'node:https';

//every 17 minutes, send GET request to the health endpoint
const job = new CronJob('*/17 * * * *', function () {
    const base = process.env.FRONTEND_URL;
    if (!base) return;
        const url = new URL("/health", base).href;
        const client = url.startsWith("https:") ? https : http;

        client
            .get(url, (res) => {
                if (res.statusCode === 200) console.log("GET request sent successfully");
                else console.error("GET request failed with status code:", res.statusCode);
                })
            .on("error", (e) => console.error("Error while sending GET request:", e));
    // Implementation for sending GET request would go here
});

export default job;
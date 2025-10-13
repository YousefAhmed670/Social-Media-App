"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTokenCleanupJob = startTokenCleanupJob;
const node_schedule_1 = require("node-schedule");
const DB_1 = require("../../DB");
function startTokenCleanupJob() {
    const tokenRepository = new DB_1.TokenRepository();
    (0, node_schedule_1.scheduleJob)("0 6 * * *", async () => {
        try {
            const result = await tokenRepository.deleteMany({
                createdAt: { $lt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
            });
            console.log(`🗑️ Deleted ${result.deletedCount} tokens from black list`);
        }
        catch (err) {
            console.error("❌ Error deleting tokens from black list", err);
        }
    });
}

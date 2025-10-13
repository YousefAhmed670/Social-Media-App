import { scheduleJob } from "node-schedule";
import { TokenRepository } from "../../DB";

export function startTokenCleanupJob() {
    const tokenRepository = new TokenRepository();
    scheduleJob("0 6 * * *", async () => {
      try {
        const result = await tokenRepository.deleteMany({
          createdAt: { $lt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
        });
        console.log(`🗑️ Deleted ${result.deletedCount} tokens from black list`);
      } catch (err) {
        console.error("❌ Error deleting tokens from black list", err);
      }
    });
  }

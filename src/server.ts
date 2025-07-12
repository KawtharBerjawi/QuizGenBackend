import "reflect-metadata";
import app from "@/app/app";
import db from "./postgres/postgres";
import { PORT } from "./constants/env";
import seedData from "./utils/seed/seed";
import logger from "@/utils/logger/logger";
import checkDB from "@/utils/checkDB/checkDB";

process.on("uncaughtException", (err: any) => {
     logger.error(`UNCAUGHT EXCEPTION: ${err.message}`);
     process.exit(1);
});

const runApp = async () => {
     try {
          await checkDB();
          await db.initialize().then(() => logger.info("database connected successfully"));
          await seedData();
          app.listen(PORT, () => logger.info(`app is running on port ${PORT}`));
     } catch (error) {
          logger.error(error);
          setTimeout(() => runApp(), 5000);
     }
};

runApp();

process.on("unhandledRejection", (err: any) => {
     logger.error(`UNHANDLED REJECTION: ${err.message}`);
     process.exit(1);
});

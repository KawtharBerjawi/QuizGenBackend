import fs from "fs";
import path from "path";
import dayjs from "@/utils/dayjs/dayjs";
import { NODE_ENV } from "@/constants/env";

const LOG_DIR = path.join("logs");
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);
const getLogFilePath = () => path.join(LOG_DIR, `${dayjs().format("DD-MM-YYYY")}.log`);
const createLogStream = () => fs.createWriteStream(getLogFilePath(), { flags: "a" });

class Logger {
     stream: fs.WriteStream;

     constructor() {
          this.stream = createLogStream();
     }

     log(level: string, message: any) {
          const timestamp = dayjs().format("DD-MM-YYYY HH:mm:ss");
          const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
          this.stream.write(logEntry);
          if (NODE_ENV === "development") console.log(logEntry.trim());
     }

     error(message: any) {
          this.log("error", message);
     }

     info(message: any) {
          this.log("info", message);
     }

     debug(message: any) {
          this.log("debug", message);
     }

     rotateLogStream() {
          const newLogFilePath = getLogFilePath();
          if (this.stream.path !== newLogFilePath) {
               this.stream.end();
               this.stream = createLogStream();
          }
     }
}

const logger = new Logger();
setInterval(() => { logger.rotateLogStream() }, 60000);
export default logger;
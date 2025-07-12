import logger from "../logger/logger";
import { POSTGRES_HOST, POSTGRES_NAME, POSTGRES_PASS, POSTGRES_PORT, POSTGRES_USER } from "@/constants/env";
import { DataSource, DataSourceOptions } from "typeorm";

const checkDB = async () => {
     try {
          const datasourceOption: DataSourceOptions = {
               type: "postgres",
               host: POSTGRES_HOST,
               port: POSTGRES_PORT,
               username: POSTGRES_USER,
               password: POSTGRES_PASS,
          }

          const connection = new DataSource(datasourceOption).initialize();
          const queryRunner = (await connection).createQueryRunner();
          const databaseExists = await queryRunner.hasDatabase(POSTGRES_NAME!);

          if (!databaseExists) {
               await queryRunner.createDatabase(POSTGRES_NAME, true);
               return logger.info("database created successfully");
          }

          logger.info("database already created");
     } catch (error) {
          logger.error(error);
     }
}

export default checkDB;
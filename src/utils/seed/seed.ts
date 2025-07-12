import User from "@/models/user";
import logger from "../logger/logger";
import { DeepPartial } from "typeorm";
import { userRepo } from "@/postgres/postgres";
import { SUPER_USER_EMAIL, SUPER_USER_FIRSTNAME, SUPER_USER_LASTNAME, SUPER_USER_PASSWORD, SUPER_USER_PHONE_NUMBER } from "@/constants/env";

const seedData = async () => {
     try {
          const supperUser = await userRepo.findOne({ where: { role: "instructor" } });
          if (supperUser) return logger.info("supper already created");
          const supperUserInfo: DeepPartial<User> = {
               firstName: SUPER_USER_FIRSTNAME,
               lastName: SUPER_USER_LASTNAME,
               email: SUPER_USER_EMAIL,
               phoneNumber: SUPER_USER_PHONE_NUMBER,
               password: SUPER_USER_PASSWORD,
               role: "instructor",
               createdBy: "system",
               updatedBy: "system",
               isVerified: true,
          }
          await userRepo.create(supperUserInfo).save();
          logger.info("supper user created successfully");
     } catch (error) {
          logger.error(error);
     }
};

export default seedData;
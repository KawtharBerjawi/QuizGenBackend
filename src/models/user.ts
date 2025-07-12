import crypto from "crypto";
import bcrypt from "bcryptjs";
import AppBaseModel from "./_base";
import { generateUniqueUsername } from "@/utils/functions/functions";
import { Column, Entity, BeforeInsert, BeforeUpdate, OneToMany } from "typeorm";
import Quiz from "./quiz";
import Summary from "./summary";

@Entity()
class User extends AppBaseModel {
     @Column({ enum: ["instructor", "student"], nullable: false })
     role!: "instructor" | "student";

     @Column({ type: "varchar", length: 100, unique: true, nullable: false })
     userName!: string;

     @Column({ type: "varchar", length: 100, nullable: false })
     firstName!: string;

     @Column({ type: "varchar", length: 100, nullable: false })
     lastName!: string;

     @Column({ type: "varchar", length: 100, nullable: false })
     email!: string;

     @Column({ type: "char", length: 8, nullable: false })
     phoneNumber!: string | null;

     @Column({ type: "char", length: 60, nullable: false })
     password!: string;

     @Column({ type: "bool", default: true, nullable: false })
     isActivated!: boolean;

     @Column({ type: "bool", default: false, nullable: false })
     isVerified!: boolean;

     @Column({ type: "varchar", length: 100, nullable: true })
     passwordResetToken!: string | null;

     @Column({ type: "timestamptz", nullable: true, })
     passwordResetExpiry!: Date | null;

     @Column({ type: "varchar", length: 100, nullable: true })
     emailVerificationToken!: string | null;

     @Column({ type: "timestamptz", nullable: true, })
     emailVerificationExpiry!: Date | null;

     @OneToMany(() => Quiz, (quiz) => quiz.instructor)
     createdQuizzes!: Quiz[];

     @OneToMany(() => Summary, (summary) => summary.student)
     quizSummaries!: Summary[];

     @BeforeInsert()
     @BeforeUpdate()
     async beforeCreateUpdate() {
          const { password } = this;
          if (!this.userName) this.userName = generateUniqueUsername(this.firstName, this.lastName);
          if (password.length <= 50) this.password = await bcrypt.hash(password, 12);
     }

     async comparePassword(plainTextPassword: string): Promise<boolean> {
          return await bcrypt.compare(plainTextPassword, this.password);
     }

     async getPasswordResetToken() {
          const resetToken = crypto.randomBytes(20).toString("hex");
          this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
          this.passwordResetExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 min
          await this.save();
          return resetToken;
     }

     async getEmailVerificationToken() {
          const resetToken = crypto.randomBytes(20).toString("hex");
          this.emailVerificationToken = crypto.createHash("sha256").update(resetToken).digest("hex");
          this.emailVerificationExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 min
          await this.save();
          return resetToken;
     }
}

export default User;

import { BaseEntity, CreateDateColumn, UpdateDateColumn, Entity, Column, DeleteDateColumn, PrimaryGeneratedColumn, Index } from "typeorm";

@Entity()
class AppBaseModel extends BaseEntity {
    @Index()
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @CreateDateColumn({ type: "timestamptz", nullable: false })
    createdAt!: Date;

    @Column({ type: "varchar", length: 100, nullable: false })
    createdBy!: string;

    @UpdateDateColumn({ type: "timestamptz", nullable: false })
    updatedAt!: Date;

    @Column({ type: "varchar", length: 100, nullable: false })
    updatedBy!: string;

    @DeleteDateColumn({ type: "timestamptz", nullable: true })
    deletedAt!: Date | null;

    @Column({ type: "varchar", length: 100, nullable: true })
    deletedBy!: string | null;

    @Column({ type: "bool", default: false, nullable: false })
    isDeleted!: boolean;
}

export default AppBaseModel;
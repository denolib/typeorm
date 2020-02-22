import {CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn} from "../../../../src/index.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @VersionColumn({ type: Number })
    version: number;

    @CreateDateColumn({type: "timestamp"})
    createdAt: Date;

    @UpdateDateColumn({type: "timestamp"})
    updatedAt: Date;

}

import { Column, ValueTransformer, Entity, PrimaryGeneratedColumn } from "../../../../../src/index.ts";
import { lowercase, encrypt } from "./User.ts";

const trim: ValueTransformer = {
    to: (entityValue: string) => {
        return entityValue.trim();
    },
    from: (databaseValue: string) => {
        return databaseValue;
    }
};

@Entity()
export class Category {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: String, transformer: [lowercase, trim, encrypt]})
    description: string;
}

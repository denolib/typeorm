import { Column, ValueTransformer, Entity, PrimaryGeneratedColumn } from "../../../../../src/index.ts";
import { PlatformTools } from "../../../../../src/platform/PlatformTools.ts";

const encode: ValueTransformer = {
    to: (entityValue: string) => {
        return encodeURI(entityValue);
    },
    from: (databaseValue: string) => {
        return decodeURI(databaseValue);
    },
};

export const encrypt: ValueTransformer = {
    to: (entityValue: string) => {
        return PlatformTools.encodeToBase64(entityValue);
    },
    from: (databaseValue: string) => {
        return PlatformTools.decodeFromBase64(databaseValue);
    },
};


export const lowercase: ValueTransformer = {
    to: (entityValue: string) => {
        return entityValue.toLocaleLowerCase();
    },
    from: (databaseValue: string) => {
        return databaseValue;
    }
};

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({type: String, transformer: [lowercase, encode, encrypt]})
    email!: string;
}

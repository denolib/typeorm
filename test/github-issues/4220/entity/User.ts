import {Entity, PrimaryColumn, Column} from "../../../../src/index.ts";

@Entity()
export class User {
    @PrimaryColumn({
        comment: "The ID of this user.",
        length: 16,
        type: "binary",
    })
    id: Uint8Array;

    @Column({ type: String })
    name: string;
}

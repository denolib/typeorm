import { PrimaryColumn, Entity, Column } from "../../../../src/index.ts";


@Entity()
export class Post {

    @PrimaryColumn({ type: Number })
    id: number;

    @Column({
        type: String,
        nullable: true,
        transformer: {
            from(val: string | undefined | null) {
                return val === null ? "This is null" : val;
            },
            to(val: string | undefined | null) {
                return val;
            }
        }
    })
    text: string;

}

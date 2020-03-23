import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number|undefined|null|string;

    @Column({ type: String })
    title!: string;

    @Column({
        type!: "date",
        transformer: {
            from: (value: any) => new Date(value),
            to: (value: Date) => value.toISOString(),
        }
    })
    dateAdded!: Date;
}

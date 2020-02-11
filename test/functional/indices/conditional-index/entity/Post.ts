import {Column, Entity, PrimaryGeneratedColumn} from "../../../../../src/index.ts";
import {Index} from "../../../../../src/decorator/Index.ts";

@Index(["name", "text"], { where: `"name" IS NOT NULL AND "text" IS NOT NULL` })
@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

    @Column({ type: String })
    text: string;

    @Index({ where: `"version" IS NOT NULL AND "version" > 0` })
    @Column({ type: Number })
    version: number;

}

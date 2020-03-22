import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Unique} from "../../../../src/decorator/Unique.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";
import {Check} from "../../../../src/decorator/Check.ts";
import {Exclusion} from "../../../../src/decorator/Exclusion.ts";

@Entity()
@Unique(["text", "tag"])
@Exclusion(`USING gist ("name" WITH =)`)
@Check(`"version" < 999`)
export class Post {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column({ unique: true, type: Number })
    version!: number;

    @Column({ default: "My post", type: String })
    name!: string;

    @Column({ type: String })
    text!: string;

    @Column({ type: String })
    tag!: string;

}

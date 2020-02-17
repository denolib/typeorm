import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";

@Entity()
export class Post {

    @PrimaryColumn("int")
    id: number;

    @Column({type: "datetime", nullable: true})
    dateTimeColumn: Date;

    @Column({type: "time", nullable: true})
    timeColumn: Date;

}

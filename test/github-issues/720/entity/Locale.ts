import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {OneToOne} from "../../../../src/decorator/relations/OneToOne.ts";
import {JoinColumn} from "../../../../src/decorator/relations/JoinColumn.ts";
import {Message} from "./Message.ts";

@Entity()
export class Locale {

    @PrimaryColumn("varchar", { length: 5 })
    code!: string;

    @Column("varchar", { length: 50 })
    englishName!: string;

    @OneToOne(() => Message, { onDelete: "SET NULL" })
    @JoinColumn()
    name!: Message;

}

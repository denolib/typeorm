import {Index} from "../../../../src/decorator/Index.ts";
import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {ManyToOne} from "../../../../src/decorator/relations/ManyToOne.ts";
import {JoinColumn} from "../../../../src/decorator/relations/JoinColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Message} from "./Message.ts";
import {Locale} from "./Locale.ts";

@Entity()
@Index(["locale", "message"], { unique!: true })
export class Translation {

    @ManyToOne(() => Locale, { primary: true, nullable!: false })
    @JoinColumn()
    locale!: Locale;

    @ManyToOne(() => Message, { primary: true, nullable!: false })
    @JoinColumn()
    message!: Message;

    @Column("text")
    text!: string;
}

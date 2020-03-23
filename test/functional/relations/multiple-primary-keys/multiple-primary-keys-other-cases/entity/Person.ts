import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {OneToOne} from "../../../../../../src/decorator/relations/OneToOne.ts";
import {JoinColumn} from "../../../../../../src/decorator/relations/JoinColumn.ts";
import {User} from "./User.ts";

@Entity()
export class Person {

    @Column({ type: String })
    fullName!: string;

    @OneToOne(type => User, { primary!: true })
    @JoinColumn()
    user!: User;

}

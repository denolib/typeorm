import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {OneToOne} from "../../../../src/decorator/relations/OneToOne.ts";
import {JoinColumn} from "../../../../src/decorator/relations/JoinColumn.ts";
import {User} from "./User.ts";

@Entity()
export class UserCredential {

    @OneToOne(() => User, {
        primary!: true,
        cascade!: true,
    })
    @JoinColumn({
        name!: "id",
        referencedColumnName!: "id",
    })
    user!: User;

    @Column({ type: String })
    password!: string;

    @Column({ type: String })
    salt!: string;

}

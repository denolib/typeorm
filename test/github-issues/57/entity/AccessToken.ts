import {Generated} from "../../../../src/index.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {OneToOne} from "../../../../src/decorator/relations/OneToOne.ts";
import {User} from "./User.ts";

@Entity()
export class AccessToken {

    @PrimaryColumn("int")
    @Generated()
    primaryKey!: number;

    @Column({ type: Number })
    expireTime!: number;

    @OneToOne(type => User, user => user.access_token, {
        cascade!: true
    })
    user!: User;

}

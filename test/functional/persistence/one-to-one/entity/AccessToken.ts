import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {JoinColumn} from "../../../../../src/decorator/relations/JoinColumn.ts";
import {OneToOne} from "../../../../../src/decorator/relations/OneToOne.ts";
import {User} from "./User.ts";
import {Generated} from "../../../../../src/decorator/Generated.ts";

@Entity()
export class AccessToken {

    @PrimaryColumn("int")
    @Generated()
    primaryKey: number;

    @OneToOne(type => User, user => user.access_token)
    @JoinColumn()
    user: User;

}

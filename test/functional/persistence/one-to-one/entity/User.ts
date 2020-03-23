import {AccessToken} from "./AccessToken.ts";
import {OneToOne} from "../../../../../src/decorator/relations/OneToOne.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Generated} from "../../../../../src/decorator/Generated.ts";

@Entity()
export class User {

    @PrimaryColumn("int")
    @Generated()
    primaryKey!: number;

    @Column({ type: String })
    email!: string;

    @OneToOne(type => AccessToken, token => token.user)
    access_token!: AccessToken;

}

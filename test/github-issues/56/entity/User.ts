import {AccessToken} from "./AccessToken.ts";
import {JoinColumn} from "../../../../src/decorator/relations/JoinColumn.ts";
import {OneToOne} from "../../../../src/decorator/relations/OneToOne.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Generated} from "../../../../src/decorator/Generated.ts";

@Entity()
export class User {

    @PrimaryColumn("int")
    @Generated()
    id: number;

    @Column({ type: String })
    email: string;

    @OneToOne(type => AccessToken)
    @JoinColumn()
    access_token: AccessToken;

}

import {PrimaryColumn, Entity, OneToMany} from "../../../../src/index.ts";
import {UserMonth} from "./user-month.ts";

@Entity()
export class User {

    @PrimaryColumn({ type: String })
    public username: string;

    @OneToMany(type => UserMonth, userMonth => userMonth.user)
    public userMonths: UserMonth[];
}

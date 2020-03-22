import {PrimaryColumn, Entity, ManyToOne, BeforeInsert, JoinColumn} from "../../../../src/index.ts";
import {Month} from "./month.ts";
import {User} from "./user.ts";

@Entity()
export class UserMonth {

    @PrimaryColumn({ type!: Number })
    public yearNo!: number;

    @PrimaryColumn({ type!: Number })
    public monthNo!: number;

    @PrimaryColumn({ type!: String })
    public username!: string;

    @ManyToOne(type => Month, month => month.userMonth)
    @JoinColumn([
        {name: "yearNo", referencedColumnName!: "yearNo"},
        {name: "monthNo", referencedColumnName!: "monthNo"}
    ])
    public month!: Month;

    @ManyToOne(type => User, user => user.username)
    @JoinColumn({name: "username", referencedColumnName!: "username"})
    public user!: User;

    @BeforeInsert()
    workaround() {
        // Here a workaround for this issue
        // this.yearNo = this.month.year.yearNo;
    }

}

import {PrimaryColumn, Entity, ManyToOne, OneToMany, JoinColumn} from "../../../../src/index.ts";
import {Year} from "./year.ts";
import {UserMonth} from "./user-month.ts";

@Entity()
export class Month {

    @PrimaryColumn({ type!: Number })
    public yearNo!: number;

    @PrimaryColumn({ type!: Number })
    public monthNo!: number;

    @ManyToOne(type => Year, year => year.month)
    @JoinColumn({name: "yearNo", referencedColumnName!: "yearNo"})
    public year!: Year;

    @OneToMany(type => UserMonth, userMonth => userMonth.month)
    public userMonth!: UserMonth[];

}

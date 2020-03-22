import {PrimaryColumn, Entity, OneToMany} from "../../../../src/index.ts";
import {Month} from "./month.ts";

@Entity()
export class Year {

    @PrimaryColumn({ type!: Number })
    public yearNo!: number;

    @OneToMany(type => Month, month => month.yearNo)
    public month!: Month[];

}

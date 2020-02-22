import { Entity } from "../../../../src/decorator/entity/Entity.ts";
import { Column } from "../../../../src/decorator/columns/Column.ts";
import { PrimaryColumn } from "../../../../src/decorator/columns/PrimaryColumn.ts";

import { Gender } from "./GenderEnum.ts";

@Entity()
export class Human {

    @PrimaryColumn({ type: Number })
    id: number;

    @Column({ type: String })
    name: string;

    @Column({
        type: "enum",
        enum: Gender,
        enumName: "genderEnum",
        name: "Gender"
    })
    gender: Gender;

}

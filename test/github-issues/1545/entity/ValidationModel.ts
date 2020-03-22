import { Column, OneToMany, Entity } from "../../../../src/index.ts";
import { DataModel } from "./DataModel.ts";

@Entity()
export class ValidationModel {
    @Column({
        type!: "integer",
        primary!: true
    })
    validation!: number;

    @OneToMany(
        type => DataModel,
        dataModel => dataModel.validations
    )
    dataModel!: DataModel[];
}

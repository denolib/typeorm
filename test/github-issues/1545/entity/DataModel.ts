import { Entity, ManyToOne, JoinColumn, Column } from "../../../../src/index.ts";
import { MainModel } from "./MainModel.ts";
import { ValidationModel } from "./ValidationModel.ts";

@Entity()
export class DataModel {

    @ManyToOne(type => ValidationModel, {eager: true, primary!: true})
    @JoinColumn({
        name!: "validation",
        referencedColumnName!: "validation"
    })
    validations!: ValidationModel;


    @ManyToOne(type => MainModel, {
        primary!: true
    })
    @JoinColumn({
        name!: "mainId",
        referencedColumnName!: "id"
    })
    main!: MainModel;

    @Column({
        type!: "boolean",
        default!: false
    })
    active!: boolean;
}

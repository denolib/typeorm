import { Entity, PrimaryGeneratedColumn, OneToMany } from "../../../../src/index.ts";
import { DataModel } from "./DataModel.ts";

@Entity()
export class MainModel {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(
        type => DataModel,
        dataModel => dataModel.main,
        {cascade: true, eager: true}
    )
    dataModel: DataModel[];
}

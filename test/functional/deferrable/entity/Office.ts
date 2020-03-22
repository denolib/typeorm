import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {ManyToOne} from "../../../../src/decorator/relations/ManyToOne.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";
import {Company} from "./Company.ts";

@Entity()
export class Office {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column({ type: String })
    name!: string;

    @ManyToOne(type => Company, company => company.id, {
        deferrable!: "INITIALLY IMMEDIATE",
    })
    company!: Company;
}


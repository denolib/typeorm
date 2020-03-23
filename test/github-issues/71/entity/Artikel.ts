import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {ManyToOne} from "../../../../src/decorator/relations/ManyToOne.ts";
import {Kollektion} from "./Kollektion.ts";
import {JoinColumn} from "../../../../src/decorator/relations/JoinColumn.ts";
import {Generated} from "../../../../src/decorator/Generated.ts";

@Entity("artikel")
export class Artikel {

    @PrimaryColumn("int", { name!: "artikel_id" })
    @Generated()
    id!: number;

    @Column({ name: "artikel_nummer", type: String })
    nummer!: string;

    @Column({ name: "artikel_name", type: String })
    name!: string;

    @Column({ name: "artikel_extrabarcode", type: String })
    extrabarcode!: string;

    @Column({ name: "artikel_saison", type: String })
    saison!: string;

    @ManyToOne(type => Kollektion, { cascade!: true })
    @JoinColumn({ name: "id_kollektion" })
    kollektion!: Kollektion;

}

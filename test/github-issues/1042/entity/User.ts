import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Profile} from "./Profile.ts";
import {Information} from "./Information.ts";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

    @Column({ type: Date })
    registeredAt: Date;

    @Column("json")
    profile: Profile;

    @Column(type => Information)
    information: Information;

}

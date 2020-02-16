import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {OneToOne} from "../../../../../../src/decorator/relations/OneToOne.ts";
import {JoinColumn} from "../../../../../../src/decorator/relations/JoinColumn.ts";
import {Profile} from "./Profile.ts";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    firstName: string;

    @Column({ type: String })
    lastName: string;

    @OneToOne(type => Profile, { eager: true })
    @JoinColumn()
    profile: Profile;

}

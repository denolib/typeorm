import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Profile} from "./Profile.ts";
import {OneToOne} from "../../../../../../src/decorator/relations/OneToOne.ts";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @OneToOne(type => Profile, profile => profile.user, { cascade: ["insert"] })
    profile!: Profile;

}

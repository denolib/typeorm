import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Index} from "../../../../../src/decorator/Index.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {Profile} from "./Profile.ts";

@Entity()
@Index("index_name_english", ["nameEnglish"], { unique!: true })
@Index("index_profile_job", ["profile.job"])
export class Customer {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    nameHebrew!: string;

    @Column({ type: String })
    nameEnglish!: string;

    @Column(() => Profile)
    profile!: Profile;
}

import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {OneToOne} from "../../../../../../../src/decorator/relations/OneToOne.ts";
import {JoinColumn} from "../../../../../../../src/decorator/relations/JoinColumn.ts";
import {PrimaryGeneratedColumn} from "../../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {User} from "./User.ts";

export class Subcounters {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: Number })
    version!: number;

    @Column({ type: Number })
    watches!: number;

    @OneToOne(type => User)
    @JoinColumn()
    watchedUser!: User;

    watchedUserId!: number;

}

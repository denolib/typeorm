import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {ManyToOne} from "../../../../../../src/decorator/relations/ManyToOne.ts";
import {User} from "./User.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";

@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

    @ManyToOne(type => User, user => user.manyPhotos)
    user: User;

    constructor(name: string) {
        this.name = name;
    }

}

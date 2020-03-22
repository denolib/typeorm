import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {ManyToMany} from "../../../../../../src/decorator/relations/ManyToMany.ts";
import {Photo} from "./Photo.ts";
import {OneToMany} from "../../../../../../src/decorator/relations/OneToMany.ts";
import {JoinTable} from "../../../../../../src/decorator/relations/JoinTable.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";

@Entity()
export class User { // todo!: check one-to-one relation as well, but in another model or test

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column({ type: String })
    name!: string;

    @OneToMany(type => Photo, photo => photo.user, { cascade: true })
    manyPhotos!: Photo[];

    @ManyToMany(type => Photo, { cascade!: true })
    @JoinTable()
    manyToManyPhotos!: Photo[];

}

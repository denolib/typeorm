import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {ImageInfo} from "./ImageInfo.ts";
import {OneToMany} from "../../../../../src/decorator/relations/OneToMany.ts";

@Entity()
export class Image {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @OneToMany(type => ImageInfo, imageInfo => imageInfo.image)
    informations: ImageInfo[] = [];

}

import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {UpdateDateColumn} from "../../../../src/decorator/columns/UpdateDateColumn.ts";
import {OneToOne} from "../../../../src/decorator/relations/OneToOne.ts";
import {PostCategory} from "./PostCategory.ts";
import {JoinColumn} from "../../../../src/decorator/relations/JoinColumn.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @Column({type: Boolean, default: false})
    active!: boolean;

    @UpdateDateColumn()
    updateDate!: Date;

    @OneToOne(type => PostCategory)
    @JoinColumn()
    category!: PostCategory;

    @Column({ type: Number })
    updatedColumns: number = 0;

    @Column({ type: Number })
    updatedRelations: number = 0;
}

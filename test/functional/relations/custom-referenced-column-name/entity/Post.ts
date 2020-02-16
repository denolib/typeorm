import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {ManyToOne} from "../../../../../src/decorator/relations/ManyToOne.ts";
import {JoinColumn} from "../../../../../src/decorator/relations/JoinColumn.ts";
import {Category} from "./Category.ts";
import {OneToOne} from "../../../../../src/decorator/relations/OneToOne.ts";
import {Tag} from "./Tag.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    title: string;

    @Column({ nullable: true, type: String })
    categoryName: string;

    @Column({ type: "int", nullable: true })
    categoryId: number;

    @Column({ nullable: true, type: String })
    tagName: string;

    @Column({ type: "int", nullable: true })
    tagId: number;

    @ManyToOne(type => Category)
    @JoinColumn()
    categoryWithEmptyJoinCol: Category;

    @ManyToOne(type => Category)
    @JoinColumn({ name: "categoryId" })
    categoryWithoutRefColName: Category;

    @ManyToOne(type => Category)
    @JoinColumn({ referencedColumnName: "name" })
    categoryWithoutColName: Category;

    @ManyToOne(type => Category)
    @JoinColumn({ name: "categoryIdentifier" })
    categoryWithoutRefColName2: Category;

    @ManyToOne(type => Category)
    @JoinColumn({ name: "categoryName", referencedColumnName: "name" })
    category: Category;

    @OneToOne(type => Tag)
    @JoinColumn()
    tagWithEmptyJoinCol: Tag;

    @OneToOne(type => Tag)
    @JoinColumn({ name: "tagId" })
    tagWithoutRefColName: Tag;

    @OneToOne(type => Tag)
    @JoinColumn({ referencedColumnName: "name" })
    tagWithoutColName: Tag;

    @OneToOne(type => Tag)
    @JoinColumn({ name: "tagIdentifier" })
    tagWithoutRefColName2: Tag;

    @OneToOne(type => Tag)
    @JoinColumn({ name: "tagName", referencedColumnName: "name" })
    tag: Tag;

}

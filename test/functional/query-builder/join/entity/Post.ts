import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {ManyToOne} from "../../../../../src/decorator/relations/ManyToOne.ts";
import {ManyToMany} from "../../../../../src/decorator/relations/ManyToMany.ts";
import {JoinTable} from "../../../../../src/decorator/relations/JoinTable.ts";
import {OneToOne} from "../../../../../src/decorator/relations/OneToOne.ts";
import {JoinColumn} from "../../../../../src/decorator/relations/JoinColumn.ts";
import {User} from "./User.ts";
import {Category} from "./Category.ts";
import {Tag} from "./Tag.ts";
import {Image} from "./Image.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @ManyToOne(type => Tag)
    tag!: Tag;

    @OneToOne(type => User)
    @JoinColumn()
    author!: User;

    @ManyToMany(type => Category, category => category.posts)
    @JoinTable()
    categories!: Category[];

    subcategories!: Category[];

    removedCategories!: Category[];

    images!: Image[];

}

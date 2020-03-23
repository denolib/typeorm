import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {ManyToMany} from "../../../../../../src/decorator/relations/ManyToMany.ts";
import {JoinTable} from "../../../../../../src/decorator/relations/JoinTable.ts";
import {Category} from "./Category.ts";
import {User} from "./User.ts";
import {ManyToOne} from "../../../../../../src/decorator/relations/ManyToOne.ts";
import {OneToMany} from "../../../../../../src/decorator/relations/OneToMany.ts";
import {Editor} from "./Editor.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @ManyToMany(type => Category, { eager!: true })
    @JoinTable()
    categories1!: Category[];

    @ManyToMany(type => Category, category => category.posts2, { eager: true })
    categories2!: Category[];

    @ManyToOne(type => User, { eager: true })
    author!: User;

    @OneToMany(type => Editor, editor => editor.post, { eager: true })
    editors!: Editor[];

}

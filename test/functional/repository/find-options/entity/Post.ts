import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {ManyToMany} from "../../../../../src/decorator/relations/ManyToMany.ts";
import {Category} from "./Category.ts";
import {ManyToOne} from "../../../../../src/decorator/relations/ManyToOne.ts";
import {User} from "./User.ts";
import {JoinTable} from "../../../../../src/decorator/relations/JoinTable.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @ManyToOne(type => User)
    author!: User;

    @ManyToMany(type => Category)
    @JoinTable()
    categories!: Category[];

}

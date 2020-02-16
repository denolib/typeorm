import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {ManyToMany} from "../../../../../src/decorator/relations/ManyToMany.ts";
import {JoinTable} from "../../../../../src/decorator/relations/JoinTable.ts";
import {OneToMany} from "../../../../../src/decorator/relations/OneToMany.ts";
import {Category} from "./Category.ts";
import {User} from "./User.ts";
import {Photo} from "./Photo.ts";
import {ManyToOne} from "../../../../../src/decorator/relations/ManyToOne.ts";
import {Counters} from "./Counters.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    title: string;

    @OneToMany(type => Photo, photo => photo.post)
    photos: Photo[];

    @ManyToOne(type => User)
    user: User;

    @ManyToMany(type => Category)
    @JoinTable()
    categories: Category[];

    @Column(type => Counters)
    counters: Counters;

}

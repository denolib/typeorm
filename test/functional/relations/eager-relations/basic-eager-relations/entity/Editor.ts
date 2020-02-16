import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {OneToOne} from "../../../../../../src/decorator/relations/OneToOne.ts";
import {JoinColumn} from "../../../../../../src/decorator/relations/JoinColumn.ts";
import {User} from "./User.ts";
import {ManyToOne} from "../../../../../../src/decorator/relations/ManyToOne.ts";
import {Post} from "./Post.ts";

@Entity()
export class Editor {

    @OneToOne(type => User, { eager: true, primary: true })
    @JoinColumn()
    user: User;

    @ManyToOne(type => Post, { primary: true })
    post: Post;

}

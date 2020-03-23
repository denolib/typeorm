import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {ManyToOne} from "../../../../../../src/decorator/relations/ManyToOne.ts";
import {Event} from "./Event.ts";
import {User} from "./User.ts";

@Entity()
export class EventMember {

    @ManyToOne(type => Event, event => event.members, { primary: true })
    event!: Event;

    @ManyToOne(type => User, user => user.members, { primary: true })
    user!: User;

}

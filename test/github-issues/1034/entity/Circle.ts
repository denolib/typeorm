import { User} from "./User.ts";
import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {ManyToMany} from "../../../../src/decorator/relations/ManyToMany.ts";
import {JoinTable} from "../../../../src/decorator/relations/JoinTable.ts";

@Entity()
export class Circle {

    /**
     * Circle's identifier
     */
    @PrimaryGeneratedColumn({type: "bigint"})
    private id: string;

    /**
     * Circle's user
     *
     * You have to use getter and setter
     */
    @ManyToMany((type) => User, (user) => "circles")
    @JoinTable({name: "circle_users_user"})
    private users: Promise<User[]>;

    /**
     * Getter identifier
     *
     * @returns {number}
     */
    public getId(): string {
        return this.id;
    }

    /**
     * Setter identifier
     *
     * @param id new identifier value
     */
    public setId(id: string): void {
        this.id = id;
    }

    /**
     * Setter user
     *
     * @param {Promise<User[]>} users
     */
    public setUsers(users: Promise<User[]>): void {
        this.users = users;
    }


    /**
     * Getter user
     *
     * @returns {User[]}
     */
    public getUsers(): Promise<User[]> {
        return this.users;
    }
}

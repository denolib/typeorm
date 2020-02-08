import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Entity} from "../../../../src/decorator/entity/Entity.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    title: string;

    constructor(id: number, title: string) {
        this.id = id;
        this.title = title;
    }
}

export default {
  type: "mysql",
  name: "test-conn",
  host: "localhost",
  port: 3306,
  username: "test",
  password: "test",
  database: "test",
  logging: false,
  entities: [Post],
};

import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String, name: "title" })
    private _title: string;

    @Column({ type: String })
    text: string;

    set title(title: string) {
        this._title = title;
    }

    get title(): string {
        return this._title;
    }

}

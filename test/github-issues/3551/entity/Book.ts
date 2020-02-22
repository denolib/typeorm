import { Entity, ObjectIdColumn, Column/*, ObjectID*/ } from "../../../../src/index.ts";

export class Page {
    @Column({ type: Number })
    number: number;
}

export class Chapter {
    @Column({ type: String })
    title: string;

    @Column(type => Page)
    pages: Page[];
}

@Entity()
export class Book {
    @ObjectIdColumn()
    id: /*ObjectID*/any; // TODO(uki00a) uncomment this when MongoDriver is implemented.

    @Column({ type: String })
    title: string;

    @Column(type => Chapter)
    chapters: Chapter[];
}

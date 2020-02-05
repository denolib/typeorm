import { Column } from "../../../../../src/decorator/columns/Column.ts";

export class Information {

    @Column({ name: "descr", type: String })
    description: string;
}

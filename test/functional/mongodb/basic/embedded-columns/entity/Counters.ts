import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {Information} from "./Information.ts";
import {ExtraInformation} from "./ExtraInformation.ts";

export class Counters {

    @Column({ type: Number })
    likes: number;

    @Column({ type: Number })
    comments: number;

    @Column({ type: Number })
    favorites: number;

    @Column(type => Information)
    information: Information;

    @Column(type => ExtraInformation)
    extraInformation: ExtraInformation;
}

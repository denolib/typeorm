import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {EditHistory} from "./EditHistory.ts";

export class ExtraInformation {

    @Column(type => EditHistory)
    lastEdit: EditHistory;

}

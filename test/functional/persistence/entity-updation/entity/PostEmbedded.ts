import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";
import {UpdateDateColumn} from "../../../../../src/decorator/columns/UpdateDateColumn.ts";
import {CreateDateColumn} from "../../../../../src/decorator/columns/CreateDateColumn.ts";
import {VersionColumn} from "../../../../../src/decorator/columns/VersionColumn.ts";

export class PostEmbedded {

    @PrimaryColumn({ type: Number })
    secondId!: number;

    @CreateDateColumn({ type: Date })
    createDate!: Date;

    @UpdateDateColumn({ type: Date })
    updateDate!: Date;

    @VersionColumn({ type: Number })
    version!: number;

}

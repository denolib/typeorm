import {TableColumnOptions} from "./TableColumnOptions.ts";
import {TableIndexOptions} from "./TableIndexOptions.ts";
import {TableForeignKeyOptions} from "./TableForeignKeyOptions.ts";
import {TableUniqueOptions} from "./TableUniqueOptions.ts";
import {TableCheckOptions} from "./TableCheckOptions.ts";
import {TableExclusionOptions} from "./TableExclusionOptions.ts";

/**
 * Table options.
 */
export interface TableOptions {

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    /**
     * Table name.
     */
    name: string;

    /**
     * Table columns.
     */
    columns?: TableColumnOptions[];

    /**
     * Table indices.
     */
    indices?: TableIndexOptions[];

    /**
     * Table foreign keys.
     */
    foreignKeys?: TableForeignKeyOptions[];

    /**
     * Table unique constraints.
     */
    uniques?: TableUniqueOptions[];

    /**
     * Table check constraints.
     */
    checks?: TableCheckOptions[];

    /**
     * Table check constraints.
     */
    exclusions?: TableExclusionOptions[];

    /**
     * Indicates if table was just created.
     * This is needed, for example to check if we need to skip primary keys creation
     * for new tables.
     */
    justCreated?: boolean;

    /**
     * Table engine.
     */
    engine?: string;

}

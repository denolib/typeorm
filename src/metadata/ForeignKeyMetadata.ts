import {ColumnMetadata} from "./ColumnMetadata.ts";
import {EntityMetadata} from "./EntityMetadata.ts";
import {NamingStrategyInterface} from "../naming-strategy/NamingStrategyInterface.ts";
import {DeferrableType} from "./types/DeferrableType.ts";
import {OnDeleteType} from "./types/OnDeleteType.ts";
import {OnUpdateType} from "./types/OnUpdateType.ts";

/**
 * Contains all information about entity's foreign key.
 */
export class ForeignKeyMetadata {

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    /**
     * Entity metadata where this foreign key is.
     */
    entityMetadata: EntityMetadata;

    /**
     * Entity metadata which this foreign key references.
     */
    referencedEntityMetadata: EntityMetadata;

    /**
     * Array of columns of this foreign key.
     */
    columns: ColumnMetadata[] = [];

    /**
     * Array of referenced columns.
     */
    referencedColumns: ColumnMetadata[] = [];

    /**
     * What to do with a relation on deletion of the row containing a foreign key.
     */
    onDelete?: OnDeleteType;

    /**
     * What to do with a relation on update of the row containing a foreign key.
     */
    onUpdate?: OnUpdateType;

    /**
     * When to check the constraints of a foreign key.
     */
    deferrable?: DeferrableType;

    /**
     * Gets the table name to which this foreign key is referenced.
     */
    referencedTablePath!: string;

    /**
     * Gets foreign key name.
     */
    name!: string;

    /**
     * Gets array of column names.
     */
    columnNames: string[] = [];

    /**
     * Gets array of referenced column names.
     */
    referencedColumnNames: string[] = [];

    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------

    constructor(options: {
        entityMetadata: EntityMetadata,
        referencedEntityMetadata: EntityMetadata,
        namingStrategy?: NamingStrategyInterface,
        columns: ColumnMetadata[],
        referencedColumns: ColumnMetadata[],
        onDelete?: OnDeleteType,
        onUpdate?: OnUpdateType,
        deferrable?: DeferrableType,
    }) {
        this.entityMetadata = options.entityMetadata;
        this.referencedEntityMetadata = options.referencedEntityMetadata;
        this.columns = options.columns;
        this.referencedColumns = options.referencedColumns;
        this.onDelete = options.onDelete || "NO ACTION";
        this.onUpdate = options.onUpdate || "NO ACTION";
        this.deferrable = options.deferrable;
        if (options.namingStrategy)
            this.build(options.namingStrategy);
    }

    // ---------------------------------------------------------------------
    // Public Methods
    // ---------------------------------------------------------------------

    /**
     * Builds some depend foreign key properties.
     * Must be called after all entity metadatas and their columns are built.
     */
    build(namingStrategy: NamingStrategyInterface) {
        this.columnNames = this.columns.map(column => column.databaseName);
        this.referencedColumnNames = this.referencedColumns.map(column => column.databaseName);
        this.referencedTablePath = this.referencedEntityMetadata.tablePath;
        this.name = namingStrategy.foreignKeyName(this.entityMetadata.tablePath, this.columnNames, this.referencedTablePath, this.referencedColumnNames);
    }

}

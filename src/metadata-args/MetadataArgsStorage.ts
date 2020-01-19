import {RelationMetadataArgs} from "./RelationMetadataArgs.ts";
import {ColumnMetadataArgs} from "./ColumnMetadataArgs.ts";
import {RelationCountMetadataArgs} from "./RelationCountMetadataArgs.ts";
import {IndexMetadataArgs} from "./IndexMetadataArgs.ts";
import {EntityListenerMetadataArgs} from "./EntityListenerMetadataArgs.ts";
import {TableMetadataArgs} from "./TableMetadataArgs.ts";
import {NamingStrategyMetadataArgs} from "./NamingStrategyMetadataArgs.ts";
import {JoinTableMetadataArgs} from "./JoinTableMetadataArgs.ts";
import {JoinColumnMetadataArgs} from "./JoinColumnMetadataArgs.ts";
import {EmbeddedMetadataArgs} from "./EmbeddedMetadataArgs.ts";
import {EntitySubscriberMetadataArgs} from "./EntitySubscriberMetadataArgs.ts";
import {RelationIdMetadataArgs} from "./RelationIdMetadataArgs.ts";
import {InheritanceMetadataArgs} from "./InheritanceMetadataArgs.ts";
import {DiscriminatorValueMetadataArgs} from "./DiscriminatorValueMetadataArgs.ts";
import {EntityRepositoryMetadataArgs} from "./EntityRepositoryMetadataArgs.ts";
import {TransactionEntityMetadataArgs} from "./TransactionEntityMetadataArgs.ts";
import {TransactionRepositoryMetadataArgs} from "./TransactionRepositoryMetadataArgs.ts";
import {MetadataUtils} from "../metadata-builder/MetadataUtils.ts";
import {GeneratedMetadataArgs} from "./GeneratedMetadataArgs.ts";
import {TreeMetadataArgs} from "./TreeMetadataArgs.ts";
import {UniqueMetadataArgs} from "./UniqueMetadataArgs.ts";
import {CheckMetadataArgs} from "./CheckMetadataArgs.ts";
import {ExclusionMetadataArgs} from "./ExclusionMetadataArgs.ts";

/**
 * Storage all metadatas args of all available types: tables, columns, subscribers, relations, etc.
 * Each metadata args represents some specifications of what it represents.
 * MetadataArgs used to create a real Metadata objects.
 */
export class MetadataArgsStorage {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    readonly tables: TableMetadataArgs[] = [];
    readonly trees: TreeMetadataArgs[] = [];
    readonly entityRepositories: EntityRepositoryMetadataArgs[] = [];
    readonly transactionEntityManagers: TransactionEntityMetadataArgs[] = [];
    readonly transactionRepositories: TransactionRepositoryMetadataArgs[] = [];
    readonly namingStrategies: NamingStrategyMetadataArgs[] = [];
    readonly entitySubscribers: EntitySubscriberMetadataArgs[] = [];
    readonly indices: IndexMetadataArgs[] = [];
    readonly uniques: UniqueMetadataArgs[] = [];
    readonly checks: CheckMetadataArgs[] = [];
    readonly exclusions: ExclusionMetadataArgs[] = [];
    readonly columns: ColumnMetadataArgs[] = [];
    readonly generations: GeneratedMetadataArgs[] = [];
    readonly relations: RelationMetadataArgs[] = [];
    readonly joinColumns: JoinColumnMetadataArgs[] = [];
    readonly joinTables: JoinTableMetadataArgs[] = [];
    readonly entityListeners: EntityListenerMetadataArgs[] = [];
    readonly relationCounts: RelationCountMetadataArgs[] = [];
    readonly relationIds: RelationIdMetadataArgs[] = [];
    readonly embeddeds: EmbeddedMetadataArgs[] = [];
    readonly inheritances: InheritanceMetadataArgs[] = [];
    readonly discriminatorValues: DiscriminatorValueMetadataArgs[] = [];

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    filterTables(target: Function|string): TableMetadataArgs[];
    filterTables(target: (Function|string)[]): TableMetadataArgs[];
    filterTables(target: (Function|string)|(Function|string)[]): TableMetadataArgs[] {
        return this.filterByTarget(this.tables, target);
    }

    filterColumns(target: Function|string): ColumnMetadataArgs[];
    filterColumns(target: (Function|string)[]): ColumnMetadataArgs[];
    filterColumns(target: (Function|string)|(Function|string)[]): ColumnMetadataArgs[] {
        return this.filterByTargetAndWithoutDuplicateProperties(this.columns, target);
    }

    findGenerated(target: Function|string, propertyName: string): GeneratedMetadataArgs|undefined;
    findGenerated(target: (Function|string)[], propertyName: string): GeneratedMetadataArgs|undefined;
    findGenerated(target: (Function|string)|(Function|string)[], propertyName: string): GeneratedMetadataArgs|undefined {
        return this.generations.find(generated => {
            return (target instanceof Array ? target.indexOf(generated.target) !== -1 : generated.target === target) && generated.propertyName === propertyName;
        });
    }

    findTree(target: (Function|string)|(Function|string)[]): TreeMetadataArgs|undefined {
        return this.trees.find(tree => {
            return (target instanceof Array ? target.indexOf(tree.target) !== -1 : tree.target === target);
        });
    }

    filterRelations(target: Function|string): RelationMetadataArgs[];
    filterRelations(target: (Function|string)[]): RelationMetadataArgs[];
    filterRelations(target: (Function|string)|(Function|string)[]): RelationMetadataArgs[] {
        return this.filterByTargetAndWithoutDuplicateProperties(this.relations, target);
    }

    filterRelationIds(target: Function|string): RelationIdMetadataArgs[];
    filterRelationIds(target: (Function|string)[]): RelationIdMetadataArgs[];
    filterRelationIds(target: (Function|string)|(Function|string)[]): RelationIdMetadataArgs[] {
        return this.filterByTargetAndWithoutDuplicateProperties(this.relationIds, target);
    }

    filterRelationCounts(target: Function|string): RelationCountMetadataArgs[];
    filterRelationCounts(target: (Function|string)[]): RelationCountMetadataArgs[];
    filterRelationCounts(target: (Function|string)|(Function|string)[]): RelationCountMetadataArgs[] {
        return this.filterByTargetAndWithoutDuplicateProperties(this.relationCounts, target);
    }

    filterIndices(target: Function|string): IndexMetadataArgs[];
    filterIndices(target: (Function|string)[]): IndexMetadataArgs[];
    filterIndices(target: (Function|string)|(Function|string)[]): IndexMetadataArgs[] {
        // todo: implement parent-entity overrides?
        return this.indices.filter(index => {
            return target instanceof Array ? target.indexOf(index.target) !== -1 : index.target === target;
        });
    }

    filterUniques(target: Function|string): UniqueMetadataArgs[];
    filterUniques(target: (Function|string)[]): UniqueMetadataArgs[];
    filterUniques(target: (Function|string)|(Function|string)[]): UniqueMetadataArgs[] {
        return this.uniques.filter(unique => {
            return target instanceof Array ? target.indexOf(unique.target) !== -1 : unique.target === target;
        });
    }

    filterChecks(target: Function|string): CheckMetadataArgs[];
    filterChecks(target: (Function|string)[]): CheckMetadataArgs[];
    filterChecks(target: (Function|string)|(Function|string)[]): CheckMetadataArgs[] {
        return this.checks.filter(check => {
            return target instanceof Array ? target.indexOf(check.target) !== -1 : check.target === target;
        });
    }

    filterExclusions(target: Function|string): ExclusionMetadataArgs[];
    filterExclusions(target: (Function|string)[]): ExclusionMetadataArgs[];
    filterExclusions(target: (Function|string)|(Function|string)[]): ExclusionMetadataArgs[] {
        return this.exclusions.filter(exclusion => {
            return target instanceof Array ? target.indexOf(exclusion.target) !== -1 : exclusion.target === target;
        });
    }

    filterListeners(target: Function|string): EntityListenerMetadataArgs[];
    filterListeners(target: (Function|string)[]): EntityListenerMetadataArgs[];
    filterListeners(target: (Function|string)|(Function|string)[]): EntityListenerMetadataArgs[] {
        return this.filterByTarget(this.entityListeners, target);
    }

    filterEmbeddeds(target: Function|string): EmbeddedMetadataArgs[];
    filterEmbeddeds(target: (Function|string)[]): EmbeddedMetadataArgs[];
    filterEmbeddeds(target: (Function|string)|(Function|string)[]): EmbeddedMetadataArgs[] {
        return this.filterByTargetAndWithoutDuplicateEmbeddedProperties(this.embeddeds, target);
    }

    findJoinTable(target: Function|string, propertyName: string): JoinTableMetadataArgs|undefined {
        return this.joinTables.find(joinTable => {
            return joinTable.target === target && joinTable.propertyName === propertyName;
        });
    }

    filterJoinColumns(target: Function|string, propertyName: string): JoinColumnMetadataArgs[] {
        // todo: implement parent-entity overrides?
        return this.joinColumns.filter(joinColumn => {
            return joinColumn.target === target && joinColumn.propertyName === propertyName;
        });
    }

    filterSubscribers(target: Function|string): EntitySubscriberMetadataArgs[];
    filterSubscribers(target: (Function|string)[]): EntitySubscriberMetadataArgs[];
    filterSubscribers(target: (Function|string)|(Function|string)[]): EntitySubscriberMetadataArgs[] {
        return this.filterByTarget(this.entitySubscribers, target);
    }

    filterNamingStrategies(target: Function|string): NamingStrategyMetadataArgs[];
    filterNamingStrategies(target: (Function|string)[]): NamingStrategyMetadataArgs[];
    filterNamingStrategies(target: (Function|string)|(Function|string)[]): NamingStrategyMetadataArgs[] {
        return this.filterByTarget(this.namingStrategies, target);
    }

    filterTransactionEntityManagers(target: Function|string, propertyName: string): TransactionEntityMetadataArgs[] {
        return this.transactionEntityManagers.filter(transactionEm => {
            return (target instanceof Array ? target.indexOf(transactionEm.target) !== -1 : transactionEm.target === target) && transactionEm.methodName === propertyName;
        });
    }

    filterTransactionRepository(target: Function|string, propertyName: string): TransactionRepositoryMetadataArgs[] {
        return this.transactionRepositories.filter(transactionEm => {
            return (target instanceof Array ? target.indexOf(transactionEm.target) !== -1 : transactionEm.target === target) && transactionEm.methodName === propertyName;
        });
    }

    filterSingleTableChildren(target: Function|string): TableMetadataArgs[] {
        return this.tables.filter(table => {
            return table.target instanceof Function
                && target instanceof Function
                && MetadataUtils.isInherited(table.target, target)
                && table.type === "entity-child";
        });
    }

    findInheritanceType(target: Function|string): InheritanceMetadataArgs|undefined {
        return this.inheritances.find(inheritance => inheritance.target === target);
    }

    findDiscriminatorValue(target: Function|string): DiscriminatorValueMetadataArgs|undefined {
        return this.discriminatorValues.find(discriminatorValue => discriminatorValue.target === target);
    }

    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------

    /**
     * Filters given array by a given target or targets.
     */
    protected filterByTarget<T extends { target: Function|string }>(array: T[], target: (Function|string)|(Function|string)[]): T[] {
        return array.filter(table => {
            return target instanceof Array ? target.indexOf(table.target) !== -1 : table.target === target;
        });
    }

    /**
     * Filters given array by a given target or targets and prevents duplicate property names.
     */
    protected filterByTargetAndWithoutDuplicateProperties<T extends { target: Function|string, propertyName: string }>(array: T[], target: (Function|string)|(Function|string)[]): T[] {
        const newArray: T[] = [];
        array.forEach(item => {
            const sameTarget = target instanceof Array ? target.indexOf(item.target) !== -1 : item.target === target;
            if (sameTarget) {
                if (!newArray.find(newItem => newItem.propertyName === item.propertyName))
                    newArray.push(item);
            }
        });
        return newArray;
    }

    /**
     * Filters given array by a given target or targets and prevents duplicate embedded property names.
     */
    protected filterByTargetAndWithoutDuplicateEmbeddedProperties<T extends EmbeddedMetadataArgs>(array: T[], target: (Function|string)|(Function|string)[]): T[] {
        const newArray: T[] = [];
        array.forEach(item => {
            const sameTarget = target instanceof Array ? target.indexOf(item.target) !== -1 : item.target === target;
            if (sameTarget) {
                const isDuplicateEmbeddedProperty = newArray.find((newItem: EmbeddedMetadataArgs): boolean =>
                    newItem.prefix === item.prefix && newItem.propertyName === item.propertyName
                );
                if (!isDuplicateEmbeddedProperty)
                    newArray.push(item);
            }
        });
        return newArray;
    }

}

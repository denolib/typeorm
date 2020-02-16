import {runTests} from "./test/deps/mocha.ts";

import "./test/integration/sample1-simple-entity.ts";
import "./test/functional/cascades/cascade-insert-from-both-sides/cascade-insert-from-both-sides.ts";
import "./test/functional/columns/embedded-columns/columns-embedded-columns.ts";
import "./test/functional/columns/getters-setters/columns-getters-setters.ts";
import "./test/functional/columns/no-select/columns-no-select.ts";
import "./test/functional/columns/readonly/columns-readonly.ts";
import "./test/functional/columns/update-insert/columns-update-insert.ts";
import "./test/functional/columns/value-transformer/value-transformer.ts";
import "./test/functional/connection/connection.ts";
import "./test/functional/connection-manager/connection-manager.ts";
import "./test/functional/connection-options-reader/connection-options-reader.ts";
import "./test/functional/cube/postgres/cube-postgres.ts";
import "./test/functional/database-schema/column-collation/cockroach/column-collation-cockroach.ts";
import "./test/functional/database-schema/column-collation/mssql/column-collation-mssql.ts";
import "./test/functional/database-schema/column-collation/mysql/column-collation-mysql.ts";
import "./test/functional/database-schema/column-collation/postgres/column-collation-postgres.ts";
import "./test/functional/database-schema/column-collation/sqlite/column-collation-sqlite.ts";
import "./test/functional/database-schema/column-length/mssql/column-length-mssql.ts";
import "./test/functional/database-schema/column-length/mysql/column-length-mysql.ts";
import "./test/functional/database-schema/column-length/postgres/column-length-postgres.ts";
import "./test/functional/database-schema/column-length/sap/column-length-sap.ts";
import "./test/functional/database-schema/column-length/sqlite/column-length-sqlite.ts";
import "./test/functional/database-schema/column-types/cockroachdb/column-types-cockroach.ts";
import "./test/functional/database-schema/column-types/mssql/column-types-mssql.ts";
import "./test/functional/database-schema/column-types/mysql/column-types-mysql.ts";
import "./test/functional/database-schema/column-types/oracle/column-types-oracle.ts";
import "./test/functional/database-schema/column-types/postgres/column-types-postgres.ts";
import "./test/functional/database-schema/column-types/postgres-enum/postgres-enum.ts";
import "./test/functional/database-schema/column-types/sap/column-types-sap.ts";
import "./test/functional/database-schema/column-types/sqlite/column-types-sqlite.ts";
import "./test/functional/database-schema/column-width/mysql/column-width.ts";
import "./test/functional/database-schema/enums/enums.ts";
import "./test/functional/database-schema/enums-array/enums-array.ts";
import "./test/functional/database-schema/indices/indices-create-modify.ts";
import "./test/functional/database-schema/mssql-parameters/mssql-parameters.ts";
import "./test/functional/database-schema/rowid-column/rowid-column.ts";
import "./test/functional/database-schema/sequences/sequence-create-test.ts";
import "./test/functional/database-schema/simple-enums/enums.ts";
import "./test/functional/database-schema/simple-enums-array/enums-array.ts";
import "./test/functional/decorators/embedded/query-builder-embedded.ts";
import "./test/functional/decorators/relation-count/relation-count-many-to-many/relation-count-decorator-many-to-many.ts";
import "./test/functional/decorators/relation-count/relation-count-one-to-many/relation-count-decorator-one-to-many.ts";
import "./test/functional/decorators/relation-id/relation-id-many-to-many/relation-id-decorator-many-to-many.ts";
import "./test/functional/decorators/relation-id/relation-id-many-to-one/relation-id-decorator-many-to-one.ts";
import "./test/functional/decorators/relation-id/relation-id-one-to-many/relation-id-decorator-one-to-many.ts";
import "./test/functional/decorators/relation-id/relation-id-one-to-one/relation-id-decorator-one-to-one.ts";
import "./test/functional/deferrable/deferrable.ts";
import "./test/functional/driver/convert-to-entity/convert-to-entity.ts";
import "./test/functional/embedded/basic-functionality/basic-functionality.ts";
import "./test/functional/embedded/embedded-listeners/embedded-listeners.ts";
import "./test/functional/embedded/embedded-many-to-many-case1/embedded-many-to-many-case1.ts";
import "./test/functional/embedded/embedded-many-to-many-case2/embedded-many-to-many-case2.ts";
import "./test/functional/embedded/embedded-many-to-many-case3/embedded-many-to-many-case3.ts";
import "./test/functional/embedded/embedded-many-to-many-case4/embedded-many-to-many-case4.ts";
import "./test/functional/embedded/embedded-many-to-many-case5/embedded-many-to-many-case5.ts";
import "./test/functional/embedded/embedded-many-to-one-case1/embedded-many-to-one-case1.ts";
import "./test/functional/embedded/embedded-many-to-one-case2/embedded-many-to-one-case2.ts";
import "./test/functional/embedded/embedded-many-to-one-case3/embedded-many-to-one-case3.ts";
import "./test/functional/embedded/embedded-many-to-one-case4/embedded-many-to-one-case4.ts";
import "./test/functional/embedded/embedded-many-to-one-case5/embedded-many-to-one-case5.ts";
import "./test/functional/embedded/embedded-one-to-one/embedded-one-to-one.ts";
import "./test/functional/embedded/embedded-with-special-columns/embedded-with-special-columns.ts";
import "./test/functional/embedded/multiple-primary-columns/multiple-primary-columns.ts";
import "./test/functional/embedded/multiple-primary-columns-with-nested-embed/multiple-primary-columns-with-nested-embed.ts";
import "./test/functional/embedded/optional-embedded-listeners/optional-embedded-listeners.ts";
import "./test/functional/embedded/outer-primary-column/outer-primary-column.ts";
import "./test/functional/embedded/prefix/embedded-prefix.ts";
import "./test/functional/entity-listeners/entity-listeners.ts";
import "./test/functional/entity-metadata-validator/basic/entity-metadata-validator.ts";
import "./test/functional/entity-metadata-validator/initialized-relations/validator-intialized-relations.ts";
import "./test/functional/entity-model/entity-model.ts";
import "./test/functional/entity-schema/basic/entity-schema-basic.ts";
import "./test/functional/entity-schema/checks/checks-basic.ts";
import "./test/functional/entity-schema/columns/mysql/columns-mysql.ts";
import "./test/functional/entity-schema/exclusions/exclusions-basic.ts";
import "./test/functional/entity-schema/indices/basic/indices-basic.ts";
import "./test/functional/entity-schema/indices/mysql/indices-mysql.ts";
import "./test/functional/entity-schema/target/entity-schema-target.ts";
import "./test/functional/entity-schema/uniques/uniques-basic.ts";
import "./test/functional/indices/basic-unique-index-test/basic-unique-index-test.ts";
import "./test/functional/indices/conditional-index/conditional-index.ts";
import "./test/functional/indices/embeddeds-index-test/embeddeds-unique-index-test.ts";
import "./test/functional/json/jsonb.ts";
import "./test/functional/metadata-builder/column-metadata/column-metadata.ts";
import "./test/functional/metadata-builder/metadata-args-storage/metadata-args-storage.ts";
import "./test/functional/migrations/show-command/command.ts";
import "./test/functional/mongodb/basic/array-columns/mongodb-array-columns.ts";
import "./test/functional/mongodb/basic/embedded-columns/mongodb-embedded-columns.ts";
import "./test/functional/mongodb/basic/embedded-columns-listeners/mongodb-embedded-columns-listeners.ts";
import "./test/functional/mongodb/basic/mongo-embeddeds-index/mongo-embeddeds-index.ts";
import "./test/functional/mongodb/basic/mongo-index/mongo-index.ts";
import "./test/functional/mongodb/basic/mongo-repository/mongo-repository.ts";
import "./test/functional/mongodb/basic/object-id/mongodb-object-id.ts";
import "./test/functional/mongodb/basic/repository-actions/mongodb-repository-actions.ts";
import "./test/functional/mongodb/basic/timestampable-columns/timestampable-columns.ts";
import "./test/functional/multi-schema-and-database/custom-junction-database/custom-junction-database.ts";
import "./test/functional/multi-schema-and-database/custom-junction-schema/custom-junction-schema.ts";
import "./test/functional/multi-schema-and-database/multi-schema-and-database-basic-functionality/multi-schema-and-database-basic-functionality.ts";
import "./test/functional/persistence/basic-functionality/persistence-basic-functionality.ts";
import "./test/functional/persistence/bulk-insert-remove-optimization/bulk-insert-remove-optimization.ts";
import "./test/functional/persistence/cascades/cascades-example1/cascades-example1.ts";
import "./test/functional/persistence/cascades/cascades-example2/cascades-example2.ts";
import "./test/functional/persistence/cascades/cascades-remove/cascades-remove.ts";
import "./test/functional/persistence/custom-column-name-pk/custom-column-name-pk.ts";
import "./test/functional/persistence/custom-column-names/persistence-custom-column-names.ts";
import "./test/functional/persistence/entity-updation/persistence-entity-updation.ts";
import "./test/functional/persistence/insert/update-relation-columns-after-insertion/update-relation-columns-after-insertion.ts";
import "./test/functional/persistence/many-to-many/persistence-many-to-many.ts";
import "./test/functional/persistence/many-to-one-bi-directional/persistence-many-to-one-bi-directional.ts";
import "./test/functional/persistence/many-to-one-uni-directional/persistence-many-to-one-uni-directional.ts";
import "./test/functional/persistence/multi-primary-key/multi-primary-key.ts";
import "./test/functional/persistence/multi-primary-key-on-both-sides/multi-primary-key.ts";
import "./test/functional/persistence/null-and-default-behaviour/null-and-default-behaviour.ts";
import "./test/functional/persistence/one-to-many/persistence-one-to-many.ts";
import "./test/functional/persistence/one-to-one/persistence-one-to-one.ts";
import "./test/functional/persistence/partial-persist/partial-persist.ts";
import "./test/functional/persistence/persistence-options/chunks/persistence-options-chunks.ts";
import "./test/functional/persistence/persistence-options/listeners/persistence-options-listeners.ts";
import "./test/functional/persistence/persistence-options/transaction/persistence-options-transaction.ts";
import "./test/functional/persistence/persistence-order/persistence-order.ts";
import "./test/functional/persistence/remove-topological-order/remove-topolotical-order.ts";
import "./test/functional/query-builder/brackets/query-builder-brackets.ts";
import "./test/functional/query-builder/cache/query-builder-cache.ts";
import "./test/functional/query-builder/delete/query-builder-delete.ts";
import "./test/functional/query-builder/distinct-on/query-builder-distinct-on.ts";
import "./test/functional/query-builder/enabling-transaction/enabling-transaction.ts";
import "./test/functional/query-builder/entity-updation/entity-updation.ts";
import "./test/functional/query-builder/insert/query-builder-insert.ts";
import "./test/functional/query-builder/insert-on-conflict/query-builder-insert-on-conflict.ts";
import "./test/functional/query-builder/join/query-builder-joins.ts";
import "./test/functional/query-builder/locking/query-builder-locking.ts";
import "./test/functional/query-builder/order-by/query-builder-order-by.ts";
import "./test/functional/query-builder/relation-count/relation-count-many-to-many/load-relation-count-and-map-many-to-many.ts";
import "./test/functional/query-builder/relation-count/relation-count-one-to-many/load-relation-count-and-map-one-to-many.ts";
import "./test/functional/query-builder/relation-id/many-to-many/basic-functionality/basic-functionality.ts";
import "./test/functional/query-builder/relation-id/many-to-many/embedded/embedded.ts";
import "./test/functional/query-builder/relation-id/many-to-many/embedded-with-multiple-pk/embedded-with-multiple-pk.ts";
import "./test/functional/query-builder/relation-id/many-to-many/multiple-pk/multiple-pk.ts";
import "./test/functional/query-builder/relation-id/many-to-one/basic-functionality/basic-functionality.ts";
import "./test/functional/query-builder/relation-id/many-to-one/embedded/embedded.ts";
import "./test/functional/query-builder/relation-id/many-to-one/embedded-with-multiple-pk/embedded-with-multiple-pk.ts";
import "./test/functional/query-builder/relation-id/many-to-many/multiple-pk/multiple-pk.ts";
import "./test/functional/query-builder/relation-id/one-to-many/basic-functionality/basic-functionality.ts";
import "./test/functional/query-builder/relation-id/one-to-many/embedded/embedded.ts";
import "./test/functional/query-builder/relation-id/one-to-many/embedded-with-multiple-pk/embedded-with-multiple-pk.ts";
import "./test/functional/query-builder/relation-id/one-to-many/multiple-pk/multiple-pk.ts";
import "./test/functional/query-builder/relation-id/one-to-one/basic-functionality/basic-functionality.ts";
import "./test/functional/query-builder/relation-id/one-to-one/embedded/embedded.ts";
import "./test/functional/query-builder/relation-id/one-to-one/embedded-with-multiple-pk/embedded-with-multiple-pk.ts";
import "./test/functional/query-builder/relation-id/one-to-one/multiple-pk/multiple-pk.ts";
import "./test/functional/query-builder/relational/with-many/query-builder-relational-add-remove-many-to-many-inverse.ts";
import "./test/functional/query-builder/relational/with-many/query-builder-relational-add-remove-many-to-many.ts";
import "./test/functional/query-builder/relational/with-many/query-builder-relational-add-remove-one-to-many.ts";
import "./test/functional/query-builder/relational/with-many/query-builder-relational-load-many.ts";
import "./test/functional/query-builder/relational/with-one/query-builder-relational-load-one.ts";
import "./test/functional/query-builder/relational/with-one/query-builder-relational-set-many-to-one.ts";
import "./test/functional/query-builder/relational/with-one/query-builder-relational-set-one-to-one-inverse.ts";
import "./test/functional/query-builder/relational/with-one/query-builder-relational-set-one-to-one.ts";
import "./test/functional/query-builder/select/query-builder-select.ts";
import "./test/functional/query-builder/subquery/query-builder-subquery.ts";
import "./test/functional/query-builder/update/query-builder-update.ts";
import "./test/functional/query-runner/add-column.ts";
import "./test/functional/query-runner/change-column.ts";
import "./test/functional/query-runner/create-and-drop-database.ts";
import "./test/functional/query-runner/create-and-drop-schema.ts";
import "./test/functional/query-runner/create-check-constraint.ts";
import "./test/functional/query-runner/create-exclusion-constraint.ts";
import "./test/functional/query-runner/create-foreign-key.ts";
import "./test/functional/query-runner/create-index.ts";
import "./test/functional/query-runner/create-primary-key.ts";
import "./test/functional/query-runner/create-table.ts";
import "./test/functional/query-runner/create-unique-constraint.ts";
import "./test/functional/query-runner/drop-check-constraint.ts";
import "./test/functional/query-runner/drop-column.ts";
import "./test/functional/query-runner/drop-exclusion-constraint.ts";
import "./test/functional/query-runner/drop-foreign-key.ts";
import "./test/functional/query-runner/drop-index.ts";
import "./test/functional/query-runner/drop-primary-key.ts";
import "./test/functional/query-runner/drop-table.ts";
import "./test/functional/query-runner/drop-unique-constraint.ts";
import "./test/functional/query-runner/rename-column.ts";
import "./test/functional/query-runner/rename-table.ts";
import "./test/functional/relations/custom-referenced-column-name/custom-referenced-column-name.ts";
import "./test/functional/relations/eager-relations/basic-eager-relations/basic-eager-relations.ts";
import "./test/functional/relations/eager-relations/circular-eager-relations/circular-eager-relations.ts";
import "./test/functional/relations/lazy-relations/basic-lazy-relation/basic-lazy-relations.ts";
import "./test/functional/relations/lazy-relations/named-columns/named-columns-lazy-relations.ts";
import "./test/functional/relations/lazy-relations/named-tables/named-tables-lazy-relations.ts";
import "./test/functional/relations/lazy-relations/named-tables-and-columns/named-tables-and-columns-lazy-relations.ts";
import "./test/functional/relations/multiple-primary-keys/multiple-primary-keys-many-to-many/multiple-primary-keys-many-to-many.ts";
import "./test/functional/relations/multiple-primary-keys/multiple-primary-keys-many-to-one/multiple-primary-keys-many-to-one.ts";
import "./test/functional/relations/multiple-primary-keys/multiple-primary-keys-one-to-one/multiple-primary-keys-one-to-one.ts";
import "./test/functional/relations/multiple-primary-keys/multiple-primary-keys-other-cases/multiple-primary-keys-other-cases.ts";
import "./test/functional/relations/relation-mapped-to-different-name-column/relation-mapped-to-different-name-column.ts";
import "./test/functional/relations/relation-with-primary-key/relation-with-primary-key.ts";
import "./test/functional/repository/basic-methods/repository-basic-methods.ts";
import "./test/functional/repository/clear/repository-clear.ts";
import "./test/functional/repository/decrement/repository-decrement.ts";
import "./test/functional/repository/delete-by-id-and-ids/repository-remove-by-id-and-ids.ts";
import "./test/functional/repository/find-methods/repostiory-find-methods.ts";
import "./test/functional/repository/find-options/repository-find-options.ts";
import "./test/functional/repository/find-options-locking/find-options-locking.ts";
import "./test/functional/repository/find-options-operators/repository-find-operators.ts";
import "./test/functional/repository/find-options-relations/repository-find-options-relations.ts";
import "./test/functional/repository/increment/repository-increment.ts";
import "./test/functional/repository/set-add-remove-relations/repository-set-add-remove-relations.ts";

import "./test/functional/schema-builder/add-column.ts";
import "./test/functional/schema-builder/change-check-constraint.ts";
import "./test/functional/schema-builder/change-column.ts";
import "./test/functional/schema-builder/change-exclusion-constraint.ts";
import "./test/functional/schema-builder/change-index.ts";
import "./test/functional/schema-builder/change-unique-constraint.ts";
import "./test/functional/schema-builder/create-foreign-key.ts";
import "./test/functional/schema-builder/create-table.ts";
import "./test/functional/schema-builder/custom-db-and-schema-sync.ts";
import "./test/functional/schema-builder/drop-column.ts";
import "./test/functional/schema-builder/update-primary-keys.ts";
import "./test/functional/spatial/postgres/spatial-postgres.ts";

runTests();

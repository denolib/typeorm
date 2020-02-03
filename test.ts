import {runTests} from "./test/deps/mocha.ts";
import "./test/integration/sample1-simple-entity.ts";
import "./test/functional/cascades/cascade-insert-from-both-sides/cascade-insert-from-both-sides.ts";

runTests();

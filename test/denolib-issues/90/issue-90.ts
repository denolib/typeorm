import {runIfMain} from "../../deps/mocha.ts";
import {setupTestingConnections} from "../../utils/test-utils.ts";
import {PostgresConnectionOptions} from "../../../src/driver/postgres/PostgresConnectionOptions.ts";
import { createConnection } from "../../../src/index.ts";
import { ConnectionOptionsReader } from "../../../src/connection/ConnectionOptionsReader.ts";

describe("denolib issues > #90 Could not connect to the postgres database when TYPEORM_PORT is set", () => {
    it("can connect to postgres database when TYPEORM_PORT is set", async () => {
        const connectionOptionsArray = setupTestingConnections({
            enabledDrivers: ["postgres"],
        });

        if (connectionOptionsArray.length === 0) {
            return;
        }

        // Override environment variables.
        const connectionOptions = connectionOptionsArray[0] as PostgresConnectionOptions;
        const envVars = {
            "TYPEORM_CONNECTION": "postgres",
            "TYPEORM_PORT": String(connectionOptions.port || 5432),
            "TYPEORM_HOST": connectionOptions.host || "localhost",
            "TYPEORM_DATABASE": connectionOptions.database,
            "TYPEORM_USERNAME": connectionOptions.username,
            "TYPEORM_PASSWORD": connectionOptions.password,
        } as { [env: string]: string | undefined; };
        const origEnvVars = Object.keys(envVars).reduce((origEnv, env) => {
            origEnv[env] = Deno.env.get(env);
            return origEnv;
        }, {} as { [env: string]: string | undefined });

        for (const env of Object.keys(envVars)) {
            if (envVars[env] != null) {
                Deno.env.set(env, envVars[env]!);
            }
        }

        try {
            // Read config from `TYPEORM_*` variables.
            const options = await new ConnectionOptionsReader({
                root: Deno.cwd(),
            }).get("default");

            // We can connect to database.
            const connection = await createConnection(options);
            await connection.close();
        } finally {
            // Cleanup environment variables.
            for (const [env, value] of Object.entries(origEnvVars)) {
                if (value != null) {
                    Deno.env.set(env, value);
                } else {
                    Deno.env.delete(env);
                }
            }
        }
    });
});

runIfMain(import.meta);


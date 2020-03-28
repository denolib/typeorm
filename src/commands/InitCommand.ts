import {CommandUtils} from "./CommandUtils.ts";
import {ObjectLiteral} from "../common/ObjectLiteral.ts";
import {CommandBuilder, CommandModule, Args} from "./CliBuilder.ts";
import * as colors from "../../vendor/https/deno.land/std/fmt/colors.ts";
import {process} from "../../vendor/https/deno.land/std/node/process.ts";
import {MOD_URL} from "../version.ts";
import * as path from "../../vendor/https/deno.land/std/path/mod.ts";

/**
 * Generates a new project with TypeORM.
 */
export class InitCommand implements CommandModule {
    command = "init";
    describe = "Generates initial TypeORM project structure. " +
        "If name specified then creates files inside directory called as name. " +
        "If its not specified then creates files inside current directory.";

    builder(args: CommandBuilder) {
        return args
            .option("c", {
                alias: "connection",
                default: "default",
                describe: "Name of the connection on which to run a query"
            })
            .option("n", {
                alias: "name",
                describe: "Name of the project directory."
            })
            .option("db", {
                alias: "database",
                describe: "Database type you'll use in your project."
            })
            .option("docker", {
                describe: "Set to true if docker-compose must be generated as well. False by default."
            });
    }

    async handler(args: Args) {
        try {
            const database: string = args.database as any || "mysql";
            const isDocker = args.docker !== undefined ? true : false;
            const basePath = process.cwd() + (args.name ? ("/" + args.name) : "");
            const projectName = args.name ? path.basename(args.name as any) : undefined;
            if (isDocker)
                await CommandUtils.createFile(basePath + "/docker-compose.yml", InitCommand.getDockerComposeTemplate(database), false);
            await CommandUtils.createFile(basePath + "/.gitignore", InitCommand.getGitIgnoreFile());
            await CommandUtils.createFile(basePath + "/README.md", InitCommand.getReadmeTemplate({ docker: isDocker }), false);
            await CommandUtils.createFile(basePath + "/tsconfig.json", InitCommand.getTsConfigTemplate());
            await CommandUtils.createFile(basePath + "/ormconfig.json", InitCommand.getOrmConfigTemplate(database));
            await CommandUtils.createFile(basePath + "/entity/User.ts", InitCommand.getUserEntityTemplate(database));
            await CommandUtils.createFile(basePath + "/mod.ts", InitCommand.getAppIndexTemplate());
            await CommandUtils.createDirectories(basePath + "/migration");

            if (args.name) {
                console.log(colors.green(`Project created inside ${colors.blue(basePath)} directory.`));

            } else {
                console.log(colors.green(`Project created inside current directory.`));
            }

        } catch (err) {
            console.log(colors.black(colors.bgRed("Error during project initialization:")));
            console.error(err);
            process.exit(1);
        }
    }

    // -------------------------------------------------------------------------
    // Protected Static Methods
    // -------------------------------------------------------------------------

    /**
     * Gets contents of the ormconfig file.
     */
    protected static getOrmConfigTemplate(database: string): string {
        const options: ObjectLiteral = { };
        switch (database) {
            case "mysql":
                Object.assign(options, {
                    type: "mysql",
                    host: "localhost",
                    port: 3306,
                    username: "test",
                    password: "test",
                    database: "test",
                });
                break;
            case "mariadb":
                Object.assign(options, {
                    type: "mariadb",
                    host: "localhost",
                    port: 3306,
                    username: "test",
                    password: "test",
                    database: "test",
                });
                break;
            case "sqlite":
                Object.assign(options, {
                    type: "sqlite",
                    "database": "database.sqlite",
                });
                break;
            case "postgres":
                Object.assign(options, {
                    "type": "postgres",
                    "host": "localhost",
                    "port": 5432,
                    "username": "test",
                    "password": "test",
                    "database": "test",
                });
                break;
            case "cockroachdb":
                Object.assign(options, {
                    "type": "cockroachdb",
                    "host": "localhost",
                    "port": 26257,
                    "username": "root",
                    "password": "",
                    "database": "defaultdb",
                });
                break;
            case "mssql":
                Object.assign(options, {
                    "type": "mssql",
                    "host": "localhost",
                    "username": "sa",
                    "password": "Admin12345",
                    "database": "tempdb",
                });
                break;
            case "oracle":
                Object.assign(options, {
                    "type": "oracle",
                    "host": "localhost",
                    "username": "system",
                    "password": "oracle",
                    "port": 1521,
                    "sid": "xe.oracle.docker",
                });
                break;
            case "mongodb":
                Object.assign(options, {
                    "type": "mongodb",
                    "database": "test",
                });
                break;
        }
        Object.assign(options, {
            synchronize: true,
            logging: false,
            entities: [
                "entity/**/*.ts"
            ],
            migrations: [
                "migration/**/*.ts"
            ],
            subscribers: [
                "subscriber/**/*.ts"
            ],
            cli: {
                entitiesDir: "entity",
                migrationsDir: "migration",
                subscribersDir: "subscriber"
            }
        });
        return JSON.stringify(options, undefined, 3);
    }

    /**
     * Gets contents of the ormconfig file.
     */
    protected static getTsConfigTemplate(): string {
        return JSON.stringify({
            compilerOptions: {
                strict: true,
                target: "esnext",
                experimentalDecorators: true,
                sourceMap: true
            }
        }
        , undefined, 3);
    }

    /**
     * Gets contents of the .gitignore file.
     */
    protected static getGitIgnoreFile(): string {
        return `.idea/
.vscode/
node_modules/
build/
tmp/
temp/`;
    }

    /**
     * Gets contents of the user entity.
     */
    protected static getUserEntityTemplate(database: string): string {
        // @see https://github.com/denoland/deno/issues/4464
        const importStatement = database === "mongodb"
            ? "import {Entity, ObjectIdColumn, ObjectID} from \"" + MOD_URL + "\";\n"
            : "import {Entity, PrimaryGeneratedColumn} from \"" + MOD_URL + "\"\n";
        return importStatement + `;

@Entity()
export class User {

    ${ database === "mongodb" ? "@ObjectIdColumn()" : "@PrimaryGeneratedColumn()" }
    id: ${ database === "mongodb" ? "ObjectID" : "number" };

    @Column({ type: String })
    firstName: string;

    @Column({ type: String })
    lastName: string;

    @Column({ type: Number })
    age: number;

}
`;
    }

    /**
     * Gets contents of the main (index) application file.
     */
    protected static getAppIndexTemplate(): string {
        // @see https://github.com/denoland/deno/issues/4464
        return "import {createConnection} from \"" + MOD_URL + "\";\n" +
            "import {User} from \"./entity/User.ts\";\n" + `

createConnection().then(async connection => {

    console.log("Inserting a new user into the database...");
    const user = new User();
    user.firstName = "Timber";
    user.lastName = "Saw";
    user.age = 25;
    await connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);

    console.log("Loading users from the database...");
    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);

    console.log("Here you can setup and run express/koa/any other framework.");

}).catch(error => console.log(error));
`;
    }

    /**
     * Gets contents of the new docker-compose.yml file.
     */
    protected static getDockerComposeTemplate(database: string): string {

        switch (database) {
            case "mysql":
                return `version: '3'
services:

  mysql:
    image: "mysql:5.7.10"
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: "admin"
      MYSQL_USER: "test"
      MYSQL_PASSWORD: "test"
      MYSQL_DATABASE: "test"

`;
            case "mariadb":
                return `version: '3'
services:

  mariadb:
    image: "mariadb:10.1.16"
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: "admin"
      MYSQL_USER: "test"
      MYSQL_PASSWORD: "test"
      MYSQL_DATABASE: "test"

`;
            case "postgres":
                return `version: '3'
services:

  postgres:
    image: "postgres:9.6.1"
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: "test"
      POSTGRES_PASSWORD: "test"
      POSTGRES_DB: "test"

`;
            case "cockroachdb":
                return `version: '3'
services:

  cockroachdb:
    image: "cockroachdb/cockroach:v2.1.4"
    command: start --insecure
    ports:
      - "26257:26257"

`;
            case "sqlite":
                return `version: '3'
services:
`;
            case "oracle":
                throw new Error(`You cannot initialize a project with docker for Oracle driver yet.`); // todo: implement for oracle as well

            case "mssql":
                return `version: '3'
services:

  mssql:
    image: "microsoft/mssql-server-linux:rc2"
    ports:
      - "1433:1433"
    environment:
      SA_PASSWORD: "Admin12345"
      ACCEPT_EULA: "Y"

`;
            case "mongodb":
                return `version: '3'
services:

  mongodb:
    image: "mongo:4.0.6"
    container_name: "typeorm-mongodb"
    ports:
      - "27017:27017"

`;
        }
        return "";
    }

    /**
     * Gets contents of the new readme.md file.
     */
    protected static getReadmeTemplate(options: { docker: boolean }): string {
        let template = `# Awesome Project Build with TypeORM

Steps to run this project:

`;

        if (options.docker) {
            template += `1. Run \`docker-compose up\` command
`;
        } else {
            template += `1. Setup database settings inside \`ormconfig.json\` file
`;
        }

        template += `2. Run \`deno run\` command
`;
        return template;
    }

}

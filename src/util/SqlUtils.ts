export class SqlUtils {
    static isInsertQuery(query: string) : boolean {
        return query.substr(0, 11) === "INSERT INTO";
    }

    static isSelectQuery(query: string): boolean {
        return query.substr(0, 6) === "SELECT";
    }

    static isCommitQuery(query: string): boolean {
        return query.substr(0, 6) === "COMMIT";
    }
}

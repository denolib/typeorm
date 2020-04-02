export class SqlUtils {
    static isInsertQuery(query: string) : boolean {
        return query.substr(0, 11) === "INSERT INTO";
    }
}

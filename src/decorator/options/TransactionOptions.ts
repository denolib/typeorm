import { IsolationLevel } from "../../driver/types/IsolationLevel.ts";

export interface TransactionOptions {
  connectionName?: string;
  isolation?: IsolationLevel;
}

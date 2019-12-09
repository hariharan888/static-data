import _ from "lodash";
import { RootDirectory } from "../../../Config/Constants";
const sqlite3 = require("sqlite3").verbose();
const dbPath = `${RootDirectory}/src/Projects/CssRN/Local/sqlite/stories.sqlite`;

const db = new sqlite3.Database(dbPath);

export default db;

// close the database connection
// db.close();

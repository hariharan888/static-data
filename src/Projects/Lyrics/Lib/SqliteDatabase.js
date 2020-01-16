import _ from "lodash";
// import { RootDirectory } from "../../../Config/Constants";
// const sqlite3 = require("sqlite3").verbose();

// const inputDbPath = `${RootDirectory}/src/Projects/Lyrics/Local/sqlite/songs.sqlite3`;
// const outputDbPath = `${RootDirectory}/src/Projects/Lyrics/Local/sqlite/lyrics.sqlite3`;

// const inputDb = new sqlite3.Database(inputDbPath);
// const outputDb = new sqlite3.Database(outputDbPath);

const inputDb = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./songs.sqlite3"
  },
  useNullAsDefault: true
});

const outputDb = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./lyrics.sqlite3"
  },
  useNullAsDefault: true
});

export default { inputDb, outputDb };

// close the database connection
// db.close();

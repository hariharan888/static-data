import _ from "lodash";
import { RootDirectory } from "../../../Config/Constants";
import Realm from "realm";

const dbPath = `${RootDirectory}/src/Projects/CssRN/Local/realm/stories.realm`;

// Define your models and their properties
const StorySchema = {
  name: "Story",
  primaryKey: "id",
  properties: {
    id: "int",
    title: "string",
    source: "string",
    language: "string",
    categories: "Category[]",
    content: "string[]",
    verse: "string",
    verseRef: "string",
    favourite: { type: "bool", default: false }
  }
};

const CategorySchema = {
  name: "Category",
  primaryKey: "id",
  properties: {
    id: "int",
    name: "string",
    iconName: "string",
    iconType: "string",
    stories: {
      type: "linkingObjects",
      objectType: "Story",
      property: "categories"
    }
  }
};

const dbConfig = {
  path: dbPath,
  schema: [StorySchema, CategorySchema],
  schemaVersion: 1
};

export default new Realm(dbConfig);

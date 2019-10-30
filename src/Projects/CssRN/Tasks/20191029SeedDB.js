import fs from "fs";
import _ from "lodash";
import Realm from "realm";
import db from "../Lib/Database";
import { RootDirectory } from "../../../Config/Constants";

/*--------------------------------------------------------------------*/
// 1. Seed ~ 220 stories to realm database
/*--------------------------------------------------------------------*/

let data = null;
const inputPath = `${RootDirectory}/src/Projects/CssRN/Local/InitialData.json`;

const seedCategories = categories => {
  db.write(() => {
    _.each(categories, (id, name) => {
      db.create("Category", { id, name }, true);
    });
  });
};

const verifyCategories = () => {
  const categories = db.objects("Category");
  console.log(_.map(categories, c => c.name));
  console.log("Total categories: ", db.objects("Category").length);
  const second = db.objectForPrimaryKey("Category", 1);
  const secondCategoryStories = _.map(second.stories, s => s.title);
  console.log("Total stories for first category: ", secondCategoryStories);
};

const seedStories = stories => {
  db.write(() => {
    _.each(stories, (data, index) => {
      const {
        title,
        content,
        source,
        language_id,
        categories,
        verse_ref,
        explanation,
        date,
        verse
      } = data;
      const story = {
        id: index + 1,
        title,
        source,
        language: "Tamil",
        content: [...content, "", explanation, "", `${source} ${date}`],
        verse,
        verseRef: verse_ref
      };
      const record = db.create("Story", story, true);
      _.each(categories, cid => {
        record.categories.push(db.objectForPrimaryKey("Category", cid));
      });
    });
  });
};

const verifyStories = () => {
  const first = db.objectForPrimaryKey("Story", 1);
  console.log(first.title);
  console.log("Total stories: ", db.objects("Story").length);
};

// id: "int",
// title: "string",
// source: "string",
// language: "string",
// categories: "Category[]",
// content: "string[]",
// verse: "string",
// verseRef: "string"

export const doTask = () => {
  fs.readFile(inputPath, function(err, buf) {
    if (err) {
      console.log(err);
      return;
    }
    const str = buf.toString();
    data = JSON.parse(str);
    seedCategories(data.categories);
    verifyCategories();
    seedStories(data.stories);
    verifyStories();
    process.exit(); // due to realm import: https://github.com/realm/realm-js/issues/1387
    return;
  });
};

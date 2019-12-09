import fs from "fs";
import _ from "lodash";
import sqlite3 from "sqlite3";
import db from "../Lib/SqliteDatabase";
import { RootDirectory } from "../../../Config/Constants";

/*--------------------------------------------------------------------*/
// 1. Seed ~ 220 stories to sqlite database
/*--------------------------------------------------------------------*/

const inputPath = `${RootDirectory}/src/Projects/CssRN/Local/InitialData.json`;

const iconMap = {
  Uncategorized: { iconType: "oct", iconName: "unverified" },
  Bible: { iconType: "mc", iconName: "bible" },
  Salvation: { iconType: "fa", iconName: "chain-broken" },
  Prayer: { iconType: "fa5", iconName: "pray" },
  Offering: { iconType: "fe", iconName: "gift" },
  Love: { iconType: "mc", iconName: "heart-outline" },
  Ministry: { iconType: "fa", iconName: "suitcase" },
  Glory: { iconType: "fa5", iconName: "crown" },
  Faith: { iconType: "fa", iconName: "handshake-o" },
  Healing: { iconType: "mc", iconName: "medical-bag" },
  Protection: { iconType: "mc", iconName: "shield-cross-outline" },
  Power: { iconType: "mi", iconName: "hdr-strong" },
  Gladness: { iconType: "mc", iconName: "emoticon-happy-outline" },
  Martyr: { iconType: "fa5", iconName: "cross" },
  Truthfulness: { iconType: "fa", iconName: "thumbs-o-up" }
};

//   mc: MaterialCommunityIcons,
//   sli: SimpleLineIcons,
//   oct: Octicons,
//   fa: FontAwesome,
//   fe: Feather,

const seedCategories = categories => {
  db.write(() => {
    _.each(categories, (id, name) => {
      const iconProps = iconMap[name];
      db.create("Category", { id, name, ...iconProps }, true);
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

export const doTask = () => {
  fs.readFile(inputPath, function(err, buf) {
    if (err) {
      console.log(err);
      return;
    }
    // const str = buf.toString();
    // data = JSON.parse(str);
    // seedCategories(data.categories);
    // verifyCategories();
    // // seedStories(data.stories);
    // verifyStories();
    let sql = `SELECT * FROM categories`;

    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      rows.forEach(row => {
        console.log(row);
      });
    });
    return;
  });
};

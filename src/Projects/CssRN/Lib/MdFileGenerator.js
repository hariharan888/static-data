import fs from "fs";
import _ from "lodash";
import { RootDirectory } from "../../../Config/Constants";
import moment from "moment";

/*--------------------------------------------------------------------*/
// 1. Seed ~ 220 stories to sqlite database
/*--------------------------------------------------------------------*/

const inputPath = `${RootDirectory}/src/Projects/CssRN/Local/InitialData.json`;

const parseStory = (story, categories) => {
  const {
    title,
    content,
    source,
    language_id,
    verse_ref: verseRef,
    explanation,
    date,
    verse
  } = story;
  const language = language_id === 1 ? "Tamil" : "English";

  return `
    ---
    title: ${title}
    date: ${moment().format("YYYY-MM-DD")}
    img: 
    tags: [${_.join(categories, ", ")}]
    language: ${language}
    ---

    > ${verse} ${verseRef}

    ${_.join(content, "\n")}

    ##சம்பவ விளக்கம்
    ${explanation}

    நன்றி: ${source}(${date})
  `;
};

export const doTask = () => {
  fs.readFile(inputPath, async (err, buf) => {
    if (err) {
      console.log(err);
      return;
    }
    const str = buf.toString();
    data = JSON.parse(str);
    const { categories, stories } = data;
    const mdData = _.map([stories[0]], story => {
      const storyCategories = _.map(story.categories, id =>
        _.chain(categories)
          .toPairs()
          .find((k, v) => v === id)
          .head()
          .value()
      );
      const parsedStory = parseStory(story, storyCategories);
      return parsedStory;
    });
    fs.writeFile("Output.md", mdData[0], err => {
      // In case of a error throw err.
      if (err) throw err;
      return;
    });
  });
};

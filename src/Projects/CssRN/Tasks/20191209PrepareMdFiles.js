import fs from "fs";
import _ from "lodash";
import { RootDirectory } from "../../../Config/Constants";
import moment from "moment";

/*--------------------------------------------------------------------*/
// 1. Seed ~ 220 stories to md files
/*--------------------------------------------------------------------*/

const inputPath = `${RootDirectory}/src/Projects/CssRN/Local/InitialData.json`;
const outputPath = `${RootDirectory}/src/Projects/CssRN/Local/md`;

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
  const verseQuote = _.replace(`${verse} ${verseRef}`, /\r|\n/g, " ");

  return `---
title: ${title}
date: ${moment().format("YYYY-MM-DD")}
description: "${_.replace(verseQuote, /:"/g, "")}"
img: 
tags: [${_.join(categories, ", ")}]
language: ${language}
---

> ${verseQuote}

${_.join(content, "\n\n")}

##சம்பவ விளக்கம்

${explanation}

நன்றி: ${source}(${date})
  `;
};

const writeToFiles = async data => {
  const promises = _.map(data, async ({ story, parsedStory }) => {
    const folderName = story.title
      .replace(/[\!@#\$%^&\*\(\)\,\s”\\\.;\?]/g, "-")
      .replace(/-{2,}/g, "-")
      .replace(/^-/, "")
      .replace(/-$/, "");
    const folderPath = `${outputPath}/${folderName}`;
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    const error = await fs.writeFile(
      `${folderPath}/index.md`,
      parsedStory,
      err => err
    );
    return error;
  });
  const errors = await Promise.all(promises);
  console.log("err", _.some(errors, _.identity));
  return;
};

export const doTask = () => {
  fs.readFile(inputPath, async (err, buf) => {
    if (err) {
      console.log(err);
      return;
    }
    const str = buf.toString();
    const data = JSON.parse(str);
    const { categories, stories } = data;
    const mdData = _.map(stories, story => {
      const storyCategories = _.map(story.categories, id =>
        _.chain(categories)
          .toPairs()
          .find((k, v) => v === id)
          .head()
          .value()
      );
      const parsedStory = parseStory(story, storyCategories);
      return { story, parsedStory };
    });

    await writeToFiles(mdData);
    return;
  });
};

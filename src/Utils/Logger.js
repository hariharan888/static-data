import fs from "fs";
import { RootDirectory } from "../Config/Constants";

export const logger = fs.createWriteStream(`${RootDirectory}/output.log`, {
  flags: "a"
});

export const log = data => {
  let str = "";
  if (typeof data === "object") {
    str = JSON.stringify(data, null, 2);
  } else if (typeof data === "string") {
    str = data;
  }
  logger.write(new Date().toLocaleString() + ": " + str + "\n");
};

export default {
  log,
  logger
};

import fs from "fs";
import _ from "lodash";
import Db from "../Lib/SqliteDatabase";
import { RootDirectory } from "../../../Config/Constants";

const { inputDb, outputDb } = Db;

const dropJsonTable = () => {
  const sql = `DROP TABLE IF EXISTS json_songs;`;
  return outputDb.raw(sql);
};

const createJsonTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS json_songs(
    id INTEGER NOT NULL,
    song_id INTEGER NOT NULL,
    data TEXT NOT NULL,
    primary key (id, song_id)
  );
  `;
  return outputDb.raw(sql);
};

const verifyLyrics = async () => {
  const inputDbSongs = await inputDb("json_songs");
  console.log("inputDb songs", inputDbSongs.length);
  const outputDbSongs = await outputDb("json_songs");
  console.log("outputDb songs", outputDbSongs.length);
  console.log("outputDb songs", outputDbSongs[0]);
};

const temp = async () => {
  const songs = await inputDb("json_songs");
  console.log(
    "song",
    _.chain(songs)
      .map(s => JSON.parse(s.data))
      .map("primary_language")
      .groupBy(_.identity)
      .map((v, k) => {
        return [v.length, k];
      })
      .value()
  );
};

// primaryLanguages: [1,2]
// total: 9656
// grouped: [ [ 1631, '1' ], [ 8025, '2' ] ]
const getFinalJson = async (songId = 1) => {
  const song = await inputDb("json_songs").where({ song_id: songId });
  // console.log("song", song);
  const authors = await inputDb
    .select("*")
    .from("authors")
    .leftJoin(
      "author_song_junctions",
      "author_song_junctions.author_id",
      "authors.id"
    )
    .where({ song_id: songId });
  // console.log("authors", authors[0]);
  const parsedSong = JSON.parse(song[0].data);
  // console.log("parsed song", parsedSong);
  const { id, youtube_id, primary_language } = parsedSong;
  const primaryLanguage = primary_language === 1 ? "tamil" : "english";
  const languages = primary_language === 1 ? ["tamil", "english"] : ["english"];
  const parsedAuthors = _.map(authors, author => ({
    english: author.name_e,
    tamil: author.name_t,
    id: author.author_id
  }));
  const parsedTitle =
    primary_language === 1
      ? {
          tamil: _.get(parsedSong, "versions.tamil.title"),
          english: _.get(parsedSong, "versions.english.title")
        }
      : {
          english: _.get(parsedSong, "versions.english.title")
        };
  const parsedLyrics =
    primary_language === 1
      ? {
          tamil: _.get(parsedSong, "versions.tamil.lyrics"),
          english: _.get(parsedSong, "versions.english.lyrics")
        }
      : {
          english: _.get(parsedSong, "versions.english.lyrics")
        };

  const final = {
    id,
    primaryLanguage,
    languages,
    youtubeId: youtube_id,
    presentationOrder:
      _.get(parsedSong, "versions.english.presentationOrder") ||
      _.get(parsedSong, "versions.tamil.presentationOrder"),
    authors: parsedAuthors,
    title: parsedTitle,
    lyrics: parsedLyrics
  };
  // console.log("final", final);
  return final;
};

const seedSong = async songId => {
  const json = await getFinalJson(songId);
  console.log("Doing", songId);
  return outputDb("json_songs").insert({
    data: JSON.stringify(json),
    song_id: songId,
    id: songId
  });
};

const seedFinalSongs = async () => {
  const songs = await inputDb("json_songs");
  return songs.reduce(async (previousPromise, song) => {
    await previousPromise;
    return seedSong(song.song_id);
  }, Promise.resolve());
};

export const doTask = async () => {
  await dropJsonTable();
  await createJsonTable();
  await seedFinalSongs();
  await verifyLyrics();
};

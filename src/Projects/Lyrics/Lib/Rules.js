const final = {
  id: 1,
  primaryLanguage: "tamil",
  languages: ["tamil", "english"],
  youtubeId: "kN5-FGG7acQ",
  presentationOrder: "1 2 3 4 5 6 7",
  authors: [
    {
      tamil: "",
      english: "",
      id: 25
    },
    {
      tamil: "",
      english: "",
      id: 26
    }
  ],
  title: {
    tamil: "அகிலமெங்கும் போற்றும்",
    english: ""
  },
  lyrics: {
    tamil: {},
    english: {}
  }
};

/*-------------------------------Rules-------------------------------------*/
// 1. languages must contain the default language from languageId
//     and other properties should not be saved if default version is not found
// 2. author names should compulsorily include english

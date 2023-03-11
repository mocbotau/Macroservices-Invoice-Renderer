import { styles } from "./styles";

export const boldLanguage = (language: string): object => {
  switch (language) {
    case "ko":
      return styles.ko_bold;
    case "ja":
      return styles.ja_bold;
    default:
      return styles.other_bold;
  }
};

export const regularLanguage = (language: string): object => {
  switch (language) {
    case "ko":
      return styles.ko_regular;
    case "ja":
      return styles.ja_regular;
    default:
      return styles.other_regular;
  }
};

export const lightLanguage = (language: string): object => {
  switch (language) {
    case "ko":
      return styles.ko_light;
    case "ja":
      return styles.ja_light;
    default:
      return styles.other_light;
  }
};

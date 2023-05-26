import moment from "moment";
import { Dimensions } from "react-native";

export const WIDTHS = Dimensions.get("screen").width;

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const keyDefault = (key: string, obj?: { [key: string]: any }) => {
  try {
    return obj[key];
  } catch (error) {
    if (obj == undefined) return undefined;
    const { length } = Object.keys(obj ?? {});
    if (length == 0) return undefined;
    else return obj[Object.keys(obj)[0]];
  }
};

export const cover = (id: string, name: string) => {
  return `https://uploads.mangadex.org/covers/${id}/${name}`;
};

export const chapterTitle = (title?: string, index?: string) => {
  return title && index
    ? `Ch. ${index}: ${title}`
    : title
    ? title
    : index
    ? `Ch. ${index}`
    : "Oneshot";
};

export function fromNow(str?: string) {
  const date = moment(str).fromNow();
  return capitalize(date);
}

export function ddMMYYYY(str?: string) {
  return moment(str).format("DD/MM/YYYY");
}

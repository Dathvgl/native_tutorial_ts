import axios from "axios";
import { cover } from "~globals";
import {
  AggregateChapterMangadex,
  AggregateResponseMangadex,
  ChapterMangadex,
  ChapterResponseMangadex,
  ChaptersResponseMangadex,
  CoverResponseMangadex,
  ImageResponseMangadex,
  MangaResponseMangadex,
  MangaSearchMangadex,
  MangasResponseMangadex,
  TagResponseMangadex,
} from "~types";

export type OptionList = {
  id?: string;
  sort: "asc" | "desc";
  limit: number;
  offset: number;
};

export type FeedType = { [key: string]: FeedItemType };
export type FeedItemType = { [key: string]: FeedChildType };
export type FeedChildType = { [key: string]: ChapterMangadex };

class MangadexService {
  static url = "https://api.mangadex.org";

  static objectLang(obj?: { [key: string]: ChapterMangadex }) {
    const keys = Object.keys(obj ?? {}).sort((a, b) => {
      const langA = obj![a].attributes?.translatedLanguage ?? "";
      const langB = obj![b].attributes?.translatedLanguage ?? "";
      return langA.localeCompare(langB);
    });

    const objNew: FeedChildType = {};
    keys.forEach((key) => {
      objNew[key] = obj![key];
    });

    return objNew;
  }

  static async mangaDetail(mangaId?: string) {
    if (!mangaId) return;
    const res = await axios.get(`${this.url}/manga/${mangaId}`);

    if (res.status == 200) {
      const data: MangaResponseMangadex = res.data;
      if (data.result == "ok") {
        return data.data;
      }
    }
  }

  static async mangaFeed({ id: mangaId, limit, offset, sort }: OptionList) {
    if (!mangaId) return;
    const res = await axios.get(`${this.url}/manga/${mangaId}/feed`, {
      params: { limit, offset, order: { volume: sort, chapter: sort } },
    });

    if (res.status == 200) {
      const data: ChaptersResponseMangadex = res.data;
      if (data.result == "ok") {
        const obj: FeedType = {};

        data.data?.forEach((item) => {
          const { id, attributes } = item;
          const volume = `${attributes?.volume}-vol` ?? "none";
          const chapter = `${attributes?.chapter}-ch` ?? "0";
          const chapterIndex = `${attributes?.chapter}-${id}` ?? "0";

          try {
            obj[volume][chapter][chapterIndex] = item;
          } catch (error) {
            try {
              obj[volume][chapter] = { [chapterIndex]: item };
            } catch (error) {
              obj[volume] = { [chapter]: { [chapterIndex]: item } };
            }
          }
        });

        Object.keys(obj).forEach((key) => {
          Object.keys(obj[key]).forEach((deep) => {
            obj[key][deep] = this.objectLang(obj[key][deep]);
          });
        });

        return { feed: obj, total: data.total };
      }
    }
  }

  static async mangaAggregate(mangaId?: string, lang?: string) {
    if (!mangaId || !lang) return;
    const res = await axios.get(`${this.url}/manga/${mangaId}/aggregate`, {
      params: { translatedLanguage: [lang] },
    });

    if (res.status == 200) {
      const data: AggregateResponseMangadex = res.data;
      if (data.result == "ok") {
        const map: AggregateChapterMangadex = {};

        const volumes = data.volumes || {};
        Object.keys(volumes).forEach((key) => {
          const chapters = volumes[key].chapters || {};
          Object.keys(chapters).forEach((child) => {
            map[child] = chapters[child];
          });
        });

        return map;
      }
    }
  }

  static async mangaTag() {
    const res = await axios.get(`${this.url}/manga/tag`);

    if (res.status == 200) {
      const data: TagResponseMangadex = res.data;
      if (data.result == "ok") return data.data;
    }
  }

  static async coverDetail(mangaId?: string, coverId?: string) {
    if (!mangaId || !coverId) return;
    const res = await axios.get(`${this.url}/cover/${coverId}`);

    if (res.status == 200) {
      const data: CoverResponseMangadex = res.data;
      if (data.result == "ok") {
        const id = mangaId ?? "";
        const name = data.data?.attributes?.fileName ?? "";
        return cover(id, name);
      }
    }
  }

  static async chapterDetail(chapterId?: string) {
    if (!chapterId) return;
    const res = await axios.get(`${this.url}/chapter/${chapterId}`);

    if (res.status == 200) {
      const data: ChapterResponseMangadex = res.data;
      if (data.result == "ok") {
        return data.data;
      }
    }
  }

  static async imageDetail(chapterId?: string) {
    if (!chapterId) return;
    const res = await axios.get(`${this.url}/at-home/server/${chapterId}`);

    if (res.status != 200) return;
    const data: ImageResponseMangadex = res.data;

    if (data.result == "error") return;
    const { baseUrl, chapter } = data;
    const hash = chapter?.hash;
    const dataSaver = chapter?.dataSaver;

    return dataSaver?.map((item) => `${baseUrl}/data-saver/${hash}/${item}`);
  }

  static async homeNews(limit: number) {
    const res = await axios.get(`${this.url}/manga`, {
      params: { limit },
    });

    if (res.status == 200) {
      const data: MangasResponseMangadex = res.data;
      if (data.result == "ok") return data.data;
    }
  }

  static async homePopular(limit: number) {
    const res = await axios.get(`${this.url}/manga`, {
      params: { limit, order: { year: "desc", followedCount: "desc" } },
    });

    if (res.status == 200) {
      const data: MangasResponseMangadex = res.data;
      if (data.result == "ok") return data.data;
    }
  }

  static async listSearch(search?: MangaSearchMangadex) {
    const res = await axios.get(`${this.url}/manga`, {
      params: { ...search },
    });

    if (res.status == 200) {
      const data: MangasResponseMangadex = res.data;
      if (data.result == "ok") return data;
    }
  }
}

export default MangadexService;

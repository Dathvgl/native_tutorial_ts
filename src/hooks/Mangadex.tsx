import { useEffect, useState } from "react";
import MangadexService from "~models/MangadexService";
import { ChapterMangadex, MangaMangadex } from "~types";

export function useMangadexCover(item?: MangaMangadex) {
  const [state, setState] = useState<string | undefined>();

  useEffect(() => {
    init();
  }, [item]);

  async function init() {
    const coverId = item?.relationships?.find(
      ({ type }) => type == "cover_art"
    )?.id;

    const res = await MangadexService.coverDetail(item?.id, coverId);
    setState(() => res);
  }

  return state;
}

export function useMangadexChapter(id?: string) {
  if (id == undefined) return;
  const [state, setState] = useState<ChapterMangadex | undefined>();

  useEffect(() => {
    init();
  }, [id]);

  async function init() {
    const res = await MangadexService.chapterDetail(id);
    setState(() => res);
  }

  return state;
}

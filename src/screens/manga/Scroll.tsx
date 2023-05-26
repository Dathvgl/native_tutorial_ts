import { useNavigation } from "@react-navigation/native";
import { RootStack } from "App";
import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import FlagManga from "~components/FlagManga";
import Pagination from "~components/Pagination";
import { SBHeight } from "~components/SizeBox";
import { chapterTitle, ddMMYYYY, fromNow } from "~globals";
import MangadexService, {
  FeedItemType,
  FeedType,
} from "~models/MangadexService";
import { ChapterMangadex } from "~types";

function MangaChapter(props: { mangaId?: string; volume: FeedItemType }) {
  const { mangaId, volume } = props;

  return (
    <View className="divide-y-2">
      {Object.keys(volume).map((key) => {
        const keys = Object.keys(volume[key]);

        if (keys.length == 1) {
          return (
            <View key={key}>
              <MangaIndex mangaId={mangaId} chapter={volume[key][keys[0]]} />
            </View>
          );
        }

        const chapterKey = key.split("-")[0];

        return (
          <View key={key}>
            {chapterKey && chapterKey != "null" && (
              <Text className="font-bold text-base pt-1">
                Chapter {chapterKey}
              </Text>
            )}
            {keys.map((deep, index, { length }) => (
              <View
                key={deep}
                className={
                  index == length - 1 ? "" : `border-b-2 border-blue-500`
                }
              >
                <MangaIndex mangaId={mangaId} chapter={volume[key][deep]} />
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}

function MangaIndex(props: { mangaId?: string; chapter: ChapterMangadex }) {
  const { mangaId, chapter } = props;
  const navigation = useNavigation<RootStack>();

  function stackChapter() {
    const { id: chapterId, attributes } = chapter;
    const lang = attributes?.translatedLanguage;
    const chapterIndex = attributes?.chapter;
    navigation.push("MangaChapter", { mangaId, chapterId, chapterIndex, lang });
  }

  return (
    <TouchableOpacity onPress={stackChapter} className="py-2">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2 flex-1 pr-4">
          <View className="w-8 h-8">
            <FlagManga lang={chapter?.attributes?.translatedLanguage} />
          </View>
          <Text
            className="flex-1 text-base"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {chapterTitle(
              chapter.attributes?.title,
              chapter.attributes?.chapter
            )}
          </Text>
        </View>
        <View className="flex-col items-end">
          <Text className="italic" numberOfLines={1} ellipsizeMode="tail">
            {fromNow(chapter?.attributes?.updatedAt)}
          </Text>
          <Text>{ddMMYYYY(chapter?.attributes?.updatedAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function MangaScroll(props: { mangaId?: string }) {
  const { mangaId } = props;
  const limit = 50;

  const refScroll = useRef<ScrollView>(null);

  const [feed, setFeed] = useState<FeedType>();
  const [offset, setOffset] = useState(0);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    init();
  }, [mangaId, sort, offset]);

  async function init() {
    const res = await MangadexService.mangaFeed({
      id: mangaId,
      sort,
      limit,
      offset,
    });

    setFeed(() => res?.feed);
    setTotal(() => Math.ceil((res?.total ?? 0) / limit));
  }

  function onPageChange(index: number) {
    refScroll.current?.scrollTo({ y: 0, animated: true });
    setOffset(() => limit * (index - 1));
  }

  function onSort() {
    if (sort == "asc") setSort(() => "desc");
    else setSort(() => "asc");
  }

  return (
    <View>
      <TouchableOpacity
        className="px-2 pb-2 flex-row justify-end"
        onPress={onSort}
      >
        <Text className="text-base">
          {sort == "asc" ? "Ascending" : "Descending"}
        </Text>
      </TouchableOpacity>
      <View className="h-64 px-2 pt-2">
        <ScrollView
          ref={refScroll}
          className="flex-col gap-4"
          nestedScrollEnabled
        >
          {Object.keys(feed ?? {}).map((key) => {
            const volume = feed![key];
            const volumeKey = key.split("-")[0];
            const volumeText =
              key == "none" || !volumeKey || volumeKey == "null"
                ? "No Volume"
                : `Vol. ${volumeKey}`;

            return (
              <View
                key={key}
                style={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}
                className="p-2 rounded-lg"
              >
                <Text className="text-base font-bold">{volumeText}</Text>
                <MangaChapter mangaId={mangaId} volume={volume} />
              </View>
            );
          })}
        </ScrollView>
      </View>
      <SBHeight />
      <Pagination total={total} onPageChange={onPageChange} />
    </View>
  );
}

export default MangaScroll;

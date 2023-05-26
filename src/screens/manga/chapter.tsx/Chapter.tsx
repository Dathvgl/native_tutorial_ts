import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import React, { useEffect, useRef, useState } from "react";
import {
  DrawerLayoutAndroid,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import IconFontAwesome5 from "react-native-vector-icons/FontAwesome5";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { WIDTHS } from "~globals";
import MangadexService from "~models/MangadexService";
import { AggregateChapterDetailMangadex } from "~types";
import MangaChapterMove from "./Move";

type MangaChapterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "MangaChapter"
>;

function MangaChapterImage(props: { uri: string }) {
  const { uri } = props;
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    Image.getSize(uri, (width, height) => {
      const aspect = WIDTHS / width;
      setHeight(() => height * aspect);
    });
  }, [uri]);

  return (
    <Image
      style={{ height }}
      className="w-full"
      source={{ uri }}
      progressiveRenderingEnabled
    />
  );
}

function MangaChapterScreen({ route, navigation }: MangaChapterScreenProps) {
  const { mangaId, chapterId, chapterIndex, lang } = route.params;

  const refDrawer = useRef<DrawerLayoutAndroid>(null);
  const refFlatManga = useRef<FlatList>(null);
  const refFlatList = useRef<FlatList>(null);

  const [images, setImages] = useState<string[]>();
  const [outline, setOutline] = useState(false);
  const [sort, setSort] = useState(true);
  const [gates, setGates] = useState<AggregateChapterDetailMangadex[]>();

  useEffect(() => {
    initAggregate();
  }, []);

  useEffect(() => {
    initImage();
  }, [chapterId]);

  async function initAggregate() {
    const res = await MangadexService.mangaAggregate(mangaId, lang);
    const list = Object.keys(res ?? {}).map((key) => res![key]);
    list.sort((a, b) => {
      const indexA = Number.parseFloat(a.chapter ?? "0");
      const indexB = Number.parseFloat(b.chapter ?? "0");
      return indexA - indexB;
    });
    setGates(() => list);
  }

  async function initImage() {
    const res = await MangadexService.imageDetail(chapterId);
    setImages(() => res);
  }

  function touchScreen() {
    setOutline(() => !outline);
  }

  function backIcon() {
    navigation.pop();
  }

  function openDrawer() {
    refDrawer.current?.openDrawer();
  }

  function closeDrawer() {
    refDrawer.current?.closeDrawer();
  }

  function indexChapter(chapterId?: string, chapterIndex?: string) {
    if (!chapterId || !chapterIndex) return;

    closeDrawer();
    navigation.setParams({ chapterId, chapterIndex });
    refFlatManga.current?.scrollToOffset({ animated: true, offset: 0 });
  }

  function moveChapter(check: boolean) {
    if (!gates) return;

    const index = gates?.findIndex(({ chapter }) => chapter == chapterIndex);
    if (!index) return;

    try {
      if (check) {
        const nextIndex = index + 1;
        const { id, chapter } = gates[nextIndex];
        indexChapter(id, chapter);
      } else {
        const prevIndex = index - 1;
        const { id, chapter } = gates[prevIndex];
        indexChapter(id, chapter);
      }
    } catch (error) {}
  }

  function navigationView() {
    return (
      <View className="flex-col flex-1">
        <View className="flex-row justify-end items-center">
          <TouchableOpacity onPress={() => setSort(() => !sort)}>
            <Text>{sort ? "Descending" : "Ascending"}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          ref={refFlatList}
          className="flex-1"
          data={sort ? gates?.reverse() : gates}
          renderItem={({ item, index }) => {
            const { id, chapter } = item!;

            return (
              <TouchableOpacity
                key={index}
                className={`px-4 py-2 w-full ${
                  chapter == chapterIndex ? "bg-green-300" : ""
                }`}
                onPress={() => indexChapter(id, chapter)}
              >
                <Text className="text-base">Chapter {item?.chapter}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }

  return (
    <DrawerLayoutAndroid
      ref={refDrawer}
      drawerWidth={300}
      drawerPosition="right"
      renderNavigationView={navigationView}
    >
      {outline && (
        <View className="absolute w-full p-2 z-50 bg-white border-y-2 flex-row justify-between">
          <IconFontAwesome5 onPress={backIcon} name="arrow-left" size={30} />
          <IconMaterialCommunityIcons
            onPress={openDrawer}
            name="menu"
            size={30}
          />
        </View>
      )}
      <FlatList
        ref={refFlatManga}
        onTouchEnd={touchScreen}
        data={images}
        renderItem={({ item, index }) => {
          return <MangaChapterImage key={index} uri={item} />;
        }}
      />
      {outline && (
        <MangaChapterMove
          onPrevChapter={() => moveChapter(false)}
          onNextChapter={() => moveChapter(true)}
        />
      )}
    </DrawerLayoutAndroid>
  );
}

export default MangaChapterScreen;

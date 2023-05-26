import { useNavigation } from "@react-navigation/native";
import { RootStack } from "App";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ImageCover from "~components/ImageCover";
import { SBHeight } from "~components/SizeBox";
import { keyDefault } from "~globals";
import MangadexService from "~models/MangadexService";
import { MangaMangadex } from "~types";
import HomeItem from "./Item";

const limit = 15;
const maxList = 6;

function HomeScreen() {
  const navigation = useNavigation<RootStack>();
  const [shuffle, setShuffle] = useState(6);
  const [list, setList] = useState<MangaMangadex[]>([]);
  const [data, setData] = useState<MangaMangadex[]>([]);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const res = await MangadexService.homeNews(limit);

    if (res) {
      setList(() => res);
      setData(() => res.slice(0, maxList));
    }
  }

  async function refreshData() {
    await init();
  }

  function shuffleData() {
    const half = maxList / 2;
    const double = maxList * 2;
    const more = double - half;

    switch (shuffle) {
      case half:
        setData(() => list.slice(half, more));
        setShuffle(() => more);
        break;
      case maxList:
        setData(() => list.slice(maxList, double));
        setShuffle(() => double);
        break;
      case more:
        setData(() => list.slice(more, limit));
        setShuffle(() => limit);
        break;
      case double:
        setData(() => [...list.slice(double, limit), ...list.slice(0, half)]);
        setShuffle(() => half);
        break;
      case limit:
        setData(() => list.slice(0, maxList));
        setShuffle(() => maxList);
        break;
    }
  }

  function stackManga(mangaId?: string) {
    navigation.push("Manga", { mangaId });
  }

  return (
    <View>
      <View className="absolute">
        <TextInput className="w-1/2 h-5 rounded-lg" />
      </View>
      <View className="p-2">
        <FlatList
          data={data}
          numColumns={3}
          columnWrapperStyle={{ gap: 8 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                key={index}
                className="flex-1"
                onPress={() => stackManga(item.id)}
              >
                <View className="h-48">
                  <View className="flex-1">
                    <ImageCover item={item} />
                  </View>
                  <Text numberOfLines={1} ellipsizeMode="tail">
                    {keyDefault("en", item.attributes?.title)}
                  </Text>
                  <HomeItem
                    chapterId={item.attributes?.latestUploadedChapter}
                  />
                </View>
              </TouchableOpacity>
            );
          }}
        />
        <SBHeight />
        <View className="flex-row justify-end gap-2">
          <Pressable
            className="px-3 py-2 bg-green-200 rounded-lg"
            onPress={refreshData}
          >
            <Text className="text-center">Refresh</Text>
          </Pressable>
          <Pressable
            className="px-3 py-2 bg-green-200 rounded-lg"
            onPress={shuffleData}
          >
            <Text className="text-center">Shuffle</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default HomeScreen;
function useContext(NavigationContext: any) {
  throw new Error("Function not implemented.");
}

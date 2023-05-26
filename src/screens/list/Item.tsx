import { useNavigation } from "@react-navigation/native";
import { RootStack } from "App";
import { Text, TouchableOpacity, View } from "react-native";
import FlagManga from "~components/FlagManga";
import ImageCover from "~components/ImageCover";
import { chapterTitle, fromNow, keyDefault } from "~globals";
import { useMangadexChapter } from "~hooks/Mangadex";
import { MangaMangadex } from "~types";

function ListItem(props: { item: MangaMangadex }) {
  const { item } = props;
  const navigation = useNavigation<RootStack>();
  const chapter = useMangadexChapter(item.attributes?.latestUploadedChapter);
  const attributes = chapter?.attributes;

  function onMangaLink() {
    navigation.push("Manga", { mangaId: item.id });
  }

  return (
    <TouchableOpacity className="w-full flex-row gap-x-2" onPress={onMangaLink}>
      <View className="w-32 h-32">
        <ImageCover item={item} />
      </View>
      <View className="flex-1 justify-center">
        <View className="flex-row items-center gap-x-2">
          <View className="w-6 h-6">
            <FlagManga lang={item.attributes?.originalLanguage} />
          </View>
          <Text
            className="font-bold text-base flex-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {keyDefault("en", item.attributes?.title)}
          </Text>
        </View>
        <Text className="my-2" numberOfLines={2} ellipsizeMode="tail">
          {item?.attributes?.tags
            ?.map((item) => keyDefault("en", item.attributes?.name))
            .join(", ")}
        </Text>
        <View className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center gap-x-2 overflow-hidden">
            <View className="w-6 h-6">
              <FlagManga lang={attributes?.translatedLanguage} />
            </View>
            <Text className="flex-1" numberOfLines={1} ellipsizeMode="tail">
              {chapterTitle(attributes?.title, attributes?.chapter)}
            </Text>
          </View>
          <Text numberOfLines={1} ellipsizeMode="tail">
            {fromNow(attributes?.updatedAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default ListItem;

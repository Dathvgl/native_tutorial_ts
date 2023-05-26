import { Text, View } from "react-native";
import FlagManga from "~components/FlagManga";
import { fromNow } from "~globals";
import { useMangadexChapter } from "~hooks/Mangadex";

function HomeItem(props: { chapterId?: string }) {
  const { chapterId } = props;
  const chapter = useMangadexChapter(chapterId);
  const attributes = chapter?.attributes;

  return (
    <View>
      <View className="flex-row gap-2 overflow-hidden items-center">
        <View className="w-6 h-6">
          <FlagManga lang={attributes?.translatedLanguage} />
        </View>
        <Text className="flex-1" numberOfLines={1} ellipsizeMode="tail">
          {attributes?.title
            ? `Ch. ${attributes?.chapter}: ${attributes?.title}`
            : attributes?.chapter
            ? `Ch. ${attributes?.chapter}`
            : "Oneshot"}
        </Text>
      </View>
      <View className="flex-row justify-end">
        <Text numberOfLines={1} ellipsizeMode="tail">
          {fromNow(attributes?.updatedAt)}
        </Text>
      </View>
    </View>
  );
}

export default HomeItem;

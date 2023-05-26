import { Text, TouchableOpacity, View } from "react-native";

type MangaChapterMoveProps = {
  onPrevChapter?: () => void;
  onNextChapter?: () => void;
};

function MangaChapterMove(props: MangaChapterMoveProps) {
  const { onPrevChapter, onNextChapter } = props;

  const btnName = "flex-1 flex-row justify-center items-center p-2";
  const textName = "font-bold text-base"

  function altChapter(check: boolean) {
    if (check) onNextChapter?.();
    else onPrevChapter?.();
  }

  return (
    <View className="w-full flex-row border-y-2 divide-x-2">
      <TouchableOpacity className={btnName} onPress={() => altChapter(false)}>
        <Text className={textName}>Previous</Text>
      </TouchableOpacity>
      <TouchableOpacity className={btnName} onPress={() => altChapter(true)}>
        <Text className={textName}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

export default MangaChapterMove;

import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import useDebounce from "~hooks/Debounce";

type ListHeaderType = {
  openModal: (check: boolean) => void;
  onTitleChange: (title?: string) => void;
};

function ListHeader(props: ListHeaderType) {
  const { openModal, onTitleChange } = props;
  const btnName = "rounded-xl px-3 py-1 text-base";

  const [text, setText] = useState<string>();
  const title = useDebounce(text);

  function onSearch() {
    onTitleChange(title);
  }

  return (
    <View
      style={{ gap: 16 }}
      className="w-full flex-row px-2 py-4 items-center justify-between"
    >
      <TouchableOpacity
        className={`${btnName} bg-green-300`}
        onPress={() => openModal(true)}
      >
        <Text>Filter</Text>
      </TouchableOpacity>
      <TextInput
        className="border pl-2 rounded flex-1"
        placeholder="Title"
        value={text}
        onChangeText={setText}
      />
      <TouchableOpacity className={`${btnName} bg-blue-300`} onPress={onSearch}>
        <Text>Search</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ListHeader;

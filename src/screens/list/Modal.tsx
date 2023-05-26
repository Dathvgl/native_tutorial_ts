import { useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { SBHeight, SBWidth } from "~components/SizeBox";
import { keyDefault } from "~globals";
import { TagMangadex } from "~types";

type ListModalProps = {
  tags?: TagMangadex[];
  search: ObjTagType;
  modalState: boolean;
  callback: (objTag: ObjTagType) => void;
};

export type ObjTagType = {
  includedTags: { [key: string]: boolean };
  excludedTags: { [key: string]: boolean };
};

type ObjTagState = "include" | "exclude" | "none";

const numColumns = 3;

function ListModal(props: ListModalProps) {
  const { tags, search, modalState, callback } = props;

  const list =
    (tags?.length ?? 0) % numColumns == 0
      ? tags
      : [
          ...(tags ?? []),
          ...(Array(
            numColumns - ((tags?.length ?? 0) % numColumns)
          ) as TagMangadex[]),
        ];

  const [objTag, setObjTag] = useState<ObjTagType>(search);

  function altId(state: ObjTagState, id?: string) {
    if (!id) return;

    switch (state) {
      case "include":
        setObjTag(() => ({
          ...objTag,
          includedTags: { ...objTag.includedTags, [id]: true },
        }));
        break;
      case "exclude":
        setObjTag(() => ({
          includedTags: { ...objTag.includedTags, [id]: false },
          excludedTags: { ...objTag.excludedTags, [id]: true },
        }));
        break;
      case "none":
        setObjTag(() => ({
          ...objTag,
          excludedTags: { ...objTag.excludedTags, [id]: false },
        }));
        objTag.excludedTags[id] = false;
        break;
    }
  }

  function onClose() {
    callback(objTag);
  }

  function onReset() {
    setObjTag(() => ({ includedTags: {}, excludedTags: {} }));
  }

  return (
    <Modal visible={modalState} transparent animationType="fade">
      <View
        style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
        className="absolute w-full h-full items-center justify-center"
      >
        <View className="w-[90%] h-4/5 rounded bg-white p-3">
          <FlatList
            data={list}
            numColumns={numColumns}
            columnWrapperStyle={{
              gap: 8,
              alignItems: "center",
              justifyContent: "space-between",
            }}
            ItemSeparatorComponent={() => <View className="h-3" />}
            renderItem={({ item, index }) => {
              if (!item) return <View key={index} className="flex-1" />;

              const include = objTag.includedTags[item!.id!];
              const exclude = objTag.excludedTags[item!.id!];
              const state: ObjTagState = include
                ? "exclude"
                : exclude
                ? "none"
                : "include";

              return (
                <View key={index} className="flex-1">
                  <TouchableOpacity
                    className={`border p-2 rounded ${
                      state == "exclude"
                        ? "bg-green-300"
                        : state == "none"
                        ? "bg-red-300"
                        : ""
                    }`}
                    onPress={() => altId(state, item.id)}
                  >
                    <Text className="text-center">
                      {keyDefault("en", item.attributes?.name)}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
          <SBHeight />
          <View className="w-full flex-row">
            <TouchableOpacity
              className="flex-1 p-2 bg-lime-300 rounded"
              onPress={onReset}
            >
              <Text className="text-center">Reset</Text>
            </TouchableOpacity>
            <SBWidth />
            <TouchableOpacity
              className="flex-1 p-2 bg-blue-300 rounded"
              onPress={onClose}
            >
              <Text className="text-center">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default ListModal;

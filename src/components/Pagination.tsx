import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const DotIcon = <IconMaterialCommunityIcons name="dots-horizontal" size={20} />;

type PaginationItemProps = {
  active?: number;
  item?: number;
  element?: JSX.Element;
  onPageClick?: () => void;
};

function PaginationItem(props: PaginationItemProps) {
  const { active, item, element, onPageClick } = props;
  const className =
    "flex-row items-center justify-center h-8 rounded-lg border";

  function touchable(type: string) {
    if (type == "element") return;
    onPageClick?.();
  }

  if (item) {
    const itemName = `px-2 ${className} ${active == item ? "bg-red-300" : ""}`;
    return (
      <TouchableOpacity
        style={{ minWidth: 32 }}
        className={itemName}
        disabled={active == item}
        onPress={() => touchable("item")}
      >
        <Text>{item}</Text>
      </TouchableOpacity>
    );
  }

  if (element) {
    return (
      <TouchableOpacity
        style={{ width: 32 }}
        className={className}
        onPress={() => touchable("element")}
      >
        {element}
      </TouchableOpacity>
    );
  }

  return <></>;
}

type PaginationProps = {
  total: number;
  arrow?: boolean;
  pageRange?: number;
  onPageChange?: (index: number) => void;
};

function Pagination({
  total,
  arrow,
  pageRange = 3,
  onPageChange,
}: PaginationProps) {
  const [index, setIndex] = useState(1);
  const [textNum, setTextNum] = useState("");

  const arrowName = "border p-2 w-1/5 flex-row justify-center";

  function indexPage(newIndex: number) {
    if (newIndex < 1 || newIndex > total) return;
    setIndex(() => newIndex);
    onPageChange?.(newIndex);
  }

  function iconPage(alt: number) {
    const newIndex = index + alt;
    indexPage(newIndex);
  }

  function goPage() {
    try {
      const newIndex = Number.parseInt(textNum);
      if (newIndex == index) return;
      indexPage(newIndex);
    } finally {
      setTextNum(() => "");
    }
  }

  function choosePage(newIndex: number) {
    indexPage(newIndex);
  }

  function blankPage() {
    const array: JSX.Element[] = [];
    if (pageRange + 2 > total) {
      for (let i = 2; i < total; i++) {
        array.push(
          <PaginationItem
            active={index}
            item={i}
            onPageClick={() => choosePage(i)}
          />
        );
      }

      return array;
    }

    const startRange = 1 + pageRange;
    if (startRange > index) {
      for (let i = 2; i < startRange; i++) {
        array.push(
          <PaginationItem
            active={index}
            item={i}
            onPageClick={() => choosePage(i)}
          />
        );
      }

      array.push(
        <PaginationItem
          active={index}
          item={startRange}
          onPageClick={() => choosePage(startRange)}
        />
      );

      array.push(<PaginationItem element={DotIcon} />);
      return array;
    }

    const endRange = total - pageRange;
    if (endRange < index) {
      array.push(<PaginationItem element={DotIcon} />);
      array.push(
        <PaginationItem
          active={index}
          item={endRange}
          onPageClick={() => choosePage(endRange)}
        />
      );

      for (let i = endRange + 1; i < total; i++) {
        array.push(
          <PaginationItem
            active={index}
            item={i}
            onPageClick={() => choosePage(i)}
          />
        );
      }

      return array;
    }

    array.push(<PaginationItem element={DotIcon} />);
    array.push(
      <PaginationItem
        active={index}
        item={index - 1}
        onPageClick={() => choosePage(index - 1)}
      />
    );
    array.push(
      <PaginationItem
        active={index}
        item={index}
        onPageClick={() => choosePage(index)}
      />
    );
    array.push(
      <PaginationItem
        active={index}
        item={index + 1}
        onPageClick={() => choosePage(index + 1)}
      />
    );
    array.push(<PaginationItem element={DotIcon} />);
    return array;
  }

  return (
    <View className="flex-col">
      {total > 1 && (
        <View>
          <View className="flex-row items-center justify-center gap-x-2">
            <PaginationItem
              active={index}
              item={1}
              onPageClick={() => choosePage(1)}
            />
            {blankPage().map((item, index) => (
              <View key={index}>{item}</View>
            ))}
            <View style={{ width: 0.1 }} />
            <PaginationItem
              active={index}
              item={total}
              onPageClick={() => choosePage(total)}
            />
          </View>
          <View className="h-2" />
          <View
            className={`flex-row items-center gap-2 ${arrow ? "" : "px-10"}`}
          >
            {arrow && (
              <TouchableOpacity
                className={arrowName}
                disabled={index == 1}
                onPress={() => iconPage(-1)}
              >
                <IconFontAwesome name="long-arrow-left" size={25} />
              </TouchableOpacity>
            )}
            <TextInput
              className="flex-1 border text-center rounded"
              value={textNum}
              onChangeText={setTextNum}
              keyboardType="numeric"
            />
            <TouchableOpacity
              className="border px-2 py-1 rounded-lg"
              onPress={goPage}
            >
              <Text className="text-base">Go</Text>
            </TouchableOpacity>
            {arrow && (
              <TouchableOpacity
                className={arrowName}
                disabled={index == total}
                onPress={() => iconPage(1)}
              >
                <IconFontAwesome name="long-arrow-right" size={25} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

export default Pagination;

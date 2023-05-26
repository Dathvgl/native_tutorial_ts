import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Pagination from "~components/Pagination";
import { SBHeight } from "~components/SizeBox";
import MangadexService from "~models/MangadexService";
import { MangaMangadex, MangaSearchMangadex, TagMangadex } from "~types";
import ListItem from "./Item";
import ListModal, { ObjTagType } from "./Modal";
import { keyDefault } from "~globals";
import ListHeader from "./Header";

const limit = 10;

function ListScreen() {
  const refFlat = useRef<FlatList>(null);

  const [modalState, setModalState] = useState(false);
  const [total, setTotal] = useState(0);
  const [tags, setTags] = useState<TagMangadex[]>();
  const [mangas, setMangas] = useState<MangaMangadex[]>();

  const [search, setSearch] = useState<MangaSearchMangadex>({
    limit,
    offset: 0,
  });

  useEffect(() => {
    initTag();
  }, []);

  useEffect(() => {
    initSearch();
  }, [search]);

  async function initTag() {
    const res = await MangadexService.mangaTag();
    setTags(() =>
      res?.sort((a, b) => {
        const indexA: string = keyDefault("en", a.attributes?.name) ?? "";
        const indexB: string = keyDefault("en", b.attributes?.name) ?? "";
        return indexA.localeCompare(indexB);
      })
    );
  }

  async function initSearch() {
    const res = await MangadexService.listSearch(search);
    setMangas(() => res?.data);
    setTotal(() => Math.ceil((res?.total ?? 0) / limit));
  }

  function onPageChange(index: number) {
    refFlat.current?.scrollToOffset({ offset: 0, animated: true });
    setSearch(() => ({ ...search, offset: limit * (index - 1) }));
  }

  function onTitleChange(title?: string) {
    if (!title) return;
    setSearch(() => ({ ...search, title }));
  }

  function onCloseModal(objTag: ObjTagType) {
    setModalState(() => false);

    const includedTags = Object.keys(objTag.includedTags).filter(
      (key) => objTag.includedTags[key] == true
    );

    const excludedTags = Object.keys(objTag.excludedTags).filter(
      (key) => objTag.excludedTags[key] == true
    );

    setSearch(() => ({ ...search, includedTags, excludedTags }));
  }

  return (
    <View className="flex-1">
      <ListModal
        tags={tags}
        search={
          {
            includedTags:
              search.includedTags?.reduce(
                (obj, item) => Object.assign(obj, { [item]: true }),
                "none"
              ) ?? {},
            excludedTags:
              search.excludedTags?.reduce(
                (obj, item) => Object.assign(obj, { [item]: true }),
                "none"
              ) ?? {},
          } as ObjTagType
        }
        modalState={modalState}
        callback={onCloseModal}
      />
      <FlatList
        ref={refFlat}
        className="flex-1"
        data={mangas}
        ItemSeparatorComponent={() => <SBHeight />}
        ListHeaderComponent={() => {
          return (
            <ListHeader
              openModal={(check) => setModalState(() => check)}
              onTitleChange={onTitleChange}
            />
          );
        }}
        renderItem={({ item, index }) => {
          return <ListItem key={index} item={item} />;
        }}
      />
      <SBHeight />
      <Pagination total={total} onPageChange={onPageChange} />
    </View>
  );
}

export default ListScreen;

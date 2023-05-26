import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "App";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import ImageCover from "~components/ImageCover";
import { SBHeight } from "~components/SizeBox";
import { keyDefault } from "~globals";
import MangadexService from "~models/MangadexService";
import { MangaMangadex } from "~types";
import MangaScroll from "./Scroll";

type MangaScreenProps = NativeStackScreenProps<RootStackParamList, "Manga">;

const Tab = createMaterialTopTabNavigator();
const TabNavigator = Tab.Navigator;
const TabScreen = Tab.Screen;

function MangaScreen({ route }: MangaScreenProps) {
  const { mangaId } = route.params;
  const [manga, setManga] = useState<MangaMangadex>();

  useEffect(() => {
    init();
  }, [mangaId]);

  async function init() {
    const res = await MangadexService.mangaDetail(mangaId);
    setManga(() => res);
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} nestedScrollEnabled>
      <View className="relative">
        <View className="absolute w-full h-36 bg-green-200">
          <ImageCover blurRadius={2} item={manga} />
        </View>
        <View className="flex-row gap-2 items-center px-4 pt-16">
          <View className="w-5/12 h-44">
            <ImageCover item={manga} />
          </View>
          <View className="flex-col h-44 justify-between flex-1">
            <Text
              className="font-bold pt-3 text-base text-justify"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {keyDefault("en", manga?.attributes?.title)}
            </Text>
            <Text className="pb-4" numberOfLines={4} ellipsizeMode="tail">
              {manga?.attributes?.tags
                ?.map((item) => keyDefault("en", item.attributes?.name))
                .join(", ")}
            </Text>
          </View>
        </View>
      </View>
      <SBHeight />
      <SBHeight />
      <View style={{ height: 450 }}>
        <TabNavigator
          initialRouteName="Info"
          screenOptions={{
            lazy: true,
            tabBarStyle: { marginBottom: 10, height: 40 },
            tabBarIconStyle: { display: "none" },
          }}
        >
          <TabScreen
            name="Info"
            options={{ tabBarLabelStyle: styles.tabBarStyle }}
          >
            {() => {
              return (
                <View className="px-4">
                  <Text
                    className="text-base text-justify"
                    numberOfLines={16}
                    ellipsizeMode="tail"
                  >
                    {keyDefault("en", manga?.attributes?.description)}
                  </Text>
                </View>
              );
            }}
          </TabScreen>
          <TabScreen
            name="Scroll"
            options={{
              tabBarLabelStyle: styles.tabBarStyle,
              tabBarContentContainerStyle: { flex: 1 },
            }}
          >
            {() => (
              <View>
                <MangaScroll mangaId={mangaId} />
              </View>
            )}
          </TabScreen>
        </TabNavigator>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    fontSize: 15,
    paddingBottom: 10,
  },
});

export default MangaScreen;

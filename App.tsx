import { NavigationContainer } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppScreen, InitScreen, RootHeader } from "~screens/Init";
import MangaScreen from "~screens/manga/Manga";
import MangaChapterScreen from "~screens/manga/chapter.tsx/Chapter";

export type RootStackParamList = {
  Init: undefined;
  App: undefined;
  Manga: { mangaId?: string };
  MangaChapter: {
    mangaId?: string;
    chapterId?: string;
    chapterIndex?: string;
    lang?: string;
  };
};

export type RootStack = NativeStackNavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();
const StackNavigator = Stack.Navigator;
const StackScreen = Stack.Screen;

function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <StackNavigator
          initialRouteName="App"
          screenOptions={{
            header: RootHeader,
            headerShown: false,
          }}
        >
          <StackScreen name="Init" component={InitScreen} />
          <StackScreen name="App" component={AppScreen} />
          <StackScreen
            name="Manga"
            component={MangaScreen}
            options={{ headerShown: true }}
          />
          <StackScreen name="MangaChapter" component={MangaChapterScreen} />
        </StackNavigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

export default App;

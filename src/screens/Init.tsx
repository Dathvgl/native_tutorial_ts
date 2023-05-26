import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { RootStack } from "App";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";
import IconFontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ListScreen from "./list/List";
import HomeScreen from "./home/Home";

type NameList = "Home" | "List";

const Tab = createBottomTabNavigator();
const TabNavigator = Tab.Navigator;
const TabScreen = Tab.Screen;

const iconSize = 20;
const iconList = [
  { name: "Home", iconName: "home" },
  { name: "List", iconName: "book" },
];

const switchScreen = (str: NameList) => {
  switch (str) {
    case "Home":
      return <HomeScreen />;
    case "List":
      return <ListScreen />;
  }
};

export function InitScreen() {
  const navigation = useNavigation<RootStack>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.navigate("App");
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <View className="flex-1 flex-row justify-center items-center bg-green-100">
      <Text style={{ fontSize: 100 }} className="font-bold italic">
        fs
      </Text>
    </View>
  );
}

export function AppScreen() {
  return (
    <TabNavigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 50 },
        tabBarActiveTintColor: "green",
      }}
    >
      {iconList.map((item, index) => {
        const name = item.name as NameList;
        return (
          <TabScreen
            key={index}
            name={name}
            options={{
              tabBarLabelStyle: styles.tabBarStyle,
              tabBarIcon: ({ color }) => (
                <IconFontAwesome
                  name={item.iconName}
                  size={iconSize}
                  color={color}
                />
              ),
            }}
          >
            {() => switchScreen(name)}
          </TabScreen>
        );
      })}
    </TabNavigator>
  );
}

export function RootHeader({ navigation }: NativeStackHeaderProps) {
  function backIcon() {
    navigation.pop();
  }

  return (
    <View
      style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
      className="absolute w-full p-2 z-50"
    >
      <IconFontAwesome5 onPress={backIcon} name="arrow-left" size={30} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    fontSize: 12,
    paddingBottom: 5,
  },
});

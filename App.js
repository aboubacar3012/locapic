import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo, Fontisto } from "@expo/vector-icons";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();
// Redux
import pseudo from "./reducers/pseudo.reducer";
import poi from "./reducers/poi.reducer";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
const store = createStore(combineReducers({ pseudo, poi }));

// Navigation
import HomeScreen from "./components/HomeScreen";
import MapScreen from "./components/MapScreen";
import ChatScreen from "./components/ChatScreen";
import Poi from "./components/Poi";
import Profile from "./components/Profile";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabScreen = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => {
                    let iconName;
                    if (route.name === "Map") {
                        iconName = "map";
                    } else if (route.name === "Chat") {
                        iconName = "chat";
                    } else if (route.name === "POI") {
                        iconName = "heart";
                    } else if (route.name === "Profile") {
                        iconName = "user";
                    }

                    return <Entypo name={iconName} size={25} color={color} />;
                },
            })}
            tabBarOptions={{
                activeTintColor: "#eb4d4b",
                inactiveTintColor: "#FFFFFF",
                style: {
                    backgroundColor: "#130f40",
                },
            }}
        >
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Chat" component={ChatScreen} />
            <Tab.Screen name="POI" component={Poi} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
};

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Tab" component={TabScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});

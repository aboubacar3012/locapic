import { StyleSheet, Image, Text, View, Dimensions, KeyboardAvoidingView } from "react-native";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Button, Overlay, Input } from "@rneui/themed";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socketIOClient from "socket.io-client";

var socket = socketIOClient("http://10.2.2.170:3000");

const MapScreen = ({ pseudo, AddPOIRedux, poiList }) => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [addPOI, setAddPOI] = useState(false);
    const [visible, setVisible] = useState(false);
    const [overlayTitle, setOverlayTitle] = useState("");
    const [overlayDescription, setOverlayDescription] = useState("");
    const [currentPosition, setCurrentPosition] = useState({});

    const [listUser, setListUser] = useState([]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Permission to access location was denied");
                return;
            }

            Location.watchPositionAsync({ distanceInterval: 0.5 }, (location) => {
                setLocation(location.coords);
                socket.emit("userLocation", { pseudo: pseudo, coords: location.coords });
            });
        })();

        AsyncStorage.getItem("poiList", function (error, data) {
            data && AddPOIRedux(JSON.parse(data));
        });
    }, []);

    useEffect(() => {
        socket.on("sendAllUserLocation", (newUser) => {
            let listUserCopy = [...listUser];
            listUserCopy = listUserCopy.filter((user) => user.pseudo !== newUser.pseudo);
            listUserCopy.push(newUser);
            setListUser(listUserCopy);
        });
    }, []);

    // let text = "Waiting..";
    // if (errorMsg) {
    //     text = errorMsg;
    // } else if (location) {
    //     text = JSON.stringify(location);
    // }

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const handleClickOverlay = async () => {
        const currentPositionCopy = currentPosition;
        currentPosition.id = Date.now() * Math.floor(Math.random() * 999);
        currentPosition.title = overlayTitle;
        currentPosition.description = overlayDescription;
        // setListPOI([...poiList, currentPositionCopy]);
        setAddPOI(false);
        setVisible(false);
        setOverlayTitle("");
        setOverlayDescription("");
        AddPOIRedux([...poiList, currentPositionCopy]);

        AsyncStorage.setItem("poiList", JSON.stringify([...poiList, currentPositionCopy]));
    };
    // Recuperation des coordonee et mettre dans listPOI
    const handleAddPOI = (e) => {
        if (addPOI) {
            toggleOverlay();
            setCurrentPosition({
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
            });
        }
    };

    // console.log(location);

    // console.log(pseudo.pseudo);
    return (
        <View style={styles.container}>
            {location ? (
                <MapView
                    onPress={(e) => handleAddPOI(e)}
                    style={styles.map}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.1922,
                        longitudeDelta: 0.1421,
                    }}
                >
                    <Marker
                        pinColor="red"
                        coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                        title="Hello"
                        description="I am here"
                        draggable
                    />
                    {poiList.length > 0 &&
                        poiList.map((obj, index) => (
                            <Marker
                                key={index}
                                pinColor={"blue"}
                                coordinate={{ latitude: obj.latitude, longitude: obj.longitude }}
                                title={obj.title}
                                description={obj.description}
                            />
                        ))}
                </MapView>
            ) : (
                <Text>Chargement en cours .....</Text>
            )}
            <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                <KeyboardAvoidingView behavior="padding" enabled style={styles.overlay}>
                    <Input
                        style={{ marginBottom: 5 }}
                        placeholder="Titre"
                        value={overlayTitle}
                        onChangeText={(text) => setOverlayTitle(text)}
                    />
                    <Input
                        style={{ marginBottom: 5 }}
                        placeholder="Description"
                        value={overlayDescription}
                        onChangeText={(text) => setOverlayDescription(text)}
                    />
                    <Button
                        disabled={overlayTitle.length > 5 && overlayDescription.length > 10 ? false : true}
                        icon={<Entypo name="add-to-list" size={20} color="#fff" />}
                        title=" Ajouter POI"
                        buttonStyle={{ backgroundColor: "#eb4d4b" }}
                        type="solid"
                        onPress={() => handleClickOverlay()}
                    ></Button>
                </KeyboardAvoidingView>
            </Overlay>
            <Button
                title=" Add POI"
                icon={<FontAwesome name="map-marker" size={20} color="#ffffff" />}
                buttonStyle={{ backgroundColor: "#eb4d4b" }}
                type="solid"
                onPress={() => setAddPOI(!addPOI)}
            />
        </View>
    );
};
function mapStateToProps(state) {
    return { pseudo: state.pseudo, poiList: state.poi };
}

function mapDispatchToProps(dispatch) {
    return {
        AddPOIRedux: function (poi) {
            dispatch({ type: "AddPOIRedux", poi });
        },
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
// export default MapScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#fff",
        // alignItems: "center",
        // justifyContent: "center",
    },
    map: {
        flex: 1,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
    overlay: {
        width: Dimensions.get("window").width - Dimensions.get("window").width * 0.3,
    },
});

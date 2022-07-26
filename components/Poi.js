import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView } from "react-native";
import React, { useState, useEffect } from "react";
import { ListItem, Button, Input } from "@rneui/themed";
import { FontAwesome, Icon } from "@expo/vector-icons";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Poi = ({ poiList, deletePOIRedux }) => {
    const handleDeletePOI = (poi) => {
        const listPOI = poiList.filter((e) => e.latitude !== poi.latitude && e.longitude !== poi.longitude);
        AsyncStorage.setItem("poiList", JSON.stringify(listPOI));
    };

    return (
        <View style={{ flex: 1, paddingTop: 50 }}>
            {poiList.length > 0 ? (
                <ScrollView style={{ flex: 1 }}>
                    {poiList.map((obj, index) => (
                        <ListItem.Swipeable
                            key={index}
                            leftContent={(reset) => (
                                <Button
                                    title="Afficher"
                                    onPress={() => reset()}
                                    icon={{ name: "info", color: "white" }}
                                    buttonStyle={{ minHeight: "100%" }}
                                />
                            )}
                            rightContent={(reset) => (
                                <Button
                                    title="Supprimer"
                                    onPress={() => {
                                        handleDeletePOI(obj);
                                        deletePOIRedux(obj);
                                        reset();
                                    }}
                                    icon={{ name: "delete", color: "white" }}
                                    buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
                                />
                            )}
                        >
                            <FontAwesome name="map-marker" size={30} />
                            <ListItem.Content>
                                <ListItem.Title>{obj.title}</ListItem.Title>
                                <ListItem.Subtitle>{obj.description}</ListItem.Subtitle>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem.Swipeable>
                    ))}
                </ScrollView>
            ) : (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text h2>Vous n'avez rien dans votre POI</Text>
                </View>
            )}
        </View>
    );
};

function mapStateToProps(state) {
    return { poiList: state.poi };
}

function mapDispatchToProps(dispatch) {
    return {
        deletePOIRedux: function (poi) {
            dispatch({ type: "deletePOIRedux", poi });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Poi);

// export default Poi;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});

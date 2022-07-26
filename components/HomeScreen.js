import { StyleSheet, Text, View, Image, ImageBackground } from "react-native";
import React, { useState, useEffect } from "react";
import { Button, Input, Icon } from "@rneui/themed";
import { FontAwesome5 } from "@expo/vector-icons";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = (props) => {
    const [pseudo, setPseudo] = useState("");
    const [pseudoIsAlreadyExist, setPseudoIsAlreadyExist] = useState(false);

    const storeData = async (value) => {
        try {
            await AsyncStorage.setItem("pseudo", value);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const value = await AsyncStorage.getItem("pseudo");
                if (value !== null) {
                    setPseudo(value);
                    setPseudoIsAlreadyExist(true);
                }
            } catch (e) {
                console.log(e);
            }
        };
        getData();
    }, []);

    return (
        <ImageBackground style={styles.container} source={require("../assets/home.jpg")} resizeMode="cover">
            {pseudoIsAlreadyExist ? (
                <Text style={{ fontWeight: "bold", marginBottom: 30 }}>Welcome back {pseudo}</Text>
            ) : (
                <Input
                    placeholder="enter your pseudo"
                    leftIcon={<FontAwesome5 name="user" size={24} color="#eb4d4b" />}
                    onChangeText={(text) => setPseudo(text)}
                    value={pseudo}
                    style={{ width: "70%", color: "#fff" }}
                />
            )}
            <Button
                // disabled={pseudo.length > 3 ? false : true}
                onPress={() => {
                    props.setPseudo(pseudo);
                    storeData(pseudo);
                    props.navigation.navigate("Tab", { screen: "Map" });
                }}
            >
                <Icon name="map" color="white" />
                Go to Map
            </Button>
        </ImageBackground>
    );
};

function mapDispatchToProps(dispatch) {
    return {
        setPseudo: function (pseudo) {
            dispatch({ type: "setPseudo", pseudo });
        },
    };
}

export default connect(null, mapDispatchToProps)(HomeScreen);

// export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        flex: 1,
        justifyContent: "center",
        opacity: 0.7,
    },
});

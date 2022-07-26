import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView } from "react-native";
import React, { useState, useEffect } from "react";
import { ListItem, Button, Input } from "@rneui/themed";
import { FontAwesome } from "@expo/vector-icons";
import { connect } from "react-redux";
import socketIOClient from "socket.io-client";

var socket = socketIOClient("http://10.2.2.170:3000");

const ChatScreen = ({ pseudo }) => {
    const [messageList, setMessageList] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [message, setMessage] = useState("");
    useEffect(() => {
        socket.on("sendMessageToAll", (object) => {
            setMessage(object.message);
            setMessageList([...messageList, { pseudo: object.pseudo, message: object.message }]);
        });
    }, [messageList]);

    const handleSocket = () => {
        console.log("Socket");
        socket.emit("sendMessage", { message: inputValue, pseudo: pseudo.pseudo });
        setInputValue("");
    };
    const pseudoVerify = (pseudo) => {
        console.log(pseudo);
        if (pseudo.pseudo === pseudo) return { backgroundColor: "blue" };
        else return { backgroundColor: "red" };
    };
    // console.log(messageList);
    return (
        <View style={{ flex: 1, marginTop: 50 }}>
            <Text>ChatScreen</Text>
            <ScrollView style={{ flex: 1 }}>
                {messageList.length > 0 &&
                    messageList.map((msg, index) => {
                        return (
                            <ListItem
                                key={index}
                                containerStyle={pseudo.pseudo === msg.pseudo && { backgroundColor: "blue" }}
                            >
                                <ListItem.Content>
                                    <ListItem.Title>{msg.pseudo}</ListItem.Title>
                                    <ListItem.Subtitle>{msg.message}</ListItem.Subtitle>
                                </ListItem.Content>
                            </ListItem>
                        );
                    })}
            </ScrollView>
            <KeyboardAvoidingView behavior="padding" enabled>
                <Input
                    value={inputValue}
                    onChangeText={(Text) => setInputValue(Text)}
                    style={{ marginBottom: 5 }}
                    placeholder="Your message"
                />
                <Button
                    onPress={() => handleSocket()}
                    icon={<FontAwesome name="envelope-o" size={20} color="#fff" />}
                    title=" Send"
                    buttonStyle={{ backgroundColor: "#eb4d4b" }}
                    type="solid"
                />
            </KeyboardAvoidingView>
        </View>
    );
};

function mapStateToProps(state) {
    return { pseudo: state.pseudo };
}

// function mapDispatchToProps(dispatch) {
//     return {
//         AddPOIRedux: function (poi) {
//             dispatch({ type: "AddPOIRedux", poi });
//         },
//     };
// }
export default connect(mapStateToProps, null)(ChatScreen);
// export default ChatScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});

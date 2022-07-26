import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";
import { Avatar, Input, Button } from "@rneui/themed";
import { connect } from "react-redux";
const Profile = ({ pseudo }) => {
    const gender = ["men", "women"];
    return (
        <View style={styles.container}>
            <View>
                <Text style={{ fontSize: 40, textAlign: "center", marginBottom: 20 }}>Profile</Text>
            </View>
            <View style={{ marginTop: 10, marginBottom: 10, alignItems: "center" }}>
                <Avatar
                    size={80}
                    rounded
                    source={{
                        uri: `https://randomuser.me/api/portraits/${gender[Math.floor(Math.random() * 1)]}/${Math.floor(
                            Math.random() * 99
                        )}.jpg`,
                    }}
                    title="Bj"
                    containerStyle={{ backgroundColor: "grey" }}
                >
                    <Avatar.Accessory size={23} />
                </Avatar>
            </View>
            <View style={styles.inputs}>
                <Input value={pseudo.pseudo} placeholder="pseudo" />
                <Input placeholder="email" />
                <Input placeholder="password" />
                <Input placeholder="confirm password" />
                <Button color="secondary">save changes</Button>
            </View>
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
export default connect(mapStateToProps, null)(Profile);
// export default Profile;

const styles = StyleSheet.create({
    container: {
        paddingTop: Dimensions.get("window").height - (Dimensions.get("window").height * 90) / 100,
        flex: 1,
        backgroundColor: "#fff",
        // alignItems: "center",
        // justifyContent: "center",
    },
    inputs: {
        flex: 1,
        alignItems: "center",
        marginLeft: 40,
        marginRight: 40,
    },
});

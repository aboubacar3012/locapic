export default function (pseudo = {}, action) {
    if (action.pseudo) {
        if (action.type === "setPseudo") {
            return { pseudo: action.pseudo };
        } else {
            return pseudo;
        }
    } else return { pseudo: "Unknown User" };
}

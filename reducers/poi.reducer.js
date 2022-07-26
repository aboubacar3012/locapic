export default function (poi = [], action) {
    console.log("POI Reducer: ", poi);
    if (action.type === "AddPOIRedux") {
        return action.poi;
    } else if (action.type === "deletePOIRedux") {
        // console.log("Suppression de l'bojet");
        // console.log(action.poi);r
        return poi.filter((obj) => obj.title !== action.poi.title);
    } else {
        return poi;
    }
}

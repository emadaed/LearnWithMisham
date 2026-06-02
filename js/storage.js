function saveHighlight(id){

    let highlights =
        JSON.parse(
            localStorage.getItem("highlights")
        ) || [];

    if(!highlights.includes(id)){

        highlights.push(id);

        localStorage.setItem(
            "highlights",
            JSON.stringify(highlights)
        );
    }
}

function getHighlights(){

    return JSON.parse(
        localStorage.getItem("highlights")
    ) || [];
}
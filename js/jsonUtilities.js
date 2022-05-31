const masterFile = "../json/artists.json"

const localJson = "currentPage";

async function readJson(fileUrl) { //Reads the whole json file and returns it as a javascript object
    try {
        const response = await fetch(fileUrl);
        const jsonContent = await response.json();
        return jsonContent;
    } catch (error) {
        console.log(error);
    }
}

function storeData(tag, data) {
    localStorage.setItem(tag, data);
}

function retrieveLocalData(tag) {
    return localStorage.getItem(tag);
}

function storeDataAsJSON(tag, data) {
    localStorage.setItem(tag, JSON.stringify(data));
}

function retrieveLocalDataAsJSON(tag, data) {
    data = localStorage.getItem(tag);
    return JSON.parse(data);
}
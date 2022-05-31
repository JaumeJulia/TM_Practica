const masterFile = "../json/artists.json"

/* function readJson(fileUrl) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', fileUrl);
    xhr.responseType = 'text';
    xhr.send();
    var jsonContent;
    //xhr.onload = function() {
    jsonContent = JSON.parse(xhr.response); // readyState will be 4
    //};
    return jsonContent;
} */
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

function readLocalJson() {
    let pageContent = localStorage.getItem(localJson);
    return JSON.parse(pageContent);
}

async function writeLocalJson(updatedPageContent) {
    let pageContent = JSON.stringify(updatedPageContent);
    localStorage.setItem(localJson, pageContent);
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

//Doesn't work properly

async function modifyJson(fileUrl, data, artistName) { //TODO
    var jsonFile = await readJson(fileUrl);

    const response = await fetch(fileUrl, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const responseText = await response.text();
    console.log(responseText);
}

async function writeJson() { //TODO
    if (fileUrl !== masterFile) {
        //write json file if it's not the masterFile, we don't want to lose all data.
        const response = await fetch(fileUrl, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const responseText = await response.text();
        console.log(responseText);
    }
}

async function addComent(data, artistName, author) {
    var jsonFile = await readJson(masterFile);
    var comment = { "author": author, "text": data };
    for (i = 0; i < jsonFile.lenght; i++) {
        if (jsonFile.name === artistName) {
            jsonFile.Review.add(comment);
            break;
        }
    }
    const response = await fetch(masterFile, {
        method: 'POST',
        body: JSON.stringify(jsonFile),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const responseText = await response.text();
    console.log(responseText);
}
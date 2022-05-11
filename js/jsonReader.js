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


//estas funciones estan comentadas y incompletas porque no creo que sea util modificar archivos en el server desde el cliente

/* function modifyJson(fileUrl) {

}

function writeJson(){
    if (fileUrl !== masterFile) {
        //write json file if it's not the masterFile, we don't want to lose all data.
        
    }
} */
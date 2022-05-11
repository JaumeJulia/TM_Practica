/*!
 * Start Bootstrap - Modern Business v5.0.6 (https://startbootstrap.com/template-overviews/modern-business)
 * Copyright 2013-2022 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-modern-business/blob/master/LICENSE)
 */
// This file is intentionally blank
// Use this file to add JavaScript to your project

async function updateCurrentPage(choosenArtist) {
    const url = "../json/artists.json";
    const jsonContent = await readJson(url);
    var artist = jsonContent.Person.filter(findArtist);

    function findArtist(jsonContent) {
        return jsonContent.name === choosenArtist;
    }
    document.getElementById("prueba").innerHTML = artist[0].name;
    writeLocalJson(artist[0]);
    loadPage(artist[0]);
}

function loadPage() { //it will load the page with the localStorage Contents

}

function loadPage(pageContent) { // it will load the page with the contents found within the variable pageContent

}

function prueba(artist) {
    const fileUrl = "../json/artists.json";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', fileUrl);
    xhr.responseType = 'text';
    xhr.send();
    var jsonContent;
    xhr.onload = function() {
        jsonContent = JSON.parse(xhr.response); // readyState will be 4
        console.log(jsonContent);
        //alert(artist);
        var display = jsonContent.Person.filter(findArtist); //esta es la linea que no funciona
        console.log(display);

        function findArtist(jsonContent) {
            return jsonContent.name === artist;
        }
        /* var display = jsonContent.Person.filter((buffer) => {
            buffer.name === artist;
        }); */
        //alert(display);
        document.getElementById("prueba").innerHTML = display[0].name;
        //document.getElementById("prueba").innerHTML = jsonContent.Person[0].name;
    };
}

/* var prueba = function() {
    document.getElementById("prueba").innerHTML = "HA CAMBIADO AL FIN";
} */

/* $(document).ready(function() {
    const fileUrl = "../json/artists.json";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', fileUrl);
    xhr.responseType = 'text';
    xhr.send();
    var jsonContent;
    xhr.onload = function() {
        jsonContent = JSON.parse(xhr.response); // readyState will be 4
        document.getElementById("prueba").innerHTML = jsonContent.Person[0].name;
    };
    $("#prueba").html("LA TENGO MUY GRANDE JODEEEEER");
}); */

/* asyncfunction readJson(fileUrl, data) {
    const fetchJson = async() => {
        try {
            data = await fetch(fileUrl);
            const response = await data.json();
        } catch (error) {
            console.log(error);
        }
    };
} */

/* async f() {
    await readJson
} */
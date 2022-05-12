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
    var pageContent = readLocalJson();
    document.getElementById("artist_name").innerHTML = pageContent.name; //this changes the artist name
    document.getElementById("artist_introduction").innerHTML = pageContent.knowsAbout; //this changes the artist presentation
    document.getElementById("artist_video").setAttribute("src", pageContent.url); //this changes the video that is shown

    var album = document.getElementById("album_card");
    //TODO eliminar el contenido de "album_section" justo aqui
    document.getElementById("album_section").childNodes = null;
    for (var i = 0; i < pageContent.MusicAlbum.length; i++) {

        // LO SIENTO, ESTO VA A SER FEO DE COJONES //

        //meter la image
        album.childNodes[0].childNodes[0].setAttribute("src", pageContent.MusicAlbum[i].image);
        //meter urlSpotify
        album.childNodes[0].childNodes[1].childNodes[0].setAttribute("href", pageContent.MusicAlbum[i].url.urlSpotify);
        //meter urlYoutube
        album.childNodes[0].childNodes[1].childNodes[1].setAttribute("href", pageContent.MusicAlbum[i].url.urlYoutube);
        //meter name
        album.childNodes[1].childNodes[0].innerHTML = pageContent.MusicAlbum[i].name;
        //meter canciones
        album.childNodes[1].childNodes[1].firstChild = generateSongList();
        //append
        document.getElementById("album_section").appendChild(album);
    }

    // No siempre podremos encontrar eventos en la pagina anterior, por lo que habria que pensar en la idea de generar el html
    // en lugar de copiarlo y modificarlo.

    /* var events = document.getElementById("event_table");
    //TODO eliminar el contenido de "event_table"
    for (var i = 0; i < pageContent.Event.length; i++){
        //generar la etiqueta html
        

        //meter la startDate
        //meter la location
        //meter la url
        //append al elemento html que contiene los conciertos
    } */
}

function loadPage(pageContent) { // it will load the page with the contents found within the variable pageContent
    document.getElementById("artist_name").innerHTML = pageContent.name; //this changes the artist name
    document.getElementById("artist_introduction").innerHTML = pageContent.knowsAbout; //this changes the artist presentation
    document.getElementById("artist_video").setAttribute("src", pageContent.url); //this changes the video that is shown

    console.log(pageContent.MusicAlbum.length);

    let album = document.getElementById("album_card");
    document.getElementById("album_section").innerHTML = "";
    album.removeAttribute("id");
    //document.getElementById("album_section").childNodes = null; // erases album_section content so it can be filled up accordingly
    for (var i = 0; i < pageContent.MusicAlbum.length; i++) {
        //let album = albumFormat;
        // LO SIENTO, ESTO VA A SER ILEGIBLE DE COJONES //

        //meter la image
        album.childNodes[1].childNodes[1].setAttribute("src", pageContent.MusicAlbum[i].image);
        //meter urlSpotify
        album.childNodes[1].childNodes[3].childNodes[1].setAttribute("href", pageContent.MusicAlbum[i].url.urlSpotify);
        //meter urlYoutube
        album.childNodes[1].childNodes[3].childNodes[3].setAttribute("href", pageContent.MusicAlbum[i].url.urlYoutube);
        //meter name
        album.childNodes[3].childNodes[1].innerHTML = pageContent.MusicAlbum[i].name;
        console.log(pageContent.MusicAlbum[i].name);
        //meter canciones
        //console.log(album.childNodes[3].childNodes[3].childNodes);
        album.childNodes[3].childNodes[3].innerHTML = generateSongList(pageContent.MusicAlbum[i]);
        //append
        console.log(document.getElementById("album_section"));
        document.getElementById("album_section").appendChild(album.cloneNode(true));
    }
    console.log(document.getElementById("album_section"));
}

function generateSongList(musicAlbum) {
    var songList = "<ol>"
    for (var i = 0; i < musicAlbum.MusicRecording.length; i++) {
        songList = songList + "<li>" + musicAlbum.MusicRecording[i].name + "</li>";
    }
    songList = songList + "</ol>";
    return songList;
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
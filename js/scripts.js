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
    document.getElementById("album_section").childNodes = null;
    for (var i = 0; i < pageContent.MusicAlbum.length; i++) {
        //changing image
        album.childNodes[1].childNodes[1].setAttribute("src", pageContent.MusicAlbum[i].image);
        //changing urlSpotify
        album.childNodes[1].childNodes[3].childNodes[1].setAttribute("href", pageContent.MusicAlbum[i].url.urlSpotify);
        //changing urlYoutube
        album.childNodes[1].childNodes[3].childNodes[3].setAttribute("href", pageContent.MusicAlbum[i].url.urlYoutube);
        //changing name
        album.childNodes[3].childNodes[1].innerHTML = pageContent.MusicAlbum[i].name;
        console.log(pageContent.MusicAlbum[i].name);
        //introducing songs
        album.childNodes[3].childNodes[3].innerHTML = generateSongList(pageContent.MusicAlbum[i]);
        //append
        document.getElementById("album_section").appendChild(album.cloneNode(true));
    }

}

function loadPage(pageContent) { // it will load the page with the contents found within the variable pageContent
    document.getElementById("artist_name").innerHTML = pageContent.name; //this changes the artist name
    document.getElementById("artist_introduction").innerHTML = pageContent.knowsAbout; //this changes the artist presentation
    document.getElementById("artist_video").setAttribute("src", pageContent.url); //this changes the video that is shown

    let album = document.getElementById("album_card");
    document.getElementById("album_section").innerHTML = ""; // erases album_section content so it can be filled up accordingly 
    for (var i = 0; i < pageContent.MusicAlbum.length; i++) {
        //changing image
        album.childNodes[1].childNodes[1].setAttribute("src", pageContent.MusicAlbum[i].image);
        //changing urlSpotify
        album.childNodes[1].childNodes[3].childNodes[1].setAttribute("href", pageContent.MusicAlbum[i].url.urlSpotify);
        //changing urlYoutube
        album.childNodes[1].childNodes[3].childNodes[3].setAttribute("href", pageContent.MusicAlbum[i].url.urlYoutube);
        //changing name
        album.childNodes[3].childNodes[1].innerHTML = pageContent.MusicAlbum[i].name;
        console.log(pageContent.MusicAlbum[i].name);
        //introducing songs
        album.childNodes[3].childNodes[3].innerHTML = generateSongList(pageContent.MusicAlbum[i]);
        //append
        document.getElementById("album_section").appendChild(album.cloneNode(true));
    }

    var events = "<tbody>";
    for (var i = 0; i < pageContent.Event.length; i++) {
        var index = i + 1;
        events = events + '<tr><th scope="row">' + index + '</th>';
        events = events + '<td>' + pageContent.Event[i].startDate + '</td>';
        events = events + '<td>' + pageContent.Event[i].location + '</td>';
        events = events + '<td>' + pageContent.Event[i].url + '</td>';
        events = events + '</tr>';
    }
    events = events + "</tbody>";
    document.getElementById("event_table").childNodes[3].innerHTML = events;

}

function generateSongList(musicAlbum) {
    var songList = "<ol>"
    for (var i = 0; i < musicAlbum.MusicRecording.length; i++) {
        songList = songList + "<li>" + musicAlbum.MusicRecording[i].name + "</li>";
    }
    songList = songList + "</ol>";
    return songList;
}
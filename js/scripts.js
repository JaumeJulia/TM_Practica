/*!
 * Start Bootstrap - Modern Business v5.0.6 (https://startbootstrap.com/template-overviews/modern-business)
 * Copyright 2013-2022 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-modern-business/blob/master/LICENSE)
 */
// This file is intentionally blank
// Use this file to add JavaScript to your project

const urlMainJson = "../json/artists.json";

window.onload = function() {
    var storedArtist = retrieveLocalData("artistName");
    console.log(storedArtist);
    if (storedArtist == null) {
        updateCurrentPage("Rick Astley");
    } else {
        console.log("recargando la pagina desde la caché");
        updateCurrentPageWithLocalStorage(storedArtist);
    }
};

async function updateCurrentPage(artistName) {
    var storedArtist = retrieveLocalData("artistName");
    if (storedArtist === artistName) {
        console.log("Eligió el mismo artista ya elegido, no hay actualización");
    } else {
        console.log("cargando desde el json");
        const jsonContent = await readJson(urlMainJson);
        var artist = jsonContent.filter(findArtist);

        function findArtist(jsonContent) {
            return jsonContent.name === artistName;
        }
        storeData("artistName", artist[0].name);
        storeDataAsJSON("jsonContents", artist[0]);
        console.log(artist[0]);
        loadPage(artist[0]);
        WikipediaApiSearch(artist[0].name, artist[0].description);
        TwitterApiSearch(artist[0].name, artist[0].sameAs);
        console.log("Recording:");
        console.log(artist[0].MusicAlbum[0].MusicRecording[0].url[0].urlSpotify);
        spotifyPlayer(artist[0].MusicAlbum[0].MusicRecording[0].url[0].urlSpotify);
        loadComments(artist[0]);
    }
}

function updateCurrentPageWithLocalStorage(artistName) {
    loadPage(retrieveLocalDataAsJSON("jsonContents"));
    loadWikiDescription(retrieveLocalData("wiki"));
    loadTwitts(retrieveLocalData("twitter"), artistName);
    loadComments(retrieveLocalDataAsJSON("jsonContents"));
}

function loadWikiDescription(data) {
    //console.log(data);
    var blurb = $('<div></div>').html(data);
    // remove links as they will not work
    console.log(blurb);
    blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });
    // remove any references
    blurb.find('sup').remove();
    blurb.find('span').remove();
    // remove cite error
    blurb.find('ol').remove();
    console.log(blurb);
    $('#biografia').html(blurb);
}

function loadPage(pageContent) { // it will load the page with the contents found within the variable pageContent
    $('#artist_name').html(pageContent.name);
    //document.getElementById("artist_name").innerHTML = pageContent.name; //this changes the artist name
    $('#artist_introduction').html(pageContent.knowsAbout);
    //document.getElementById("artist_introduction").innerHTML = pageContent.knowsAbout; //this changes the artist presentation
    $('#artist_video').attr("src", pageContent.url);
    //document.getElementById("artist_video").setAttribute("src", pageContent.url); //this changes the video that is shown
    let album = $('#album_card')[0];
    //let album = document.getElementById("album_card");
    $('#album_section').empty();
    //document.getElementById("album_section").innerHTML = ""; // erases album_section content so it can be filled up accordingly 
    console.log(album);
    //console.log(document.getElementById("album_section"));
    //console.log(pageContent.MusicAlbum.length);
    for (var i = 0; i < pageContent.MusicAlbum.length; i++) {
        //changing image
        album.childNodes[1].childNodes[1].setAttribute("src", pageContent.MusicAlbum[i].image);
        //changing urlSpotify
        album.childNodes[1].childNodes[3].childNodes[5].setAttribute("href", pageContent.MusicAlbum[i].url[0].urlSpotify);
        //changing urlYoutube
        album.childNodes[1].childNodes[3].childNodes[1].setAttribute("href", pageContent.MusicAlbum[i].url[0].urlYoutube);
        //changing name
        album.childNodes[3].childNodes[1].innerHTML = pageContent.MusicAlbum[i].name;
        console.log(pageContent.MusicAlbum[i].name);
        //introducing songs
        album.childNodes[3].childNodes[3].innerHTML = generateSongList(pageContent.MusicAlbum[i], pageContent.genre);
        //append
        $("#album_section").append(album.cloneNode(true));
        //document.getElementById("album_section").appendChild(album.cloneNode(true));
    }

    ;
    //var eventTable = document.createElement("tbody");
    $("#event_table > tbody").empty();
    var events = "";
    for (var i = 0; i < pageContent.Event.length; i++) {
        var index = i + 1;
        events = events + '<tr><th scope="row">' + index + '</th>';
        events = events + '<div property="event" typeof="Event">';
        events = events + '<td property="startDate">' + pageContent.Event[i].startDate + '</td>';
        events = events + '<td property="location">' + pageContent.Event[i].location + '</td>';
        events = events + '<td property="url"><a href="' + pageContent.Event[i].url + '">Link</a></td>';
        events = events + '</tr>';
    }
    var eventTable = $("<tbody></tbody>").html(events);
    //eventTable.innerHTML = events;
    $("#event_table").append(eventTable);
    //document.getElementById("event_table").appendChild(eventTable);
    window.scrollTo({ top: 0 });
}

function generateSongList(musicAlbum, genre) {
    var type = 'property="track" typeof="MusicRecording"';
    var metadata = '<meta content="' + musicAlbum.MusicRecording.length + '" property="numTracks" />\n<meta content="' + genre + '" property="genre" />'
    var songList = metadata + "\n<ol>"
    for (var i = 0; i < musicAlbum.MusicRecording.length; i++) {
        songList = songList + "<li><div " + type + " onclick=\"spotifyPlayer('" + musicAlbum.MusicRecording[i].url[0].urlSpotify + "')\" class=\"text-wrap\" style=\"cursor:hand;cursor:pointer;width: 12rem;\">" + musicAlbum.MusicRecording[i].name + "</div></li>";
    }
    songList = songList + "</ol>";
    return songList;
}

function fetchSelectedGenres() {
    var selectedGenres = [];
    if (document.getElementById("pop_genre").checked) {
        console.log("popeado bro");
        selectedGenres.push("pop");
    }
    if (document.getElementById("metal_genre").checked) {
        selectedGenres.push("metal");
    }
    if (document.getElementById("fusion_genre").checked) {
        selectedGenres.push("fusion");
    }
    if (document.getElementById("electronic_genre").checked) {
        selectedGenres.push("electronic");
    }
    if (document.getElementById("jazz-fusion_genre").checked) {
        selectedGenres.push("jazz-fusion");
    }
    if (document.getElementById("reggaeton_genre").checked) {
        selectedGenres.push("reggaeton");
    }
    if (selectedGenres.length == 0) {
        selectedGenres.push("pop", "metal", "fusion", "electronic", "jazz-fusion", "reggaeton");
    }
    console.log("generos cogidos");
    console.log(selectedGenres);
    filterArtistByGenre(selectedGenres);
}

async function filterArtistByGenre(selectedGenres) {
    jsonContent = await readJson(urlMainJson);
    var carrouselContent = "";
    for (var i = 0; i < jsonContent.length; i++) {
        if (selectedGenres.includes(jsonContent[i].genre)) {
            carrouselContent += buildArtistCard(jsonContent[i].name);
        }
    }
    console.log(document.getElementById("carrousel").childNodes);
    console.log(carrouselContent);
    document.getElementById("carrousel").innerHTML = carrouselContent;
    //var flickity = document.getElementById("flickity");
    //document.getElementById("flickity").remove;
    //var flickity = document.createElement('script');
    //flickity.id = "flickity";
    //flickity.src = "js/flickity.js?amapola=0";
    //document.getElementById('body').appendChild(flickity);
    //document.getElementsById('body').appendChild(flickity);
}

function buildArtistCard(artistName) {
    console.log("building card");
    var card = '<div class="tile" onclick="updateCurrentPage(\'' + artistName + '\');">';
    card += '<div class="tile__media">';
    card += '<img class="tile__img" src="assets/' + artistName + '.webp" alt="" />';
    card += '</div>';
    card += '<div class="tile__details">';
    card += '<div class="tile__title">';
    card += artistName;
    card += '</div></div></div>';
    return card;
}

function WikipediaApiSearch(artistName, section) {
    jQuery.ajax({
        type: "GET",
        url: "https://es.wikipedia.org/w/api.php?action=opensearch&search=" + artistName + "&callback=?",
        contentType: "application/json; charset=utf-8",
        async: true,
        dataType: "json",
        success: function(data, textStatus, jqXHR) {
            $.each(data, function(i, item) {
                if (i == 1) {
                    var searchData = item[0];
                    WikipediaAPIGetContent(searchData, section);
                }
            });
        },
        error: function(errorMessage) {
            alert("Wikipedia apiSearch");
            alert(errorMessage);
        }
    });
}

function WikipediaAPIGetContent(search, section) {
    jQuery.ajax({
        type: "GET",
        url: "https://es.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=" + section + "&page=" + search + "&callback=?",
        contentType: "application/json; charset=utf-8",
        async: true,
        dataType: "json",
        success: function(data, textStatus, jqXHR) {
            var markup = data.parse.text["*"];
            storeData("wiki", markup);
            loadWikiDescription(markup);
        },
        error: function(errorMessage) {
            alert("Wikipedia getContent");
            alert(errorMessage);
        }
    });
}

function TwitterApiSearch(artistName, artistTwitter) {
    var twitterResponse = '<a loading="lazy" class="twitter-timeline" href="https://twitter.com/' + artistTwitter + '?ref_src=twsrc%5Etfw" width="280" height="500" data-chrome="transparent">Tweets by ' + artistTwitter + '</a>';
    twitterResponse += '<script id="twitterApiScript" async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>';
    console.log("artistTwitter: " + artistTwitter)
    console.log("twitterResponse: " + twitterResponse);
    storeData("twitter", twitterResponse);
    loadTwitts(twitterResponse, artistName);
}

function loadTwitts(data, artistName) {
    var twitterHead = '<h3 class="panel-title"><i class="fa fa-twitter-square" aria-hidden="true"></i>' + artistName + '</h3>';
    $("#twitterHeading").html(twitterHead);
    $("#twitterBody").html(data);
    //document.getElementById("twitterHeading").innerHTML = twitterHead;
    //document.getElementById("twitterBody").innerHTML = data;
}

function spotifyPlayer(url) {
    var song = '<iframe loading="lazy" style="border-radius:12px" src="' + url + '" width="100%" height="80" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>';
    $("#spotify-player").html(song);
    //document.getElementById("spotify-player").innerHTML = song;
}

function loadComments(data) {
    console.log("Entrando en la seccion de comentarios");
    //var seccionComentarios = document.getElementById("comentarios");
    /* var seccionComentarios = $("#comentarios")[0];
    console.log(seccionComentarios); */
    var comentarios = "";
    for (let i = 0; i < data.Review.length; i++) {
        comentarios += '<div class="d-flex mb-3"property="review" typeof="Review"><div class="ms-3" property="reviewBody"><div class="fw-bold" property="author">' + data.Review[i].author + '</div>' + data.Review[i].text + '</div></div>';
    }

    var comments = retrieveLocalDataAsJSON("Reviews");
    if (comments != null) {
        for (let i = 0; i < comments.length; i++) {
            if (comments[i].artist == data.name) {
                comentarios += '<div class="d-flex mb-3"property="review" typeof="Review"><div class="ms-3" property="reviewBody"><div class="fw-bold" property="author">' + comments[i].author + '</div>' + comments[i].text + '</div></div>';

            }
        }
    }
    $("#comentarios").html(comentarios);
/*     seccionComentarios.innerHTML = comentarios;
    console.log($("#comentarios")[0]); */
}

async function guardarComentario() {

    var comentario = document.getElementById("comment").value;
    var nombreUsuario = document.getElementById("commentor-name").value;

    if (nombreUsuario == "") {
        alert("Debes poner un nombre para mostrar tu comentario");
    }
    if (comentario == "") {
        alert("El campo del comentario no debe estar vacio");
    }
    try {
        guardarComentariosLocalStorage(document.getElementById("artist_name").innerHTML, nombreUsuario, comentario);
    } catch (error) {
        alert(error);
    }
}

function guardarComentariosLocalStorage(artistName, author, comment) {
    var comments = retrieveLocalDataAsJSON("Reviews");
    var newComment = "";
    if (comments != null) {
        var i = 0;
        //var newComment = "";
        newComment = newComment + '[{"artist" : "' + comments[i].artist + '", "author" : "' + comments[i].author + '", "text" : "' + comments[i].text + '"},';
        i = i + 1;
        for (; i < comments.length; i++) {
            newComment = newComment + '{"artist" : "' + comments[i].artist + '", "author" : "' + comments[i].author + '", "text" : "' + comments[i].text + '"},';
        }
        newComment = newComment + '{"artist" : "' + artistName + '", "author" : "' + author + '", "text" : "' + comment + '"}]';
    } else {
        newComment = '[{"artist" : "' + artistName + '", "author" : "' + author + '", "text" : "' + comment + '"}]';
    }
    newComment = JSON.parse(newComment);
    storeDataAsJSON("Reviews", newComment);
    loadComments(retrieveLocalDataAsJSON("jsonContents"));
    document.getElementById("comment").value = null;
    document.getElementById("commentor-name").value = null;
}

function busqueda(artistName) {
    if (event.key === 'Enter') {
        updateCurrentPage(artistName.value);
    }
}
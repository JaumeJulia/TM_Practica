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
    $('html,body').scrollTop(0);
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

        console.log("Recording:");
        console.log(artist[0].album[0].track[0].url[0].urlSpotify);
        disableSpotifyPlayer();
        //spotifyPlayer(artist[0].MusicAlbum[0].MusicRecording[0].url[0].urlSpotify);
        loadComments(artist[0]);
    }
}

function updateCurrentPageWithLocalStorage(artistName) {
    $('html,body').scrollTop(0);
    loadPage(retrieveLocalDataAsJSON("jsonContents"));
    loadWikiDescription(retrieveLocalData("wiki"));
    loadTwitts(retrieveLocalData("twitter"), artistName);
    loadComments(retrieveLocalDataAsJSON("jsonContents"));
}

function loadWikiDescription(data) {
    if (data == "Rise on Fire") {
        $('#biografia').html($('<div></div>').html($('<h2></h2>').html("Actualmente Rise on fire no tiene wikipedia")));
    } else {
        console.log(data);
        var blurb = $('<div></div>').html(data);
        // remove links as they will not work
        console.log(blurb);
        blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });
        // remove any references
        blurb.find('sup').remove();
        blurb.find('.mw-editsection').remove();
        blurb.find('.toc').remove();
        // remove cite error
        blurb.find('ol').remove();
        console.log(blurb);
        $('#biografia').html(blurb);
    }

}

function loadPage(pageContent) { // it will load the page with the contents found within the variable pageContent
    $('meta[name=description]').attr('content', pageContent.name + ' musical career');
    $('#artist_name').html(pageContent.name);
    $('#artist_introduction').html(pageContent.knowsAbout);
    $('#artist_main_genre').html(pageContent.genre);
    $('#artist_video').attr("data-id", pageContent.url);
    $("#comment").val('');
    $("#commentor-name").val('');
    initYouTubeVideos();
    console.log(document.getElementById("artist_video"));
    let music_album = $('#album_card')[0];
    console.log(music_album);
    $('#album_section').empty();
    console.log(pageContent.album.length);
    console.log(pageContent.album);
    for (var i = 0; i < pageContent.album.length; i++) {
        //changing image
        music_album.childNodes[1].childNodes[1].setAttribute("src", pageContent.album[i].image);
        console.log(pageContent.album[i].image);
        //changing urlSpotify
        music_album.childNodes[1].childNodes[3].childNodes[5].setAttribute("href", pageContent.album[i].url[0]);
        //changing urlYoutube
        music_album.childNodes[1].childNodes[3].childNodes[1].setAttribute("href", pageContent.album[i].url[1]);
        //changing name
        music_album.childNodes[3].childNodes[1].innerHTML = pageContent.album[i].name;
        //introducing songs
        music_album.childNodes[3].childNodes[3].innerHTML = generateSongList(pageContent.album[i], pageContent.genre);
        //append
        $("#album_section").append(music_album.cloneNode(true));
    }

    var eventTable = document.createElement("tbody");
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
    $("#event_table").append(eventTable);
    //window.scrollTo({ top: 0 });
}

function generateSongList(musicAlbum, genre) {
    var type = 'property="track" typeof="MusicRecording"';
    var metadata = '<meta content="' + musicAlbum.track.length + '" property="numTracks" />\n<meta content="' + genre + '" property="genre" />';
    var songList = metadata + "\n<ol>";
    for (var i = 0; i < musicAlbum.track.length; i++) {
        console.log(musicAlbum.track[i].url[0]);
        songList = songList + "<li><div " + type + " onclick=\"spotifyPlayer('" + musicAlbum.track[i].url[0] + "')\" class=\"text-wrap\" style=\"cursor:hand;cursor:pointer;width: 12rem;\">" + musicAlbum.track[i].name + "</div></li>";
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
    if (document.getElementById("jazz-funk_genre").checked) {
        selectedGenres.push("jazz-funk");
    }
    if (document.getElementById("reggaeton_genre").checked) {
        selectedGenres.push("reggaeton");
    }
    if (selectedGenres.length == 0) {
        selectedGenres.push("pop", "metal", "fusion", "electronic", "jazz-funk", "reggaeton");
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

async function WikipediaApiSearch(artistName, section) {
    console.log(artistName);
    if (artistName == "Louis Cole" || artistName == "Tom Misch") {
        jQuery.ajax({
            type: "GET",
            url: "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + artistName + "&callback=?",
            async: true,
            dataType: "json",
            success: function(data) {
                $.each(data, function(i, item) {
                    if (i == 1) {
                        if (artistName == "Louis Cole") {
                            var searchData = item[1];
                        } else {
                            var searchData = item[0];
                        }
                        WikipediaAPIGetContent(searchData, section, artistName);
                    }
                });
            },
            error: function(errorMessage) {
                alert("Wikipedia apiSearch");
                alert(errorMessage);
            }
        });
    } else if (artistName == "Rise on Fire") {
        WikipediaAPIGetContent(null, null, artistName);
    } else {
        jQuery.ajax({
            type: "GET",
            url: "https://es.wikipedia.org/w/api.php?action=opensearch&search=" + artistName + "&callback=?",
            async: true,
            dataType: "json",
            success: function(data) {
                $.each(data, function(i, item) {
                    if (i == 1) {
                        var searchData = item[0];
                        WikipediaAPIGetContent(searchData, section, artistName);
                    }
                });
            },
            error: function(errorMessage) {
                alert("Wikipedia apiSearch");
                alert(errorMessage);
            }
        });
    }


}

async function WikipediaAPIGetContent(search, section, artistName) {
    if (artistName == "Louis Cole" || artistName == "Tom Misch") {
        jQuery.ajax({
            type: "GET",
            url: "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=" + section + "&page=" + search + "&callback=?",
            async: true,
            dataType: "json",
            success: function(data) {
                console.log(data);
                var markup = data.parse.text["*"];
                storeData("wiki", markup);
                loadWikiDescription(markup);
            },
            error: function(errorMessage) {
                alert("Wikipedia getContent");
                alert(errorMessage);
            }
        });
    } else if (artistName == "Rise on Fire") {
        storeData("wiki", "<div><h2>Actualmente Rise on fire no tiene wikipedia</h2></div>");
        loadWikiDescription(artistName);
    } else {
        jQuery.ajax({
            type: "GET",
            url: "https://es.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=" + section + "&page=" + search + "&callback=?",
            async: true,
            dataType: "json",
            success: function(data) {
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
}

async function TwitterApiSearch(artistName, artistTwitter) {
    var twitterResponse = '<a loading="lazy" class="twitter-timeline" href="https://twitter.com/' + artistTwitter + '?ref_src=twsrc%5Etfw" width="280" height="500" data-chrome="transparent">Tweets by ' + artistTwitter + '</a>';
    twitterResponse += '<script id="twitterApiScript" async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>';
    console.log("artistTwitter: " + artistTwitter)
    console.log("twitterResponse: " + twitterResponse);
    storeData("twitter", twitterResponse);
    loadTwitts(twitterResponse, artistName);
}

async function loadTwitts(data, artistName) {
    var twitterHead = '<h3 class="panel-title"><i class="fa fa-twitter-square" aria-hidden="true"></i>' + artistName + '</h3>';
    $("#twitterHeading").html(twitterHead);
    $("#twitterBody").html(data);
}

async function spotifyPlayer(url) {
    var song = '<iframe loading="lazy" style="border-radius:12px" src="' + url + '" width="100%" height="80" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>';
    $("#spotify-player").show();
    $("#spotify-player").html(song);
}

async function disableSpotifyPlayer() {
    $("#spotify-player").hide();
}

async function loadComments(data) {
    console.log("Entrando en la seccion de comentarios");
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
}

async function guardarComentario() {
    console.log($("#comment")[0]);
    console.log($("#commentor-name")[0]);

    var comentario = $("#comment").val();
    var nombreUsuario = $("#commentor-name").val();
    if (nombreUsuario == "") {
        alert("Debes poner un nombre para mostrar tu comentario");
    }
    if (comentario == "") {
        alert("El campo del comentario no debe estar vacio");
    }
    try {
        guardarComentariosLocalStorage($("#artist_name")[0].innerHTML, nombreUsuario, comentario);
    } catch (error) {
        alert(error);
    }
}

async function guardarComentariosLocalStorage(artistName, author, comment) {
    var comments = retrieveLocalDataAsJSON("Reviews");
    var newComment = "";
    if (comments != null) {
        var i = 0;
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
}

function busqueda() {
    artistName = $("#searchBar").val();
    if (event.key === 'Enter') {
        event.preventDefault();
        console.log(artistName);
        $(function() {
            $("#searchBar").val('');
        });
        if (artistName != ' ') {

            updateCurrentPage(artistName);
        }
    }
}

async function cargarTwitter() {
    const jsonContent = await readJson(urlMainJson);
    var artist = jsonContent.filter(findArtist);

    function findArtist(jsonContent) {
        return jsonContent.name === $("#artist_name")[0].innerHTML;
    }
    TwitterApiSearch(artist[0].name, artist[0].sameAs);
}

function labnolIframe(div) {
    console.log('https://www.youtube.com/embed/' + div.dataset.id + '?autoplay=1&rel=0');
    var iframe = document.createElement('iframe');
    iframe.setAttribute(
        'src',
        'https://www.youtube.com/embed/' + div.dataset.id + '?autoplay=1&rel=0'
    );
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', '1');
    iframe.setAttribute(
        'allow',
        'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
    );
    iframe.setAttribute('width', "500");
    iframe.setAttribute('height', "300");
    div.parentNode.replaceChild(iframe, div);
}

async function initYouTubeVideos() {
    document.getElementById("artist_video").innerHTML = "";
    var youtubeVideo = document.getElementById("artist_video");
    var videoId = youtubeVideo.dataset.id;
    var div = document.createElement('div');
    div.setAttribute('data-id', videoId);
    var thumbNode = document.createElement('img');
    thumbNode.src = '//i.ytimg.com/vi/ID/hqdefault.jpg'.replace(
        'ID',
        videoId
    );
    div.appendChild(thumbNode);
    var playButton = document.createElement('div');
    playButton.setAttribute('class', 'play');
    div.appendChild(playButton);
    div.onclick = function() {
        labnolIframe(this);
    };
    youtubeVideo.appendChild(div);
}

$(function() {
    $.getJSON(urlMainJson, function(data) {
        autoComplete = [];
        for (var i = 0, len = data.length; i < len; i++) {
            autoComplete.push(data[i].name);
        }
        $("#searchBar").autocomplete({
            source: autoComplete,
            autoFill: true,
            minLenght: 2,
            appendTo: "#auto-complete"
        });
    });
});
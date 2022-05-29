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
    console.log(storedArtist);
    if (storedArtist == null) {
        updateCurrentPage("Rick Astley");
    } else {
        updateCurrentPageWithLocalStorage();
    }
};

async function updateCurrentPage(artistName) {
    var storedArtist = retrieveLocalData("artistName");
    if (storedArtist === artistName) {
        updateCurrentPageWithLocalStorage();
    } else {
        const jsonContent = await readJson(urlMainJson);
        var artist = jsonContent.Person.filter(findArtist);

        function findArtist(jsonContent) {
            return jsonContent.name === artistName;
        }
        storeData("artistName", artist[0].name);
        storeDataAsJSON("jsonContents", artist[0]);
        console.log(artist[0]);
        loadPage(artist[0]);
        WikipediaApiSearch(artist[0].name, artist[0].description);
    }
}

function updateCurrentPageWithLocalStorage() {
    loadPage(retrieveLocalDataAsJSON("jsonContents"));
    loadWikiDescription(retrieveLocalData("wiki"));
}

function loadWikiDescription(data) {
    console.log(data);
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
    window.scrollTo({ top: 0 });

}

function generateSongList(musicAlbum) {
    var songList = "<ol>"
    for (var i = 0; i < musicAlbum.MusicRecording.length; i++) {
        songList = songList + "<li>" + musicAlbum.MusicRecording[i].name + "</li>";
    }
    songList = songList + "</ol>";
    return songList;
}

async function filterArtistByGenre(selectedGenres) {
    jsonContent = await readJson(urlMainJson);
    var carrouselContent;
    for (var i = 0; i < jsonContent.Person.length; i++) {
        if (selectedGenres.includes(jsonContent.Person[i].genre)) {
            carrouselContent += buildArtistCard(jsonContent.Person[i].name);
        }
    }
    document.getElementById("carrousel").innerHTML = carrouselContent;
}

function buildArtistCard(artistName) {
    var card = '<div class="col-lg-4 mx-1 my-1" onclick="updateCurrentPage(' + artistName + ');">';
    card += '<a class="text-decoration-none link-dark stretched-link" href="#!">';
    card += '<div class="card h-100 shadow border-0">';
    card += '<img class="card-img-top" src="assets/' + artistName + '.jpg alt="..." />';
    card += '<div class="card-body p-4 text-center">';
    card += '<h5 class="card-title mb-3">' + artistName + '</h5>'
    card += '</div></div></a></div>';
    return card;
}

function WikipediaApiSearch(artistName, section) {
    jQuery.ajax({
        type: "GET",
        url: "http://es.wikipedia.org/w/api.php?action=opensearch&search=" + artistName + "&callback=?",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function(data, textStatus, jqXHR) {
            $.each(data, function(i, item) {
                if (i == 1) {
                    console.log(data);
                    var searchData = item[0];
                    WikipediaAPIGetContent(searchData, section);
                }
            });
        },
        error: function(errorMessage) {
            alert(errorMessage);
        }
    });
}

function WikipediaAPIGetContent(search, section) {
    jQuery.ajax({
        type: "GET",
        url: "http://es.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=" + section + "&page=" + search + "&callback=?",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function(data, textStatus, jqXHR) {
            console.log("http://es.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=" + section + "&page=" + search + "&callback=?");
            console.log(data);
            var markup = data.parse.text["*"];
            console.log(markup);
            storeData("wiki", markup);
            loadWikiDescription(markup);
        },
        error: function(errorMessage) {
            alert(errorMessage);
        }
    });
}
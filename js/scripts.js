/*!
 * Start Bootstrap - Modern Business v5.0.6 (https://startbootstrap.com/template-overviews/modern-business)
 * Copyright 2013-2022 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-modern-business/blob/master/LICENSE)
 */
// This file is intentionally blank
// Use this file to add JavaScript to your project

const url = "../json/artists.json";

window.onload = function() {
    loadPageWithLocalStorage();
};

async function updateCurrentPage(choosenArtist) {

    const jsonContent = await readJson(url);
    var artist = jsonContent.Person.filter(findArtist);

    function findArtist(jsonContent) {
        return jsonContent.name === choosenArtist;
    }
    writeLocalJson(artist[0]);
    loadPage(artist[0]);
}

function loadPageWithLocalStorage() { //it will load the page with the localStorage Contents
    var pageContent = readLocalJson();
    if (pageContent != null) {
        loadPage(pageContent);
    } else { // if it's the first time loading in, we need to be sure we rick roll them
        pageContent = updateCurrentPage('Rick Astley');
    }
}

function loadPage(pageContent) { // it will load the page with the contents found within the variable pageContent
    document.getElementById("artist_name").innerHTML = pageContent.name; //this changes the artist name
    WikipediaApiSearch(pageContent.name, pageContent.description);
    TwitterApiSerach(pageContent.name, pageContent.follows);
    document.getElementById("artist_introduction").innerHTML = pageContent.knowsAbout; //this changes the artist presentation
    document.getElementById("artist_video").setAttribute("src", pageContent.url); //this changes the video that is shown

    let album = document.getElementById("album_card");
    document.getElementById("album_section").innerHTML = ""; // erases album_section content so it can be filled up accordingly 
    console.log(album);
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

function WikipediaApiSearch(artistName, section){
    jQuery.ajax({
        type: "GET",
        url: "http://es.wikipedia.org/w/api.php?action=opensearch&search=" + artistName + "&callback=?",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            $.each(data, function (i, item) {
                if (i == 1) {
                    console.log(data);
                    var searchData = item[0];
                    WikipediaAPIGetContent(searchData, section);
                }
            });
        },
        error: function (errorMessage) {
            alert(errorMessage);
        }
    });
}

function WikipediaAPIGetContent(search, section) {
    jQuery.ajax({
        type: "GET",
        url: "http://es.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section="+section+"&page=" + search + "&callback=?",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            var markup = data.parse.text["*"];
            var blurb = $('<div></div>').html(markup);
            // remove links as they will not work
            blurb.find('a').each(function () { $(this).replaceWith($(this).html()); });
            // remove any references
            blurb.find('sup').remove();
            blurb.find('span').remove();
            // remove cite error
            blurb.find('ol').remove();/* 
            $('#biografia').html($(blurb).find('p')); */
            $('#biografia').html(blurb); 
        },
        error: function (errorMessage) {
            alert(errorMessage);
        }
    });
}

function TwitterApiSerach(artistName, artistTwitter){
    let twitter = document.getElementById("artistTwitterPanel");
    twitter.childNodes[1].childNodes[1].innerHTML = "<i class=\"fa fa-twitter-square\" aria-hidden=\"true\"></i>"+ artistName;
    twitter.childNodes[2].innerHTML = "<a class=\"twitter-timeline\" href=\"https://twitter.com/"+ artistTwitter+"\" data-widget-id=\"12345\" width=\"280\" data-chrome=\"transparent\">Tweets by"+ artistTwitter+"</a>"; 
    console.log( twitter);
    document.getElementById("twitterPanel").innerHTML="";
    document.getElementById("twitterPanel").appendChild(twitter.cloneNode(true));

}
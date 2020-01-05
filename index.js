$(document).ready(function () {
    $('.container_film').hide(); //important pour cacher cette partie au départ
    //Animation search-bar du début
    setTimeout(function () {
        $('#search').animate({
            display: 'block',
            width: '100%',
        });
    }, 1000)

    //animation bouton du début
    setTimeout(function () {
        $('#button').animate({
            width: '20%',
            display: 'block',
        });
    }, 2000)


    $('#search').change(function () {
        $('.container').html('');
        $.ajax({
            url: 'http://www.omdbapi.com/?s=' + encodeURI($('#search').val()) + '&apikey=84c0aab5',
            dataType: 'json',
            success: function (response) {
                console.log(response);
                //on crée une boucle pour afficher tous les résultats
                for (let i = 0; i < response.Search.length; i++) {
                    $('#container').append('<div class="film"><img class="affiche" data-id=' + response.Search[i].imdbID + ' src="' + response.Search[i].Poster + '">' + '<h2>' + response.Search[i].Title) + '</h2></div>';
                }
                //on affiche le container avec les vignettes
                $('#container').removeClass('hidden');
                //on le cache pour ensuite le faire apparaître avec le slideDown 
                $('#container').hide();
                callAffiche();
            }
        });
        setTimeout(function () {
            //On fais apparaitre 1s après la recherche
            $('#container').slideDown(1000);
        }, 1000);
        setTimeout(function () {
            $('body, html').animate({
                scrollTop: '300px'
            })
        }, 1500);
    });
});


function callAffiche() {
    //On cache la div information pour la faire apparaitre plus tard
    //On recupère l'affiche cliqué
    $('.affiche').click(function (event) {
        let imdbID = $(event.target).attr('data-id'); //on récupère l'attribut
        console.log(imdbID);
        $('#container').addClass('hidden');
        //on cache le container avec les vignettes
        //$('#info').css('background', '#e9e4e6');
        //on ajoute une couleur a la div info
        $.ajax({
            url: 'http://www.omdbapi.com/?i=' + imdbID + '&apikey=84c0aab5',
            dataType: 'json',
            //appel ajax avec lequel on va remplir les informations du film choisi
            success: function (response) {
                console.log(response);
                $('#search').val(response.Title);
                $('.title').html(response.Title);
                $('.year').html('(' + response.Year + ')');
                $('.time').html(response.Runtime);
                $('.genre').html(response.Genre);
                $('.affiche').append('<img class="affiche" data-id="' + response.imdbID + '" src="' + response.Poster + '">');
                callYoutube();
                $('.item_release').html(response.Released);
                $('.plot').html(response.Plot + '..');
                $('.item_director').html(response.Director);
                $('.item_writers').html(response.Writer);
                $('.item_actors').html(response.Actors);
                setTimeout(function () {
                    $('.container_film').slideDown();
                    //on fait apparaitre les infos 
                }, 800);
                setTimeout(function () {
                    $('body, html').animate({
                        scrollTop: '400px'
                    })
                }, 1500)
                loop();
            }
        });
    });
}

function loop() {
    $('#search').change(function () {
        //on regarde si la barre de recherche est déjà remplie
        //Si c'est le cas on remet tout en position de départ
        //afin d'enchainer les recherches
        if ($('#search').val() !== '') {
            console.log('salit');
            $('.container').html('');
            $('.container_film').hide();
            $('.element').html('');
            $('.affiche').children('img').remove();
            $('.iframe').children('iframe').remove();
        };
    })
};


function callYoutube() {
    $.ajax({
        url: 'https:www.googleapis.com/youtube/v3/search?part=snippet&q=' + encodeURIComponent($('#search').val()) + ' Trailer&key=AIzaSyCFVLCvT_ibRI0XmIENGmzB_umY1ZCt7TQ',
        dataType: 'json',
        success: function (responseYt) {
            //console.log(responseYt);
            //console.log(responseYt.items[0].id.videoId);
            //console.log('https:www.googleapis.com/youtube/v3/search?part=snippet&q=' + encodeURIComponent($('#search').val()) +'Trailer&key=AIzaSyCEZGmXE2pP0bApuFVXp8W02JbbY5MJ53c');
            //$('.descr_info').append(' <div id="player"></div>');
            $('.iframe').append('<iframe width="700" height="315" src="https://www.youtube.com/embed/' + responseYt.items[0].id.videoId + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
        },
    });
};
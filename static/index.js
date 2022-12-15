
FADE_TIME = 1000;

function view_about_me() {
    $("#home_frame").hide();
    $("#about_me_frame").fadeIn(FADE_TIME);
}

function view_home() {
    $("#about_me_frame").hide();
    $("#home_frame").fadeIn(FADE_TIME);
}
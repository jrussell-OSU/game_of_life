
const FADE_TIME = 1000;


//These functions swap which div we are viewing on the main body of the page
function view_home() {
    $("#about_me_frame").hide();
    $("#home_frame").fadeIn(FADE_TIME);

}function view_about_me() {
    $("#home_frame").hide();
    $("#about_me_frame").fadeIn(FADE_TIME);
}


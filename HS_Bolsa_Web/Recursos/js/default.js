var nuevaLiga = "";

function inicio() {
    var cargar = getUrlVars()["goto"] || "default";
    var URL = mapURI()[cargar];
    $("#frmDirecciones").attr('src', URL);
}

function llamaPagina(url) {
    unaLlamada = false;
    var pasadaLiga = document.getElementById("frmDirecciones").src;
    nuevaLiga = mapURI(pasadaLiga)[url];
    //if (pasadaLiga.indexOf(nuevaLiga) == -1) {
        //$("#frmDirecciones").hide("slide", {}, 1000, callback);
    //}
    $("#frmDirecciones").attr('src', nuevaLiga);
}

function CargarUrl() {
    var url = $('#hfNoPerfil').value;
}

function callback() {
        $("#frmDirecciones").attr('src', nuevaLiga);
};

$(document).ready(function () {
    $('#frmDirecciones').load(function () {
        $("#frmDirecciones").show("slide",  { direction: 'right' }, 1000);
    });
});

function mostrarRecuperar() {
    var login = document.getElementById("login");
    var signed = document.getElementById("signed");
    var olvido = document.getElementById("olvido");
    login.className = "ocultar";
    signed.className = "ocultar";
    olvido.removeAttribute("class");
}


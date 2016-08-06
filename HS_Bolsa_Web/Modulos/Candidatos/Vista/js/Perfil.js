$(document).ready(function () {
    if (window.parent.session.usuario.foto.length > 100)
    {
        var fotoUsuario = document.getElementById("fotoUsuario");
        fotoUsuario.setAttribute("src", "data:image/png;base64," + window.parent.session.usuario.foto)
    }

    $.post("../Controlador/Perfil.aspx", "op=datosFicha&seccion=perfil").done(function (xmlDoc) {
        SetValor(xmlDoc, "Nombre", "Nombre");
        SetValor(xmlDoc, "FechaNacimiento", "nacimiento", "date");
        SetValor(xmlDoc, "TituloRecibido", "TituloRecibido");
        SetValor(xmlDoc, "EstadoCivil", "civil");
        SetValor(xmlDoc, "NivelEscolar", "estudios");
    });

    $.post("../Controlador/Perfil.aspx", "op=obtenerHistorial&seccion=historial").done(function (xmlDoc) {
        var ItemCat = xmlDoc.getElementsByTagName("Table");
        var listaItemCat = document.getElementById("tb-historial");
        $(listaItemCat).empty();
        for (var i = 0; i < ItemCat.length; i++) {
            var NombreVacante = GetValor(ItemCat[i], "NombreVacante");
            var fechaSolicitud = GetValor(ItemCat[i], "fechaSolicitud");
            var Empresa = GetValor(ItemCat[i], "Empresa");
            var itemLista = document.createElement("tr");
            $(itemLista).html(
                '<td >' + fechaSolicitud + '</td>' +
                '<td style=" overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">' + NombreVacante + '</td>' +
                '<td>' + Empresa + '</td>'
            );
            listaItemCat.appendChild(itemLista);
        }
    });
});

function verCV() {
    window.open("../Controlador/Perfil.aspx?op=obtenerCV&seccion=perfil", "CV_Word", "height=200,width=200");
}
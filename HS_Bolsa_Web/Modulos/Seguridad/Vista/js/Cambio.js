$(document).ready(function () {
    $("input,select,textarea").focus(function () {
        $("label[for='" + $(this).attr("id") + "']:not(.error)").addClass("active");
    });

    $("input,select,textarea").blur(function () {
        if (!$(this).val()) {
            $("label[for='" + $(this).attr("id") + "']:not(.error)").removeClass("active");
        }
    });
});

function guardar() {
    var frm = document.getElementById("frmCambio");
    var parametros = $(frm).serialize();
    $.post("../Controlador/usuario.aspx", "op=nuevoPass&seccion=usuario&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        alert(mensaje);

    });
}
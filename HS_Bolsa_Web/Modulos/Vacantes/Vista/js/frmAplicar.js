$(document).ready(function () {
    $("input,select,textarea").focus(function () {
        $("label[for='" + $(this).attr("id") + "']:not(.error)").addClass("active");
    });

    $("input,select,textarea").blur(function () {
        if (!$(this).val()) {
            $("label[for='" + $(this).attr("id") + "']:not(.error)").removeClass("active");
        }
    });

    $("#fecha").datepicker({
        dateFormat: 'dd/M/yy',
        minDate: 1,
        maxDate: 60,
        onSelect: function () { $(this).focus(); }
    });

    LlenarSelect("../Controlador/Vacantes.aspx?seccion=filtros&op=obtenerMedios", "medio", "", "Clave", "detalle");
});

function gardarCuestionario() {
    var parametros = $("#CuestionarioAplicar").serialize();
    $.post("../Controlador/Vacantes.aspx", "op=aplicarAVacante&seccion=Vacante&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        if (estatus == 1) {
            window.parent.llamaPagina('registro');
        }
        else {
            alert(mensaje);
        }
    });
}
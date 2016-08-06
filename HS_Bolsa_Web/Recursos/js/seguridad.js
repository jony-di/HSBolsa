var pathSession = "../../Modulos/Seguridad/Controlador/session.aspx"
var pathusuario = "../../Modulos/Seguridad/Controlador/usuario.aspx"
var session = new Object();
session.usuario = new Object();
session.usuario.nombre = "";
session.usuario.foto = "";
session.usuario.registroCompleto = false;

session.usuario.getNombre = function () {
    return this.nombre;
};

session.usuario.getFoto = function () {
    if (session.foto === "") {
        $.post(pathusuario, "op=obtenerImagen&seccion=usuario").done(function (xmlDoc) {
            session.usuario.foto = xmlDoc.foto;
        });
    }
}

session.iniciar = function () {
    var frm = document.getElementById("frmlogin");
    var parametros = $(frm).serialize();
    $.post(pathSession, "op=iniciar&seccion=session&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        if (xmlDoc.estatus == 1) {
            window.location.reload();
        }
        else {
            alert(xmlDoc.mensaje);
        }
    });
    frm.reset();
};

session.validar = function () {
    $.post(pathSession, "op=vigencia&seccion=session&").done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        if (estatus == 1) {
        }
        else {
            btn.removeAttribute("class");
            alert(mensaje);
        }
    });
};

session.cerrar = function () {
    $.post(pathSession, "op=cerrar&seccion=session&").done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        if (estatus == 1) {
            window.location.reload();
        }
        else {
            alert(mensaje);
        }
    });
};

session.firmado = function () {
    var result = false;

    var formData = new FormData();
    $.ajax({
        type: "POST",
        async: false,
        url: pathSession + "?op=signed&seccion=session&",
        data: formData,
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (msg) {
            var estatus = msg.estatus;
            if (estatus == 1) {
                session.usuario.nombre = msg.nombre;
                session.usuario.foto = msg.foto;
                session.usuario.registroCompleto = msg.verPerfil.toUpperCase() === "TRUE"? true:false;
                var login = document.getElementById("login");
                var signed = document.getElementById("signed");
                var olvido = document.getElementById("olvido");
                olvido.className = "ocultar";
                login.className = "ocultar";
                signed.removeAttribute("class");
                document.getElementById("lblNom_usuario").innerHTML = session.usuario.getNombre();
                if (session.usuario.foto.length > 100)
                {
                    var fotoUsuario = document.getElementById("fotoUsuario");
                    var iconUser = document.getElementById("iconUser");
                    iconUser.className = "ocultar";
                    fotoUsuario.className = "";
                    fotoUsuario.setAttribute("src", "data:image/png;base64," + session.usuario.foto)
                }
                result = true;
            }
            else {
                var login = document.getElementById("login");
                var signed = document.getElementById("signed");
                var olvido = document.getElementById("olvido");
                olvido.className = "ocultar";
                signed.className = "ocultar";
                login.removeAttribute("class");
                document.getElementById("lblNom_usuario").innerHTML = "";
            }
        },
        error: function (error) {

        }
    });
    return result;
};

function ingresar(btn) {
    session.iniciar();
}

function recuperar() {
    var frm = document.getElementById("frmolvido");
    var parametros = $(frm).serialize();
    $.post(pathusuario, "op=olvido&seccion=usuario&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        alert(mensaje);
    });
    frm.reset();
    var login = document.getElementById("login");
    var signed = document.getElementById("signed");
    var olvido = document.getElementById("olvido");
    olvido.className = "ocultar";
    signed.className = "ocultar";
    login.removeAttribute("class");
}


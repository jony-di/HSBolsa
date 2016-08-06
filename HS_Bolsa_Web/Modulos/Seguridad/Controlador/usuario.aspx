<%@ Page Language="C#"%>

<%@ Import Namespace="HSBolsaServer" %>
<%@ Import Namespace="System.Net" %>
<%@ Import Namespace="System.Data" %>
<script runat="server">

    Modelo oModelo = new Modelo("/Modelo/seguridad.xml");
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "text/xml";
        string seccion = Request["seccion"];
        string op = Request["op"];
        string usuario;
        string estatus;
        string mensaje;
        DataSet ds;
        if (seccion != null)
        {
            switch (op)
            {
                case "olvido":
                    ds = oModelo.GenerarOperacionCX(op, seccion);
                    estatus = ds.Tables[0].Rows[0]["estatus"].ToString();
                    if (estatus.Equals("1")){
                        string email = ds.Tables[0].Rows[0]["email"].ToString();
                        string src = Server.MapPath("../Metadata");
                        oModelo.cambioPass(src,email);
                    }
                    ds.WriteXml(Response.OutputStream);
                    //Response.Write("<NewDataSet><Table><estatus>1</estatus><mensaje>correo enviado</mensaje></Table></NewDataSet>");
                break;
                case "cambiar":
                    string host = HttpContext.Current.Request.Url.Host;
                    string url = "http://" + host + "/index.html?goto=cambio";
                    string key = Request["key"];
                    string cadena = Encripta.Base64Decode(key);
                    ds = oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Email", "correo", cadena, true, "string", 50 } });
                    estatus = ds.Tables[0].Rows[0]["estatus"].ToString();
                    if (estatus.Equals("1"))
                    {
                        Session["usuario"] = ds.Tables[0].Rows[0]["mensaje"].ToString();
                        Response.Redirect(url);
                    }
                    else
                    {
                        ds.WriteXml(Response.OutputStream);
                    }
                break;
                case "nuevoPass":
                    oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Usuario", "usuario", Session["usuario"].ToString(), true, "string", 50 } }).WriteXml(Response.OutputStream);
                break;
                case "obtenerImagen":
                    if (Session["usuario"] != null)
                    { 
                        ds=oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Usuario", "RFC", Session["usuario"].ToString(), true, "string", 50 } });
                        string foto = ds.Tables[0].Rows[0]["Foto_Base64"].ToString();
                        Response.ContentType = "application/json";
                        string json = "{ \"foto\": \"" + foto + "\"}";
                        Response.Write(json);
                    }
                    else
                    {
                        Response.Write("<NewDataSet><Table><estatus>-1</estatus><mensaje>Antes inicie sesión</mensaje</Table></NewDataSet>");
                    }
                break;
            }
        }
        else { Response.Write("<NewDataSet><Table><estatus>-1</estatus><mensaje>No se encuentra la opcion</mensaje></Table></NewDataSet>"); }
    }
</script>


<%@ Page Language="C#" %>

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
        if (seccion != null)
        {
            DataSet ds;
            string usuario = string.Empty;
            string host = string.Empty;
            string url = string.Empty;
            string estatus = string.Empty;
            string nombre = string.Empty;
            string foto = string.Empty;
            string verPerfil = string.Empty;
            string json = string.Empty;
            
            switch (op)
            {
                case "iniciar":
                    ds = oModelo.GenerarOperacionCX(op, seccion);
                    estatus = ds.Tables[0].Rows[0]["estatus"].ToString();
                    json = "{ \"estatus\": \"" + estatus;
                    if (estatus.Equals("1"))
                    {
                        Session["usuario"] = ds.Tables[0].Rows[0]["mensaje"].ToString();
                    }
                    else if (estatus.Equals("-1"))
                    {
                        string email = ds.Tables[0].Rows[0]["email"].ToString();
                        string src = Server.MapPath("../Metadata");
                        oModelo.cambioPass(src, email);
                        json += "\",\"email\":\"" + email;
                    }
                    else if (estatus.Equals("-2"))
                    {
                        json += "\",\"mensaje\":\"" + ds.Tables[0].Rows[0]["mensaje"].ToString();
                        oModelo.volverValidarCorreo(Server.MapPath("~/Modulos/Registro/Metadata"), ds.Tables[0]);
                    }
                    else if (estatus.Equals("-3"))
                    {
                        string email = ds.Tables[0].Rows[0]["email"].ToString();
                        string src = Server.MapPath("../Metadata");
                        oModelo.cambioPass(src, email);
                        json += "\",\"email\":\"" + email ;
                    }
                    else 
                    {
                        json += "\",\"mensaje\":\"" + ds.Tables[0].Rows[0]["mensaje"].ToString();
                    }
                    json += "\"}"; 
                    Response.ContentType = "application/json";
                    Response.Write(json);
                break;
                case "signed":
                try
                {
                    ds=oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Usuaro", "usuario", Session["usuario"].ToString(), true, "string", 50 } });
                    nombre = ds.Tables[0].Rows[0]["nombre"].ToString();
                    foto = ds.Tables[0].Rows[0]["Foto_Base64"].ToString();
                    verPerfil = ds.Tables[0].Rows[0]["verPerfil"].ToString();
                    Response.ContentType = "application/json";
                    json = "{ \"estatus\": \"1\",\"nombre\":\"" + nombre + "\",\"foto\":\"" + foto + "\",\"verPerfil\":\"" + verPerfil + "\" }";
                    Response.Write(json);
                }
                catch {
                    Response.ContentType = "application/json";
                    json = "{ \"estatus\": \"-1\"}";
                    Response.Write(json);
                }
                break;
                case "vigencia":
                    try
                    {
                        usuario = Session["usuario"].ToString();
                        oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Usuaro", "usuario", usuario, true, "string", 50 } }).WriteXml(Response.OutputStream);
                    }
                    catch {Response.Write("<NewDataSet><Table><estatus>-1</estatus><mensaje>Sesion cerrada</mensaje></Table></NewDataSet>");}
                break;
                case "cerrar":
                    Session.Clear();
                    Response.Write("<NewDataSet><Table><estatus>1</estatus><mensaje>Sesion cerrada</mensaje></Table></NewDataSet>");
                break;
            }
        }
        else { Response.Write("<NewDataSet><Table><estatus>-1</estatus><mensaje>No se encuentra la opcion</mensaje></Table></NewDataSet>"); }
    }
</script>

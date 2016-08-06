<%@ Page Language="C#" %>

<%@ Import Namespace="HSBolsaServer" %>
<%@ Import Namespace="System.Net" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Web.Script.Serialization" %>
<%@ Import Namespace="System.Data" %>
<script runat="server">
    
    Modelo oModelo = new Modelo("/Modelo/Perfil.xml");
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "text/xml";

        string seccion = Request["seccion"];
        string op = Request["op"];
        DataSet ds;
        //string estatus;
        //string mensaje;
        if (seccion != null)
        {
            if (seccion.Equals("perfil"))
            {
                switch (op)
                {
                    case "datosFicha":
                        oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Usuario", "RFC", Session["usuario"].ToString(), true, "string", 50 } }).WriteXml(Response.OutputStream);
                    break;
                   
                    case "obtenerCV":
                        ds=oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Usuario", "RFC", Session["usuario"].ToString(), true, "string", 50 } });
                        string cv = ds.Tables[0].Rows[0]["CV_Base64"].ToString();
                        if (cv.Length > 100)
                        {
                            byte[] filebytes = Encripta.Base64DecodeFile(cv);
                            HttpContext.Current.Response.Clear();
                            HttpContext.Current.Response.Charset = "";
                            Response.AddHeader("Content-Disposition", "attachment; filename=CV.docx"); 
                            HttpContext.Current.Response.Cache.SetCacheability(System.Web.HttpCacheability.NoCache);
                            HttpContext.Current.Response.Cache.SetExpires(DateTime.Now);
                            HttpContext.Current.Response.Cache.SetNoServerCaching();
                            HttpContext.Current.Response.Cache.SetNoStore();
                            HttpContext.Current.Response.ContentType = "application/octet-stream";
                            HttpContext.Current.Response.BinaryWrite(filebytes);
                            HttpContext.Current.Response.Flush();
                            HttpContext.Current.Response.End();
                        }
                        else
                        {
                            Response.ContentType = "text/html";
                            Response.Write("<"+"script>alert('No se encontro el archivo'); self.close();<"+"/script>");
                        }
                    break;
                }
            }
            else if (seccion.Equals("proceso"))
            {
                switch (op)
                {
                    case "datosFicha":

                        break;
                }
            }
            else if (seccion.Equals("historial"))
            {
                switch (op)
                {
                    case "obtenerHistorial":
                        oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Usuario", "RFC", Session["usuario"].ToString(), true, "string", 50 } }).WriteXml(Response.OutputStream);
                    break;
                }
            }
        }
        else { Response.Write("<NewDataSet><Table><estatus>-1</estatus><mensaje>No se encuentra la opcion</mensaje></Table></NewDataSet>"); }
    }
</script>

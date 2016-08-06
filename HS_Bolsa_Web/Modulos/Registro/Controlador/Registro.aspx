<%@ Page Language="C#" %>

<%@ Import Namespace="HSBolsaServer" %>
<%@ Import Namespace="System.Net" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Web.Script.Serialization" %>
<%@ Import Namespace="System.Data" %>
<script runat="server">
    
    Modelo oModelo = new Modelo("/Modelo/Registro.xml");
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "text/xml";

        string seccion = Request["seccion"];
        string op = Request["op"];
        DataSet ds;
        string estatus;
        string mensaje;
        if (seccion != null)
        {
            switch (op)
            {
                case "obtenerReferenciasLaborales":
                    oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Usuario", "RFC", Session["usuario"].ToString(), true, "string", 50 } }).WriteXml(Response.OutputStream);
                break;
                case "guardarReferenciaLaboral":
                    oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Usuario", "RFC", Session["usuario"].ToString(), true, "string", 50 } }).WriteXml(Response.OutputStream);
                break;
                case "quitarReferenciaLaboral":
                    oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Usuario", "RFC", Session["usuario"].ToString(), true, "string", 50 } }).WriteXml(Response.OutputStream);
                break;
                case "validaRegistro":
                    oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Usuario", "RFC", Session["usuario"].ToString(), true, "string", 50 } }).WriteXml(Response.OutputStream);
                break;
                case "gardarEscolaridad":
                    oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Usuario", "RFC", Session["usuario"].ToString(), true, "string", 50 } }).WriteXml(Response.OutputStream);
                break;
                case "obtenerEscolaridad":
                    oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Usuario", "RFC", Session["usuario"].ToString(), true, "string", 50 } }).WriteXml(Response.OutputStream);
                break;
                case "quitarEscuela":
                    oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Usuario", "RFC", Session["usuario"].ToString(), true, "string", 50 } }).WriteXml(Response.OutputStream);
                break;
                case "obtenerTodo":
                    oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Usuario", "RFC", Session["usuario"].ToString(), true, "string", 50 } }).WriteXml(Response.OutputStream);
                break;
                case "nuevo":
                    bool err = false;
                    if (Validate())
                    {
                        ds = oModelo.GenerarOperacionCX(op, seccion);
                        estatus = ds.Tables[0].Rows[0]["estatus"].ToString();
                        mensaje = ds.Tables[0].Rows[0]["mensaje"].ToString();
                        if (estatus.Equals("1"))
                        {
                            string src = Server.MapPath("../Metadata");
                            try
                            {
                                oModelo.validarCorreo(src);
                            }
                            catch(Exception ex) {
                                err = true;
                            } 
                        }
                        if (err)
                        {
                            Response.Write("<NewDataSet><Table><estatus>-1</estatus><mensaje>No se pudo enviar correo</mensaje></Table></NewDataSet>");
                        }
                        else
                        {
                            ds.WriteXml(Response.OutputStream);
                        }
                        
                    }
                    else
                    {
                        Response.Write("<NewDataSet><Table><estatus>-1</estatus><mensaje>No se valido el captcha</mensaje></Table></NewDataSet>");
                    }
                    break;
                case "validar":
                    string key = Request["key"];
                    string cadena = Encripta.Base64Decode(key);
                    ds = oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Email", "correo", cadena, true, "string", 50 } });
                    estatus = ds.Tables[0].Rows[0]["estatus"].ToString();
                    mensaje = ds.Tables[0].Rows[0]["mensaje"].ToString();
                    string host = HttpContext.Current.Request.Url.Host;
                    string url = "http://" + host + ":5530/index.html?goto=validado";
                    if (!estatus.Equals("1")){url += "&estatus=" + estatus + "&menasage=" + mensaje;}
                    Response.Redirect(url);
                break;
                case "gardarDatosGenerales":
                    if (Session["usuario"] != null)
                    { oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Usuario", "RFC",  Session["usuario"].ToString(), true, "string", 50 } }).WriteXml(Response.OutputStream); }
                    else
                    {
                        Response.Write("<NewDataSet><Table><estatus>-1</estatus><mensaje>Antes inicie sesión</mensaje</Table></NewDataSet>");
                    }
                break;
                case "DatosLaborales":
                    if (Session["usuario"] != null)
                    { oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Usuario", "RFC", Session["usuario"].ToString(), true, "string", 50 } }).WriteXml(Response.OutputStream); }
                    else
                    {
                        Response.Write("<NewDataSet><Table><estatus>-1</estatus><mensaje>Antes inicie sesión</mensaje</Table></NewDataSet>");
                    }
                break;
                case "archivos":
                    if (Session["usuario"] != null)
                    {
                        estatus = "1";
                        mensaje = "No se recibieron archivos";
                        string CV = " ";
                        string FOTO = " ";
                        if (Request.Files.Count > 0)
                        {
                            try
                            {
                                if (Request.Files["foto"] != null)
                                {
                                    BinaryReader b = new BinaryReader(Request.Files["foto"].InputStream);
                                    byte[] binData = b.ReadBytes(Request.Files["foto"].ContentLength);
                                    FOTO = Encripta.Base64EncodeFile(binData);
                                }
                                if (Request.Files["CV"] != null)
                                {
                                    BinaryReader b = new BinaryReader(Request.Files["CV"].InputStream);
                                    byte[] binData = b.ReadBytes(Request.Files["CV"].ContentLength);
                                    CV = Encripta.Base64EncodeFile(binData);
                                }
                            }
                            catch { }
                        }
                        ds = oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Usuario", "RFC", Session["usuario"].ToString(), true, "string", 50 }, { "Archivo de CV", "CV_DOC", CV, false, "text", 18 }, { "Foto", "foto", FOTO, false, "text", 18 } });
                        estatus = ds.Tables[0].Rows[0]["estatus"].ToString();
                        mensaje = ds.Tables[0].Rows[0]["mensaje"].ToString();
                        Response.ContentType = "application/json";
                        string json = "{ \"estatus\": \"" + estatus + "\",\"mensaje\":\"" + mensaje + "\" }";
                        Response.Write(json);
                    }
                    else
                    {
                        Response.ContentType = "application/json";
                        string json = "{ \"estatus\": \"-1\",\"mensaje\":\"Se termino la sesion\" }";
                        Response.Write(json);
                    }
                break;
                default:
                    oModelo.GenerarOperacionCX(op, seccion).WriteXml(Response.OutputStream);
                break;
            }
        }
        else { Response.Write("<NewDataSet><Table><estatus>-1</estatus><mensaje>No se encuentra la opcion</mensaje></Table></NewDataSet>"); }
    }

    public bool Validate()
    {
        string Response = Request["g-recaptcha-response"];//Getting Response String Appned to Post Method
        bool Valid = false;
        //Request to Google Server
        System.Net.HttpWebRequest req = (HttpWebRequest)WebRequest.Create(" https://www.google.com/recaptcha/api/siteverify?secret=6Le65f4SAAAAAMfPM5hXSHwzdR7ioAo3n3QVVIga&response=" + Response);

        try
        {
            //Google recaptcha Responce 
            using (WebResponse wResponse = req.GetResponse())
            {

                using (StreamReader readStream = new StreamReader(wResponse.GetResponseStream()))
                {
                    string jsonResponse = readStream.ReadToEnd();

                    JavaScriptSerializer js = new JavaScriptSerializer();
                    recaptcha data = js.Deserialize<recaptcha>(jsonResponse);// Deserialize Json 
                    Valid = Convert.ToBoolean(data.success);
                }
            }
            return Valid;
        }
        catch (WebException ex)
        {
            throw ex;
        }
    }

    public class recaptcha
    {
        public string success { get; set; }
    }
    
</script>

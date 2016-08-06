<%@ Page Language="C#" %>
<%@ Import Namespace="System.Data" %>
<%@ Import Namespace="HSBolsaServer" %>

<script runat="server">
    Modelo oModelo = new Modelo("/Modelo/Modelo.xml");
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "text/xml";
        string seccion = Request["seccion"];
        string op = Request["op"];
        if (seccion != null)
        {
            switch (op)
            {
                case "obtenerMedios":
                    oModelo.GenerarOperacionCX(op, seccion).WriteXml(Response.OutputStream);
                break;
                case "mostrarVacantes":
                oModelo.GenerarOperacionCX(op, seccion).WriteXml(Response.OutputStream);
                break;
                case "mostrarVacante":
                    oModelo.GenerarOperacionCX(op, seccion).WriteXml(Response.OutputStream);
                break;
                case "aplicar":
                    Session["VacanteID"] = Request["vacanteId"];
                    oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Usuario", "RFC", Session["usuario"].ToString(), true, "string", 50 }, { "Vacante", "vacanteId", Session["VacanteID"].ToString(), true, "int", 50 } }).WriteXml(Response.OutputStream);
                break;
                case "aplicarAVacante":
                    oModelo.GenerarOperacionCX(op, seccion, new object[,] { { "Usuario", "RFC", Session["usuario"].ToString(), true, "string", 50 }, { "Vacante", "vacanteId", Session["VacanteID"].ToString(), true, "int", 50 } }).WriteXml(Response.OutputStream);
                break;
                default:
                    Response.Write("<NewDataSet><Table><estatus>-1</estatus><mensaje>No se encuentra la opcion</mensaje></Table></NewDataSet>");
                break;
            }
        }
        else { Response.Write("<NewDataSet><Table><estatus>-1</estatus><mensaje>No se encuentra la opcion</mensaje></Table></NewDataSet>"); }
    }
</script>
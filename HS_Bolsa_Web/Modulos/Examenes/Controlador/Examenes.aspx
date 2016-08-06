<%@ Page Language="C#" %>
<%@ Import Namespace="HSBolsaServer" %>
<%@ Import Namespace="System.Net" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Web.Script.Serialization" %>
<%@ Import Namespace="System.Data" %>
<script runat="server">
    
    Modelo oModelo = new Modelo("/Modelo/Examenes.xml");
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.Clear();
        Response.ContentType = "text/xml";

        string seccion = Request["seccion"];
        string op = Request["op"];
        if (seccion != null){
            switch (op){
                default:oModelo.GenerarOperacionCX(op, seccion, new object[,] {{ "Usuario", "RFC", Session["usuario"].ToString(), true, "string", 50 }}).WriteXml(Response.OutputStream);break;
                case "ObtenerExamen": ObtenerExamen(); break;
                case "CapturarRespuestasCandidato": CapturarRespuestasCandidato(); break;
            }
        }
        else { Response.Write("<xml><Table><estatus>-1</estatus><mensaje>No se encuentra la sección.</mensaje></Table></xml>"); }
    }
    
    public void CapturarRespuestasCandidato(){
        object[,] parametros = new object[,] { { "Usuario", "cve_candidato", Session["usuario"].ToString(), true, "string", 50 } };
        parametros = Util.AgregarFilaMatriz(parametros, new object[] { "Clave de puesto", "cve_puesto", Request["cve_puesto"], true, "int", 0 });
        parametros = Util.AgregarFilaMatriz(parametros, new object[] { "Clave de examen", "cve_examen", Request["cve_examen"], true, "int", 0 });
        parametros = Util.AgregarFilaMatriz(parametros, new object[] { "Tiempo duración", "duracion", 50, true, "int", 0 });
        string query = "BEGIN TRANSACTION T; BEGIN TRY DELETE FROM EXA_candidato WHERE cve_candidato=@cve_candidato AND cve_examen=@cve_examen AND cve_puesto=@cve_puesto;"+
            "DELETE FROM EXA_candrespuestas WHERE cve_candidato=@cve_candidato AND cve_examen=@cve_examen;" +
            "INSERT INTO EXA_candidato(cve_puesto,cve_candidato,fechaAplicacion,cve_examen,tiempoduracion) VALUES(@cve_puesto,@cve_candidato,GETDATE(),@cve_examen,@duracion);" +
            "INSERT INTO EXA_candrespuestas(cve_candidato, cve_examen,cve_pregunta,cve_respuesta,respuesta) SELECT * FROM (VALUES ";
        string valuesKey = "",coma="";
        foreach (string key in Request.Form.Keys){
            if (key.Trim().StartsWith("resp_")){
                if (new Regex("multiple|varias").IsMatch(key.Split('_')[3].Trim().ToLower())){
                    string[] cves_respuesta = Request[key].Split(',');
                    foreach (string cve_respuesta in cves_respuesta){
                        valuesKey += coma + "(@cve_candidato,@cve_examen," + key.Split('_')[2] + "," + cve_respuesta + ",NULL)";
                    }
                }
                else
                {
                    parametros = Util.AgregarFilaMatriz(parametros, new object[] { "", key, Request[key], true, "string", 1024 });
                    valuesKey += coma + "(@cve_candidato,@cve_examen," + key.Split('_')[2] + ",NULL,@" + key + ")";
                    
                }
                coma = ",";
            }
        }
        query += valuesKey + ")Q(cve_candidato, cve_examen,cve_pregunta,cve_respuesta,respuesta);COMMIT TRANSACTION T;SELECT 1 estatus, 'Exámen guardado correctamente.' mensaje;"+
            "  END TRY " +
            " BEGIN CATCH " +
            " ROLLBACK TRANSACTION T;" +
            " SELECT -1 estatus, CASE WHEN ERROR_NUMBER( ) = 2627 THEN 'No se pueden registrar las respuestas. Ya ha respondido el exámen.' ELSE 'Error:' + ERROR_MESSAGE() END mensaje;" +
            " END CATCH";
        oModelo.GenerarOperacionCX("placebo", "Examen", parametros, query).WriteXml(Response.OutputStream);
    }

    public void ObtenerExamen(){
        DataSet ds = new DataSet();
        DataTable dtPreguntas = oModelo.GenerarOperacionCX("ObtenerPreguntas", "Preguntas").Tables[0].Copy();
        DataTable dtAgrupaciones = oModelo.GenerarOperacionCX("ObtenerAgrupaciones", "Respuestas").Tables[0].Copy();
        DataTable dtRespuestas = oModelo.GenerarOperacionCX("ObtenerRespuestas", "Respuestas").Tables[0].Copy();
        DataTable dtColRespuestas = oModelo.GenerarOperacionCX("ObtenerColRespuestas", "Columnas").Tables[0].Copy();
        ds.DataSetName = "Examen";
        dtPreguntas.TableName = "Pregunta";
        ds.Tables.Add(dtPreguntas);
        dtAgrupaciones.TableName = "Agrupacion";
        ds.Tables.Add(dtAgrupaciones);
        dtRespuestas.TableName = "Respuesta";
        ds.Tables.Add(dtRespuestas);
        dtColRespuestas.TableName = "ColRespuesta";
        ds.Tables.Add(dtColRespuestas);
        DataColumn[] dcsA = new DataColumn[2] { dtPreguntas.Columns["cve_examen"], dtPreguntas.Columns["cve_pregunta"] };
        DataColumn[] dcsB = new DataColumn[2] { dtAgrupaciones.Columns["cve_examen"], dtAgrupaciones.Columns["cve_pregunta"] };

        DataColumn[] dcsC = new DataColumn[3] { dtAgrupaciones.Columns["cve_examen"], dtAgrupaciones.Columns["cve_pregunta"], dtAgrupaciones.Columns["cve_grupo"] };
        DataColumn[] dcsD = new DataColumn[3] { dtRespuestas.Columns["cve_examen"], dtRespuestas.Columns["cve_pregunta"], dtRespuestas.Columns["cve_grupo"] };

        DataColumn[] dcsE = new DataColumn[2] { dtColRespuestas.Columns["cve_examen"], dtColRespuestas.Columns["cve_pregunta"] };

        if (dtPreguntas.Columns["cve_examen"] != null && dtPreguntas.Columns["cve_pregunta"] != null && dtRespuestas.Columns["cve_examen"] != null && dtRespuestas.Columns["cve_pregunta"] != null)
        {
            try
            {
                DataRelation PregAgrup = ds.Relations.Add("PregAgrup", dcsA, dcsB);
                PregAgrup.Nested = true;
                DataRelation AgrupResp = ds.Relations.Add("AgrupResp", dcsC, dcsD);
                AgrupResp.Nested = true;
                if (dtColRespuestas.Columns["cve_examen"] != null)
                {
                    DataRelation ColResp = ds.Relations.Add("ColResp", dcsA, dcsE);
                    ColResp.Nested = true;
                }
            }
            catch (Exception e) { }
        }
        ds.WriteXml(Response.OutputStream);
    }
</script>

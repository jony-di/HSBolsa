using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using iTextSharp.text.pdf;
using System.IO;
using iTextSharp.text;
using System.Runtime.InteropServices;
using System.Xml;
using System.Globalization;
using iTextSharp.tool.xml;

namespace HSBolsaServer
{
    public class Util
    {
        
        public static void AddElement(ref string[] arreglo, string elemento){
            Array.Resize(ref arreglo, arreglo.Length + 1);
            arreglo[arreglo.Length-1] = elemento;
        }

        public static object[,] AgregarFilaMatriz(object[,] Mat1, object[] Mat2)
        {
            int col1 = Mat1.GetLength(1);
            int row1 = Mat1.GetLength(0);
            int col2 = Mat2.Length;
            int i, j;
            object[,] newMat = new object[row1 + 1, col1];
            if (col1 == col2)
            {

                for (i = 0; i < row1; i++)
                {
                    for (j = 0; j < col1; j++)
                    {
                        newMat[i, j] = Mat1[i, j];
                    }
                }
                for (j = 0; j < col1; j++)
                {
                    newMat[row1, j] = Mat2[j];
                }
            }
            else
            {
                throw new Exception("El numero de columnas debe coincidir, en este caso sucede: " + col1 + " <> " + col2);
            }
            return newMat;
        }

        public static string ObtenerExtensionArchivoPost(HttpPostedFile file) {
            string extension = "";
            try
            {
                extension= file.FileName.Substring(file.FileName.LastIndexOf('.'));
            }catch(Exception ex){}
            return extension;
        }

        public static object[,] ConcatenarMatrices(object[,] Mat1, object[,] Mat2)
        {
            if (Mat1 == null && Mat2 == null)
            {
                return null;
            }
            else if (Mat1 == null && Mat2 != null)
            {
                return Mat2;
            }
            else if (Mat1 != null && Mat2 == null)
            {
                return Mat1;
            }
            else
            {

                int col = Mat1.GetLength(1);
                int col2 = Mat2.GetLength(1);
                int row1 = Mat1.GetLength(0);
                int row2 = Mat2.GetLength(0);
                int i, j, y;
                object[,] newMat = new object[row1 + row2, col];
                if (col == col2)
                {

                    for (i = 0; i < row1; i++)
                    {
                        for (j = 0; j < col; j++)
                        {
                            newMat[i, j] = Mat1[i, j];
                        }
                    }
                    for (i = 0; i < row2; i++)
                    {
                        for (j = 0; j < col; j++)
                        {
                            newMat[i + row1, j] = Mat2[i, j];
                        }
                    }
                }
                else
                {
                    throw new Exception("El numero de columnas debe coincidir, en este caso sucede: " + col + " <> " + col2);
                }
                return newMat;
            }
        }

        public static DataSet agregarCampoValor(string variable, string valor, DataSet ds)
        {
            DataTable tblTemp; DataRow dr;
            if (ds == null)
            {
                ds = (ds == null ? new DataSet() : ds);
                tblTemp = new DataTable("Table");
                ds.Tables.Add(tblTemp);
                tblTemp.Columns.Add(variable, typeof(string));
                tblTemp = ds.Tables[0];
                dr = tblTemp.NewRow();
                dr[variable] = valor;
                tblTemp.Rows.Add(dr);
            }
            else {
                ds.Tables[0].Columns.Add(variable, typeof(string));
                ds.Tables[0].Rows[0][variable] = valor;
            }

            return ds;
        }

        public static Byte[] generarDocumentoPdf(string nombreDocumento, string ruta, object[,] textosDinamicos)
        {
            MemoryStream ms = null;
            Document doc = new Document(PageSize.A4, 15, 15, 0, 0);
            try
            {
                ms = new MemoryStream();
                PdfWriter oPdfWriter = PdfWriter.GetInstance(doc, ms);
                doc.Open();
                XmlDocument documentos = new XmlDocument();
                documentos.Load(ruta);
                XmlElement documento = null;
                BaseFont bfTimes = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.CP1252, false);
                Font times = new Font(bfTimes, 9, Font.NORMAL, BaseColor.BLACK);
                try
                {
                    documento = (XmlElement)documentos.GetElementsByTagName(nombreDocumento)[0];
                }
                catch { throw; }
                if (documento != null)
                {
                    var cb = oPdfWriter.DirectContent;
                    //Ponemos los textos
                    XmlNodeList textos = documento.GetElementsByTagName("texto");
                    if (textos.Count > 0)
                    {
                        foreach (XmlElement texto in textos)
                        {
                            try
                            {

                                Paragraph parrafo = new Paragraph(texto.InnerText.ToString(), 
                                    FontFactory.GetFont(
                                        texto.HasAttribute("font-family") ? texto.GetAttribute("font-family") : "helvetica"
                                        , texto.HasAttribute("font-size") ? Convert.ToInt32(texto.GetAttribute("font-size")) : 9
                                        , GetFontStyle(texto.GetAttribute("font-style"))
                                        , texto.HasAttribute("color") ? new BaseColor(Convert.ToInt32(texto.GetAttribute("color").Split(',')[0]), Convert.ToInt32(texto.GetAttribute("color").Split(',')[1]), Convert.ToInt32(texto.GetAttribute("color").Split(',')[2])) : BaseColor.BLACK
                                   )
                                );
                                var Col = new ColumnText(cb);
                                Col.SetSimpleColumn(
                                    Convert.ToInt32(texto.GetAttribute("left"))
                                    , Convert.ToInt32(texto.GetAttribute("top"))
                                    , Convert.ToInt32(texto.GetAttribute("width"))
                                    , Convert.ToInt32(texto.GetAttribute("height"))
                                );
                                Col.AddText(parrafo);
                                Col.Go();
                            }catch(Exception e){}
                        }
                    }
                    //Ponemos los rectangulos
                    XmlNodeList rectangulos = documento.GetElementsByTagName("rectangulo");
                    if (rectangulos.Count > 0)
                    {
                        foreach (XmlElement rectangulo in rectangulos)
                        {
                            try
                            {
                                cb.SetLineWidth(rectangulo.HasAttribute("border-width") ? Convert.ToInt32(rectangulo.GetAttribute("border-width")) : 1);
                                cb.Rectangle(
                                    Convert.ToInt32(rectangulo.GetAttribute("left"))
                                    , Convert.ToInt32(rectangulo.GetAttribute("top"))
                                    , Convert.ToInt32(rectangulo.GetAttribute("width"))
                                    , Convert.ToInt32(rectangulo.GetAttribute("height"))
                                );
                                cb.Stroke();
                            }catch(Exception e){}
                        }
                    }
                    //Ponemos las lineas
                    XmlNodeList lineas = documento.GetElementsByTagName("linea"); 
                    if (lineas.Count > 0)
                    {
                        foreach (XmlElement linea in lineas)
                        {
                            try
                            {
                            cb.SetLineWidth(linea.HasAttribute("border-width")?Convert.ToInt32(linea.GetAttribute("border-width")):1);
                            cb.MoveTo(Convert.ToInt32(linea.GetAttribute("left")), Convert.ToInt32(linea.GetAttribute("top")));
                            cb.LineTo(Convert.ToInt32(linea.GetAttribute("left-end")), Convert.ToInt32(linea.GetAttribute("top-end")));
                            cb.Stroke();
                            }
                            catch (Exception e) { }
                        }
                    }
                    //Ponemos las imagenes
                    XmlNodeList imagenes = documento.GetElementsByTagName("imagen");
                    if (imagenes.Count > 0)
                    {
                        foreach (XmlElement imagen in imagenes)
                        {
                            try
                            {
                            Image img = Image.GetInstance(HttpContext.Current.Server.MapPath("~") + imagen.GetAttribute("src"));
                            img.ScalePercent(imagen.HasAttribute("scale")? Convert.ToInt32(imagen.GetAttribute("scale")) : 100);
                            img.SetAbsolutePosition(Convert.ToInt32(imagen.GetAttribute("left")), Convert.ToInt32(imagen.GetAttribute("top")));
                            doc.Add(img);
                            }
                            catch (Exception e) { }
                        }
                    }

                    for (int i = 0; i < textosDinamicos.GetLength(0); i++)
                    {
                        Paragraph parrafo = new Paragraph(textosDinamicos[i, 4].ToString(), times);
                        ColumnText Col = new ColumnText(cb);

                        Col.SetSimpleColumn(
                            Convert.ToInt32(textosDinamicos[i, 0])
                            , Convert.ToInt32(textosDinamicos[i, 1])
                            , Convert.ToInt32(textosDinamicos[i, 2])
                            , Convert.ToInt32(textosDinamicos[i, 3])
                        );
                        Col.AddText(parrafo);
                        Col.Go();
                    }

                }
            }
            catch { throw; }
            finally { doc.Close(); }
            return ms.ToArray();
        }

        private static int GetFontStyle(string p)
        {
            switch(p){
                case "normal" :return Font.NORMAL;break; 
                case "bold" :return Font.BOLD;break; 
                case "italic" :return Font.ITALIC;break; 
                case "bold-italic" :return Font.BOLDITALIC;break; 
                default:return Font.NORMAL;break; 
            }
        }

        private static float GetFontsize(string p)
        {
            int n = 0;
            int.TryParse(p, out n);
            if (n > 8) return n;
            else return 8;
        }

        public static void ResponderPDF(Byte[] bytes){
            HttpResponse Response= HttpContext.Current.Response;
            Response.Clear();            
            Response.ContentType = "application/pdf";
            Response.BinaryWrite(bytes);
            Response.End();
        }

        public static byte[] converHTMLToPDF(string htmlText)
        {
            htmlText = htmlText.Replace("<br>", "<br/>");
            Random rnd = new Random();
            int month = rnd.Next(1, 13);
            //string filePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Desktop), String.Format("test{0}.pdf", month));
            MemoryStream ms = null;
            Document pdfDocument = new Document(PageSize.A4, 70, 55, 40, 25);
            try
            {
                ms = new MemoryStream();
                PdfWriter wri = PdfWriter.GetInstance(pdfDocument, ms);
                pdfDocument.Open();
                XMLWorkerHelper.GetInstance().ParseXHtml(wri, pdfDocument, new StringReader(htmlText));
            }
            catch { throw; }
            finally { pdfDocument.Close(); }
            return ms.ToArray();
        }

            public static DataSet GetArchivos(string carpeta,string buscar="*.*",bool subCarpetas=false)
        {
            DataTable tb = new DataTable();
            DataSet result = new DataSet("Archivos");
            tb.Columns.Add("Nombre", typeof(string));
            tb.Columns.Add("Ext", typeof(string));
            tb.Columns.Add("Fecha", typeof(DateTime));
            try
            {
                DirectoryInfo dirPath = new DirectoryInfo(carpeta);
                foreach (FileInfo fi in dirPath.GetFiles(buscar, subCarpetas ? System.IO.SearchOption.AllDirectories : System.IO.SearchOption.TopDirectoryOnly))
                {
                    DataRow dr = tb.NewRow();
                    dr["Nombre"] = Path.GetFileNameWithoutExtension(fi.Name);
                    dr["Ext"] = Path.GetExtension(fi.Name);
                    dr["Fecha"] = File.GetCreationTime(fi.Name);
                    tb.Rows.Add(dr);
                }
            }
            catch { }
            finally
            {
                result.Merge(tb);
            }
            return result;
        }
    }
}

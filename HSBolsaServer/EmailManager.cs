using System;
using System.Collections.Specialized;
using System.Net.Mail;
using System.Xml;

namespace HSBolsaServer
{
    public class EmailManager
    {
        public string remitente;
        public string host;
        public string usuario;
        public string clave;
        public string puerto; 
        public string destinatarios;
        public string cc;
        public string bcc;
        public string asunto;
        public string alias;
        public string body;

        SmartTemplate smarty = new SmartTemplate();

        private XmlDocument srcxmlmail(string srcxml) {
            XmlDocument xmlmail = new XmlDocument();
            xmlmail.Load(srcxml);
            return xmlmail;
        }

        public void sendEmail()
        {
            MailMessage correo = new MailMessage();
            string dest = destinatarios;
            //correo.To.Add(dest);
            string[] destinos = dest.Split(',');
            for (int idest=0; idest < destinos.Length; idest++)
            {
                correo.To.Add(destinos[idest]);
            }
            if (this.cc != "")
            {
                correo.CC.Add(this.cc);
            }
            if (this.bcc != "")
            {
                correo.Bcc.Add(this.bcc);
            }
            correo.From = new MailAddress(remitente, alias, System.Text.Encoding.UTF8);
            correo.Subject = asunto;
            correo.SubjectEncoding = System.Text.Encoding.UTF8;
            correo.Body = smarty.compile(body);
            correo.BodyEncoding = System.Text.Encoding.UTF8;
            correo.IsBodyHtml = true;
            SmtpClient scredencial = new SmtpClient();
            scredencial.Credentials = new System.Net.NetworkCredential(this.usuario, this.clave);
            scredencial.Host = host;
            scredencial.Port = Convert.ToInt16(puerto);
            try
            {
                scredencial.Send(correo);
                string text = String.Format("{0:G} se envia correo a:-{1}", DateTime.Now, correo.To);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public void loadConfiguration(XmlDocument xmlEmailConfig)
        {
            try
            {
                XmlNodeList lista = xmlEmailConfig.GetElementsByTagName("emaildef");
                foreach (XmlElement nodo in lista)
                {
                    this.remitente = nodo.GetAttribute("remitente");
                    this.host = nodo.GetAttribute("host");
                    this.usuario = nodo.GetAttribute("usuario");
                    this.clave = nodo.GetAttribute("clave");
                    this.puerto = nodo.GetAttribute("puerto");
                }
                destinatarios = xmlEmailConfig.DocumentElement["destinatarios"]["destinatario"].InnerText;
                cc = xmlEmailConfig.DocumentElement["destinatarios"]["cc"].InnerText;
                bcc = xmlEmailConfig.DocumentElement["destinatarios"]["bcc"].InnerText;
                body = xmlEmailConfig.DocumentElement["body"].InnerText;
                lista = xmlEmailConfig.GetElementsByTagName("body");
                foreach (XmlElement nodo in lista)
                {
                    asunto = nodo.GetAttribute("asunto");
                    alias = nodo.GetAttribute("alias");
                }
            }
            catch (Exception)
            {
                
                throw;
            }
            
        }

        public void loadBeanValues(XmlDocument xmlBeanValues)
        {
            XmlElement fields = xmlBeanValues.DocumentElement["FIELDS"];
            for (int iField = 0; iField < fields.ChildNodes.Count; iField++)
            {
                this.smarty.assign(fields.ChildNodes[iField]["NAME"].InnerText, fields.ChildNodes[iField]["VALUE"].InnerText);
            }
        }

        public void loadBeanValues(NameValueCollection valuesColection, XmlDocument xmlDefinition)
        {
            for (int ifiel = 0; ifiel < valuesColection.Count; ifiel++)
            {
                this.smarty.assign(valuesColection.Keys[ifiel].ToString(), valuesColection[ifiel].ToString());
            }
            xmlDefinition.InnerXml = this.smarty.compile(xmlDefinition.InnerXml);
            this.loadConfiguration(xmlDefinition);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Web;

namespace CeNAT_CEMEDE.Meteorologia.PIACT.Models
{
    public class NetworkContext
    {

        private static NetworkContext Network;

        private NetworkContext() {

        }

        public static NetworkContext Instance {
            get
            {
                if (Network == null) {
                    Network = new NetworkContext();
                }
                return Network;
            }   
        }

        public int sendEmail(String From,String FromPassword, String Recipient, String Subject, String Body)
        {
            MailMessage mmsg = new MailMessage();
            //Direccion de correo electronico a la que queremos enviar el mensaje
            mmsg.To.Add(new MailAddress(Recipient));
            mmsg.Subject = Subject;
            mmsg.SubjectEncoding = System.Text.Encoding.UTF8;
            mmsg.Body = Body;
            mmsg.BodyEncoding = System.Text.Encoding.UTF8;
            mmsg.IsBodyHtml = true;
            mmsg.From = new System.Net.Mail.MailAddress(From);
  
            //Creamos un objeto de cliente de correo
            System.Net.Mail.SmtpClient cliente = new System.Net.Mail.SmtpClient();
            cliente.EnableSsl = true;
            cliente.UseDefaultCredentials = false;
            //Hay que crear las credenciales del correo emisor
            cliente.Credentials =
                new System.Net.NetworkCredential(From, FromPassword);
            cliente.Host = "smtp.gmail.com";
            cliente.Port = 587;//25;   //haga pruebas con el puerto 80 o el 80 80 porque el server  solo tiene esos habilitados
            cliente.DeliveryMethod = SmtpDeliveryMethod.Network;
            
            try
            {  
                cliente.Send(mmsg);
                return 1;
            }
            catch (System.Net.Mail.SmtpException ex)
            {
                // DBcontext.setPiactProblem(ex.ToString(),)
                throw ex;
            }
        }

    }
}
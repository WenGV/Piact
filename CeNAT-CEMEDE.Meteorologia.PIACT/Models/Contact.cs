using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mail;
using System.Web;
using System.Threading.Tasks;

namespace CeNAT_CEMEDE.Meteorologia.PIACT.Models
{
    public class Contact {
        [Required]
        [Display(Name = "Nombre")]
        [DataType(DataType.Text)]
        [RegularExpression("^[a-zA-Z_áéíóúñs]*$", ErrorMessage = "Digite solo letras por favor.")]
        [MaxLength(40)]
        public string firstName { get; set; }

        [Required]
        [DataType(DataType.Text)]
        [Display(Name = "Apellidos")]
        [RegularExpression("^[a-zA-Z_áéíóúñs]*$", ErrorMessage = "Digite solo letras por favor.")]
        [MaxLength(40)]
        public string lastNames { get; set; }

        [Required]
        [DataType(DataType.EmailAddress)]
        [Display(Name = "Correo electrónico")]
        [EmailAddress(ErrorMessage = "Digite un correo por favor.")]
        [MaxLength(40)]
        public string email { get; set; }

        [Required]
        [DataType(DataType.Text)]
        [Display(Name = "Profesión")]
        [MaxLength(40)]
        public string occupation { get; set; }


        [Required]
        [Display(Name = "Telefono :")]
        [DataType(DataType.PhoneNumber, ErrorMessage = "Digite su numero de telefono por favor")]
        [RegularExpression("^([0-8]{0,8})$", ErrorMessage = "Digite solo numeros y asegurese de digitar solo ocho por favor.")]
        [MaxLength(40)]
        public string phoneNumber { get; set; }

        [Required]
        [Display(Name = "Empresa :")]
        [DataType(DataType.Text, ErrorMessage = "Digite el nombre de su empresa por favor")]
        [MaxLength(40)]
        public string company { get; set; }

        [Required]
        [Display(Name = "Asunto :")]
        [DataType(DataType.MultilineText, ErrorMessage = "Digite un asunto por favor")]
        public string subject { get; set; }

        public int sendEmail(String Name, String Last_name, String Email, String Recipient, String Occupation, String Phone_number, String Company, String Subject, String FromPassword, String Message)
        {
            MailMessage mmsg = new MailMessage();
            //Direccion de correo electronico a la que queremos enviar el mensaje
            mmsg.To.Add(new MailAddress(Recipient));
            mmsg.Subject = Subject;
            mmsg.SubjectEncoding = System.Text.Encoding.UTF8;
            String Body = "<div style='background:#035487;-webkit-border-radius:30px;-moz-border-radius:30px;border-radius:30px;-webkit-box-shadow: 0px 15px 10px 6px rgba(173,160,144,0.61);-moz-box-shadow: 0px 15px 10px 6px rgba(173,160,144,0.61);box-shadow: 0px 15px 10px 6px rgba(173,160,144,0.61);font-family:verdana;margin:0 auto;padding:20px;width:68.685%;'>" +
                                    "<div style='margin-bottom: 30px;'>" +
                                        "<a href='#' style='text-decoration:none;'><p style='color:#fff;font-size:2.5em;font-weight:800;text-align:center;text-decoration:none;'>PIACT</p></a>"+
                                    "</div>"+
                                    "<div style='color:#fff;'>"+
                                        "<p><b>Buen día<b></p>" +
                                        "<p>"+ Name + " " + Last_name +" ha enviado un mensaje de contacto desde la plataforma PIACT con el correo <a href='mailto:"+Email+"' style='color:#fff;'>"+ Email +"</a>:</p>"+           
                                        "<p>Su información personal es:</p>"+
                                        "<p><b>Profesión:</b> " + Occupation + "</p>"+
                                        "<p><b>Número de teléfono:</b> " + Phone_number + "</p>" +
                                        "<p><b>Empresa:</b> " + Company + "</p>" +
                                        "<p><b>Mensaje:</b> "+ Message + "</p>"+
                                        "<br><br>"+
                                        "<p>Saludos,</p>"+   
                                        "<p>Plataforma PIACT</p>"+      
                                    "</div>"+
                          "</div>";
            mmsg.Body = Body;
            mmsg.BodyEncoding = System.Text.Encoding.UTF8;
            mmsg.IsBodyHtml = true;
            mmsg.From = new System.Net.Mail.MailAddress(Email);

            //Creamos un objeto de cliente de correo
            System.Net.Mail.SmtpClient cliente = new System.Net.Mail.SmtpClient("smtp.gmail.com", 587);
            cliente.Credentials = new System.Net.NetworkCredential(Recipient, FromPassword);
            cliente.EnableSsl = true;
            //cliente.UseDefaultCredentials = false;
            //Hay que crear las credenciales del correo emisor
            //cliente.Host = "smtp.gmail.com";
            //cliente.Port = 587;//25;   //haga pruebas con el puerto 80 o el 80 80 porque el server  solo tiene esos habilitados
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
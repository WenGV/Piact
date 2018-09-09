using CeNAT_CEMEDE.Meteorologia.PIACT.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CeNAT_CEMEDE.Meteorologia.PIACT.Controllers
{
    public class ContactController : Controller
    {
        // GET: Contact
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Index(Contact contact) {
            String Recipient = "piactcr@gmail.com";
            String RecipientPassword = "piactcr1234";
            String mail_subject = "Mensaje de Contacto de la Plataforma PIACT";

            String firstName = contact.firstName;
            String lastName = contact.lastNames;
            String email = contact.email;
            String occupation = contact.occupation;
            String phoneNumber = contact.phoneNumber;
            String company = contact.company;
            String subject = contact.subject;

            Contact obj = new Contact();
            try {
                int send_mail_status = obj.sendEmail(firstName, lastName, email, Recipient, occupation, phoneNumber, company, mail_subject, RecipientPassword, subject);

                if (send_mail_status == 1) {
                    ViewBag.Message = "El mensaje ha sido enviado correctamente, responderemos a la mayor brevedad";
                } else if (send_mail_status == 0) {
                    ViewBag.Message = "Hubo un error en el envio del mensaje, por favor intentelo nuevamente1";
                }
            } catch (System.Net.Mail.SmtpException ex) {

                ViewBag.Message = "Hubo un error en el envio del mensaje, por favor intentelo nuevamente2";
            } catch (Exception ex) {
                ViewBag.Message = "Hubo un error en el envio del mensaje, por favor intentelo nuevamente3";

            }

            return View();
        }
    }
}
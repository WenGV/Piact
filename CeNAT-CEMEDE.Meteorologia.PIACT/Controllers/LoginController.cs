using CeNAT_CEMEDE.Meteorologia.PIACT.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;
using System.Web.Mvc;


namespace CeNAT_CEMEDE.Meteorologia.PIACT.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        private void TrackLog(String location, String Action)
        {
            string userIpAddress = this.Request.UserHostAddress;
            String action = "";
            String owner = "";

            action = Action;


            if (Session["email"] != null)
            {
                owner = Session["email"].ToString();
            }


           
            SecurityContext.saveAction(action, location, owner, userIpAddress);
        }
        //Login
        public ActionResult Register()
        {

            if (Session["email"] != null)
            {
                int perfil = 0;
                Int32.TryParse(Session["perfil"].ToString(), out perfil);
                ViewBag.Message = perfil.ToString();

                if (perfil == 1)
                {
                    return View();
                }
                else
                {
                    return RedirectToAction("Index", "Login");
                }
            }
            else
            {
                return RedirectToAction("Index", "Login");
            }
        }


        //Actualizar
        public ActionResult Update()
        {
            return View();
        }

        // POST: UserAccount/Create
        [HttpPost]
        public ActionResult Register(Users usuario)
        {
            ModelState.Clear();
            ViewBag.Message = "Empty";
            try
            {
               
                if (ModelState.IsValid)
                {
                    int perfil = 0;
                    Int32.TryParse(Session["perfil"].ToString(), out perfil);
                    if (Session["email"] != null && perfil == 1)
                    {
                    if (DBcontext.AgregarUsuario(usuario))
                    {
                        String Recipient = usuario.email;
                        usuario.idUser = DBcontext.Mostrar(Recipient);
                        String Subject = "Registro PIACT";
                        String Body = "<body>Gracias por registarse a PIACT " + "<br>"
                            + "Por favor haga click en el " + "<br>" +
                            "siguiente enlace para <a href='"+ "http://piactcr.azurewebsites.net/Login/Confirmar/" + usuario.idUser.ToString()+"'>" 
                            +"registrarse</a></body>";
                        String From = "piactcr@gmail.com";
                        String FromPassword = "piactcr1234";
                        String Action = "";
                        
                        try
                        {
                            int res = NetworkContext.Instance.sendEmail(From, FromPassword, Recipient, Subject, Body);
                            //Case successful 
                            if (res == 1)
                            {
                                ViewBag.Message = usuario.name + "name" + "Registro Correcto!";
                                Session["mensaje"] = "correcto";
                                Action = "correcto";
                            }
                            //Case failed conection
                            else if (res == 0)
                            {
                                Session["mensaje"] = "incorrecto";
                                Action = "Incorrecto";

                            }
                        }
                        catch (System.Net.Mail.SmtpException ex)
                        {
 
                            Session["mensaje"] = "incorrecto";
                            Action = "Incorrecto";
                            DBcontext.setPiactProblem(ex.Message, ex.StackTrace, Session["email"].ToString(), "IP", "BETA");
                        }
                        catch (Exception ex)
                        {
                            Session["mensaje"] = "incorrecto";
                            Action = "Incorrecto";
                            DBcontext.setPiactProblem(ex.Message, ex.StackTrace, Session["email"].ToString(), "IP", "BETA");

                        }
                        String location = "Class: " + System.Reflection.MethodBase.GetCurrentMethod().DeclaringType.Name;
                        location += "-Method: " + System.Reflection.MethodBase.GetCurrentMethod().Name;
                        TrackLog(location,Action);

                        return View();
                    }
                    else
                    {
                        ModelState.AddModelError("email", "Email ya existe!");
                        return View();
                    }
                    }
                    return RedirectToAction("Index", "Login");
                }




                return View();
            }
            catch(Exception ex)
            {
                Session["mensaje"] = "incorrecto";
                DBcontext.setPiactProblem(ex.Message, ex.StackTrace, Session["email"].ToString(), "IP", "BETA");
                return View();
            }
        }



        // POST: Actualizar/Create
        [HttpPost]
        public ActionResult Update(Users usuario)
        {
            try
            {
                String Action = "";
                if (ModelState.IsValid)
                {

                    if (Session["email"] != null)
                    {

                        if (Models.DBcontext.ActualizarUsuario(usuario))
                        {
                            ViewBag.Message = "Usuario agregado exitosamente";
                            Action = "Usuario agregado exitosamente";
                        }

                        ModelState.Clear();
                        ViewBag.Message = usuario.name + " " + "Registro Correcto!";
                    }
                    else
                    {
                        ViewBag.Message = usuario.name + " " + "Registro incorrecto!";

                    }
                }


                //Traking
                String location = "Class: " + System.Reflection.MethodBase.GetCurrentMethod().DeclaringType.Name;
                location += "-Method: " + System.Reflection.MethodBase.GetCurrentMethod().Name;
                TrackLog(location,Action);

                return View();
            }
            catch(Exception ex)
            {
                //SAVE LOG
                DBcontext.setPiactProblem(ex.Message, ex.StackTrace, Session["email"].ToString(), "IP", "BETA");

                return RedirectToAction("Index", "Login");
            }
        }
        

       //TODO
       [HttpPost]
        public ActionResult UsersIndex(Users usuario)
        {
            try
            {

                String Action = "";
                String location = "";
                 int perfil = 0;
                 Int32.TryParse(Session["perfil"].ToString(), out perfil);
                if (validateUser(usuario)  && perfil == 1)
                {
                        int status = 0;
                        Int32.TryParse(usuario.Status, out status);
                        if (status >= 1)
                        {
                            usuario.Status = "0";
                        }
                        else
                        {
                            usuario.Status = "2";// Set Publisher by default
                        }
                        if (Models.DBcontext.UpdateProfileByEmail(usuario))
                        {
                            Session["mensaje"] = "correcto";
                            Action = "correcto";
                        }
                        else
                        {
                            Session["mensaje"] = "incorrecto";
                            Action = "Incorrecto";
                        }
                        //Traking
                        location = "Class: " + System.Reflection.MethodBase.GetCurrentMethod().DeclaringType.Name;
                        location += "-Method: " + System.Reflection.MethodBase.GetCurrentMethod().Name;
                        TrackLog(location, Action);
                        return null;
                    

                }
                else
                {
                    Action = "No tiene permisos para desactivar usuarios";
                }

                //Traking
                location = "Class: " + System.Reflection.MethodBase.GetCurrentMethod().DeclaringType.Name;
                location += "-Method: " + System.Reflection.MethodBase.GetCurrentMethod().Name;
                TrackLog(location,Action);

                return RedirectToAction("Index", "Login");



            }
            catch (Exception ex)
            {
                //SAVE LOG
                DBcontext.setPiactProblem(ex.Message, ex.StackTrace, Session["email"].ToString(), "IP", "BETA");

                return UsersIndex();


            }
        }
        //Login
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Index(Login user)
        {
            try
            {
                /*var response = Request["g-recaptcha-response"];
                string secretKey = "6Ldd7BsUAAAAAPV5qQigjCeqN53JJVn0vpsu1Sc1";
                var client = new WebClient();
                var result = client.DownloadString(string.Format("https://www.google.com/recaptcha/api/siteverify?secret={0}&response={1}", secretKey, response));
                var obj = JObject.Parse(result);
                var status = (bool)obj.SelectToken("success");
                if (status == false)
                {
                    ViewBag.Message = "Por favor, verifica que no eres un robot.";
                }
                else
                {*/
                String Action = "";
                if (ModelState.IsValid || user.email != null)
                    {

                        int perfil = DBcontext.LoginUser(user);
                        
                        ModelState.Clear();

                        if (perfil == 1 || perfil == 2)
                        {
                            Session["email"] = user.email.ToString();
                            Session["perfil"] = perfil;
                            //Session["email"] = form["usuarioAP"].ToString();
                            if (perfil == 1 || perfil == 2)
                            {
                                //Traking log
                                Session["mensaje"] = "Login";
                                Action = "Login";

                                String location = "Class: " + System.Reflection.MethodBase.GetCurrentMethod().DeclaringType.Name;
                                location += "-Method: " + System.Reflection.MethodBase.GetCurrentMethod().Name;
                                TrackLog(location, Action);
                                return RedirectToAction("Index", "Publisher");
                            }
                            // return RedirectToAction("LoggedIn");
                        }
                        else if (perfil == 0)
                        {
                            Action = "Lo sentimos, el email de usuario es incorrecto";
                            String location = "Class: " + System.Reflection.MethodBase.GetCurrentMethod().DeclaringType.Name;
                            location += "-Method: " + System.Reflection.MethodBase.GetCurrentMethod().Name;
                            TrackLog(location, Action);
                            ViewBag.Message = "Lo sentimos, el email de usuario es incorrecto";
                        }
                        else if (perfil == -1) {
                            Action = "Lo sentimos, su contraseña es incorrecto";
                            String location = "Class: " + System.Reflection.MethodBase.GetCurrentMethod().DeclaringType.Name;
                            location += "-Method: " + System.Reflection.MethodBase.GetCurrentMethod().Name;
                            TrackLog(location, Action);
                            ViewBag.Message = "Lo sentimos, su contraseña es incorrecto";
                        }
                    }
                /*}*/

                return View();
            }


            catch(Exception ex)
            {
                string userIpAddress = this.Request.UserHostAddress;

                ViewBag.Message = "Error en el proceso de autenticación, por favor contactar al equipo de desarrollo PIACT";
                DBcontext.setPiactProblem(ex.Message, ex.StackTrace, userIpAddress, "IP", "BETA");
                return View();
            }

        }


        //LoggedIn
        //public ActionResult LoggedIn()
        //{
        //    if (Session["email"] != null)
        //    {
        //        return RedirectToAction("Index","Publisher");
        //    }

        //    else
        //    {
        //        return RedirectToAction("Login");
        //    }
        //}

        //Logout
        public ActionResult LogOut()
        {
           string userIpAddress = this.Request.UserHostAddress;
            try
            {
                String Action = "";
                if (Session["email"] != null)
                {
                    //Traking
                    Session["mensaje"] = "Logout";
                    Action = "Logout";
                    String location = "Class: " + System.Reflection.MethodBase.GetCurrentMethod().DeclaringType.Name;
                    location += "-Method: " + System.Reflection.MethodBase.GetCurrentMethod().Name;
                    TrackLog(location,Action);
                    Session.Abandon();
                    Session.Clear();
                    Response.Cookies.Clear();

                    return RedirectToAction("Index", "Home");

                }
                else
                {
         
                    return RedirectToAction("Index", "Home");

                }
            }
            catch (Exception ex)
            {
                //Log error
                DBcontext.setPiactProblem(ex.Message, ex.StackTrace, Session["email"].ToString(), userIpAddress, "BETA");
                return RedirectToAction("Index");

            }
        }
        //Fin Login


        public ActionResult Confirmar(int id)
        {
            string userIpAddress = this.Request.UserHostAddress;

            try
            {

                String Action = "";
                if (ModelState.IsValid)
                {
                    if (DBcontext.InsertClient(id))
                    {
                        Session["mensaje"] = "correcto";
                        Action = "Confirmar password correcto";
                        //Traking
                        String location = "Class: " + System.Reflection.MethodBase.GetCurrentMethod().DeclaringType.Name;
                        location += "-Method: " + System.Reflection.MethodBase.GetCurrentMethod().Name;
                        TrackLog(location, Action);
                        return View();
                    }
                }
                
                return View();
            }
            catch(Exception ex)
            {
                //Log error
                DBcontext.setPiactProblem(ex.Message, ex.StackTrace, "NA", userIpAddress, "BETA");

                return View();
            }
        }
        //End confirmar

        //Login
        public ActionResult LoginIndex() {
            return View();
        }

        public ActionResult UsersIndex()
        {
            try
            {

            int perfil = 0;
            Int32.TryParse(Session["perfil"].ToString(), out perfil);
            if (Session["email"] != null && perfil==1)
            {
                List<Users> users = new List<Users>();
                users = DBcontext.getAllUsers();
                return View(users);
            }
                return RedirectToAction("Index", "Login");


            }
            catch (Exception ex)
            {
                return RedirectToAction("Index", "Login");

            }

        }

        public ActionResult UsersEdit()
        {
            string userIpAddress = this.Request.UserHostAddress;
            try
            {
            String email = (String)Session["email"];
            email = "alexvillegascarranza@gmail.com";
            if(email != null)
            {
                Users user = DBcontext.getUserByEmail(email);

                    return View(user);
            }
           else
            {
                    return null;
            }

            }
            catch (Exception ex)
            {
                //Log error
                DBcontext.setPiactProblem(ex.Message, ex.StackTrace, Session["email"].ToString(), userIpAddress, "BETA");

                throw;
            }
        }


        [HttpPost]
        public ActionResult UsersEdit(Users user)
        {
            string userIpAddress = this.Request.UserHostAddress;

            try
            {
                String Action = ""; 
                if (validateUser(user))
                {
                    //Password validation
                    if ((user.PasswordHash.Length >= 8) && (user.ConfirmPassword.Length >= 8) && (user.ConfirmPassword.Length >= 8) && user.ConfirmPassword == user.ConfirmPassword2)
                    {
                        user.email = Session["email"].ToString();
                        int perfil = DBcontext.LoginUser(new Models.Login(user.email, user.PasswordHash));
                        if (perfil == 1 || perfil == 2)
                        {
                            user.PasswordHash = user.ConfirmPassword;
                            if (DBcontext.ActualizarUsuario(user) == true)
                            {
                                clearPassword(user);
                                Session["mensaje"] = "correcto";
                                //Traking
                                Action = "Editar datos de usuario correcto";
                                String location = "Class: " + System.Reflection.MethodBase.GetCurrentMethod().DeclaringType.Name;
                                location += "-Method: " + System.Reflection.MethodBase.GetCurrentMethod().Name;
                                TrackLog(location, Action);

                                return View();
                            }
                            else
                            {
                                clearPassword(user);
                                Session["mensaje"] = "incorrecto";
                                //Traking
                                Action = "Editar datos de usuario incorrecto";
                                String location = "Class: " + System.Reflection.MethodBase.GetCurrentMethod().DeclaringType.Name;
                                location += "-Method: " + System.Reflection.MethodBase.GetCurrentMethod().Name;
                                TrackLog(location, Action);

                                return View();
                            }
                        }
                        else
                        {
                            clearPassword(user);
                            Session["mensaje"] = "incorrecto";
                            //Traking
                            Action = "Editar datos de usuario incorrecto";
                            String location = "Class: " + System.Reflection.MethodBase.GetCurrentMethod().DeclaringType.Name;
                            location += "-Method: " + System.Reflection.MethodBase.GetCurrentMethod().Name;
                            TrackLog(location,Action);

                            return View();
                        }
                    }else
                    {
                        clearPassword(user);
                        Session["mensaje"] = "incorrecto";
                        //Traking
                        Action = "Editar datos de usuario incorrecto";
                        String location = "Class: " + System.Reflection.MethodBase.GetCurrentMethod().DeclaringType.Name;
                        location += "-Method: " + System.Reflection.MethodBase.GetCurrentMethod().Name;
                        TrackLog(location,Action);


                    }


                    return View();
                }
                return View();

            }
            catch (Exception ex)
            {
                clearPassword(user);
                Session["mensaje"] = "incorrecto";
                //Log error
                DBcontext.setPiactProblem(ex.Message, ex.StackTrace, Session["email"].ToString(), userIpAddress, "BETA");

                return View();
                //saveLog;
            }


        }


        //Validar injection sql y sizes
        private Boolean validateUser(Users user)
        {

            if (Session["email"] != null)
            {
                List<String> preparedUser = user.toList(user);
                int notNulls = 0;
                foreach (var attr in preparedUser)
                {
                    if (attr != null)
                    {
                        notNulls++;
                        int passLength = attr.Length;
                        if (passLength > 0 && passLength < 45)
                        {
                            if (attr.Contains("'"))
                            {
                                return false;
                            }
                        }
                        else
                        {
                            return false;
                        }
                    }
                    else
                    {
                        continue;
                    }
                }

                //Password validation
                if (notNulls < 1)
                {
                    return false;
                }
                return true;

            }

            return false;
        }

        private void clearPassword(Users user)
        {
            user.PasswordHash = "";
            user.ConfirmPassword = "";
            user.ConfirmPassword2 = "";
        }
    }
}
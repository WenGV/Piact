using CeNAT_CEMEDE.Meteorologia.PIACT.Models;
using CeNAT_CEMEDE.Meteorologia.PIACT.Services;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace CeNAT_CEMEDE.Meteorologia.PIACT.Controllers
{
    public class HomeController : Controller
    {
        //private IMediaPublicationRepository _mediaRepository;

        //public HomeController(IMediaPublicationRepository mediaRepository)
        //{
        //    _mediaRepository = mediaRepository;
        //}

        private MediaPublicationRepository _mediaRepository = new MediaPublicationRepository();

        //
        // GET: /Home/ Last update
        public ActionResult Index()
        {
            return View();
        }

        //public ActionResult IndexResource()
        //{
        //    return View();
        //}

        //public ActionResult Files()
        //{
        //    return View();
        //}


        //prueba Scraping
        private String getScrapData(ClimaticPublication pub)
        {
            string userIpAddress = this.Request.UserHostAddress;

            //return ScrapContext.loadScrapByPubID(pubID);
            try
            {

                String href = "";
                if (pub.nodeIndex > 0)
                {
                    href = ScrapContext.scrapPubByPubIndex(pub.source, pub.nodeIndex, pub.tagType);
                }
                else
                {

                    switch (pub.idPublication)
                    {

                        case 26:
                            href = ScrapContext.scrap26anomSST();
                            break;
                        case 29:
                            href = ScrapContext.scrap29anomDepth();
                            break;
                        //ENOS plumas
                        case 66:
                            href = ScrapContext.scrapInGroup(pub.idPublication, pub.source);
                            break;
                        case 67:
                            href = ScrapContext.scrapInGroup(pub.idPublication, pub.source);
                            break;
                        default:
                            break;
                    }

                }
                return href;
            }
            catch (Exception ex)
            {
                DBcontext.setPiactProblem(ex.Message, ex.StackTrace, userIpAddress, "IP", "BETA");
                return "Server error";
            }
        }




        #region TiempoActual

        //Imagenes Satelitales MAIN
        public ActionResult ImagenesSatelitales()
        {
            return View("TiempoActual/ImagenesSatelitales");
        }

        public ActionResult Atlantico()
        {
            return View("TiempoActual/Atlantico");
        }

        public ActionResult Pacifico()
        {
            return View("TiempoActual/Pacifico");
        }

        //public ActionResult CondicionesTropico()
        //{
        //    return View("TiempoActual/CondicionesTropico");
        //}

        #endregion TiempoActual
        public ActionResult GestionAmbiental()
        {
            return View();
        }
        public ActionResult Resena()
        {
            return View();
        }
        public ActionResult DondeObtieneInfo()
        {
            return View();
        }
        public ActionResult QueOfrece()
        {
            return View();
        }
        public ActionResult AnomaliasPrecipitacion()
        {
            return View();
        }

        //ANOMALIAS
        public ActionResult AnomaliasSST()
        {
            return View();
        }

        public ActionResult AnomaliasVientos()
        {
            return View();
        }
        public ActionResult AnomaliasProfundidad()
        {
            return View();
        }

        public ActionResult AnomaliasElevacion()
        {
            return View();
        }

        //PRONOSTICOS

        public ActionResult enosGRAFICOS()
        {
            return View();
        }

        public ActionResult enosPLUMAS()
        {
            return View();
        }

        public ActionResult CortoPlazo()
        {
            return View();
        }

        public ActionResult MedianoPlazo()
        {
            return View();
        }

        public ActionResult LargoPlazo()
        {
            return View();
        }

        public ActionResult AboutProject()
        {
            return View();
        }


        public ActionResult windsFirstWeek()
        {
            return View();
        }

        public ActionResult windsSecondWeek()
        {
            return View();
        }

        public ActionResult windsMonth()
        {
            return View();
        }



        public ActionResult temperatureONEweek()
        {
            return View();
        }

        public ActionResult temperatureONEMONTH()
        {
            return View();
        }

        public ActionResult temperatureSIXMONTHS()
        {
            return View();
        }

        //Interviews views
        public ActionResult Interviews()
        {
            return View();
        }
        public ActionResult InterviewsVideo()
        {
            return View();
        }

        public ActionResult Library()
        {
            return View();
        }
        //  Load meteorological publications for common clients
        /*   [HttpPost]
           public JsonResult getPubBySection(Sections section)
           {
               if (HttpContext.Request.IsAjaxRequest())
               {
                   int idSection = section.ID;
                   var data = ClimaticPublication.getPublicationBySection(idSection);

                   foreach (var pub in data)
                   {
                       pub.source += getScrapData(pub.idPublication);
                       //This below, should prevent the bad requested Publications to be displayed
                       if (pub.source.Length <= 30)
                       {
                           pub.State = 0;
                       }
                   }

                   return Json(data, JsonRequestBehavior.AllowGet);
               }
               return null;
           }
           */


        // Load meteorological publications for common clients
        [HttpPost]
        public JsonResult getPubBySection(Sections section)
        {


            string userIpAddress = this.Request.UserHostAddress;

            try
            {
                if (HttpContext.Request.IsAjaxRequest())
                {
                    List<ClimaticPublication> Publication_List = new List<ClimaticPublication>();
                    int id = 0;
                    Int32.TryParse(section.Name, out id);//Security feature, handeling indexes

                    //Case for get DAta in Entrevistas
                    if (id == 32 || id == 19 || id == 20)
                    {
                        int pageNum = 0;
                        Int32.TryParse(section.pageNum, out pageNum);//Security feature, handeling indexes

                        Session["Publication_List"] = ClimaticPublication.getPublicationBySection(id, pageNum);
                        Publication_List = (List<ClimaticPublication>)Session["Publication_List"];
                    }
                    else
                    {
                        Session["Publication_List"] = ClimaticPublication.getPublicationBySection(id);
                        Publication_List = (List<ClimaticPublication>)Session["Publication_List"];
                    }

                    if (Publication_List == null) return null;
                    //NULL EXCEPTION TODO
                    foreach (ClimaticPublication pub in Publication_List)
                    {
                        //IF SCRAP IS 0  =  not apply getScrapData
                        if (pub.Scrap == 1)
                        {
                            String href = getScrapData(pub);
                            if (href.Length <= 1)
                            {
                                //This below, should prevent the bad requested Publications to be displayed   
                                pub.State = 0;

                            }
                            else
                            {

                                if (pub.OriginalURL.Length == 0 && href.Length < 600)
                                {
                                    pub.source += href;
                                }
                                else if (href.Length >= 90)
                                {
                                    pub.source = href;
                                }
                                else
                                {
                                    //Original ID has the reference value
                                    pub.source = pub.OriginalURL += href;
                                }
                            }

                        }

                    }

                    return Json(Publication_List, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("network-related"))
                {
                    //send user some alert about the network related problem
                }
                else
                {
                    //Log error
                    DBcontext.setPiactProblem(ex.Message, ex.StackTrace, "NA", userIpAddress, "BETA");
                }
            }
            return null;
        }

        [HttpGet]
        public JsonResult getPubBySectionPaged(Sections section)
        {
            string userIpAddress = this.Request.UserHostAddress;

            try
            {
                if (HttpContext.Request.IsAjaxRequest())
                {
                    List<ClimaticPublication> Publication_List = new List<ClimaticPublication>();

                    Session["Publication_List"] = _mediaRepository.getPublicationBySection(section);
                    Publication_List = (List<ClimaticPublication>)Session["Publication_List"];

                    if (Publication_List == null) return null;
                    //NULL EXCEPTION TODO
                    foreach (ClimaticPublication pub in Publication_List)
                    {
                        //IF SCRAP IS 0  =  not apply getScrapData
                        if (pub.Scrap == 1)
                        {
                            String href = getScrapData(pub);
                            if (href.Length <= 1)
                            {
                                //This below, should prevent the bad requested Publications to be displayed   
                                pub.State = 0;

                            }
                            else
                            {

                                if (pub.OriginalURL.Length == 0 && href.Length < 600)
                                {
                                    pub.source += href;
                                }
                                else if (href.Length >= 90)
                                {
                                    pub.source = href;
                                }
                                else
                                {
                                    //Original ID has the reference value
                                    pub.source = pub.OriginalURL += href;
                                }
                            }

                        }

                    }

                    return Json(Publication_List, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("network-related"))
                {
                    //send user some alert about the network related problem
                }
                else
                {
                    //Log error
                    DBcontext.setPiactProblem(ex.Message, ex.StackTrace, "NA", userIpAddress, "BETA");
                }
            }
            return null;
        }

        /*************EXPERINMENT DINAMIC RENDER**************/

        //private static List<ClimaticPublication> Publication_List = null;


        //InitialPublicPost
        /*[HttpPost]
        public JsonResult getPubBySection(Sections section)
        {
            Session["x"] = "";// new List<ClimaticPublication>();  NOT USE OR WHAT?

            if (HttpContext.Request.IsAjaxRequest())
            {
                int idSection = section.ID;

                //Case 0, means that the Publication List has been previusly load, and the request came for the  remaining publications
                if(idSection == 0)
                {
                    return getPubOnScrolling();
                }
                //First time Publication List is load
                else
                {
                    List<ClimaticPublication> Publication_List = new List<ClimaticPublication>();
                    Publication_List = ClimaticPublication.getPublicationBySection(idSection);
                    
                    ////Cicle below, initialize the State of all Publications
                    //foreach (var pub in Publication_List)
                    //{
                    //    pub.source += getScrapData(pub.idPublication);
                    //}
                    Session["Publication_List"] = Publication_List;
                    Session["Index"] = 0;
                    return getPubOnScrolling();
                }
            }
            return null;
        }
        */
        //Function below, is sending publication to UI, per 3 on 3 groups from a Publication_List
        [HttpPost]
        public JsonResult getPubOnScrolling()
        {

            if (HttpContext.Request.IsAjaxRequest())
            {
                List<ClimaticPublication> data = new List<ClimaticPublication>();
                List<ClimaticPublication> Publication_List = (List<ClimaticPublication>)Session["Publication_List"];
                //int TripeIndex = 0;//count data, on every 3 publication with State on True

                int index = (int)Session["Index"];
                string userIpAddress = this.Request.UserHostAddress;

                try
                {

                    if (index > Publication_List.Count - 1)
                    {
                        return null;
                    }
                    else
                    {


                        data.Add(Publication_List.ElementAt(index));
                        //Below, if next data is the contain the last item, send the current and it's all
                        if ((index + 1) <= Publication_List.Count - 1)
                        {
                            data.Add(Publication_List.ElementAt(index + 1));
                        }
                        //Cicle below, initialize the State of all Publications
                        foreach (var pub in Publication_List)
                        {
                            pub.source += getScrapData(pub);
                            if (pub.source == "") { pub.State = 0; }
                        }
                        index = index + 2;
                        Session["Index"] = index;
                    }

                }
                catch (Exception ex)
                {
                    //Log error
                    DBcontext.setPiactProblem(ex.Message, ex.StackTrace, "NA", userIpAddress, "BETA");

                }

                return Json(data, JsonRequestBehavior.AllowGet);
            }
            return null;
        }


        //Function below, work with the Publication Management Module, to send Pub data
        [HttpPost]
        public JsonResult getPublicationInfo(ClimaticPublication data)
        {
            string userIpAddress = this.Request.UserHostAddress;

            try
            {

                ClimaticPublication pub = new ClimaticPublication();
                if (HttpContext.Request.IsAjaxRequest())
                {
                    //get the source attribute
                    pub = pub.getPublicationInfo(data.idResource);
                    //NOT SOURCE YET, TODO
                    //IF SCRAP IS 0  =  not apply getScrapData
                    if (pub.Scrap == 1)
                    {
                        String href = getScrapData(pub);
                        if (href.Length <= 1)
                        {
                            //This below, should prevent the bad requested Publications to be displayed   
                            pub.State = 0;

                        }
                        else
                        {
                            if (pub.OriginalURL.Length == 0)
                            {
                                pub.source += href;
                            }
                            else if (href.Length >= 90)
                            {
                                pub.source = href;
                            }
                            else
                            {
                                //Original ID has the reference value
                                pub.source = pub.OriginalURL += href;
                            }
                        }

                    }
                    return Json(pub, JsonRequestBehavior.AllowGet);

                }
                return null;
            }
            catch (Exception ex)
            {
                //Log error
                DBcontext.setPiactProblem(ex.Message, ex.StackTrace, "NA", userIpAddress, "BETA");
                return null;

            }
        }
    }
}
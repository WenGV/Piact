using CeNAT_CEMEDE.Meteorologia.PIACT.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace CeNAT_CEMEDE.Meteorologia.PIACT.Controllers
{
    public class BibliotecaController : Controller
    {
        public ActionResult Biblioteca()
        {
            return View();
        }
        public ActionResult Videos()
        {
            return View();
        }

        public ActionResult ClimaticCharts()
        {
            return View();
        }

        //Function below, work with the Publication Management Module, to send Pub data
        [HttpPost]
        public JsonResult worldWeatherGetCityInfo(string city)
        {
            if (string.IsNullOrEmpty(city))
            {
                return null;
            }
            try
            {


                int cityID = 0;
                Int32.TryParse(city, out cityID);
                if (!(cityID < 9999 && cityID > 1)) { return null; }

                string meteorologia = "";

                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(@"http://worldweather.wmo.int/en/json/" + city + "_en.xml");
                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                using (Stream stream = response.GetResponseStream())
                using (StreamReader reader = new StreamReader(stream))
                {
                    var json = reader.ReadToEnd();
                    meteorologia = json;

                    return Json(meteorologia, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception)
            {
                return null;
            }
        }

        [HttpGet]
        public JsonResult worldWeatherGetPresent()
        {
            string meteorologia = "";

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(@"http://worldweather.wmo.int/en/json/present.xml");
            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            using (Stream stream = response.GetResponseStream())
            using (StreamReader reader = new StreamReader(stream))
            {
                // var json = @"{ ""present"": "+reader.ReadToEnd() + "};";
                var json = @reader.ReadToEnd();
                meteorologia = json;

                return Json(meteorologia, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult worldWeatherGetCountries_Map()
        {
            string meteorologia = "";

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(@"http://worldweather.wmo.int/en/json/Country_en.xml");
            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            using (Stream stream = response.GetResponseStream())
            using (StreamReader reader = new StreamReader(stream))
            {
                // var json = @"{ ""present"": "+reader.ReadToEnd() + "};";
                var json = @reader.ReadToEnd();
                meteorologia = json;

                return Json(meteorologia, JsonRequestBehavior.AllowGet);
            }
        }

        //[HttpGet]
        //public JsonResult worldWeatherGetCountries_InfoSiteMap()
        //{
        //    string meteorologia = "";

        //    HttpWebRequest request = (HttpWebRequest)WebRequest.Create(@"http://worldweather.wmo.int/en/json/Region_en.xml");
        //    using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
        //    using (Stream stream = response.GetResponseStream())
        //    using (StreamReader reader = new StreamReader(stream))
        //    {
        //        // var json = @"{ ""present"": "+reader.ReadToEnd() + "};";
        //        var json = @reader.ReadToEnd();
        //        meteorologia = json;

        //        return Json(meteorologia, JsonRequestBehavior.AllowGet);
        //    }
        //}
        // GET: Files
        public ActionResult Index()
        {
            Session["files"] = FileContext.getAllPubTitles();
            return View();
        }
 

        
        // POST: Subir archivo
        [HttpPost]
        public ActionResult Index(FormCollection file)
        {
           // Response.Write(file);
            return View();
        }

        private String loadIcon(String extension)
        {
            switch (extension)
            {
                case ".pdf":
                    return  Url.Content("~/img/PdfIcon.png");
                case ".ppt":
                    return Url.Content("~/img/ppt.png");
                case ".pptx":
                    return Url.Content("~/img/ppt.png");
                case ".doc":
                    return Url.Content("~/img/DocIcon.png");
                case ".docx":
                    return Url.Content("~/img/DocIcon.png");
                case ".xls":
                    return Url.Content("~/img/ExcelIcon.png");

                case ".txt":
                    return Url.Content("~/img/TxtIcon.png");

                case ".zip":
                    return Url.Content("~/img/ZipIcon.png");
                default:
                    return "";
  
            }
        }

        public JsonResult GenerateDownloadLinks()
        {
            List<DataRow> list = new List<DataRow>();

            list = FileContext.readFilesFromLocalPath("/Biblioteca");
            int top = 0;
            foreach (DataRow fi in list)
            {
                string ext = Path.GetExtension(fi[1].ToString());
                fi["Icon"]  = loadIcon(ext);
                top++;
                if(top == 10)
                {
                    //LIMIT OF PUBLICATED FILES
                    break;
                }

            }
            // return View(ShowContent);
            string result = JsonConvert.SerializeObject(list, Newtonsoft.Json.Formatting.Indented);
            return Json(result, JsonRequestBehavior.AllowGet);

        }




        //[HttpPost]
        public JsonResult findFileByName(ClimaticPublication pub)
        {
            if (HttpContext.Request.IsAjaxRequest())
            {
                try
                {


                    if (pub.title.Length >= 10)
                    {
                        pub.title = pub.title.Substring(0, 10);
                    }
                    if (pub.title.Length >= 3)
                    {

                        List<ClimaticPublication> list = (List<ClimaticPublication>) Session["files"];

                        List <ClimaticPublication> res = new List<ClimaticPublication>();

                       // list = FileContext.readFilesFromLocalPath("/Biblioteca");
                        string ext = "";

                        foreach (ClimaticPublication fi in list)
                        {
                            ext = (fi.title);
                            String icon = ext.ToUpper();
                            if (icon.Contains(pub.title.ToUpper()))
                            {
                                ext = fi.source;
                                ext = Path.GetExtension(ext);
                                fi.OriginalURL = loadIcon(ext);
                                res.Add(fi);
                            }
                        }
                        // return View(ShowContent);
                        return Json(res, JsonRequestBehavior.AllowGet);

                    }
                }
                catch (Exception ex)
                {
                    return Json(null, JsonRequestBehavior.AllowGet);

                    throw;
                }
                return null;
            }
            else return null;
        }



    }
}
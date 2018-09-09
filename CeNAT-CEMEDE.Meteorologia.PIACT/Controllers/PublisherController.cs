using CeNAT_CEMEDE.Meteorologia.PIACT.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CeNAT_CEMEDE.Meteorologia.PIACT.Controllers
{
    public class PublisherController : Controller
    {

        // GET: Login
        private void TrackLog(String location,String Action)
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
        //
        // GET: /Publisher/
        public ActionResult Index()
        {
            int perfil = Convert.ToInt32(Session["perfil"]);
            if (Session["email"] != null)
            {
    
                if (perfil == 1 || perfil == 2)
                {
                    return View();
                }
                else
                {
                    return RedirectToAction("Index", "Home");
                }
            }
            else
            {
                return RedirectToAction("Index", "Home");

            }
        }

        [HttpPost]
        public JsonResult getClimaticData(ClimaticPublication State)
        {

            ClimaticData data = new ClimaticData();
            Session["Publication_List"] = DBcontext.getClimaticData();
            data = (ClimaticData)Session["Publication_List"];
    
            //Active or Inactive Resources
            if (State.pos == 1)
            {
                data.resources = data.resources.Where(x => x.pubState == 1).ToList();
            }
            else
            {
                data = (ClimaticData)Session["Publication_List"];
                List<Resource> resources = DBcontext.getResourceList();
                data.resources = data.resources.Where(x => x.pubState == 0).ToList();
            }
            


            if (data == null)
            {
                // show error msg
                return null;
            }

            return Json(data,JsonRequestBehavior.AllowGet);
        }

 
        [HttpPost]
        public JsonResult setPublicationInfo(ClimaticPublication publication)
        {
            if (HttpContext.Request.IsAjaxRequest())
            {
                try
                {
                    //Traking
                    String location = "Class: " + System.Reflection.MethodBase.GetCurrentMethod().DeclaringType.Name;
                    location += "-Method: " + System.Reflection.MethodBase.GetCurrentMethod().Name;
                    TrackLog(location, "Create Publication: " +"Source: "+publication.idPublication);

                    if (publication.img != null)
                    {
                        if (publication.idDisplayMode == 1)
                        {
                            String path = publication.tagType;
                            if (path == null) return null;
                            path = path.Split('/').Last();

                            if (path.ToString().Length > 4)
                            {
                                //If is FIle, store it in local server and return saved virtual path String to pass it to ppub Source
                                FileContext.SaveByteArrayAsImage(path, publication.img, "/img");
                                publication.tagType = "";
                                publication.img = null;
                                //get the source attribute
                                Boolean res = ClimaticPublication.setPublicationInfo(publication);
                                return Json(res, JsonRequestBehavior.AllowGet);
                            }
                        }
                        else if (publication.idDisplayMode == 3)
                        {
                            //Youtube update source
                            publication.source = publication.img;
                            publication.img = null;

                            Boolean res = ClimaticPublication.setPublicationInfo_Source(publication);
                            return Json(res, JsonRequestBehavior.AllowGet);
                        }
                    else
                    {
                        //Clean flags
                        Boolean res = ClimaticPublication.setPublicationInfo(publication);
                        return Json(res, JsonRequestBehavior.AllowGet);
                    }
                       
                    }
                    else
                    {
                        //get the source attribute
                        Boolean res = ClimaticPublication.setPublicationInfo(publication);
                        return Json(res, JsonRequestBehavior.AllowGet);
                    }

                }
                catch (Exception ex)
                {
                    //SAVE LOG
                    //Log error
                    string userIpAddress = this.Request.UserHostAddress;

                    DBcontext.setPiactProblem(ex.Message, ex.StackTrace, Session["email"].ToString(), userIpAddress, "BETA");

                    return null;

                }
            }
            return null;
        }

        [HttpPost]
        public JsonResult setInterviewPublicationInfo(ClimaticPublication publication)
        {
            if (HttpContext.Request.IsAjaxRequest())
            {
                //validate USER VAR
                try
                {
                    //Traking
                    String location = "Class: " + System.Reflection.MethodBase.GetCurrentMethod().DeclaringType.Name;
                    location += "-Method: " + System.Reflection.MethodBase.GetCurrentMethod().Name;
                    TrackLog(location, "Update publication id: "+publication.idPublication);

                    //THE NEXT RULE JUST ALLOW  INTERVIEWS AND BIBLIOTECA TO UPLOAD CONTENT
                    if (publication.idPublication == 32)
                    {
                        String res = "";
                        //Upload file for Biblioteca
                        try
                        {
                            if (publication.img != null)
                            {
                                if (publication.idDisplayMode == 2)
                                {
                                    String path = publication.tagType;
                                    path = path.Split('/').Last();

                                    if (path.ToString().Length > 4)
                                    {
                                        //If is FIle, store it in local server and return saved virtual path String to pass it to ppub Source
                                        FileContext.SaveByteArrayAsImage(path, publication.img,"/Biblioteca");
                                        publication.tagType = "";
                                        publication.img = null;
                                        publication.source =  path;

                                        //SAVE ICON in Original URL column
                                        String ext = Path.GetExtension(path);
                                        publication.OriginalURL = loadIcon(ext);

                                        //get the source attribute
                                        res = ClimaticPublication.setInterviewPublicationInfo(publication);
                                        return Json(res, JsonRequestBehavior.AllowGet);
                                    }
                                }
                                else
                                {
                                    //UPDATE 
                                    res = ClimaticPublication.setPublicationInfo(publication).ToString();
                                    return Json(res, JsonRequestBehavior.AllowGet);
                                }

                            }
                            else
                            {
                                //if cannot upload full do nothing
                                return null;

                            }

                        }
                        catch (Exception ex)
                        {
                            //SAVE LOG
                            //Log error
                            string userIpAddress = this.Request.UserHostAddress;

                            DBcontext.setPiactProblem(ex.Message, ex.StackTrace, Session["email"].ToString(), userIpAddress, "BETA");

                            return null;

                        }
                    }
                    else if(publication.idPublication == 19 || publication.idPublication == 20){
                        //get the source attribute
                        String res = ClimaticPublication.setInterviewPublicationInfo(publication);
                        return Json(res, JsonRequestBehavior.AllowGet);
                    }
                    return null;
                }
                catch (Exception ex)
                {
                    //Log error
                    string userIpAddress = this.Request.UserHostAddress;

                    DBcontext.setPiactProblem(ex.Message, ex.StackTrace, Session["email"].ToString(), userIpAddress, "BETA");

                }
            }
            return null;
        }



        private String loadIcon(String extension)
        {
            switch (extension)
            {
                case ".pdf":
                    return Url.Content("~/img/PdfIcon.png");
                case ".ppt":
                    return Url.Content("~/img/ppt.png");
                case ".pptx":
                    return Url.Content("~/img/ppt.png");
                case ".doc":
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


        [HttpPost]
        public JsonResult setResourcePosition(Resource resource)
        {
            if (HttpContext.Request.IsAjaxRequest())
            {
                try
                {  
                    List<Resource> res = Resource.setResourcePosition(resource);
                    //Traking
                    String location = "Class: " + System.Reflection.MethodBase.GetCurrentMethod().DeclaringType.Name;
                    location += "-Method: " + System.Reflection.MethodBase.GetCurrentMethod().Name;
                    TrackLog(location, "Update pub position idResource: " + resource.ID);
                    return Json(res, JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    //Log error
                    string userIpAddress = this.Request.UserHostAddress;
                    DBcontext.setPiactProblem(ex.Message, ex.StackTrace, Session["email"].ToString(), userIpAddress, "BETA");

                }
            }
            return null;
        }


        /*INTERVIEWS*/

        public ActionResult CreateInterview()
        {

            int perfil = Convert.ToInt32(Session["perfil"]);
            if (Session["email"] != null)
            {
                if (perfil == 1 || perfil == 2)
                {
                    return View();
                }
                else
                {
                    return RedirectToAction("Index", "Home");
                }
            }
            else
            {
                return RedirectToAction("Index", "Login");
            }

        }

        //get the list of Interviews Sections
        public JsonResult getInterviewsSection()
        {
            return Json(DBcontext.getInterviewSection(), JsonRequestBehavior.AllowGet);
        }
        



    }// END class
}//END namespace





//public JsonResult getCategoryData()
//{
//    IQueryable catList = Category.getCategoryData();
//    if (HttpContext.Request.IsAjaxRequest())
//    {
//        return Json(new SelectList(catList,"id","name"),JsonRequestBehavior.AllowGet);
//    }
//    return null;
//}

//public JsonResult getSectionData(int idCategory)
//{
//    IQueryable sectionList = Sections.getSectionsData().Where(x => x.CategoryID == idCategory);
//    if (HttpContext.Request.IsAjaxRequest())
//    {
//        return Json(new SelectList(sectionList, "ID", "NAME"), JsonRequestBehavior.AllowGet);
//    }
//    return null;
//}

//public JsonResult getResourceData(int idSection)
//{
//    IQueryable resourceList = Resource.getResourcesData().Where(x => x.IDsection == idSection);
//    if (HttpContext.Request.IsAjaxRequest())
//    {
//        return Json(new SelectList(resourceList, "ID", "NAME"), JsonRequestBehavior.AllowGet);
//    }
//    return null;
//}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace CeNAT_CEMEDE.Meteorologia.PIACT
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
             name: "categoryList",
             url: "Files/GenerateDownloadLinks",
             defaults: new { controller = "Files", action = "GenerateDownloadLinks" }
            );
            routes.MapRoute(
             name: "filesContent",
             url: "Files/Category/List",
             defaults: new { controller = "Publisher", action = "getCategoryData" }
            );

            routes.MapRoute(
             name: "sectionList",
             url: "Publisher/Section/List/{idCategory}",
             defaults: new { controller = "Publisher", action = "getSectionData", idCategory = "" }
            );


            routes.MapRoute(
             name: "resourceList",
             url: "Publisher/Resource/List/{idSection}",
             defaults: new { controller = "Publisher", action = "getResourceData", idSection = "" }
            );


            routes.MapRoute(
             name: "getpublisherInfo",
             url: "Home/info/{idResource}",
             defaults: new { controller = "Home", action = "getPublicationInfo", idResource = "" }
            );


            routes.MapRoute(
             name: "getPubBySection",
             url: "getPubBySection/",
             defaults: new { controller = "Home", action = "getPubBySection" }

            );

            routes.MapRoute(
                name: "getUserEditView",
                url: "usuarios/editar/{idUser}",
                defaults: new { controller = "Login", action = "UsersEdit", id = UrlParameter.Optional }
            );

            // views

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}

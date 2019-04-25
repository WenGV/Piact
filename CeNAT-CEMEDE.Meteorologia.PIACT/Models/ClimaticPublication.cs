using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web.UI.HtmlControls;

namespace CeNAT_CEMEDE.Meteorologia.PIACT.Models
{
    public class ClimaticPublication
    {
        public String title { get; set; }
        public String interpretation { get; set; }
        public String pubDate { get; set; }
        public int idResource { get; set; }
        public int idPublication { get; set; }
        public int idDisplayMode { get; set; }
        public Byte State { get; set; }
        public Byte Scrap { get; set; }
        public String OriginalURL { get; set; }
        public int nodeIndex { get; set; }
        public int pos { get; set; }

        public int idSection { get; set; }

        public String tagType { get; set; }
        public String authorEmail { get; set; }
        public String source{get;set;}
        public String img { get; set; }
        public ClimaticPublication getPublicationInfo(int idResource)
        {
            return DBcontext.getPublicationInfo(idResource);
        }

  
        public static List<ClimaticPublication> getPublicationBySection(int idSection)
        {
            try
            {
                return DBcontext.getPublicationBySection(idSection);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static List<ClimaticPublication> getPublicationBySection(int idSection, int pageNum)
        {
            try
            {
                return DBcontext.getPublicationBySection(idSection, pageNum);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static Boolean setPublicationInfo(ClimaticPublication pub){
            return DBcontext.setPublicationInfo(pub);
        }

        public static Boolean setPublicationInfo_Source(ClimaticPublication pub)
        {
            return DBcontext.setPublicationInfo_Source(pub);
        }
        

        public static String setInterviewPublicationInfo(ClimaticPublication pub)
        {
            return DBcontext.setInterviewPublicationInfo(pub);
        }

        public static String setVideoPublication(ClimaticPublication pub)
        {
            return DBcontext.setVideoPublication(pub);
        }
        
    }
}

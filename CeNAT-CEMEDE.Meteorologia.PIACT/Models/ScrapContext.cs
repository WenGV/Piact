﻿using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;

namespace CeNAT_CEMEDE.Meteorologia.PIACT.Models
{
    public static class ScrapContext
    {

        private static HtmlWeb getHtmlWeb = new HtmlWeb();


        public static String scrap26anomSST()
        {
            String res = "";
            String href = "";

            try
            {
                var document = getHtmlWeb.Load("http://www.ospo.noaa.gov/Products/ocean/sst/anomaly/index.html");
                var aTags = document.DocumentNode.SelectNodes("//a[@href]");
                //
                //aTags = document.DocumentNode.SelectNodes("href[@gif]").LastOrDefault();


                if (aTags != null)
                {
                    foreach (var aTag in aTags)
                    {
                        href = aTag.Attributes["href"].Value;
                        //list.Add(href);
                        if (href.Contains(".gif"))
                        {
                            res = href;
                        }
                    }

                }
                return res;
            }
            catch (Exception)
            {
                return res;
            }
           
        }

        public static String scrap29anomDepth()
        {
            String sDate = DateTime.Now.ToShortDateString();
            sDate = sDate.Replace("/", "");
            String Year = sDate.Substring(4, 4);
            String Month = sDate.Substring(2, 2);
            return Year + Month + ".gif";
        }


        private static String getAttributeByTagType(String t)
        {
            try
            {
                int start = t.IndexOf("@") + 1;
                int end = t.IndexOf("]", start);
                if (end <= 0)
                {
                    if (t.Contains("a") == true) return "href";
                    else return "src";
                }
                else
                {
                    return t.Substring(start, end - start);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
           
        }

        /*Scrap method by specific node Index or default
          0 is null value
          1 return FIRST element
          999 return LAST element
          Other values can retunrs specific node Index (Node position in html tag list)
         */
        public static String scrapPubByPubIndex( String source, int nodeIndex, String tagType)
        {
            System.Net.ServicePointManager.SecurityProtocol =
            System.Net.SecurityProtocolType.Tls | System.Net.SecurityProtocolType.Tls11 | System.Net.SecurityProtocolType.Tls12;
            var document = new HtmlDocument();
            String href = "";
            
            try
            {
                String attr = getAttributeByTagType(tagType);
                document = getHtmlWeb.Load(source);
                //Search by index
                //var aTags = new HtmlNode(HtmlNodeType.Element, document, 0);
                if (nodeIndex == 1)
                {
                    var aTags = document.DocumentNode.SelectNodes(tagType).FirstOrDefault();
                    href = aTags.Attributes[attr].Value.ToString();

                    return href;
                }
                else if (nodeIndex == 999)
                {
                    var aTags = document.DocumentNode.SelectNodes(tagType).LastOrDefault();
                    href = aTags.Attributes[attr].Value.ToString();

                    return href;
                }
                else
                {
                    var aTags = document.DocumentNode.SelectNodes(tagType).ElementAtOrDefault(nodeIndex);
                    href = aTags.Attributes[attr].Value.ToString();

                    return href;
                }

                return href;
            }
            catch (Exception ex)
            {
                href = "error";
                throw ex;
            }
        }


        public static String getDateInitials(String date) {

            switch (date)
            {
                case "":
                    break;
                default:
                    break;
                

            }

            return "";
        }



        private static string getDateFormat(string num) 
        {
            switch (num)
            {
                case "01":
                    return "jan";
                case "02":
                    return "feb";
                case "03":
                    return "mar";
                case "04":
                    return "apr";
                case "05":
                    return "may";
                case "06":
                    return "jun";
                case "07":
                    return "jul";
                case "08":
                    return "ago";
                case "09":
                    return "set";
                case "10":
                    return "oct";
                case "11":
                    return "nov";
                case "12":
                    return "dec";
                default:
                    return null;
        }
            
            
        }


        public static String scrapInGroup(int idPub, String source)
        {
            String res = "";
            String href = "";
            var document = new HtmlDocument();
            String uri = "";

            try
            {
                System.Net.ServicePointManager.SecurityProtocol =
                System.Net.SecurityProtocolType.Tls | System.Net.SecurityProtocolType.Tls11 | System.Net.SecurityProtocolType.Tls12;

                switch (idPub)
                {
                    case 66:
                 
                        String month = getDateFormat(DateTime.Now.ToString("MM").ToLower());
                        //String month = DateTime.Today.AddDays(-10).ToString("MMM").ToLower();
                        String year = DateTime.Now.Year.ToString();
                        document = getHtmlWeb.Load(source + "var1=" + year + "&var2=" + month);//updatedLinkPlumas66());
                                                                                               //document = getHtmlWeb.Load("https://gmao.gsfc.nasa.gov/cgi-bin/products/climateforecasts/GEOS5/forecastindices_n34.cgi?var1=2017&var2=may");//updatedLinkPlumas66());
                        uri = "http://gmao.gsfc.nasa.gov";
                        break;
                    case 67:
                        document = getHtmlWeb.Load(source);
                        uri = "http://www.cpc.ncep.noaa.gov/products/NMME/current/";
                        break;
                    default:
                        break;
                }        

                var aTags = document.DocumentNode.SelectNodes("//img[@src]");
                if (aTags != null)
                {
                    foreach (var aTag in aTags)
                    {

                        href = uri + aTag.Attributes["src"].Value;
                        if (href.Contains(".png"))
                        {
                            res += href + "\n";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                res = "";
                //return res; //ex.ToString();
                throw ex;
            }
            return res;
        }

    }
      
}
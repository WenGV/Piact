using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Mvc;


namespace CeNAT_CEMEDE.Meteorologia.PIACT.Models
{
    public static class FileContext
    {
        public static void SaveByteArrayAsImage(String fileName, String base64String,String path)
        {
            try
            {

                String s = base64String.Remove(15);
                if (s.Contains("jpeg"))
                {
                    s = base64String.Replace("data:image/jpeg;base64,", " ").Trim();
                }
                else if (s.Contains("png"))
                {
                    s = base64String.Replace("data:image/png;base64,", " ").Trim();
                }
                else
                {
                    //Calculate for other kind of files
                    s = base64String.Replace("data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,"," ").Trim();
                }

                byte[] bytes = Convert.FromBase64String(s);

                String ServerPath = HttpContext.Current.Server.MapPath(path);
                if (System.IO.Directory.Exists(ServerPath))
                {
                    fileName = ServerPath + "\\"+ fileName;
                    System.IO.File.WriteAllBytes(@fileName, bytes);
                }
            }
            catch(Exception ex)
            {
                //SAVE LOG
            }

       }


        public static List<DataRow> readFilesFromLocalPath(string Path)
        {
            List<DataRow> list = new List<DataRow>();
            try
            {
                String name = "";
                String ServerPath = HttpContext.Current.Server.MapPath(Path);
                if (System.IO.Directory.Exists(ServerPath))
                {
                    DataTable ShowContent = new DataTable();
                    ShowContent.Columns.Add("Icon", typeof(string));
                    ShowContent.Columns.Add("DownloadLink", typeof(string));
                    ShowContent.Columns.Add("FileName", typeof(string));
                    System.IO.DirectoryInfo di = new DirectoryInfo(ServerPath);

                    foreach (System.IO.FileInfo fi in di.GetFiles())
                    {
                        DataRow dr = ShowContent.NewRow();
                        dr["FileName"] = fi.Name; ;
                        dr["DownloadLink"] = fi.Name;
                        dr["Icon"] = "";
                      list.Add(dr);
                    }
                  return list;
                }

            }
            catch (Exception ex)
            {
                //SAVE LOG
                throw ex;
            }
            return list;
        }


        public static List<ClimaticPublication> getAllPubTitles()
        {
            return DBcontext.getPubTitlesBySection(32);
        }






    }
}
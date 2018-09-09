using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using CeNAT_CEMEDE.Meteorologia.PIACT.Models;
using System.Web.Mvc;

namespace CeNAT_CEMEDE.Meteorologia.PIACT.Models
{
    public class Category
    {
        public int ID   { get; set; }
        public String Name { get; set; }

        public static IQueryable<Category> getCategoryData()
        {
            return DBcontext.getListCategory().AsQueryable();
        }
    }
}


/*
 
 */
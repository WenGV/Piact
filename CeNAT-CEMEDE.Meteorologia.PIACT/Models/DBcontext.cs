using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using CeNAT_CEMEDE.Meteorologia.PIACT.Models;
using System.Configuration;
using System.Data;

namespace CeNAT_CEMEDE.Meteorologia.PIACT.Models
{
    public static class DBcontext
    {
        // Returns only the list 
        private static SqlConnection _con;

        private static void Connection()
        {
            string connString = ConfigurationManager.ConnectionStrings["piactDBConnection"].ToString();
            _con = new SqlConnection(connString);
        }
        
        // Get the NAME and ID of the Category table
        public static List<Category> getListCategory()
        {
            Connection();
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_getCategoriesList", _con))
                {
                    _con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    List<Category> list = new List<Category>();
                    Category item;
                    while (reader.Read())
                    {

                        item = new Category();
                        item.ID = Convert.ToInt32(reader["id"]);
                        item.Name = Convert.ToString(reader["name"]);
                        list.Add(item);
                    }
                    _con.Close();
                    return list;
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                if (_con.State == ConnectionState.Open)
                {
                    _con.Close();
                }
            }
        }

        //Get the idSection,idCategory and name of data in the Section Table
        public static List<Sections> getListSection()
        {
            Connection();
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_getSeccionList", _con))
                {
                    _con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    List<Sections> list = new List<Sections>();
                    Sections item;
                    while (reader.Read())
                    {
                        item = new Sections();
                        item.ID = Convert.ToInt32(reader["idSection"]);
                        item.Name = Convert.ToString(reader["name"]);
                        item.CategoryID = Convert.ToInt32(reader["idCategory"]);
                        list.Add(item);
                    }
                    _con.Close();
                    return list;
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                if (_con.State == ConnectionState.Open)
                {
                    _con.Close();
                }
            }

        }

        //Get the resource data, idSection, idResource, name from Resources table
        public static List<Resource> getResourceList()
        {
            Connection();
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_getResourceList", _con))
                {
                    _con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    List<Resource> list = new List<Resource>();
                    Resource item;
                    while (reader.Read())
                    {

                        item = new Resource();
                        item.ID = Convert.ToInt32(reader["idResource"]);
                        item.Name = Convert.ToString(reader["name"]);
                        item.IDsection = Convert.ToInt32(reader["idSection"]);
                        item.Pos = Convert.ToInt32(reader["Pos"]);
                        item.pubState = Convert.ToInt32(reader["pubState"]);

                        list.Add(item);
                    }
                    _con.Close();
                    return list;
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                if (_con.State == ConnectionState.Open)
                {
                    _con.Close();
                }
            }
        }


        // GET the next publication data: title, idResource, pubState,name.
        public static ClimaticPublication getPublicationInfo(int idResource)
        {
            Connection();
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_getPublicationInfo", _con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@idResource", idResource);
                    _con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    List<Resource> list = new List<Resource>();
                    ClimaticPublication item;
                    reader.Read();
                        item = new ClimaticPublication();
                        item.title = Convert.ToString(reader["title"]);
                        item.source = Convert.ToString(reader["source"]);
                        item.State = Convert.ToByte(reader["pubState"]);
                        item.Scrap = Convert.ToByte(reader["Scrap"]);
                        item.OriginalURL = Convert.ToString(reader["OriginalURL"]);
                        item.authorEmail = Convert.ToString(reader["email"]);
                        item.pubDate = Convert.ToString(reader["pubDate"]);
                        item.interpretation = reader["interpretation"].ToString();
                        item.img = reader["imageData"].ToString().Replace("\"", "");
                        item.idPublication = Convert.ToInt32(reader["idPub"]);
                        item.pos = Convert.ToInt32(reader["pos"]);
                        item.idDisplayMode = Convert.ToInt32(reader["idDisplayMode"]);


                    //IF ScrapSettings has values
                    if (item.Scrap == 1)
                        {
                            int nodeIndex;
                            Int32.TryParse(reader["nodeIndex"].ToString(), out nodeIndex);
                            item.nodeIndex = nodeIndex;
                            item.tagType = Convert.ToString(reader["tagType"]);
                        }

                    _con.Close();
                    return item;
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                if (_con.State == ConnectionState.Open)
                {
                    _con.Close();
                }
            }
        }


        //-- Parameters: idPub,title,interpretation,state,pubDate,email,imageData
        public static Boolean setPublicationInfo(ClimaticPublication pub)
        {
            Connection();
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_updateClimaticPublication", _con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@idPub", pub.idPublication);
                    cmd.Parameters.AddWithValue("@title", pub.title);
                    cmd.Parameters.AddWithValue("@interpretation", pub.interpretation);
                    cmd.Parameters.AddWithValue("@state", pub.State);
                    //
                    //EMAIL  just for test
                    cmd.Parameters.AddWithValue("@email", "ND");//current user, must be fixedd!

                    if (pub.img == null)
                    {
                        cmd.Parameters.Add("@imageData", SqlDbType.VarBinary, -1);
                        cmd.Parameters["@imageData"].Value = DBNull.Value;
                    }

                    else
                    {
                        cmd.Parameters.AddWithValue("@imageData", pub.img);

                    }


                    _con.Open();
                    int n = cmd.ExecuteNonQuery();
                    return n >= 1;
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                if (_con.State == ConnectionState.Open)
                {
                    _con.Close();
                }
            }
        }

        public static Boolean setPublicationInfo_Source(ClimaticPublication pub)
        {
            Connection();
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_updateClimaticPublication_source", _con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@idPub", pub.idPublication);
                    cmd.Parameters.AddWithValue("@title", pub.title);
                    cmd.Parameters.AddWithValue("@interpretation", pub.interpretation);
                    cmd.Parameters.AddWithValue("@state", pub.State);
                    cmd.Parameters.AddWithValue("@source", pub.source);
                    //
                    //EMAIL  just for test
                    cmd.Parameters.AddWithValue("@email", "ND");//current user, must be fixedd!

                    if (pub.img == null)
                    {
                        cmd.Parameters.Add("@imageData", SqlDbType.VarBinary, -1);
                        cmd.Parameters["@imageData"].Value = DBNull.Value;
                    }

                    else
                    {
                        cmd.Parameters.AddWithValue("@imageData", pub.img);

                    }


                    _con.Open();
                    int n = cmd.ExecuteNonQuery();
                    return n >= 1;
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                if (_con.State == ConnectionState.Open)
                {
                    _con.Close();
                }
            }
        }


        // List<Resource>
        public static List<Resource> setResourcePosition(Resource resource)
        {
            Connection();
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_setNewPosition", _con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@idSelectedResource", resource.ID);
                    cmd.Parameters.AddWithValue("@newPosition", resource.Pos);
                    _con.Open();
                    int n = cmd.ExecuteNonQuery();
                    if (n >= 1) {
                    return  getResourceList();
                    }
                   else { return new List<Resource>(); }
                }
            }
            catch (Exception ex)
            {
                return new List<Resource>();
                //throw ex;
            }
            finally
            {
                if (_con.State == ConnectionState.Open)
                {
                    _con.Close();
                }
            }
        }


        internal static ClimaticData getClimaticData()
        {

            ClimaticData data = new ClimaticData();

            Connection();
            try
            {
                data.categories = getListCategory();
                data.sections = getListSection();
                data.resources = getResourceList();
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                if (_con.State == ConnectionState.Open)
                {
                    _con.Close();
                }
            }

            return data;
        }




          public static List<ClimaticPublication> getPubTitlesBySection(int idSection)
          {
            Connection();
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_getTitlesBySection", _con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@idSection", idSection);
                    _con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    List<ClimaticPublication> list = new List<ClimaticPublication>();
                    ClimaticPublication item;
                    while (reader.Read())
                    {
                        item = new ClimaticPublication();
                        item.title = Convert.ToString(reader["title"]);
                        item.source = Convert.ToString(reader["source"]);
                        //item.State = Convert.ToByte(reader["pubState"]);
                        //item.Scrap = Convert.ToByte(reader["Scrap"]);
                        //item.OriginalURL = Convert.ToString(reader["OriginalURL"]);
                        //item.interpretation = reader["interpretation"].ToString();
                        //item.img = reader["imageData"].ToString().Replace("\"", "");
                        item.idPublication = Convert.ToInt32(reader["idPub"]);
                       // item.idDisplayMode = Convert.ToInt32(reader["idDisplayMode"]);


                        list.Add(item);
                    }

                    return list;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (_con.State == ConnectionState.Open)
                {
                    _con.Close();
                }
            }
        }
    

        /***********************************************************
        * Description: Get the list of:							    *
        * 				  Publication (Title,Interpretation,State),	*
        *				  Image_Publication (imageData),			*
        *				  Resources (source)						*
        ************************************************************
        * Author: Alex Villegas Carranza							*
        *************************************************************
        * Parameters: 	@idSection									*
        ************************************************************/

        public static List<ClimaticPublication> getPublicationBySection(int idSection)
        {
            Connection();
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_getPublicationBySection", _con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@idSection", idSection);
                    _con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    List<ClimaticPublication> list = new List<ClimaticPublication>();
                    ClimaticPublication item;
                    while (reader.Read())
                    {
                        item = new ClimaticPublication();
                        item.title = Convert.ToString(reader["title"]);
                        item.source = Convert.ToString(reader["source"]);
                        item.State = Convert.ToByte(reader["pubState"]);
                        item.Scrap = Convert.ToByte(reader["Scrap"]);
                        item.OriginalURL = Convert.ToString(reader["OriginalURL"]);
                        item.interpretation = reader["interpretation"].ToString();
                        item.img = reader["imageData"].ToString().Replace("\"", "");
                        item.idPublication = Convert.ToInt32(reader["idPub"]);
                        item.idDisplayMode = Convert.ToInt32(reader["idDisplayMode"]);

                        
                        //IF ScrapSettings has values
                        if (item.Scrap == 1)
                        {
                            int nodeIndex;
                            Int32.TryParse(reader["nodeIndex"].ToString(), out nodeIndex);
                            item.nodeIndex = nodeIndex;
                            item.tagType = Convert.ToString(reader["tagType"]);
                        }
                        
                        list.Add(item);
                    }
                    
                    return list;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (_con.State == ConnectionState.Open)
                {
                    _con.Close();
                }
            }
        }

        public static List<ClimaticPublication> getPublicationBySection(int idSection,int page)
        {
            Connection();
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_getPublicationBySection_paged", _con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@idSection", idSection);
                    cmd.Parameters.AddWithValue("@PageNumber", page);
                    _con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    List<ClimaticPublication> list = new List<ClimaticPublication>();
                    ClimaticPublication item;
                    while (reader.Read())
                    {
                        item = new ClimaticPublication();
                        item.title = Convert.ToString(reader["title"]);
                        item.source = Convert.ToString(reader["source"]);
                        item.State = Convert.ToByte(reader["pubState"]);
                        item.Scrap = Convert.ToByte(reader["Scrap"]);
                        item.OriginalURL = Convert.ToString(reader["OriginalURL"]);
                        item.interpretation = reader["interpretation"].ToString();
                        item.img = reader["imageData"].ToString().Replace("\"", "");
                        item.idPublication = Convert.ToInt32(reader["idPub"]);
                        item.idDisplayMode = Convert.ToInt32(reader["idDisplayMode"]);


                        //IF ScrapSettings has values
                        if (item.Scrap == 1)
                        {
                            int nodeIndex;
                            Int32.TryParse(reader["nodeIndex"].ToString(), out nodeIndex);
                            item.nodeIndex = nodeIndex;
                            item.tagType = Convert.ToString(reader["tagType"]);
                        }

                        list.Add(item);
                    }

                    return list;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (_con.State == ConnectionState.Open)
                {
                    _con.Close();
                }
            }
        }


        /*LOGIN - Wenfri Grijalba*/
        //Agregar Userss

        //Agregar Usuarios
        public static bool AgregarUsuario(Users obj)
        {

            Connection();
            try
            {
                using (SqlCommand com = new SqlCommand("SP_Insert_Users", _con))
                {
                    com.CommandType = CommandType.StoredProcedure;
                    com.Parameters.AddWithValue("@name", obj.name);
                    com.Parameters.AddWithValue("@lastName", obj.lastName);
                    com.Parameters.AddWithValue("@phoneNumber", obj.phoneNumber);
                    com.Parameters.AddWithValue("@Pais", obj.Pais);
                    com.Parameters.AddWithValue("@Provincia", obj.Provincia);
                    com.Parameters.AddWithValue("@email", obj.email);
                    com.Parameters.AddWithValue("@company", obj.company);
                    com.Parameters.AddWithValue("@Profession", obj.Profession);
                    com.Parameters.AddWithValue("@PasswordHash", obj.PasswordHash);

                    _con.Open();
                    //int i = Convert.ToInt32(com.ExecuteScalar());
                    //int i = com.ExecuteNonQuery();
                    //return i >= 1;
                    SqlDataReader reader = com.ExecuteReader();
                    reader.Read();

                    int res = Convert.ToInt32(reader["res"]);
                    //1 = inserted, 0 No insertion, user already exists
                    return res>=1;

                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                if (_con.State == ConnectionState.Open)
                {
                    _con.Close();
                }
            }



        }


        //Fin Agregar Usuarios
        //Actualizar Usuario
        public static List<Users> getAllUsers()
        {
            Connection();
            try
            {
                using (SqlCommand com = new SqlCommand("sp_getUsers", _con))
                {
                    _con.Open();
                    SqlDataReader reader = com.ExecuteReader();
                    List<Users> list = new List<Users>();
                    Users item;
                    while (reader.Read())
                    {

                        item = new Users();
                        item.idUser = Convert.ToInt32(reader["idUser"]);
                        item.name = Convert.ToString(reader["name"]);
                        item.lastName = Convert.ToString(reader["lastName"]);
                        item.company = Convert.ToString(reader["company"]);
                        item.Profession = Convert.ToString(reader["profession"]);
                        item.email = Convert.ToString(reader["email"]);
                        item.phoneNumber = Convert.ToString(reader["phoneNumber"]);
                        item.Provincia = Convert.ToString(reader["Provincia"]);
                        item.Pais = Convert.ToString(reader["Pais"]);
                        item.Role = Convert.ToString(reader["Role"]);
                        item.Status = Convert.ToString(reader["Status"]);

                        list.Add(item);
                    }
                    _con.Close();
                    return list;
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public static Users getUserByEmail(string email)
        {
            Connection();
            try
            {
                using (SqlCommand com = new SqlCommand("sp_getUserByEmail", _con))
                {
                    com.CommandType = CommandType.StoredProcedure;
                    com.Parameters.AddWithValue("@email", email);
                    _con.Open();
                    SqlDataReader reader = com.ExecuteReader();
                    Users item;
                    reader.Read();
                        item = new Users();
                        item.name = Convert.ToString(reader["name"]);
                        item.lastName = Convert.ToString(reader["lastName"]);
                        item.company = Convert.ToString(reader["company"]);
                        item.Profession = Convert.ToString(reader["profession"]);
                        item.email = Convert.ToString(reader["email"]);
                        item.phoneNumber = Convert.ToString(reader["phoneNumber"]);
                        item.Provincia = Convert.ToString(reader["Provincia"]);
                        item.Pais = Convert.ToString(reader["Pais"]);
                    _con.Close();
                    return item;
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        //sp_updateProfileByEmail
        public static bool UpdateProfileByEmail(Users obj)
        {

            Connection();
            try
            {
                using (SqlCommand com = new SqlCommand("sp_updateProfileByEmail", _con))
                {
                    int Status = 0;
                    Int32.TryParse(obj.Status, out Status);
                    com.CommandType = CommandType.StoredProcedure;
                    com.Parameters.AddWithValue("@email", obj.email);
                    com.Parameters.AddWithValue("@profile", Status);//Int que equivale al ID del role o Perfil del usuario 

                    _con.Open();

                    int i = com.ExecuteNonQuery();
                    _con.Close();
                    return i >= 1;

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (_con.State == ConnectionState.Open)
                {
                    _con.Close();
                }
            }
        }
        //Actualizar Usuario
        public static bool ActualizarUsuario(Users obj)
        {

            Connection();
            try
            {
                using (SqlCommand com = new SqlCommand("SP_UpdateUser", _con))
                {
                    com.CommandType = CommandType.StoredProcedure;
                    com.Parameters.AddWithValue("@name", obj.name);
                    com.Parameters.AddWithValue("@lastName", obj.lastName);
                    com.Parameters.AddWithValue("@phoneNumber", obj.phoneNumber);
                    com.Parameters.AddWithValue("@Pais", obj.Pais);
                    com.Parameters.AddWithValue("@Provincia", obj.Provincia);
                    com.Parameters.AddWithValue("@email", obj.email);
                    com.Parameters.AddWithValue("@company", obj.company);
                    com.Parameters.AddWithValue("@Profession", obj.Profession);
                    com.Parameters.AddWithValue("@PasswordHash", obj.PasswordHash);

                    _con.Open();

                    int i = com.ExecuteNonQuery();
                    _con.Close();
                    return i >= 1;

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (_con.State == ConnectionState.Open)
                {
                    _con.Close();
                }
            }
        }
        //Actualizar usuario
        //1 or 2 = successfull login
        //-1 fail Password, 0 fail Email
        //Login Users
        public static int LoginUser(Login obj)
        {

            Connection();
            try
            {
                using (SqlCommand com = new SqlCommand("SP_Login", _con))
                {
                    com.CommandType = CommandType.StoredProcedure;
                    com.Parameters.AddWithValue("@email", obj.email);
                    com.Parameters.AddWithValue("@PasswordHash", obj.PasswordHash);

                    _con.Open();
                    SqlDataReader reader = com.ExecuteReader();
                    reader.Read();

                    int res = Convert.ToInt32(reader["res"]);
                    return res;

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (_con.State == ConnectionState.Open)
                {
                    _con.Close();
                }
            }



        }//Fin Login


        //Insert client
        public static bool InsertClient(int obj)
        {

            Connection();
            try
            {
                using (SqlCommand com = new SqlCommand("SP_confirmar", _con))
                {
                    com.CommandType = CommandType.StoredProcedure;
                    com.Parameters.AddWithValue("@idUser", obj);

                    _con.Open();

                    int i = Convert.ToInt32(com.ExecuteScalar());
                    _con.Close();
                    return i >= 1;

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (_con.State == ConnectionState.Open)
                {
                    _con.Close();
                }
            }



        }//insert log client

        public static int Mostrar(string obj)
        {
            Connection();
            // List<Usuario> EmpList = new List<Usuario>();
            try
            {
                SqlCommand com = new SqlCommand("SP_mostrar", _con);
                com.CommandType = CommandType.StoredProcedure;
                com.Parameters.AddWithValue("@email", obj);
                SqlDataAdapter da = new SqlDataAdapter(com);
                DataTable dt = new DataTable();

                _con.Open();
                //  da.Fill(dt);

                //Bind EmpModel generic list using dataRow     
                int i = Convert.ToInt32(com.ExecuteScalar());
                return i;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (_con.State == ConnectionState.Open)
                {
                    _con.Close();
                }
            }
        }


        //INTERVIEWS
        //Get the idSection,idCategory and name of data in the Section Table
        public static List<Sections> getInterviewSection()
        {
            Connection();
            try
            {
                using (SqlCommand cmd = new SqlCommand("getInterviewSection", _con))
                {
                    _con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    List<Sections> list = new List<Sections>();
                    Sections item;
                    while (reader.Read())
                    {
                        item = new Sections();
                        item.ID = Convert.ToInt32(reader["idSection"]);
                        item.Name = Convert.ToString(reader["name"]);
                        item.CategoryID = Convert.ToInt32(reader["idCategory"]);
                        list.Add(item);
                    }
                    _con.Close();
                    return list;
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                if (_con.State == ConnectionState.Open)
                {
                    _con.Close();
                }
            }

        }



        //-- Parameters: idCategory, Title, Source, Interpretation, pubDate,
        public static String setInterviewPublicationInfo(ClimaticPublication pub)
        {
            Connection();
            try
            {
                using (SqlCommand cmd = new SqlCommand("setInterviewPublicationInfo", _con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@idSection", pub.idPublication);
                    cmd.Parameters.AddWithValue("@title", pub.title);
                    cmd.Parameters.AddWithValue("@interpretation", pub.interpretation);
                    cmd.Parameters.AddWithValue("@podcast", pub.source);
                    // cmd.Parameters.AddWithValue("@state", 1);//stade on, by default
                    //EMAIL  just for test
                    cmd.Parameters.AddWithValue("@email", "ND");//current user, must be fixedd!

                    pub.Scrap = 0;
                    //pub.OriginalURL = "";
                    pub.nodeIndex = 0;
                    pub.tagType = "";
                    cmd.Parameters.AddWithValue("@Scrap", pub.Scrap);
                    cmd.Parameters.AddWithValue("OriginalURL", pub.source);
                    cmd.Parameters.AddWithValue("@nodeIndex", pub.nodeIndex);
                    cmd.Parameters.AddWithValue("@tagType", pub.tagType);

                    //@Scrap bit,@OriginalURL nvarchar(max),@nodeIndex int null, @tagType nvarchar(50) null

                    _con.Open();

                    SqlDataReader reader = cmd.ExecuteReader();
                    reader.Read();

                    int res = Convert.ToInt32(reader["res"]);
                    if (res >= 1) return "true";
                    else return "false";
                }
            }
            catch (Exception ex)
            {

                return ex.ToString();//"Error al conectar con la base de datos";//
            }
            finally
            {
                if (_con.State == ConnectionState.Open)
                {
                    _con.Close();
                }
            }
        }




        //-- Parameters: idCategory, Title, Source, Interpretation, pubDate,
        public static String setVideoPublication(ClimaticPublication pub)
        {
            Connection();
            try
            {
                using (SqlCommand cmd = new SqlCommand("setVideoPublication", _con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@title", pub.title);
                    cmd.Parameters.AddWithValue("@description", pub.interpretation);
                    cmd.Parameters.AddWithValue("@videoSource", pub.source);
                    // cmd.Parameters.AddWithValue("@state", 1);//stade on, by default
                    //EMAIL  just for test
                    cmd.Parameters.AddWithValue("@email", "ND");//current user, must be fixedd!

                    _con.Open();

                    SqlDataReader reader = cmd.ExecuteReader();
                    reader.Read();

                    int res = Convert.ToInt32(reader["res"]);
                    if (res >= 1) return "true";
                    else return "false";
                }
            }
            catch (Exception ex)
            {

                return ex.ToString();//"Error al conectar con la base de datos";//
            }
            finally
            {
                if (_con.State == ConnectionState.Open)
                {
                    _con.Close();
                }
            }
        }


        /*ERROR LOG*/
        public static String setPiactProblem(String problem, String location, String userName, String site, String version)
        {
            Connection();
            try
            {
                using (SqlCommand cmd = new SqlCommand("InsertNewPiactProblem", _con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@problem", problem);
                    cmd.Parameters.AddWithValue("@location", location);
                    cmd.Parameters.AddWithValue("@status", "");
                    cmd.Parameters.AddWithValue("@userName", userName);
                    cmd.Parameters.AddWithValue("@site", site);
                    cmd.Parameters.AddWithValue("@version", version);
                    _con.Open();

                    int n = cmd.ExecuteNonQuery();
                    if (n >= 1)return "1";
                    else { return "0"; }
                }
            }
            catch (Exception ex)
            {
                throw ex;//"Error al conectar con la base de datos";//
            }
            finally
            {
                if (_con.State == ConnectionState.Open)
                {
                    _con.Close();
                }
            }
        }

    }
}




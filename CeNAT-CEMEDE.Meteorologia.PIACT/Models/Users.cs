using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CeNAT_CEMEDE.Meteorologia.PIACT.Models
{
    public class Users
    {
      
        public List<String> toList(Users user)
        {
            try
            {


                List<String> preparedUser = new List<String>();
                preparedUser.Add(user.name);
                preparedUser.Add(user.lastName);
                preparedUser.Add(user.phoneNumber);
                preparedUser.Add(user.Pais);
                preparedUser.Add(user.Provincia);
                preparedUser.Add(user.email);
                preparedUser.Add(user.company);
                preparedUser.Add(user.Profession);
                preparedUser.Add(user.PasswordHash);
                preparedUser.Add(user.ConfirmPassword);
                preparedUser.Add(user.ConfirmPassword2);
                preparedUser.Add(user.Status);
                return preparedUser;
            }
            catch (Exception ex)
            {
                return new List<String>();
            }

        }
        public int idUser { get; set; }

        [Required]
        [Display(Name = "Nombre :")]
        [DataType(DataType.Text)]
        [RegularExpression("^[a-zA-Z_áéíóúñs]*$", ErrorMessage = "Digite solo letras por favor.")]
        public string name { get; set; }


        [Required]
        [Display(Name = "Apellido :")]
        [DataType(DataType.Text)]
        [RegularExpression("^[a-zA-Z_áéíóúñs]*$", ErrorMessage = "Digite solo letras por favor.")]
        public string lastName { get; set; }

        [Required]
        [Display(Name = "Telefono :")]
        [DataType(DataType.Text, ErrorMessage = "Digite su numero de telefono por favor")]
        public string phoneNumber { get; set; }

        [Required]
        [Display(Name = "Pais :")]
        public string Pais { get; set; }

        [Required]
        [Display(Name = "Provincia :")]
        public string Provincia { get; set; }

        [Required]
        [Display(Name = "Correo Electronico :")]
        [EmailAddress(ErrorMessage = "Digite un Email Valido.")]
        [MaxLength(40)]
        public string email { get; set; }

        [Required]
        [Display(Name = "Empresa :")]
        [DataType(DataType.Text, ErrorMessage = "Digite texto por favor")]
        public string company { get; set; }

        [Required]
        [Display(Name = "Profesion :")]
        [DataType(DataType.Text,ErrorMessage="Digite texto por favor")]
        public string Profession { get; set; }

        [Required(ErrorMessage = "Password es requerido")]
        [DataType(DataType.Password)]
        [MinLength(8,ErrorMessage = "La contraseña debe contener minimo 8 caracteres")]
        [Display(Name = "Confirmar Contraseña Actual")]
        public string PasswordHash { get; set; }

        [Required(ErrorMessage = "Password es requerido")]
        [DataType(DataType.Password)]
        [MinLength(8, ErrorMessage = "La contraseña debe contener minimo 8 caracteres")]
        [Display(Name = "Nueva Contraseña")]
        public string ConfirmPassword { get; set; }

        [NotMapped]
        [Required(ErrorMessage = "Password es requerido")]
        [CompareAttribute("ConfirmPassword", ErrorMessage = "Confirma correctamente la contraseña")]
        [DataType(DataType.Password)]
        [Display(Name = "Confirmar contraseña")]
        [MinLength(8, ErrorMessage = "La contraseña debe contener minimo 8 caracteres")]

        public string ConfirmPassword2 { get; set; }


        [Required]
        [Display(Name = "Role :")]
        [DataType(DataType.Text)]
        [RegularExpression("^[a-zA-Z_áéíóúñs]*$", ErrorMessage = "Digite solo letras por favor.")]
        public string Role { get; set; }


        [Required]
        [Display(Name = "Status :")]
        [DataType(DataType.Text)]
        [RegularExpression("^[a-zA-Z_áéíóúñs]*$", ErrorMessage = "Digite solo letras por favor.")]
        public string Status { get; set; }

        public Nullable<System.Guid> Salt { get; set; }
    }
}

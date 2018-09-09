using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CeNAT_CEMEDE.Meteorologia.PIACT.Models
{
   public class Login
    {
        public Login(string email, string passwordHash)
        {
            this.email = email;
            PasswordHash = passwordHash;
        }
        public Login()
        {
        }

        [Required(ErrorMessage = "El Correo electrónico es requerido")]
        [Display(Name = "Correo electrónico :")]
        [RegularExpression(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$|^\+?\d{0,2}\-?\d{4,5}\-?\d{5,6}", ErrorMessage = "Por favor digita una cuenta de correo válida")]
        [MaxLength(40)]
        public string email { get; set; }

        [MaxLength(40)]
        [Required(ErrorMessage = "La Contraseña es requerida")]
        [DataType(DataType.Password)]
        [Display(Name = "Contraseña")]
        public string PasswordHash { get; set; }
    }
}

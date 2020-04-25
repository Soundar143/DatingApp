using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        [StringLength(20, MinimumLength = 1 , 
        ErrorMessage="Your username must contains atleast 1 and maximun 20 characters")]
        public string Username { get; set; }

        [Required]
        [StringLength(8, MinimumLength = 5 , 
        ErrorMessage="Your password must contains atleast 4 and maximun 8 characters")]
        public string Password { get; set; }
    }
}
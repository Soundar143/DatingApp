using System.Threading.Tasks;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    public interface IAuthRepository
    {
         // Register User
         Task<User> Register(User user, string password);

         //Login User
         Task<User> Login(string username, string password);

         // Check for User
         Task<bool> UserExists(string username);
    }
}
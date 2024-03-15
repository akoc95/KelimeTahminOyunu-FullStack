using KeywordGame.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using KeywordGame.Data;


namespace KeywordGame.Controllers
{
    [AllowAnonymous]
    public class LoginController : Controller
    {
        private readonly AppDbContext _context;
        private const int MaxFailedAttempts = 3;

        public LoginController(AppDbContext context)
        {
            _context = context;
        }


        [Route("User/Login")]
        public async Task<IActionResult> Index(User u)
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Admin");
            }

            var lockoutEnd = HttpContext.Session.GetString("LockoutEnd");

            DateTime? lockoutEndTime = null;
            if (!string.IsNullOrEmpty(lockoutEnd) && DateTime.TryParse(lockoutEnd, out var parsedLockoutEndTime))
            {
                lockoutEndTime = parsedLockoutEndTime;
            }

            if (lockoutEndTime.HasValue && lockoutEndTime.Value > DateTime.Now)
            {
                //Kilitlenme süresi boyunca bu sayfaya yönlendirir.
                return RedirectToAction("Index", "Home");
            }

            
            var userLogin = _context.Users.FirstOrDefault(x => x.Username == u.Username && x.Password == u.Password);
            if (userLogin != null)
            {
                var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, u.Username)
            };

                var useridentity = new ClaimsIdentity(claims, "a");
                ClaimsPrincipal principal = new ClaimsPrincipal(useridentity);
                await HttpContext.SignInAsync(principal);

                // Giriş yapılırsa Yanlış denemeler silinsin.
                HttpContext.Session.Remove("FailedAttempts");
                return RedirectToAction("Index", "Admin");
            }
            else
            {
                // Hatalı bilgi var ise failedAttempts artar.
                var failedAttempts = HttpContext.Session.GetInt32("FailedAttempts") ?? 0;
                failedAttempts++;
                HttpContext.Session.SetInt32("FailedAttempts", failedAttempts);

                // Kullanıcı deneme limitini aşarsa.
                if (failedAttempts >= MaxFailedAttempts)
                {
                    // User/Login' i o kullanıcı için belirli süre kapat.
                    var lockoutDuration = TimeSpan.FromMinutes(30); // 30 dakika boyunca kilitle.
                    HttpContext.Session.SetString("LockoutEnd", DateTime.Now.Add(lockoutDuration).ToString());

                    // Tüm haklar kullanılırsa isteğe bağlı lockout sayfasına yönlendirebilir veya mesaj gösterilebilir.
                    return View();
                }

                return View();
            }
        }


        [Route("User/Logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return RedirectToAction("Index", "Home");
        }
    }
}

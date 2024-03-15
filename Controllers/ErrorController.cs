using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KeywordGame.Controllers
{
    public class ErrorController : Controller
    {
        [AllowAnonymous]

        [Route("Hata/{statusCode}")]
        public IActionResult ErrorPage(int? statusCode)
        {
            if (statusCode.HasValue)
            {
                if (statusCode == 404)
                {
                    return View("NotFound");
                }
                else
                {
                    return View("GenError");
                }

            }
            return View();
        }

    }
}

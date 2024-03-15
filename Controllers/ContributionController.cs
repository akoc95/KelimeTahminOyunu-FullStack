using KeywordGame.Repositories;
using KeywordGame.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using KeywordGame.Data;

namespace KeywordGame.Controllers
{
    [AllowAnonymous]

    [Route("kelime-oneri")]
    public class ContributionController : Controller
    {
        private readonly ContributionRepository _contributionRepository;

        public ContributionController(ContributionRepository contributionRepository)
        {
            _contributionRepository = contributionRepository;
        }

        [Route("yeni")]
        public IActionResult Add()
        {
            return View();
        }

        [HttpPost]
        [Route("yeni")]
        public IActionResult Add(Contribution cont)
        {

            if (ModelState.IsValid)
            {
                var newContribution = new Contribution { Word = cont.Word, Category = cont.Category };
                _contributionRepository.Insert(newContribution);
                TempData["success"] = "Geribildirimiz başarıyla gönderildi.";
                return RedirectToAction("Index");
            }
            else
            {
                TempData["error"] = "Lütfen boş alan bırakmayın.";
                return RedirectToAction("Index");
            }
        }


        [Route("")]
        public IActionResult Index()
        {
            return View();
        }
    }
}

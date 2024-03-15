using KeywordGame.Data;
using KeywordGame.Repositories;
using KeywordGame.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;

namespace KeywordGame.Controllers
{

    [AllowAnonymous]
    [Route("geri-bildirim")]

    public class ReportController : Controller
    {
        private readonly ReportRepository _reportRepository;

        public ReportController(ReportRepository reportRepository)
        {
            _reportRepository = reportRepository;
        }

        [Route("")]

        public IActionResult Index()
        {
            return View();
        }

        [Route("yeni")]
        public IActionResult SendReport()
        {
            return View();
        }

        [HttpPost]
        [Route("yeni")]
        public async Task<IActionResult> Report(Report rep)
        {
            if (ModelState.IsValid)
            {
                var newReport = new Report { Title = rep.Title, Description = rep.Description, Email = rep.Email };
                _reportRepository.Insert(newReport);

                TempData["success"] = "Geribildirimiz başarıyla gönderildi.";

                // E-posta gönderme işlemi
                await SendEmailAsync(rep.Email, "Mesajınızı aldık",
                    "En kısa sürede tarafınıza dönüş sağlayacağız.<br>" +
                    "Bizimle iletişime geçtiniz için teşekkür eder sağlıklı günler dileriz.<br><br>" +
                    "siteadi.com - Destek");

                return RedirectToAction("Index");
            }
            else
            {
                TempData["error"] = "Lütfen boş alan bırakmayın.";
                return RedirectToAction("Index");
            }
        }

        private async Task SendEmailAsync(string emailAddress, string subject, string body)
        {
            var smtpClient = new SmtpClient("mail.siteadi.com")
            {
                Port = 587,
                Credentials = new NetworkCredential("destek@siteadi.com", "password"),
            };

            var message = new MailMessage
            {
                From = new MailAddress("SiteAdi@siteadi.com"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };
            message.To.Add(emailAddress);

            await smtpClient.SendMailAsync(message);
        }

    }
}
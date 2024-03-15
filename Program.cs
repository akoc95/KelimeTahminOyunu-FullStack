using Microsoft.EntityFrameworkCore;
using KeywordGame.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using KeywordGame.Data;
using System.Data.Common;
using KeywordGame.Repositories;
using KeywordGame.Models;

namespace KeywordGame
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Dependency Injection alaný
            builder.Services.AddControllersWithViews();
            builder.Services.AddSession();
            builder.Services.AddScoped<ReportRepository>();
            builder.Services.AddScoped<ContributionRepository>();
            builder.Services.AddScoped<AnimalRepository>();
            builder.Services.AddScoped<FruitRepository>();
            builder.Services.AddScoped<VegetableRepository>();
            builder.Services.AddScoped<FourLetterRepository>();
            builder.Services.AddScoped<FiveLetterRepository>();
            builder.Services.AddScoped<CountryRepository>();
            builder.Services.AddScoped<CityRepository>();


            // Controllers
            builder.Services.AddScoped<GameController>();
            builder.Services.AddScoped<AdminController>();
            builder.Services.AddScoped<ContributionController>();
            builder.Services.AddScoped<ReportController>();



            // Authorize iþlemi gerçekleþtirir. Belli sayfalara giriþ iznini kapatýr. Tüm projeyi kapsar.
            // Allowanonymus
            builder.Services.AddMvc(config =>
            {
                var policy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .Build();

                config.Filters.Add(new AuthorizeFilter(policy));
            });

            builder.Services.AddAuthentication(
                CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(x =>
                {
                    x.LoginPath = "/Login/Index";
                }

                );

            var DBConnection = builder.Configuration.GetConnectionString("Default");
            builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(DBConnection));

            var app = builder.Build();



            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Error/NotFound");

                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseAuthentication();
            app.UseSession();
            app.UseRouting();
            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");
            app.UseStatusCodePagesWithRedirects("/Hata/{0}");
            app.Run();
        }
    }
}

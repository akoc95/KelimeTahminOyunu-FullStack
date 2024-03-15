using Microsoft.EntityFrameworkCore;
using KeywordGame.Models;

namespace KeywordGame.Data
{
    public class AppDbContext : DbContext
    {

        public AppDbContext()
        {
            
        }

        public AppDbContext(DbContextOptions <AppDbContext> options) : base(options)
        {
            
        }

        public virtual DbSet<Animal> Animals { get; set; }
        public virtual DbSet<City> Cities { get; set; }
        public virtual DbSet<Country> Countries { get; set; }
        public virtual DbSet<FourLetter> FourLetters { get; set; }
        public virtual DbSet<Fruit> Fruits { get; set; }
        public virtual DbSet<Vegetable> Vegetables { get; set; }
        public virtual DbSet<Contribution> Contributions { get; set; }
        public virtual DbSet<Report> Reports { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<FiveLetter> FiveLetters { get; set; }
        public virtual DbSet<SixLetter> SixLetters { get; set; }


    }
}

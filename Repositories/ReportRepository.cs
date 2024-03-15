using KeywordGame.Data;
using KeywordGame.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KeywordGame.Repositories
{
    public class ReportRepository
    {
        private readonly AppDbContext _context;

        public ReportRepository(AppDbContext context)
        {

            _context = context;

        }
        public void Delete(Report rep)
        {
            _context.Remove(rep);
            _context.SaveChanges();
        }

        public List<Report> GetAll()
        {

            return _context.Set<Report>().ToList();
        }

        public void Insert(Report rep)
        {
            _context.Add(rep);
            _context.SaveChanges();

        }
    }
}

using KeywordGame.Data;
using KeywordGame.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KeywordGame.Repositories
{
    public class ContributionRepository
    {
        private readonly AppDbContext _context;
        public ContributionRepository(AppDbContext context)
        {

            _context = context;

        }
        public void Delete(Contribution con)
        {

            _context.Remove(con);
            _context.SaveChanges();
        }

        public List<Contribution> GetAll()
        {

            return _context.Set<Contribution>().ToList();
        }

        public void Insert(Contribution con)
        {
            _context.Add(con);
            _context.SaveChanges();
        }
    }
}

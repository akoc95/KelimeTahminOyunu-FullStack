using KeywordGame.Data;
using KeywordGame.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KeywordGame.Repositories
{
    public class CityRepository : GenericRepository<City>
    {
        
        public CityRepository(AppDbContext context) : base(context)
        {
           
        }

       
    }
}

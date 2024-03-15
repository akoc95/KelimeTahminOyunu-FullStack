using KeywordGame.Data;
using KeywordGame.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KeywordGame.Repositories
{
    public class FruitRepository : GenericRepository<Fruit>
    {       
        public FruitRepository(AppDbContext context) : base(context)
        {
           
        }
        
    }
}

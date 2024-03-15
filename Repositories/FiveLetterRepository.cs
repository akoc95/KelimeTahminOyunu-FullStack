using KeywordGame.Data;
using KeywordGame.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KeywordGame.Repositories
{
    public class FiveLetterRepository : GenericRepository<FiveLetter>
    {
        public FiveLetterRepository(AppDbContext context) : base(context)
        {
           
        }

    }
}

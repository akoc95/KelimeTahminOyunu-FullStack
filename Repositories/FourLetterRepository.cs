using KeywordGame.Data;
using KeywordGame.Models;

namespace KeywordGame.Repositories
{
    public class FourLetterRepository : GenericRepository<FourLetter>
    {
        
        public FourLetterRepository(AppDbContext context) : base(context)
        {
           
        }      
       
    }
}

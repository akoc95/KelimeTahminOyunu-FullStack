using KeywordGame.Data;
using KeywordGame.Models;

namespace KeywordGame.Repositories
{

    // Burası tüm methodların ana reposu. Çoğu repo buradaki methodları kullanır.
    public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
    {
        private readonly AppDbContext _context;

        public GenericRepository(AppDbContext context)
        {

            _context = context;

        }

        // Tablodaki verileri Word'e göre siler. GetByName ile ortak çalışır.
        public void Delete(T item)
        {
            _context.Remove(item);
            _context.SaveChanges();
        }

        // Tablodaki tüm kelimeleri listeler. Web tarafında kullanılmayacak. Hazırda bekletiyorum.
        public List<T> GetAll()
        {
            return _context.Set<T>().ToList();
        }

       
        // Kelime eklemek için yazıldı.

        public void Insert(T item)
        {
            _context.Add(item);
            _context.SaveChanges();
        }

        // Kelime güncellemek için yazıldı. GetByName ile ortak çalışır.
        public void Update(T item)
        {
            _context.Update(item);
            _context.SaveChanges();
        }

        // Rastgele bir kelime getirmek için yazıldı.
        public async Task<T> GetKeyword()
        {
            var randomEntry = _context.Set<T>().OrderBy(x => Guid.NewGuid()).FirstOrDefault();

            return randomEntry;

        }

        public async Task<T> GetByName(string name)
        {
            return _context.Set<T>().FirstOrDefault(x => x.Word == name);
        }
    }
}

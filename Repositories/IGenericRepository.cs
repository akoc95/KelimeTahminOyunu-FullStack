namespace KeywordGame.Repositories
{
    public interface IGenericRepository<T>
    {
        void Insert(T item);
        void Delete(T item);
        void Update(T item);
        List<T> GetAll();
        Task<T> GetKeyword();
        Task<T> GetByName(string name);

    }
}

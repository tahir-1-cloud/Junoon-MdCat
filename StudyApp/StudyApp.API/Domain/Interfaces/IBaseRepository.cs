namespace StudyApp.API.Domain.Interfaces
{
    public interface IBaseRepository<T> where T : class
    {
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task<IEnumerable<T>> GetAsync();
        
    }
}

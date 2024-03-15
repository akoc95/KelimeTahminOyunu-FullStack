namespace KeywordGame.Models
{
    public class BaseEntity
    {
        public int Id { get; set; }
        public string Word { get; set; }
        public string? ImagePath { get; set; }
        public string? ImageDesc { get; set; }
        public bool? IsActive { get; set; } = true;
       
    }
}

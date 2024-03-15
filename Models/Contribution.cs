namespace KeywordGame.Models
{
    public class Contribution
    {
        public int Id { get; set; }

        public string Word { get; set; }

        public string? Category { get; set; }

        public bool? IsActive { get; set; } = false;

        public DateTime? DateCreated { get; set; } = DateTime.Now;
    }
}

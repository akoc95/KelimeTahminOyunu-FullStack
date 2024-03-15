namespace KeywordGame.Models
{
    public class SiteMap
    {
        public string Url { get; set; }
        public DateTime LastModified { get; set; }
        public ChangeFrequency ChangeFrequency { get; set; }
        public double Priority { get; set; }
    }

    public enum ChangeFrequency
    {
        Always,
        Hourly,
        Daily,
        Weekly,
        Monthly,
        Yearly,
        Never
    }

}
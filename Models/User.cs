using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KeywordGame.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string? Email { get; set; }
        public bool IsAdmin { get; set; } = false;
        public DateTime? DateCreated { get; set; } = DateTime.Now;
    }
}

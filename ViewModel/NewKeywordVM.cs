using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KeywordGame.ViewModel
{
    public class NewKeywordVM
    {
        // Kelime güncelleme için kullanıyorum.
        public int Id { get; set; }
        public string Word { get; set; }
        public string NewWord { get; set; }
        public string? Category { get; set; }
        public string? ImagePath { get; set; }
        public string? ImageDesc { get; set; }


    }
}

# KeywordleFinal

appsettings.json içerisinde Default kısmına Bağlantı bilgilerinizi yazarak kaydedin.
Migration yaparak database tablolarını oluşturduktan sonra veri ekleme işlemlerine başlayabilirsiniz.

Eğer projeyi yayınlayacak iseniz satın aldığınız Hosting firmasından SMTP Mail ayarlarını isteyin.
ReportController içerisinde 
"private async Task SendEmailAsync(string emailAddress, string subject, string body)" methodunu bulup kendi SMTP ayarlarınız ile değiştirin.

Views/Admin/Index içerisinde
"<a class="text-decoration-none text-secondary" href="https://webmail.siteadi.com/" target="_blank">Web mail'e yönlendir.</a>"
İlgili URL'yi kendi site adınıza göre değiştirin.

Bitki, Canlı, Meyve, Sebze, Şehir, Ülke kategolerinde resim eklenmesi gerekmekte.
Ayrıca Şehir kategorisinde ilgili resmin tanıtım metni de olması gerekmekte.
Migration yaparken bu kolonlar zaten otomatik olarak eklenecek.

Demo: https://kelimegrafi.com

İletişim: dev.ahkoc@gmail.com






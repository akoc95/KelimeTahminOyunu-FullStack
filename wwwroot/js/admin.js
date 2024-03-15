$("#_animalView").load("Admin/ListAnimals")
$("#_cityView").load("/Admin/ListCities")
$("#_countryView").load("/Admin/ListCountries")
$("#_fruitView").load("/Admin/ListFruits")
$("#_fourLetterView").load("/Admin/ListFourLetters")
$("#_fiveLetterView").load("/Admin/ListFiveLetters")
$("#_vegetableView").load("/Admin/ListVegetables")
$("#reportSection").load("/Admin/ListReports")
$("#contributeSection").load("/Admin/ListContributions")


function checkKeywordLength() {

    let category = document.getElementById("Category").value;
    let keywordInput = document.getElementById("keywordInput");

    if (category === "4 Harf") {

        keywordInput.minLength = 4;
        keywordInput.maxLength = 4;
    }

    else {
        keywordInput.maxLength = 15;
    }

    if (category === "5 Harf") {
        keywordInput.minLength = 5;
        keywordInput.maxLength = 5;
    }

    else if (category == "6 Harf") {
        keywordInput.minLength = 6;
        keywordInput.maxLength = 6;
    }

}

$(document).ready(function () {
    $('#addKeywordForm').submit(function (e) {
        e.preventDefault(); // Sayfanın yenilenmesini engelle
        var formData = $(this).serialize(); // Form verilerini al
        $.ajax({
            url: '/Admin/AddNewKeyword',
            type: 'POST',
            data: formData,
            success: function () {
                Swal.fire({
                    icon: 'success',
                    title: 'Eklendi!',
                    text: 'Yeni kelime başarıyla eklendi.',
                    background: '#1c1f23', // Başarı mesajının arka plan rengi
                    customClass: {
                        popup: 'swal2-bg-dark', // Pop-up arka plan rengi
                        title: 'swal2-title-dark', // Başlık arka plan rengi
                        htmlContainer: 'swal2-html-container-dark', // HTML içeriği arka plan rengi
                        confirmButton: 'swal2-btn-dark', // Onay düğmesi arka plan rengi
                        timer: 1500
                    }
                }).then(() => {
                    location.reload(); // Sayfayı yenilemek yerine silinen öğeyi tablodan kaldırabilirsiniz
                });
            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText);
                Swal.fire({
                    icon: 'error',
                    title: 'Hata!',
                    text: 'Kelime tabloda mevcut.',
                    timer: 1500 // 3 saniye sonra otomatik kapanır
                });
            }
        });
    });
});

$(document).ready(function () {
    $('#deleteKeywordForm').submit(function (e) {
        e.preventDefault(); // Sayfanın yenilenmesini engelle
        var formData = $(this).serialize(); // Form verilerini al
        $.ajax({
            url: '/Admin/DeleteWord',
            type: 'POST',
            data: formData,
            success: function () {
                Swal.fire({
                    icon: 'success',
                    title: 'Silindi!',
                    text: 'Kelime başarıyla silindi.',
                    background: '#1c1f23', // Başarı mesajının arka plan rengi
                    customClass: {
                        popup: 'swal2-bg-dark', // Pop-up arka plan rengi
                        title: 'swal2-title-dark', // Başlık arka plan rengi
                        htmlContainer: 'swal2-html-container-dark', // HTML içeriği arka plan rengi
                        confirmButton: 'swal2-btn-dark' // Onay düğmesi arka plan rengi
                    }
                }).then(() => {
                    location.reload(); // Sayfayı yenilemek yerine silinen öğeyi tablodan kaldırabilirsiniz
                });
            },
            error: function (xhr, status, error) {

                Swal.fire({
                    icon: 'error',
                    title: 'Hata!',
                    text: 'Kelime mevcut değil!',
                    background: '#000', // Arka plan rengi siyah
                    customClass: {
                        popup: 'swal2-bg-dark', // Pop-up arka plan rengi
                        title: 'swal2-title-dark', // Başlık arka plan rengi
                        htmlContainer: 'swal2-html-container-dark', // HTML içeriği arka plan rengi
                        confirmButton: 'swal2-btn-dark', // Onay düğmesi arka plan rengi
                        content: 'swal2-content-dark' // İçerik rengi
                    },
                    showConfirmButton: true, // Onay düğmesini göster
                    confirmButtonColor: 'swal2-btn-dark', // Onay düğmesi rengi beyaz
                    confirmButtonText: 'Tamam', // Onay düğmesi metni
                    cancelButtonColor: '#d33', // İptal düğmesi rengi kırmızı
                    cancelButtonText: 'İptal' // İptal düğmesi metni
                });
            }
        });
    });
});

$(document).ready(function () {
    $('#updateKeywordForm').submit(function (e) {
        e.preventDefault(); // Sayfanın yenilenmesini engelle
        var formData = $(this).serialize(); // Form verilerini al
        $.ajax({
            url: '/Admin/UpdateWord',
            type: 'POST',
            data: formData,
            success: function () {
                Swal.fire({
                    icon: 'success',
                    title: 'Güncellendi!',
                    text: 'Kelime başarıyla güncellendi.',
                    background: '#1c1f23', // Başarı mesajının arka plan rengi
                    customClass: {
                        popup: 'swal2-bg-dark', // Pop-up arka plan rengi
                        title: 'swal2-title-dark', // Başlık arka plan rengi
                        htmlContainer: 'swal2-html-container-dark', // HTML içeriği arka plan rengi
                        confirmButton: 'swal2-btn-dark' // Onay düğmesi arka plan rengi
                    }
                }).then(() => {
                    location.reload(); // Sayfayı yenilemek yerine silinen öğeyi tablodan kaldırabilirsiniz
                });
            },
            error: function (xhr, status, error) {

                Swal.fire({
                    icon: 'error',
                    title: 'Hata!',
                    text: 'Kelime mevcut değil!',
                    background: '#000', // Arka plan rengi siyah
                    customClass: {
                        popup: 'swal2-bg-dark', // Pop-up arka plan rengi
                        title: 'swal2-title-dark', // Başlık arka plan rengi
                        htmlContainer: 'swal2-html-container-dark', // HTML içeriği arka plan rengi
                        confirmButton: 'swal2-btn-dark', // Onay düğmesi arka plan rengi
                        content: 'swal2-content-dark' // İçerik rengi
                    },
                    showConfirmButton: true, // Onay düğmesini göster
                    confirmButtonColor: 'swal2-btn-dark', // Onay düğmesi rengi beyaz
                    confirmButtonText: 'Tamam', // Onay düğmesi metni
                    cancelButtonColor: '#d33', // İptal düğmesi rengi kırmızı
                    cancelButtonText: 'İptal' // İptal düğmesi metni
                });
            }

        });
    });
});

function confirmDeleteCon(id) {
    Swal.fire({
        title: 'Emin misiniz?',
        text: "Bu öneriyi silmek istediğinizden emin misiniz?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Evet, sil!',
        cancelButtonText: 'İptal',
        background: '#1c1f23', // Arka plan rengi
        customClass: {
            popup: 'swal2-bg-dark', // Pop-up arka plan rengi
            content: 'swal2-content-dark', // İçerik arka plan rengi
            confirmButton: 'swal2-btn-dark', // Onay düğmesi arka plan rengi
            cancelButton: 'swal2-btn-dark' // İptal düğmesi arka plan rengi
        }
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/Admin/DeleteCon',
                type: 'POST',
                data: { id: id },
                success: function () {
                    Swal.fire({
                        icon: 'success',
                        title: 'Silindi!',
                        text: 'Geribildirim başarıyla silindi.',
                        background: '#1c1f23', // Başarı mesajının arka plan rengi
                        customClass: {
                            popup: 'swal2-bg-dark', // Pop-up arka plan rengi
                            title: 'swal2-title-dark', // Başlık arka plan rengi
                            htmlContainer: 'swal2-html-container-dark', // HTML içeriği arka plan rengi
                            confirmButton: 'swal2-btn-dark' // Onay düğmesi arka plan rengi
                        }
                    }).then(() => {
                        location.reload(); // Sayfayı yenilemek yerine silinen öğeyi tablodan kaldırabilirsiniz
                    });
                },
                error: function () {
                    Swal.fire(
                        'Hata!',
                        'Silme işlemi başarısız oldu.',
                        'error'
                    );
                }
            });
        }
    });
}


function confirmDeleteRep(id) {
    Swal.fire({
        title: 'Emin misiniz?',
        text: "Bu geribildirimi silmek istediğinizden emin misiniz?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Evet, sil!',
        cancelButtonText: 'İptal',
        background: '#1c1f23', // Arka plan rengi
        customClass: {
            popup: 'swal2-bg-dark', // Pop-up arka plan rengi
            content: 'swal2-content-dark', // İçerik arka plan rengi
            confirmButton: 'swal2-btn-dark', // Onay düğmesi arka plan rengi
            cancelButton: 'swal2-btn-dark' // İptal düğmesi arka plan rengi
        }
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/Admin/DeleteRep',
                type: 'POST',
                data: { id: id },
                success: function () {
                    Swal.fire({
                        icon: 'success',
                        title: 'Silindi!',
                        text: 'Öneri başarıyla silindi.',
                        background: '#1c1f23', // Başarı mesajının arka plan rengi
                        customClass: {
                            popup: 'swal2-bg-dark', // Pop-up arka plan rengi
                            title: 'swal2-title-dark', // Başlık arka plan rengi
                            htmlContainer: 'swal2-html-container-dark', // HTML içeriği arka plan rengi
                            confirmButton: 'swal2-btn-dark' // Onay düğmesi arka plan rengi
                        }
                    }).then(() => {
                        location.reload(); // Sayfayı yenilemek yerine silinen öğeyi tablodan kaldırabilirsiniz
                    });
                },
                error: function () {
                    Swal.fire(
                        'Hata!',
                        'Silme işlemi başarısız oldu.',
                        'error'
                    );
                }
            });
        }
    });
}

$(document).ready(function () {
    $('#bulkKeywordForm').submit(function (e) {
        e.preventDefault(); // Sayfanın yenilenmesini engelle
        var formData = $(this).serialize(); // Form verilerini al
        $.ajax({
            url: '/Admin/AddBulk',
            type: 'POST',
            data: formData,
            success: function () {
                Swal.fire({
                    icon: 'success',
                    title: 'Eklendi!',
                    text: 'Kelimeler başarıyla eklendi.',
                    background: '#1c1f23', // Başarı mesajının arka plan rengi
                    customClass: {
                        popup: 'swal2-bg-dark', // Pop-up arka plan rengi
                        title: 'swal2-title-dark', // Başlık arka plan rengi
                        htmlContainer: 'swal2-html-container-dark', // HTML içeriği arka plan rengi
                        confirmButton: 'swal2-btn-dark', // Onay düğmesi arka plan rengi
                        timer: 1500
                    }
                }).then(() => {
                    location.reload(); // Sayfayı yenilemek yerine silinen öğeyi tablodan kaldırabilirsiniz
                });
            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText);
                Swal.fire({
                    icon: 'error',
                    title: 'Hata!',
                    text: 'Kelimelerden bazıları tabloda mevcut.',
                    timer: 1500 // 3 saniye sonra otomatik kapanır
                });
            }
        });
    });
});
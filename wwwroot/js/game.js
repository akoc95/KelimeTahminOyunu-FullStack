var beepURL = "/sound/beep-sound.mp3"
var correctAnswerURL = "/sound/correct-answer.mp3"
var wrongAnswerURL = "/sound/wrong-answer.mp3"

var beepSound = new Audio(beepURL);
var correctSound = new Audio(correctAnswerURL);
var wrongSound = new Audio(wrongAnswerURL);


class Animal {
    constructor() {

        this.countDownZero = null;
        this.currentFormIndex = 0;
        this.forms = ["form1"];
        this.enterEnabled = true;
        this.kWord = "";
        this.getNKywCounter = 0;
        this.list = [];
        this.counter = 0;
        this.score = 0;
        this.randomNumber;
        this.initialize();
        this.second = 30;
        this.failed = false;

    }

    initialize() {

        this.countDown(this.second);
        this.getNKyw();
        this.addEventListeners();
    }

    // Geri sayım
    countDown() {
        this.countDownZero && clearInterval(this.countDownZero);
        this.countDownZero = setInterval(() => {

            // Timer içindeki değer güncelleniyor.
            $("#timer").html(this.second);

            // Geri sayım 0 veya daha küçük ise
            if (this.second <= 0) {
                $("#timer").html(30);
                clearInterval(this.countDownZero);
                $("#timer").hide().css("color", "white");
                wrongSound.play();
                $(".formInput input").prop("readonly", true);
                $(".formInput input").prop("disabled", true);
                for (let i = 0; i < this.kWord.length; i++) {
                    $(".formInput input:eq(" + i + ")").val(this.kWord[i]).css({
                        "background": "#6aaa64",
                        "color": "white",
                        "text-shadow": "2px 2px 4px rgb(0, 0, 0)"
                    }).hide().delay(300 * i).fadeIn(300);
                }

                // Restart butonu
                $("#restart")
                    .removeClass("d-none")
                    .off("click")
                    .click(() => {
                        $("#restart").addClass("d-none");
                    });

            }

            //renk değiştirme & shake & sound
            else {
                if (this.second === 5 || this.second === 3 || this.second === 1) {
                    $("#timer").addClass("shake").css("color", "#ff0015");
                    beepSound.play(); // Ses çal
                } else if (this.second === 4 || this.second === 2) {
                    $("#timer").removeClass("shake").css("color", "#ff0015");
                    beepSound.play();
                }

                this.second--;
            }

        }, 1000); // 1000 = 1 saniye. Geri sayım için kullanılıyor.

    }

    //Kelime database de mevcut mu?
    isKeywordExist(word, callback) {
        $.ajax({
            url: "/Game/IsAnimalExist",
            type: "GET",
            data: { searchKeyword: word },
            success: (response) => {
                callback(response.isExist);
            },
            error: (error) => {
                callback(false);
            }
        });
    }

    // Gelen değer ile girilen değer eşleşiyor mu?
    checkMatch() {

        const formId = this.forms[this.currentFormIndex];
        const inputValue = this.getInputValue(formId);

        if (inputValue.length < this.kWord.length || inputValue.includes(" ")) {
            this.displayMessage("Eksik harf!", "secondary");
        } else {
            this.isKeywordExist(inputValue, (isExist) => {
                if (!isExist) {
                    this.displayMessage("Geçersiz kelime!", "danger");
                    $("#" + formId + " input").css("background", "#993535")
                        .css("color", "white")
                        .css("text-shadow", "2px 2px 4px rgb(0, 0, 0)");
                }
            });

            // Kelime eşleşmiyor ise.
            if (inputValue != this.kWord) {
                this.second = 0;
            }


            // Kelime kullanıcı verisi ile eşleşiyor ise.
            else if (inputValue === this.kWord) {

                correctSound.play();
                this.setColors(inputValue, formId);
                $("#" + formId + " input").prop("readonly", true);
                $("#" + formId + " input").prop("disabled", true);
                this.currentFormIndex = 0;
                this.score += 1;
                $("#score").html("Skor: " + this.score).addClass("shake");

                setTimeout(() => {
                    clearInterval(this.countDownZero);
                    this.second = 30;
                    this.countDown();
                });

                this.kWord = this.getNKyw();

            }

        }

    }

    // input değerlerini alır.
    getInputValue(form) {
        return $("#" + form + " input").map(function () {
            return $(this).val().toUpperCase();
        }).get().join("");
    }

    // input renklerini harfe göre ayarlar.
    setColors(inputValue, formId) {
        const occurrences = this.countLetterOccurrences(this.kWord);

        for (let i = 0; i < inputValue.length; i++) {
            const char = inputValue.charAt(i);
            const input = $("#" + formId + ' input[name="letter' + (i + 1) + '"]');

            if (this.kWord.charAt(i) === char) {
                input
                    .css("background-color", "#6aaa64")
                    .css("color", "white")
                    .css("text-shadow", "2px 2px 4px rgb(0, 0, 0)")
                    .text(occurrences[char]);

                occurrences[char]--;
                if (occurrences[char] <= 0) {
                    delete occurrences[char];
                }
            } else {
                input
                    .css("background-color", "#3a3a3c")
                    .css("color", "white")
                    .css("text-shadow", "2px 2px 4px rgb(0, 0, 0)")
                    .text(occurrences[char]);
            }
        }

    }

    //i harfini İ olarak değiştirir.
    capitalizeTurkishLetter(text) {
        return text.replace(/i/g, "İ").toUpperCase();
    }

    //Sayaca göre timeout verir. Asıl işi performGetNKyw yapar.
    getNKyw() {
        var self = this;
        const spaceDiv = $(".space");
        const imageDiv = $(".imagePath");

        if (this.getNKywCounter > 0) {
            setTimeout(function () {
                spaceDiv.empty();
                imageDiv.empty();
                self.performGetNKyw(spaceDiv, imageDiv);

            }, 600);
        } else {

            this.performGetNKyw(spaceDiv, imageDiv);
        }


    }

    //Veritabanından kelime çeker.
    performGetNKyw(spaceDiv, imageDiv) {
        var self = this;
        $.ajax({
            url: "/Game/GetAnimal",
            type: "GET",
            success: function (data) {
                self.handleKeyword(data, spaceDiv, imageDiv);
            },
            error: function (error) {
                console.error("Hata:", error);
            }
        });
    }

    //Kelimenin tekrarlanmamasını sağlıyor. Sadece devam eden oyun içerisinde!
    handleKeyword(data, spaceDiv, imageDiv) {
        this.kWord = this.capitalizeTurkishLetter(data.word).toUpperCase();
        if (this.list.indexOf(this.kWord) === -1) {
            this.showElements();
            this.list.push(this.kWord);
        } else {
            this.hideElements();
            this.counter += 1;
            if (this.counter > 600) {
                this.list = [];
            }
            this.performGetNKyw(spaceDiv, imageDiv);
            return;
        }
        this.displayWordAndImage(data.imagePath, imageDiv);
        this.createForms(spaceDiv);
        this.showRandomLetter();
    }

    // Divleri display eder.
    showElements() {
        $(".space").show();
        $(".imagePath").show();
        $("#timer").show();
    }

    // Divleri gizler.
    hideElements() {
        $(".space").hide();
        $(".imagePath").hide();
        $("#timer").hide();
    }

    //Resme fadein efekti verir. ImageDiv'e append eder.
    displayWordAndImage(imagePath, imageDiv) {
        const imageUrl = "/images/animals/" + imagePath;
        imageDiv.empty();
        const imageElement = $("<img>").attr("src", imageUrl).attr("alt", "canli-resmi");
        imageDiv.hide().append(imageElement).fadeIn(1500);
    }

    //Form oluşturur. Kelime uzunluğuna göre input oluşturup append eder. Ayrıca bir takım kurallar içerir.
    createForms(spaceDiv) {
        spaceDiv.empty();
        for (let formIndex = 0; formIndex < 1; formIndex++) {
            const form = $("<form>").attr("id", "form" + (formIndex + 1)).addClass("formInput align-middle").attr("autocomplete", "off");
            for (let letterIndex = 0; letterIndex < this.kWord.length; letterIndex++) {
                const input = $("<input>").attr("type", "text").attr("name", "letter" + (letterIndex + 1)).attr("maxlength", "1").addClass(this.getInputClass()).val("").on("input", (event) => this.handleInput(event.target)).on("keydown", (event) => this.handleKeyDown(event.target, event)).prop("disabled", formIndex > 0);

                // Sadece harf girilmesine izin veren method.
                input.on("keydown", function (event) {
                    if (!event.key.match(/[a-zA-ZğüşıöçĞÜŞİÖÇ]/i)) {
                        event.preventDefault();
                    }
                });

                form.append(input);
            }
            form.append("<br>");
            spaceDiv.append(form);
        }
    }

    // Kelimenin uzunluğuna göre class verir. Mobil için boyutlandırma işlemi yapılır.
    getInputClass() {
        const wordLength = this.kWord.length;
        if (wordLength > 4 && wordLength < 7) {
            return "moreThanFour";
        } else if (wordLength == 7) {
            return "moreThanSeven";
        } else if (wordLength == 8) {
            return "moreThanEight";
        } else if (wordLength == 9) {
            return "moreThanNine";
        } else if (wordLength == 10) {
            return "moreThanTen";
        } else if (wordLength >= 11) {
            return "moreThanEleven";
        } else {
            return "lessThanFour";
        }
    }

    // Kelime içerisinde rastgele bir harfi yeşil ile vurgular. İpucu olarak kullanılır.
    showRandomLetter() {
        this.randomNumber = Math.floor(Math.random() * this.kWord.length);
        $("#" + this.forms[this.currentFormIndex] + ' input[name="letter' + (this.randomNumber + 1) + '"]').val(this.kWord[this.randomNumber]).prop("disabled", true).prop("readonly", true).css("background", "#6aaa64").css("color", "black");
    }

    // Bu method kullanılmıyor. Form sayısının arttırıldığı senaryoda kullanılabilir.
    // Yaptığı iş kelime de hangi harf kaç kere geçiyor bulmak. 
    // Gelen değere göre SetColor ile birlikte çalışıyor.
    countLetterOccurrences(text) {
        let occurrences = {};
        for (let i = 0; i < text.length; i++) {
            let char = text.charAt(i);
            occurrences[char] = (occurrences[char] || 0) + 1;
        }
        return occurrences;
    }

    // Uyarı Mesajları
    displayMessage(message, type) {
        const msgText = $("#msg-text");
        let msgClass = "";
        switch (type) {
            case "success":
                msgClass = "bg-success";
                break;
            case "secondary":
                msgClass = "bg-secondary";
                break;
            case "danger":
                msgClass = "bg-danger";
                break;
            default:
                msgClass = "bg-primary";
        }



        msgText.html(message).addClass("shake").addClass(msgClass);
        setTimeout(() => {
            msgText.removeClass("shake").removeClass(msgClass).html("");
        }, type === "secondary" ? 1500 : 3000);


    }

    // Enter Tıklaması için event. Tekrarlı tıklama engelleniyor. 1 saniyede bir kere.
    addEventListeners() {
        document.addEventListener("keydown", (event) => {

            const focusedElement = document.activeElement;

            if (focusedElement.tagName === "INPUT" || event.target.tagName === "INPUT") {
                this.enterEnabled = true;
            } else {
                this.enterEnabled = false;
                return;
            }

            if (event.key === "Enter" && this.enterEnabled && this.second > 0) {
                this.checkMatch();
                this.enterEnabled = false;
                setTimeout(() => {
                    this.enterEnabled = true;
                }, 1000);
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.ctrlKey && (event.key === 'z' || event.key === 'Z')) {
                event.preventDefault(); // Kombinasyonu engelle
                // İstediğiniz işlemleri gerçekleştirin veya boş bırakın
            }
        });
    }

    // Bir sonraki kutuya ilerler, ilerlediği esnada css zoom efekti uygular.
    handleInput(input) {
        moveToNextInput(input);
        applyZoomEffect(input);
    }

    // Backspace tuşu ile silme işlemini yapar.
    handleKeyDown(input, event) {
        handleBackspace(input, event);
    }
}

function moveToNextInput(currentInput) {
    var inputs = currentInput.parentElement.getElementsByTagName('input');
    var currentIndex = Array.from(inputs).indexOf(currentInput);

    var nextIndex = currentIndex + 1;
    while (nextIndex < inputs.length && (inputs[nextIndex].disabled || inputs[nextIndex].readOnly)) {
        nextIndex++;
    }

    if (nextIndex < inputs.length) {
        inputs[nextIndex].focus();
    }

    if (currentInput.value !== "") {
        currentInput.value = capitalizeTurkish(currentInput.value);
        currentInput.style.background = '#ececec';
    }
}


function handleBackspace(currentInput, event) {
    if (event.key === 'Backspace') {
        event.preventDefault();

        var inputs = currentInput.parentElement.getElementsByTagName('input');
        var currentIndex = Array.from(inputs).indexOf(currentInput);


        if (currentInput.value === "") {
            var prevIndex = currentIndex - 1;
            while (prevIndex >= 0 && (inputs[prevIndex].disabled || inputs[prevIndex].readOnly)) {
                prevIndex--;
            }

            if (prevIndex >= 0) {
                inputs[prevIndex].focus();
                inputs[prevIndex].value = "";
                inputs[prevIndex].style.background = '#ececec';
                return;
            }
        }

        if (currentInput.value !== "") {
            currentInput.value = "";
            currentInput.style.background = '#ececec';
        }
    }
}

function capitalizeTurkish(text) {
    return text.replace(/i/g, "İ").toUpperCase();
}

function applyZoomEffect(input) {
    if (input.value === "") {
        input.style.transform = "scale(1)";
    } else {
        input.style.transition = "transform 0.2s ease"; // Animasyon süresi ve geçiş türü ayarı
        input.style.transform = "scale(1.04)";
        setTimeout(function () {
            input.style.transform = "scale(1)";
        }, 200); // 200 milisaniye (0.2 saniye) içinde geri dönecek şekilde ayarlandı.
    }
}


class City {
    constructor() {

        this.countDownZero = null;
        this.currentFormIndex = 0;
        this.forms = ["form1"];
        this.enterEnabled = true;
        this.kWord = "";
        this.getNKywCounter = 0;
        this.list = [];
        this.counter = 0;
        this.score = 0;
        this.randomNumber;
        this.initialize();
        this.second = 30;
        this.failed = false;

    }

    initialize() {

        this.countDown(this.second);
        this.getNKyw();
        this.addEventListeners();
    }

    // Geri sayım
    countDown() {
        this.countDownZero && clearInterval(this.countDownZero);
        this.countDownZero = setInterval(() => {

            // Timer içindeki değer güncelleniyor.
            $("#timer").html(this.second);

            // Geri sayım 0 veya daha küçük ise
            if (this.second <= 0) {
                $("#timer").html(30);
                clearInterval(this.countDownZero);
                $("#timer").hide().css("color", "white");
                wrongSound.play();
                $(".formInput input").prop("readonly", true);
                $(".formInput input").prop("disabled", true);
                for (let i = 0; i < this.kWord.length; i++) {
                    $(".formInput input:eq(" + i + ")").val(this.kWord[i]).css({
                        "background": "#6aaa64",
                        "color": "white",
                        "text-shadow": "2px 2px 4px rgb(0, 0, 0)"
                    }).hide().delay(300 * i).fadeIn(300);
                }

                // Restart butonu
                $("#restart")
                    .removeClass("d-none")
                    .off("click")
                    .click(() => {
                        $("#restart").addClass("d-none");
                    });

            }

            //renk değiştirme & shake
            else {
                if (this.second === 5 || this.second === 3 || this.second === 1) {
                    $("#timer").addClass("shake").css("color", "#ff0015");
                    beepSound.play(); // Ses çal
                } else if (this.second === 4 || this.second === 2) {
                    $("#timer").removeClass("shake").css("color", "#ff0015");
                    beepSound.play();
                }

                this.second--;
            }

        }, 1000); // 1000 = 1 saniye. Geri sayım için kullanılıyor.

    }

    //Kelime database de mevcut mu?
    isKeywordExist(word, callback) {
        $.ajax({
            url: "/Game/IsCityExist",
            type: "GET",
            data: { searchKeyword: word },
            success: (response) => {
                callback(response.isExist);
            },
            error: (error) => {
                callback(false);
            }
        });
    }

    // Gelen değer ile girilen değer eşleşiyor mu?
    checkMatch() {

        const formId = this.forms[this.currentFormIndex];
        const inputValue = this.getInputValue(formId);

        if (inputValue.length < this.kWord.length || inputValue.includes(" ")) {
            this.displayMessage("Eksik harf!", "secondary");
        } else {
            this.isKeywordExist(inputValue, (isExist) => {
                if (!isExist) {
                    this.displayMessage("Geçersiz kelime!", "danger");
                    $("#" + formId + " input").css("background", "#993535")
                        .css("color", "white")
                        .css("text-shadow", "2px 2px 4px rgb(0, 0, 0)");
                }
            });

            // Kelime eşleşmiyor ise.
            if (inputValue != this.kWord) {
                this.second = 0;
            }


            // Kelime kullanıcı verisi ile eşleşiyor ise.
            else if (inputValue === this.kWord) {

                correctSound.play();
                this.setColors(inputValue, formId);
                $("#" + formId + " input").prop("readonly", true);
                $("#" + formId + " input").prop("disabled", true);
                this.currentFormIndex = 0;
                this.score += 1;
                $("#score").html("Skor: " + this.score).addClass("shake");

                setTimeout(() => {
                    clearInterval(this.countDownZero);
                    this.second = 30;
                    this.countDown();
                });

                this.kWord = this.getNKyw();

            }

        }

    }

    // input değerlerini alır.
    getInputValue(form) {
        return $("#" + form + " input").map(function () {
            return $(this).val().toUpperCase();
        }).get().join("");
    }

    // input renklerini harfe göre ayarlar.
    setColors(inputValue, formId) {
        const occurrences = this.countLetterOccurrences(this.kWord);

        for (let i = 0; i < inputValue.length; i++) {
            const char = inputValue.charAt(i);
            const input = $("#" + formId + ' input[name="letter' + (i + 1) + '"]');

            if (this.kWord.charAt(i) === char) {
                input
                    .css("background-color", "#6aaa64")
                    .css("color", "white")
                    .css("text-shadow", "2px 2px 4px rgb(0, 0, 0)")
                    .text(occurrences[char]);

                occurrences[char]--;
                if (occurrences[char] <= 0) {
                    delete occurrences[char];
                }
            } else {
                input
                    .css("background-color", "#3a3a3c")
                    .css("color", "white")
                    .css("text-shadow", "2px 2px 4px rgb(0, 0, 0)")
                    .text(occurrences[char]);
            }
        }

    }

    //i harfini İ olarak değiştirir.
    capitalizeTurkishLetter(text) {
        return text.replace(/i/g, "İ").toUpperCase();
    }

    //Sayaca göre timeout verir. Asıl işi performGetNKyw yapar.
    getNKyw() {
        var self = this;
        const spaceDiv = $(".space");
        const imageDiv = $(".imagePath");

        if (this.getNKywCounter > 0) {
            setTimeout(function () {
                spaceDiv.empty();
                imageDiv.empty();
                self.performGetNKyw(spaceDiv, imageDiv);

            }, 600);
        } else {

            this.performGetNKyw(spaceDiv, imageDiv);
        }


    }

    //Veritabanından kelime çeker.
    performGetNKyw(spaceDiv, imageDiv) {
        var self = this;
        $.ajax({
            url: "/Game/GetCity",
            type: "GET",
            success: function (data) {
                self.handleKeyword(data, spaceDiv, imageDiv);
            },
            error: function (error) {
                console.error("Hata:", error);
            }
        });
    }

    //Kelimenin tekrarlanmamasını sağlıyor. Sadece devam eden oyun içerisinde!
    handleKeyword(data, spaceDiv, imageDiv) {
        this.kWord = this.capitalizeTurkishLetter(data.word).toUpperCase();
        if (this.list.indexOf(this.kWord) === -1) {
            this.showElements();
            this.list.push(this.kWord);
        } else {
            this.hideElements();
            this.counter += 1;
            if (this.counter > 600) {
                this.list = [];
            }
            this.performGetNKyw(spaceDiv, imageDiv);
            return;
        }
        this.displayWordAndImage(data.imagePath, imageDiv);
        $(".imageDesc").text(data.imageDesc);
        this.createForms(spaceDiv);
        this.showRandomLetter();
    }

    // Divleri display eder.
    showElements() {
        $(".space").show();
        $(".imagePath").show();
        $(".imageDesc").show();
        $("#timer").show();
    }

    // Divleri gizler.
    hideElements() {
        $(".space").hide();
        $(".imagePath").hide();
        $("#timer").hide();
        $(".imageDesc").hide();
    }

    //Resme fadein efekti verir. ImageDiv'e append eder.
    displayWordAndImage(imagePath, imageDiv) {
        const imageUrl = "/images/cities/" + imagePath;
        imageDiv.empty();
        const imageElement = $("<img>").attr("src", imageUrl).attr("alt", "sehir-resmi");
        imageDiv.hide().append(imageElement).fadeIn(1500);
    }

    //Form oluşturur. Kelime uzunluğuna göre input oluşturup append eder. Ayrıca bir takım kurallar içerir.
    createForms(spaceDiv) {
        spaceDiv.empty();
        for (let formIndex = 0; formIndex < 1; formIndex++) {
            const form = $("<form>").attr("id", "form" + (formIndex + 1)).addClass("formInput align-middle").attr("autocomplete", "off");
            for (let letterIndex = 0; letterIndex < this.kWord.length; letterIndex++) {
                const input = $("<input>").attr("type", "text").attr("name", "letter" + (letterIndex + 1)).attr("maxlength", "1").addClass(this.getInputClass()).val("").on("input", (event) => this.handleInput(event.target)).on("keydown", (event) => this.handleKeyDown(event.target, event)).prop("disabled", formIndex > 0);

                // Sadece harf girilmesine izin veren method.
                input.on("keydown", function (event) {
                    if (!event.key.match(/[a-zA-ZğüşıöçĞÜŞİÖÇ]/i)) {
                        event.preventDefault();
                    }
                });

                form.append(input);
            }
            form.append("<br>");
            spaceDiv.append(form);
        }
    }

    // Kelimenin uzunluğuna göre class verir. Mobil için boyutlandırma işlemi yapılır.
    getInputClass() {
        const wordLength = this.kWord.length;
        if (wordLength > 4 && wordLength < 7) {
            return "moreThanFour";
        } else if (wordLength == 7) {
            return "moreThanSeven";
        } else if (wordLength == 8) {
            return "moreThanEight";
        } else if (wordLength == 9) {
            return "moreThanNine";
        } else if (wordLength == 10) {
            return "moreThanTen";
        } else if (wordLength >= 11) {
            return "moreThanEleven";
        } else {
            return "lessThanFour";
        }
    }

    // Kelime içerisinde rastgele bir harfi yeşil ile vurgular. İpucu olarak kullanılır.
    showRandomLetter() {
        this.randomNumber = Math.floor(Math.random() * this.kWord.length);
        $("#" + this.forms[this.currentFormIndex] + ' input[name="letter' + (this.randomNumber + 1) + '"]').val(this.kWord[this.randomNumber]).prop("disabled", true).prop("readonly", true).css("background", "#6aaa64").css("color", "black");
    }

    // Bu method kullanılmıyor. Form sayısının arttırıldığı senaryoda kullanılabilir.
    // Yaptığı iş kelime de hangi harf kaç kere geçiyor bulmak. 
    // Gelen değere göre SetColor ile birlikte çalışıyor.
    countLetterOccurrences(text) {
        let occurrences = {};
        for (let i = 0; i < text.length; i++) {
            let char = text.charAt(i);
            occurrences[char] = (occurrences[char] || 0) + 1;
        }
        return occurrences;
    }

    // Uyarı Mesajları
    displayMessage(message, type) {
        const msgText = $("#msg-text");
        let msgClass = "";
        switch (type) {
            case "success":
                msgClass = "bg-success";
                break;
            case "secondary":
                msgClass = "bg-secondary";
                break;
            case "danger":
                msgClass = "bg-danger";
                break;
            default:
                msgClass = "bg-primary";
        }



        msgText.html(message).addClass("shake").addClass(msgClass);
        setTimeout(() => {
            msgText.removeClass("shake").removeClass(msgClass).html("");
        }, type === "secondary" ? 1500 : 3000);


    }

    // Enter Tıklaması için event. Tekrarlı tıklama engelleniyor. 1 saniyede bir kere.
    addEventListeners() {
        document.addEventListener("keydown", (event) => {

            const focusedElement = document.activeElement;

            if (focusedElement.tagName === "INPUT" || event.target.tagName === "INPUT") {
                this.enterEnabled = true;
            } else {
                this.enterEnabled = false;
                return;
            }

            if (event.key === "Enter" && this.enterEnabled && this.second > 0) {
                this.checkMatch();
                this.enterEnabled = false;
                setTimeout(() => {
                    this.enterEnabled = true;
                }, 1000);
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.ctrlKey && (event.key === 'z' || event.key === 'Z')) {
                event.preventDefault(); // Kombinasyonu engelle
                // İstediğiniz işlemleri gerçekleştirin veya boş bırakın
            }
        });
    }

    // Bir sonraki kutuya ilerler, ilerlediği esnada css zoom efekti uygular.
    handleInput(input) {
        moveToNextInput(input);
        applyZoomEffect(input);
    }

    // Backspace tuşu ile silme işlemini yapar.
    handleKeyDown(input, event) {
        handleBackspace(input, event);
    }
}


class Country {
    constructor() {

        this.countDownZero = null;
        this.currentFormIndex = 0;
        this.forms = ["form1"];
        this.enterEnabled = true;
        this.kWord = "";
        this.getNKywCounter = 0;
        this.list = [];
        this.counter = 0;
        this.score = 0;
        this.randomNumber;
        this.initialize();
        this.second = 30;
        this.failed = false;

    }

    initialize() {

        this.countDown(this.second);
        this.getNKyw();
        this.addEventListeners();
    }

    // Geri sayım
    countDown() {
        this.countDownZero && clearInterval(this.countDownZero);
        this.countDownZero = setInterval(() => {

            // Timer içindeki değer güncelleniyor.
            $("#timer").html(this.second);

            // Geri sayım 0 veya daha küçük ise
            if (this.second <= 0) {
                wrongSound.play();
                $("#timer").html(30);
                clearInterval(this.countDownZero);
                $("#timer").hide().css("color", "white");
                $(".formInput input").prop("readonly", true);
                $(".formInput input").prop("disabled", true);
                for (let i = 0; i < this.kWord.length; i++) {
                    $(".formInput input:eq(" + i + ")").val(this.kWord[i]).css({
                        "background": "#6aaa64",
                        "color": "white",
                        "text-shadow": "2px 2px 4px rgb(0, 0, 0)"
                    }).hide().delay(300 * i).fadeIn(300);
                }

                // Restart butonu
                $("#restart")
                    .removeClass("d-none")
                    .off("click")
                    .click(() => {
                        $("#restart").addClass("d-none");
                    });

            }

            //renk değiştirme & shake
            else {
                if (this.second === 5 || this.second === 3 || this.second === 1) {
                    $("#timer").addClass("shake").css("color", "#ff0015");
                    beepSound.play(); // Ses çal
                } else if (this.second === 4 || this.second === 2) {
                    $("#timer").removeClass("shake").css("color", "#ff0015");
                    beepSound.play();
                }

                this.second--;
            }

        }, 1000); // 1000 = 1 saniye. Geri sayım için kullanılıyor.

    }

    //Kelime database de mevcut mu?
    isKeywordExist(word, callback) {
        $.ajax({
            url: "/Game/IsCountryExist",
            type: "GET",
            data: { searchKeyword: word },
            success: (response) => {
                callback(response.isExist);
            },
            error: (error) => {
                callback(false);
            }
        });
    }

    // Gelen değer ile girilen değer eşleşiyor mu?
    checkMatch() {

        const formId = this.forms[this.currentFormIndex];
        const inputValue = this.getInputValue(formId);

        if (inputValue.length < this.kWord.length || inputValue.includes(" ")) {
            this.displayMessage("Eksik harf!", "secondary");
        } else {
            this.isKeywordExist(inputValue, (isExist) => {
                if (!isExist) {
                    this.displayMessage("Geçersiz kelime!", "danger");
                    $("#" + formId + " input").css("background", "#993535")
                        .css("color", "white")
                        .css("text-shadow", "2px 2px 4px rgb(0, 0, 0)");
                }
            });

            // Kelime eşleşmiyor ise.
            if (inputValue != this.kWord) {
                this.second = 0;
                wrongSound.play();
            }


            // Kelime kullanıcı verisi ile eşleşiyor ise.
            else if (inputValue === this.kWord) {

                correctSound.play();
                this.setColors(inputValue, formId);
                $("#" + formId + " input").prop("readonly", true);
                $("#" + formId + " input").prop("disabled", true);
                this.currentFormIndex = 0;
                this.score += 1;
                $("#score").html("Skor: " + this.score).addClass("shake");

                setTimeout(() => {
                    clearInterval(this.countDownZero);
                    this.second = 30;
                    this.countDown();
                });

                this.kWord = this.getNKyw();

            }

        }

    }

    // input değerlerini alır.
    getInputValue(form) {
        return $("#" + form + " input").map(function () {
            return $(this).val().toUpperCase();
        }).get().join("");
    }

    // input renklerini harfe göre ayarlar.
    setColors(inputValue, formId) {
        const occurrences = this.countLetterOccurrences(this.kWord);

        for (let i = 0; i < inputValue.length; i++) {
            const char = inputValue.charAt(i);
            const input = $("#" + formId + ' input[name="letter' + (i + 1) + '"]');

            if (this.kWord.charAt(i) === char) {
                input
                    .css("background-color", "#6aaa64")
                    .css("color", "white")
                    .css("text-shadow", "2px 2px 4px rgb(0, 0, 0)")
                    .text(occurrences[char]);

                occurrences[char]--;
                if (occurrences[char] <= 0) {
                    delete occurrences[char];
                }
            } else {
                input
                    .css("background-color", "#3a3a3c")
                    .css("color", "white")
                    .css("text-shadow", "2px 2px 4px rgb(0, 0, 0)")
                    .text(occurrences[char]);
            }
        }

    }

    //i harfini İ olarak değiştirir.
    capitalizeTurkishLetter(text) {
        return text.replace(/i/g, "İ").toUpperCase();
    }

    //Sayaca göre timeout verir. Asıl işi performGetNKyw yapar.
    getNKyw() {
        var self = this;
        const spaceDiv = $(".space");
        const imageDiv = $(".imagePath");

        if (this.getNKywCounter > 0) {
            setTimeout(function () {
                spaceDiv.empty();
                imageDiv.empty();
                self.performGetNKyw(spaceDiv, imageDiv);

            }, 600);
        } else {

            this.performGetNKyw(spaceDiv, imageDiv);
        }


    }

    //Veritabanından kelime çeker.
    performGetNKyw(spaceDiv, imageDiv) {
        var self = this;
        $.ajax({
            url: "/Game/GetCountry",
            type: "GET",
            success: function (data) {
                self.handleKeyword(data, spaceDiv, imageDiv);
            },
            error: function (error) {
                console.error("Hata:", error);
            }
        });
    }

    //Kelimenin tekrarlanmamasını sağlıyor. Sadece devam eden oyun içerisinde!
    handleKeyword(data, spaceDiv, imageDiv) {
        this.kWord = this.capitalizeTurkishLetter(data.word).toUpperCase();
        if (this.list.indexOf(this.kWord) === -1) {
            this.showElements();
            this.list.push(this.kWord);
        } else {
            this.hideElements();
            this.counter += 1;
            if (this.counter > 600) {
                this.list = [];
            }
            this.performGetNKyw(spaceDiv, imageDiv);
            return;
        }
        this.displayWordAndImage(data.imagePath, imageDiv);
        this.createForms(spaceDiv);
        this.showRandomLetter();
    }

    // Divleri display eder.
    showElements() {
        $(".space").show();
        $(".imagePath").show();
        $("#timer").show();
    }

    // Divleri gizler.
    hideElements() {
        $(".space").hide();
        $(".imagePath").hide();
        $("#timer").hide();
    }

    //Resme fadein efekti verir. ImageDiv'e append eder.
    displayWordAndImage(imagePath, imageDiv) {
        const imageUrl = "/images/countries/" + imagePath;
        imageDiv.empty();
        const imageElement = $("<img>").attr("src", imageUrl).attr("alt", "ulke-bayrak-resmi");
        imageDiv.hide().append(imageElement).fadeIn(1500);
    }

    //Form oluşturur. Kelime uzunluğuna göre input oluşturup append eder. Ayrıca bir takım kurallar içerir.
    createForms(spaceDiv) {
        spaceDiv.empty();
        for (let formIndex = 0; formIndex < 1; formIndex++) {
            const form = $("<form>").attr("id", "form" + (formIndex + 1)).addClass("formInput align-middle").attr("autocomplete", "off");
            for (let letterIndex = 0; letterIndex < this.kWord.length; letterIndex++) {
                const input = $("<input>").attr("type", "text").attr("name", "letter" + (letterIndex + 1)).attr("maxlength", "1").addClass(this.getInputClass()).val("").on("input", (event) => this.handleInput(event.target)).on("keydown", (event) => this.handleKeyDown(event.target, event)).prop("disabled", formIndex > 0);

                // Sadece harf girilmesine izin veren method.
                input.on("keydown", function (event) {
                    if (!event.key.match(/[a-zA-ZğüşıöçĞÜŞİÖÇ]/i)) {
                        event.preventDefault();
                    }
                });

                form.append(input);
            }
            form.append("<br>");
            spaceDiv.append(form);
        }
    }

    // Kelimenin uzunluğuna göre class verir. Mobil için boyutlandırma işlemi yapılır.
    getInputClass() {
        const wordLength = this.kWord.length;
        if (wordLength > 4 && wordLength < 7) {
            return "moreThanFour";
        } else if (wordLength == 7) {
            return "moreThanSeven";
        } else if (wordLength == 8) {
            return "moreThanEight";
        } else if (wordLength == 9) {
            return "moreThanNine";
        } else if (wordLength == 10) {
            return "moreThanTen";
        } else if (wordLength >= 11) {
            return "moreThanEleven";
        } else {
            return "lessThanFour";
        }
    }

    // Kelime içerisinde rastgele bir harfi yeşil ile vurgular. İpucu olarak kullanılır.
    showRandomLetter() {
        this.randomNumber = Math.floor(Math.random() * this.kWord.length);
        $("#" + this.forms[this.currentFormIndex] + ' input[name="letter' + (this.randomNumber + 1) + '"]').val(this.kWord[this.randomNumber]).prop("disabled", true).prop("readonly", true).css("background", "#6aaa64").css("color", "black");
    }

    // Bu method kullanılmıyor. Form sayısının arttırıldığı senaryoda kullanılabilir.
    // Yaptığı iş kelime de hangi harf kaç kere geçiyor bulmak. 
    // Gelen değere göre SetColor ile birlikte çalışıyor.
    countLetterOccurrences(text) {
        let occurrences = {};
        for (let i = 0; i < text.length; i++) {
            let char = text.charAt(i);
            occurrences[char] = (occurrences[char] || 0) + 1;
        }
        return occurrences;
    }

    // Uyarı Mesajları
    displayMessage(message, type) {
        const msgText = $("#msg-text");
        let msgClass = "";
        switch (type) {
            case "success":
                msgClass = "bg-success";
                break;
            case "secondary":
                msgClass = "bg-secondary";
                break;
            case "danger":
                msgClass = "bg-danger";
                break;
            default:
                msgClass = "bg-primary";
        }



        msgText.html(message).addClass("shake").addClass(msgClass);
        setTimeout(() => {
            msgText.removeClass("shake").removeClass(msgClass).html("");
        }, type === "secondary" ? 1500 : 3000);


    }

    // Enter Tıklaması için event. Tekrarlı tıklama engelleniyor. 1 saniyede bir kere.
    addEventListeners() {
        document.addEventListener("keydown", (event) => {

            const focusedElement = document.activeElement;

            if (focusedElement.tagName === "INPUT" || event.target.tagName === "INPUT") {
                this.enterEnabled = true;
            } else {
                this.enterEnabled = false;
                return;
            }

            if (event.key === "Enter" && this.enterEnabled && this.second > 0) {
                this.checkMatch();
                this.enterEnabled = false;
                setTimeout(() => {
                    this.enterEnabled = true;
                }, 1000);
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.ctrlKey && (event.key === 'z' || event.key === 'Z')) {
                event.preventDefault(); // Kombinasyonu engelle
                // İstediğiniz işlemleri gerçekleştirin veya boş bırakın
            }
        });
    }

    // Bir sonraki kutuya ilerler, ilerlediği esnada css zoom efekti uygular.
    handleInput(input) {
        moveToNextInput(input);
        applyZoomEffect(input);
    }

    // Backspace tuşu ile silme işlemini yapar.
    handleKeyDown(input, event) {
        handleBackspace(input, event);
    }
}

class Fruit {
    constructor() {

        this.countDownZero = null;
        this.currentFormIndex = 0;
        this.forms = ["form1"];
        this.enterEnabled = true;
        this.kWord = "";
        this.getNKywCounter = 0;
        this.list = [];
        this.counter = 0;
        this.score = 0;
        this.randomNumber;
        this.initialize();
        this.second = 30;
        this.failed = false;

    }

    initialize() {

        this.countDown(this.second);
        this.getNKyw();
        this.addEventListeners();
    }

    // Geri sayım
    countDown() {
        this.countDownZero && clearInterval(this.countDownZero);
        this.countDownZero = setInterval(() => {

            // Timer içindeki değer güncelleniyor.
            $("#timer").html(this.second);

            // Geri sayım 0 veya daha küçük ise
            if (this.second <= 0) {
                $("#timer").html(30);
                clearInterval(this.countDownZero);
                $("#timer").hide().css("color", "white");
                wrongSound.play();
                $(".formInput input").prop("readonly", true);
                $(".formInput input").prop("disabled", true);
                for (let i = 0; i < this.kWord.length; i++) {
                    $(".formInput input:eq(" + i + ")").val(this.kWord[i]).css({
                        "background": "#6aaa64",
                        "color": "white",
                        "text-shadow": "2px 2px 4px rgb(0, 0, 0)"
                    }).hide().delay(300 * i).fadeIn(300);
                }

                // Restart butonu
                $("#restart")
                    .removeClass("d-none")
                    .off("click")
                    .click(() => {
                        $("#restart").addClass("d-none");
                    });

            }

            //renk değiştirme & shake
            else {
                if (this.second === 5 || this.second === 3 || this.second === 1) {
                    $("#timer").addClass("shake").css("color", "#ff0015");
                    beepSound.play(); // Ses çal
                } else if (this.second === 4 || this.second === 2) {
                    $("#timer").removeClass("shake").css("color", "#ff0015");
                    beepSound.play();
                }

                this.second--;
            }

        }, 1000); // 1000 = 1 saniye. Geri sayım için kullanılıyor.

    }

    //Kelime database de mevcut mu?
    isKeywordExist(word, callback) {
        $.ajax({
            url: "/Game/IsFruitExist",
            type: "GET",
            data: { searchKeyword: word },
            success: (response) => {
                callback(response.isExist);
            },
            error: (error) => {
                callback(false);
            }
        });
    }

    // Gelen değer ile girilen değer eşleşiyor mu?
    checkMatch() {

        const formId = this.forms[this.currentFormIndex];
        const inputValue = this.getInputValue(formId);

        if (inputValue.length < this.kWord.length || inputValue.includes(" ")) {
            this.displayMessage("Eksik harf!", "secondary");
        } else {
            this.isKeywordExist(inputValue, (isExist) => {
                if (!isExist) {
                    this.displayMessage("Geçersiz kelime!", "danger");
                    $("#" + formId + " input").css("background", "#993535")
                        .css("color", "white")
                        .css("text-shadow", "2px 2px 4px rgb(0, 0, 0)");
                }
            });

            // Kelime eşleşmiyor ise.
            if (inputValue != this.kWord) {
                this.second = 0;
            }


            // Kelime kullanıcı verisi ile eşleşiyor ise.
            else if (inputValue === this.kWord) {

                correctSound.play();
                this.setColors(inputValue, formId);
                $("#" + formId + " input").prop("readonly", true);
                $("#" + formId + " input").prop("disabled", true);
                this.currentFormIndex = 0;
                this.score += 1;
                $("#score").html("Skor: " + this.score).addClass("shake");

                setTimeout(() => {
                    clearInterval(this.countDownZero);
                    this.second = 30;
                    this.countDown();
                });

                this.kWord = this.getNKyw();

            }

        }

    }

    // input değerlerini alır.
    getInputValue(form) {
        return $("#" + form + " input").map(function () {
            return $(this).val().toUpperCase();
        }).get().join("");
    }

    // input renklerini harfe göre ayarlar.
    setColors(inputValue, formId) {
        const occurrences = this.countLetterOccurrences(this.kWord);

        for (let i = 0; i < inputValue.length; i++) {
            const char = inputValue.charAt(i);
            const input = $("#" + formId + ' input[name="letter' + (i + 1) + '"]');

            if (this.kWord.charAt(i) === char) {
                input
                    .css("background-color", "#6aaa64")
                    .css("color", "white")
                    .css("text-shadow", "2px 2px 4px rgb(0, 0, 0)")
                    .text(occurrences[char]);

                occurrences[char]--;
                if (occurrences[char] <= 0) {
                    delete occurrences[char];
                }
            } else {
                input
                    .css("background-color", "#3a3a3c")
                    .css("color", "white")
                    .css("text-shadow", "2px 2px 4px rgb(0, 0, 0)")
                    .text(occurrences[char]);
            }
        }

    }

    //i harfini İ olarak değiştirir.
    capitalizeTurkishLetter(text) {
        return text.replace(/i/g, "İ").toUpperCase();
    }

    //Sayaca göre timeout verir. Asıl işi performGetNKyw yapar.
    getNKyw() {
        var self = this;
        const spaceDiv = $(".space");
        const imageDiv = $(".imagePath");

        if (this.getNKywCounter > 0) {
            setTimeout(function () {
                spaceDiv.empty();
                imageDiv.empty();
                self.performGetNKyw(spaceDiv, imageDiv);

            }, 600);
        } else {

            this.performGetNKyw(spaceDiv, imageDiv);
        }


    }

    //Veritabanından kelime çeker.
    performGetNKyw(spaceDiv, imageDiv) {
        var self = this;
        $.ajax({
            url: "/Game/GetFruit",
            type: "GET",
            success: function (data) {
                self.handleKeyword(data, spaceDiv, imageDiv);
            },
            error: function (error) {
                console.error("Hata:", error);
            }
        });
    }

    //Kelimenin tekrarlanmamasını sağlıyor. Sadece devam eden oyun içerisinde!
    handleKeyword(data, spaceDiv, imageDiv) {
        this.kWord = this.capitalizeTurkishLetter(data.word).toUpperCase();
        if (this.list.indexOf(this.kWord) === -1) {
            this.showElements();
            this.list.push(this.kWord);
        } else {
            this.hideElements();
            this.counter += 1;
            if (this.counter > 600) {
                this.list = [];
            }
            this.performGetNKyw(spaceDiv, imageDiv);
            return;
        }
        this.displayWordAndImage(data.imagePath, imageDiv);
        this.createForms(spaceDiv);
        this.showRandomLetter();
    }

    // Divleri display eder.
    showElements() {
        $(".space").show();
        $(".imagePath").show();
        $("#timer").show();
    }

    // Divleri gizler.
    hideElements() {
        $(".space").hide();
        $(".imagePath").hide();
        $("#timer").hide();
    }

    //Resme fadein efekti verir. ImageDiv'e append eder.
    displayWordAndImage(imagePath, imageDiv) {
        const imageUrl = "/images/fruits/" + imagePath;
        imageDiv.empty();
        const imageElement = $("<img>").attr("src", imageUrl).attr("alt", "meyve-resmi");
        imageDiv.hide().append(imageElement).fadeIn(1500);
    }

    //Form oluşturur. Kelime uzunluğuna göre input oluşturup append eder. Ayrıca bir takım kurallar içerir.
    createForms(spaceDiv) {
        spaceDiv.empty();
        for (let formIndex = 0; formIndex < 1; formIndex++) {
            const form = $("<form>").attr("id", "form" + (formIndex + 1)).addClass("formInput align-middle").attr("autocomplete", "off");
            for (let letterIndex = 0; letterIndex < this.kWord.length; letterIndex++) {
                const input = $("<input>").attr("type", "text").attr("name", "letter" + (letterIndex + 1)).attr("maxlength", "1").addClass(this.getInputClass()).val("").on("input", (event) => this.handleInput(event.target)).on("keydown", (event) => this.handleKeyDown(event.target, event)).prop("disabled", formIndex > 0);

                // Sadece harf girilmesine izin veren method.
                input.on("keydown", function (event) {
                    if (!event.key.match(/[a-zA-ZğüşıöçĞÜŞİÖÇ]/i)) {
                        event.preventDefault();
                    }
                });

                form.append(input);
            }
            form.append("<br>");
            spaceDiv.append(form);
        }
    }

    // Kelimenin uzunluğuna göre class verir. Mobil için boyutlandırma işlemi yapılır.
    getInputClass() {
        const wordLength = this.kWord.length;
        if (wordLength > 4 && wordLength < 7) {
            return "moreThanFour";
        } else if (wordLength == 7) {
            return "moreThanSeven";
        } else if (wordLength == 8) {
            return "moreThanEight";
        } else if (wordLength == 9) {
            return "moreThanNine";
        } else if (wordLength == 10) {
            return "moreThanTen";
        } else if (wordLength >= 11) {
            return "moreThanEleven";
        } else {
            return "lessThanFour";
        }
    }

    // Kelime içerisinde rastgele bir harfi yeşil ile vurgular. İpucu olarak kullanılır.
    showRandomLetter() {
        this.randomNumber = Math.floor(Math.random() * this.kWord.length);
        $("#" + this.forms[this.currentFormIndex] + ' input[name="letter' + (this.randomNumber + 1) + '"]').val(this.kWord[this.randomNumber]).prop("disabled", true).prop("readonly", true).css("background", "#6aaa64").css("color", "black");
    }

    // Bu method kullanılmıyor. Form sayısının arttırıldığı senaryoda kullanılabilir.
    // Yaptığı iş kelime de hangi harf kaç kere geçiyor bulmak. 
    // Gelen değere göre SetColor ile birlikte çalışıyor.
    countLetterOccurrences(text) {
        let occurrences = {};
        for (let i = 0; i < text.length; i++) {
            let char = text.charAt(i);
            occurrences[char] = (occurrences[char] || 0) + 1;
        }
        return occurrences;
    }

    // Uyarı Mesajları
    displayMessage(message, type) {
        const msgText = $("#msg-text");
        let msgClass = "";
        switch (type) {
            case "success":
                msgClass = "bg-success";
                break;
            case "secondary":
                msgClass = "bg-secondary";
                break;
            case "danger":
                msgClass = "bg-danger";
                break;
            default:
                msgClass = "bg-primary";
        }



        msgText.html(message).addClass("shake").addClass(msgClass);
        setTimeout(() => {
            msgText.removeClass("shake").removeClass(msgClass).html("");
        }, type === "secondary" ? 1500 : 3000);


    }

    // Enter Tıklaması için event. Tekrarlı tıklama engelleniyor. 1 saniyede bir kere.
    addEventListeners() {
        document.addEventListener("keydown", (event) => {

            const focusedElement = document.activeElement;

            if (focusedElement.tagName === "INPUT" || event.target.tagName === "INPUT") {
                this.enterEnabled = true;
            } else {
                this.enterEnabled = false;
                return;
            }

            if (event.key === "Enter" && this.enterEnabled && this.second > 0) {
                this.checkMatch();
                this.enterEnabled = false;
                setTimeout(() => {
                    this.enterEnabled = true;
                }, 1000);
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.ctrlKey && (event.key === 'z' || event.key === 'Z')) {
                event.preventDefault(); // Kombinasyonu engelle
                // İstediğiniz işlemleri gerçekleştirin veya boş bırakın
            }
        });
    }

    // Bir sonraki kutuya ilerler, ilerlediği esnada css zoom efekti uygular.
    handleInput(input) {
        moveToNextInput(input);
        applyZoomEffect(input);
    }

    // Backspace tuşu ile silme işlemini yapar.
    handleKeyDown(input, event) {
        handleBackspace(input, event);
    }
}

class Vegetable {
    constructor() {

        this.countDownZero = null;
        this.currentFormIndex = 0;
        this.forms = ["form1"];
        this.enterEnabled = true;
        this.kWord = "";
        this.getNKywCounter = 0;
        this.list = [];
        this.counter = 0;
        this.score = 0;
        this.randomNumber;
        this.initialize();
        this.second = 30;
        this.failed = false;

    }

    initialize() {

        this.countDown(this.second);
        this.getNKyw();
        this.addEventListeners();
    }

    // Geri sayım
    countDown() {
        this.countDownZero && clearInterval(this.countDownZero);
        this.countDownZero = setInterval(() => {

            // Timer içindeki değer güncelleniyor.
            $("#timer").html(this.second);

            // Geri sayım 0 veya daha küçük ise
            if (this.second <= 0) {
                $("#timer").html(30);
                clearInterval(this.countDownZero);
                $("#timer").hide().css("color", "white");
                wrongSound.play();
                $(".formInput input").prop("readonly", true);
                $(".formInput input").prop("disabled", true);
                for (let i = 0; i < this.kWord.length; i++) {
                    $(".formInput input:eq(" + i + ")").val(this.kWord[i]).css({
                        "background": "#6aaa64",
                        "color": "white",
                        "text-shadow": "2px 2px 4px rgb(0, 0, 0)"
                    }).hide().delay(300 * i).fadeIn(300);
                }

                // Restart butonu
                $("#restart")
                    .removeClass("d-none")
                    .off("click")
                    .click(() => {
                        $("#restart").addClass("d-none");
                    });

            }

            //renk değiştirme & shake
            else {
                if (this.second === 5 || this.second === 3 || this.second === 1) {
                    $("#timer").addClass("shake").css("color", "#ff0015");
                    beepSound.play(); // Ses çal
                } else if (this.second === 4 || this.second === 2) {
                    $("#timer").removeClass("shake").css("color", "#ff0015");
                    beepSound.play();
                }

                this.second--;
            }

        }, 1000); // 1000 = 1 saniye. Geri sayım için kullanılıyor.

    }

    //Kelime database de mevcut mu?
    isKeywordExist(word, callback) {
        $.ajax({
            url: "/Game/IsVegetableExist",
            type: "GET",
            data: { searchKeyword: word },
            success: (response) => {
                callback(response.isExist);
            },
            error: (error) => {
                callback(false);
            }
        });
    }

    // Gelen değer ile girilen değer eşleşiyor mu?
    checkMatch() {

        const formId = this.forms[this.currentFormIndex];
        const inputValue = this.getInputValue(formId);

        if (inputValue.length < this.kWord.length || inputValue.includes(" ")) {
            this.displayMessage("Eksik harf!", "secondary");
        } else {
            this.isKeywordExist(inputValue, (isExist) => {
                if (!isExist) {
                    this.displayMessage("Geçersiz kelime!", "danger");
                    $("#" + formId + " input").css("background", "#993535")
                        .css("color", "white")
                        .css("text-shadow", "2px 2px 4px rgb(0, 0, 0)");
                }
            });

            // Kelime eşleşmiyor ise.
            if (inputValue != this.kWord) {
                this.second = 0;
            }


            // Kelime kullanıcı verisi ile eşleşiyor ise.
            else if (inputValue === this.kWord) {

                correctSound.play();
                this.setColors(inputValue, formId);
                $("#" + formId + " input").prop("readonly", true);
                $("#" + formId + " input").prop("disabled", true);
                this.currentFormIndex = 0;
                this.score += 1;
                $("#score").html("Skor: " + this.score).addClass("shake");

                setTimeout(() => {
                    clearInterval(this.countDownZero);
                    this.second = 30;
                    this.countDown();
                });

                this.kWord = this.getNKyw();

            }

        }

    }

    // input değerlerini alır.
    getInputValue(form) {
        return $("#" + form + " input").map(function () {
            return $(this).val().toUpperCase();
        }).get().join("");
    }

    // input renklerini harfe göre ayarlar.
    setColors(inputValue, formId) {
        const occurrences = this.countLetterOccurrences(this.kWord);

        for (let i = 0; i < inputValue.length; i++) {
            const char = inputValue.charAt(i);
            const input = $("#" + formId + ' input[name="letter' + (i + 1) + '"]');

            if (this.kWord.charAt(i) === char) {
                input
                    .css("background-color", "#6aaa64")
                    .css("color", "white")
                    .css("text-shadow", "2px 2px 4px rgb(0, 0, 0)")
                    .text(occurrences[char]);

                occurrences[char]--;
                if (occurrences[char] <= 0) {
                    delete occurrences[char];
                }
            } else {
                input
                    .css("background-color", "#3a3a3c")
                    .css("color", "white")
                    .css("text-shadow", "2px 2px 4px rgb(0, 0, 0)")
                    .text(occurrences[char]);
            }
        }

    }

    //i harfini İ olarak değiştirir.
    capitalizeTurkishLetter(text) {
        return text.replace(/i/g, "İ").toUpperCase();
    }

    //Sayaca göre timeout verir. Asıl işi performGetNKyw yapar.
    getNKyw() {
        var self = this;
        const spaceDiv = $(".space");
        const imageDiv = $(".imagePath");

        if (this.getNKywCounter > 0) {
            setTimeout(function () {
                spaceDiv.empty();
                imageDiv.empty();
                self.performGetNKyw(spaceDiv, imageDiv);

            }, 600);
        } else {

            this.performGetNKyw(spaceDiv, imageDiv);
        }


    }

    //Veritabanından kelime çeker.
    performGetNKyw(spaceDiv, imageDiv) {
        var self = this;
        $.ajax({
            url: "/Game/GetVegetable",
            type: "GET",
            success: function (data) {
                self.handleKeyword(data, spaceDiv, imageDiv);
            },
            error: function (error) {
                console.error("Hata:", error);
            }
        });
    }

    //Kelimenin tekrarlanmamasını sağlıyor. Sadece devam eden oyun içerisinde!
    handleKeyword(data, spaceDiv, imageDiv) {
        this.kWord = this.capitalizeTurkishLetter(data.word).toUpperCase();
        if (this.list.indexOf(this.kWord) === -1) {
            this.showElements();
            this.list.push(this.kWord);
        } else {
            this.hideElements();
            this.counter += 1;
            if (this.counter > 600) {
                this.list = [];
            }
            this.performGetNKyw(spaceDiv, imageDiv);
            return;
        }
        this.displayWordAndImage(data.imagePath, imageDiv);
        this.createForms(spaceDiv);
        this.showRandomLetter();
    }

    // Divleri display eder.
    showElements() {
        $(".space").show();
        $(".imagePath").show();
        $("#timer").show();
    }

    // Divleri gizler.
    hideElements() {
        $(".space").hide();
        $(".imagePath").hide();
        $("#timer").hide();
    }

    //Resme fadein efekti verir. ImageDiv'e append eder.
    displayWordAndImage(imagePath, imageDiv) {
        const imageUrl = "/images/vegetables/" + imagePath;
        imageDiv.empty();
        const imageElement = $("<img>").attr("src", imageUrl).attr("alt", "sebze-resmi");
        imageDiv.hide().append(imageElement).fadeIn(1500);
    }

    //Form oluşturur. Kelime uzunluğuna göre input oluşturup append eder. Ayrıca bir takım kurallar içerir.
    createForms(spaceDiv) {
        spaceDiv.empty();
        for (let formIndex = 0; formIndex < 1; formIndex++) {
            const form = $("<form>").attr("id", "form" + (formIndex + 1)).addClass("formInput align-middle").attr("autocomplete", "off");
            for (let letterIndex = 0; letterIndex < this.kWord.length; letterIndex++) {
                const input = $("<input>").attr("type", "text").attr("name", "letter" + (letterIndex + 1)).attr("maxlength", "1").addClass(this.getInputClass()).val("").on("input", (event) => this.handleInput(event.target)).on("keydown", (event) => this.handleKeyDown(event.target, event)).prop("disabled", formIndex > 0);

                // Sadece harf girilmesine izin veren method.
                input.on("keydown", function (event) {
                    if (!event.key.match(/[a-zA-ZğüşıöçĞÜŞİÖÇ]/i)) {
                        event.preventDefault();
                    }
                });

                form.append(input);
            }
            form.append("<br>");
            spaceDiv.append(form);
        }
    }

    // Kelimenin uzunluğuna göre class verir. Mobil için boyutlandırma işlemi yapılır.
    getInputClass() {
        const wordLength = this.kWord.length;
        if (wordLength > 4 && wordLength < 7) {
            return "moreThanFour";
        } else if (wordLength == 7) {
            return "moreThanSeven";
        } else if (wordLength == 8) {
            return "moreThanEight";
        } else if (wordLength == 9) {
            return "moreThanNine";
        } else if (wordLength == 10) {
            return "moreThanTen";
        } else if (wordLength >= 11) {
            return "moreThanEleven";
        } else {
            return "lessThanFour";
        }
    }

    // Kelime içerisinde rastgele bir harfi yeşil ile vurgular. İpucu olarak kullanılır.
    showRandomLetter() {
        this.randomNumber = Math.floor(Math.random() * this.kWord.length);
        $("#" + this.forms[this.currentFormIndex] + ' input[name="letter' + (this.randomNumber + 1) + '"]').val(this.kWord[this.randomNumber]).prop("disabled", true).prop("readonly", true).css("background", "#6aaa64").css("color", "black");
    }

    // Bu method kullanılmıyor. Form sayısının arttırıldığı senaryoda kullanılabilir.
    // Yaptığı iş kelime de hangi harf kaç kere geçiyor bulmak. 
    // Gelen değere göre SetColor ile birlikte çalışıyor.
    countLetterOccurrences(text) {
        let occurrences = {};
        for (let i = 0; i < text.length; i++) {
            let char = text.charAt(i);
            occurrences[char] = (occurrences[char] || 0) + 1;
        }
        return occurrences;
    }

    // Uyarı Mesajları
    displayMessage(message, type) {
        const msgText = $("#msg-text");
        let msgClass = "";
        switch (type) {
            case "success":
                msgClass = "bg-success";
                break;
            case "secondary":
                msgClass = "bg-secondary";
                break;
            case "danger":
                msgClass = "bg-danger";
                break;
            default:
                msgClass = "bg-primary";
        }



        msgText.html(message).addClass("shake").addClass(msgClass);
        setTimeout(() => {
            msgText.removeClass("shake").removeClass(msgClass).html("");
        }, type === "secondary" ? 1500 : 3000);


    }

    // Enter Tıklaması için event. Tekrarlı tıklama engelleniyor. 1 saniyede bir kere.
    addEventListeners() {
        document.addEventListener("keydown", (event) => {

            const focusedElement = document.activeElement;

            if (focusedElement.tagName === "INPUT" || event.target.tagName === "INPUT") {
                this.enterEnabled = true;
            } else {
                this.enterEnabled = false;
                return;
            }

            if (event.key === "Enter" && this.enterEnabled && this.second > 0) {
                this.checkMatch();
                this.enterEnabled = false;
                setTimeout(() => {
                    this.enterEnabled = true;
                }, 1000);
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.ctrlKey && (event.key === 'z' || event.key === 'Z')) {
                event.preventDefault(); // Kombinasyonu engelle
                // İstediğiniz işlemleri gerçekleştirin veya boş bırakın
            }
        });
    }

    // Bir sonraki kutuya ilerler, ilerlediği esnada css zoom efekti uygular.
    handleInput(input) {
        moveToNextInput(input);
        applyZoomEffect(input);
    }

    // Backspace tuşu ile silme işlemini yapar.
    handleKeyDown(input, event) {
        handleBackspace(input, event);
    }
}

class FourLetters {
    constructor() {
        this.countDownZero = null;
        this.currentFormIndex = 0;
        this.forms = ["form1", "form2", "form3", "form4", "form5"];
        this.enterEnabled = true;
        this.kWord = "";
        this.getNKywCounter = 0;
        this.list = [];
        this.counter = 0;
        this.score = 0;
        this.second = 45;
        this.initialize();

    }

    initialize() {
        this.getNKyw();
        this.countDown(this.second);
        this.addEventListeners();
        setTimeout(() => {
            $("#" + this.forms[this.currentFormIndex] + " input:first").focus();
        }, 100);

    }

    // Geri sayım
    countDown() {
        this.countDownZero && clearInterval(this.countDownZero);
        this.countDownZero = setInterval(() => {

            // Timer içindeki değer güncelleniyor.
            $("#timer").html(this.second);

            // Geri sayım 0 veya daha küçük ise
            if (this.second <= 0) {
                $("#timer").html(45);
                clearInterval(this.countDownZero);
                wrongSound.play();
                $("#timer").hide().css("color", "white");
                $(".formInputFour input").prop("readonly", true);
                $(".formInputFour input").prop("disabled", true);
                for (let i = 0; i < this.kWord.length; i++) {
                    $(".formInputFour input:eq(" + i + ")").val(this.kWord[i]).css({
                        "background": "#6aaa64",
                        "color": "white",
                        "text-shadow": "2px 2px 4px rgb(0, 0, 0)"
                    }).hide().delay(300 * i).fadeIn(300);
                }

                // Restart butonu
                $("#restart")
                    .removeClass("d-none")
                    .off("click")
                    .click(() => {
                        $("#restart").addClass("d-none");
                    });

            }

            //renk değiştirme & shake
            else {
                if (this.second <= 60 && this.second >= 5) {
                    $("#timer").css("color", "#white");
                }
                else {
                    if (this.second === 5 || this.second === 3 || this.second === 1) {
                        $("#timer").addClass("shake").css("color", "#ff0015");
                        beepSound.play(); // Ses çal
                    } else if (this.second === 4 || this.second === 2) {
                        $("#timer").removeClass("shake").css("color", "#ff0015");
                        beepSound.play();
                    }
                }

                this.second--;
            }

        }, 1000); // 1000 = 1 saniye. Geri sayım için kullanılıyor.

    }

    clearInputs() {
        for (let i = 0; i < this.forms.length; i++) {
            $("#" + this.forms[i] + " input").val("").css("background-color", "").css("text-shadow", "none").css("color", "black");
        }
    }

    isKeywordExist(word, callback) {
        $.ajax({
            url: "/Game/IsFourLetterExist",
            type: "GET",
            data: { searchKeyword: word },
            success: (response) => {
                callback(response.isExist);
            },
            error: (error) => {
                callback(false);
            }
        });
    }

    checkMatch() {
        const formId = this.forms[this.currentFormIndex];
        const inputValue = this.getInputValue(formId);

        if (inputValue.length < this.kWord.length || inputValue.includes(" ")) {
            this.displayMessage("Eksik harf!", "danger");
        } else {
            this.resetInputColors(formId);
            this.setColors(inputValue, formId);

            this.isKeywordExist(inputValue, (isExist) => {
                if (!isExist) {
                    this.displayMessage("Geçersiz kelime!", "danger");
                    $("#" + formId + " input").css("background", "#8a0909");
                }
            });

            if (inputValue != this.kWord && inputValue.length >= 4) {
                $("#" + formId + " input").prop("readonly", true);
                $("#" + formId + " input").prop("disabled", true);


                this.currentFormIndex++;

                $("#" + this.forms[this.currentFormIndex]).show();
                $("#" + this.forms[this.currentFormIndex] + " input").prop("readonly", false);
                $("#" + this.forms[this.currentFormIndex] + " input").prop("disabled", false);

                setTimeout(() => {
                    $("#" + this.forms[this.currentFormIndex] + ' input[name="letter' + (2) + '"]').focus();
                    $("#" + this.forms[this.currentFormIndex] + " input:first").val(this.kWord[0]);
                    $("#" + this.forms[this.currentFormIndex] + " input:first").prop("disabled", true).prop("readonly", true).css("background", "#6aaa64").css("color", "black");

                }, 100);

                if (this.currentFormIndex == 5) {
                    this.second = 0;
                }

            } else if (inputValue === this.kWord) {

                this.displayMessage("Tebrikler!", "success");
                correctSound.play();
                this.currentFormIndex = 0;
                $("#" + formId + " input").prop("readonly", true);
                $("#" + formId + " input").prop("disabled", true);
                clearInterval(this.countDownZero);
                setTimeout(() => {
                    this.clearInputs();
                    this.second = 45;
                    this.countDown(this.second);
                    this.score += 1;
                    $("#score").show();
                    $("#score").html("Skor: " + this.score).css("font-size", "25px");
                }, 1500);
                this.kWord = this.getNKyw();
            }


        }
    }

    moveToNextForm() {
        this.currentFormIndex++;
        if (this.currentFormIndex < this.forms.length) {
            $("#" + this.forms[this.currentFormIndex]).show();
            $("#" + this.forms[this.currentFormIndex] + " input").prop("readonly", false);
            $("#" + this.forms[this.currentFormIndex] + " input").prop("disabled", false);
        }

        const foundLetters = this.countLetterOccurrences(this.kWord);
    }


    getInputValue(form) {
        return $("#" + form + " input").map(function () {
            return $(this).val().toUpperCase();
        }).get().join("");
    }

    resetInputColors(form) {
        $("#" + form + " input").css("background-color", "");
    }

    setColors(inputValue, formId) {
        const occurrences = this.countLetterOccurrences(this.kWord);

        for (let i = 0; i < inputValue.length; i++) {
            const char = inputValue.charAt(i);
            const input = $("#" + formId + ' input[name="letter' + (i + 1) + '"]');

            if (this.kWord.charAt(i) === char) {
                input
                    .css("background-color", "#6aaa64")
                    .css("color", "white")
                    .css("text-shadow", "2px 2px 4px rgb(0, 0, 0)")
                    .text(occurrences[char]);

                occurrences[char]--;
                if (occurrences[char] <= 0) {
                    delete occurrences[char];
                }
            } else {
                input
                    .css("background-color", "#3a3a3c")
                    .css("color", "white")
                    .css("text-shadow", "2px 2px 4px rgb(0, 0, 0)")
                    .text(occurrences[char]);
            }
        }

        for (let i = 0; i < inputValue.length; i++) {
            const char = inputValue.charAt(i);
            const input = $("#" + formId + ' input[name="letter' + (i + 1) + '"]');

            if (occurrences[char] > 0 && this.kWord.charAt(i) !== char) {
                input.css("background-color", "#b59f3b").css("color", "white").text(occurrences[char]);
                occurrences[char]--;
            }
        }
    }

    capitalizeTurkishLetter(text) {
        return text.replace(/i/g, "İ").toUpperCase();
    }

    getNKyw() {
        var self = this;
        const spaceDiv = $(".space");

        if (this.getNKywCounter > 0) {
            setTimeout(function () {
                spaceDiv.empty();
                self.performGetNKyw(spaceDiv);
            }, 1500);
        } else {
            this.performGetNKyw(spaceDiv);
        }
    }

    performGetNKyw(spaceDiv) {
        var self = this;
        $.ajax({
            url: "/Game/GetFourLetter",
            type: "GET",
            success: function (data) {
                self.kWord = self.capitalizeTurkishLetter(data.word).toUpperCase();
                if (self.list.indexOf(self.kWord) === -1) {

                    $(".space").show();
                    self.list.push(self.kWord);
                }

                else {

                    $(".space").hide();
                    self.counter += 1
                    self.performGetNKyw(spaceDiv);

                    if (self.counter > 1500) {
                        self.list = [];
                    }

                }

                spaceDiv.empty();

                for (let formIndex = 0; formIndex < 5; formIndex++) {
                    const form = $("<form>")
                        .attr("id", "form" + (formIndex + 1))
                        .addClass("formInputFour align-middle")
                        .attr("autocomplete", "off");

                    for (let letterIndex = 0; letterIndex < self.kWord.length; letterIndex++) {
                        const input = $("<input>")
                            .attr("type", "text")
                            .attr("name", "letter" + (letterIndex + 1))
                            .attr("maxlength", "1")
                            .val("")
                            .on("input", (event) => self.handleInput(event.target))
                            .on("keydown", (event) => self.handleKeyDown(event.target, event))
                            .prop("disabled", formIndex > 0);

                        // Sadece harf girilmesine izin veren method.
                        input.on("keydown", function (event) {
                            if (!event.key.match(/[a-zA-ZğüşıöçĞÜŞİÖÇ]/i)) {
                                event.preventDefault();
                            }
                        });

                        form.append(input);
                    }

                    form.append("<br>");
                    spaceDiv.append(form);
                }

                // Sayaç artırılıyor
                self.getNKywCounter++;

                setTimeout(() => {
                    $("#" + self.forms[self.currentFormIndex] + ' input[name="letter' + (2) + '"]').focus();
                    $("#" + self.forms[self.currentFormIndex] + " input:first").val(self.kWord[0]);
                    $("#" + self.forms[self.currentFormIndex] + " input:first").prop("disabled", true).prop("readonly", true).css("background", "#6aaa64").css("color", "black");

                }, 100);
            },
            error: function (error) {
                console.error("Hata:", error);
            }
        });
    }


    countLetterOccurrences(text) {
        let occurrences = {};
        for (let i = 0; i < text.length; i++) {
            let char = text.charAt(i);
            occurrences[char] = (occurrences[char] || 0) + 1;
        }
        return occurrences;
    }

    displayMessage(message, type) {
        const msgText = $("#msg-text");
        let msgClass = "";
        switch (type) {
            case "success":
                msgClass = "bg-success";
                break;
            case "seconday":
                msgClass = "bg-secondary";
                break;
            case "danger":
                msgClass = "bg-danger";
                break;
            default:
                msgClass = "bg-dark";
        }
        msgText.html(message).addClass("shake").addClass(msgClass);
        setTimeout(() => {
            msgText.removeClass("shake").removeClass(msgClass).html("");
        }, type === "success" ? 1500 : 1500);
    }

    addEventListeners() {
        document.addEventListener("keydown", (event) => {

            const focusedElement = document.activeElement;

            if (focusedElement.tagName === "INPUT" || event.target.tagName === "INPUT") {
                this.enterEnabled = true;
            } else {
                this.enterEnabled = false;
                return;
            }

            if (event.key === "Enter" && this.enterEnabled && this.second > 0) {
                this.checkMatch();
                this.enterEnabled = false;
                setTimeout(() => {
                    this.enterEnabled = true;
                }, 1000);
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.ctrlKey && (event.key === 'z' || event.key === 'Z')) {
                event.preventDefault(); // Kombinasyonu engelle
                // İstediğiniz işlemleri gerçekleştirin veya boş bırakın
            }
        });
    }


    handleInput(input) {
        moveToNextInput(input);
        applyZoomEffect(input);
    }

    handleKeyDown(input, event) {
        handleBackspace(input, event);
    }
}

class FiveLetters {
    constructor() {
        this.countDownZero = null;
        this.currentFormIndex = 0;
        this.forms = ["form1", "form2", "form3", "form4", "form5"];
        this.enterEnabled = true;
        this.kWord = "";
        this.getNKywCounter = 0;
        this.list = [];
        this.counter = 0;
        this.score = 0;
        this.second = 45;
        this.initialize();

    }

    initialize() {
        this.getNKyw();
        this.countDown(this.second);
        this.addEventListeners();
        setTimeout(() => {
            $("#" + this.forms[this.currentFormIndex] + " input:first").focus();
        }, 100);

    }

    // Geri sayım
    countDown() {
        this.countDownZero && clearInterval(this.countDownZero);
        this.countDownZero = setInterval(() => {

            // Timer içindeki değer güncelleniyor.
            $("#timer").html(this.second);

            // Geri sayım 0 veya daha küçük ise
            if (this.second <= 0) {
                $("#timer").html(45);
                clearInterval(this.countDownZero);
                wrongSound.play();
                $("#timer").hide().css("color", "white");
                $(".formInputFour input").prop("readonly", true);
                $(".formInputFour input").prop("disabled", true);
                for (let i = 0; i < this.kWord.length; i++) {
                    $(".formInputFour input:eq(" + i + ")").val(this.kWord[i]).css({
                        "background": "#6aaa64",
                        "color": "white",
                        "text-shadow": "2px 2px 4px rgb(0, 0, 0)"
                    }).hide().delay(300 * i).fadeIn(300);
                }

                // Restart butonu
                $("#restart")
                    .removeClass("d-none")
                    .off("click")
                    .click(() => {
                        $("#restart").addClass("d-none");
                    });

            }

            //renk değiştirme & shake
            else {
                if (this.second <= 60 && this.second >= 5) {
                    $("#timer").css("color", "#white");
                }
                else {
                    if (this.second === 5 || this.second === 3 || this.second === 1) {
                        $("#timer").addClass("shake").css("color", "#ff0015");
                        beepSound.play(); // Ses çal
                    } else if (this.second === 4 || this.second === 2) {
                        $("#timer").removeClass("shake").css("color", "#ff0015");
                        beepSound.play();
                    }
                }

                this.second--;
            }

        }, 1000); // 1000 = 1 saniye. Geri sayım için kullanılıyor.

    }

    clearInputs() {
        for (let i = 0; i < this.forms.length; i++) {
            $("#" + this.forms[i] + " input").val("").css("background-color", "").css("text-shadow", "none").css("color", "black");
        }
    }

    isKeywordExist(word, callback) {
        $.ajax({
            url: "/Game/IsFiveLetterExist",
            type: "GET",
            data: { searchKeyword: word },
            success: (response) => {
                callback(response.isExist);
            },
            error: (error) => {
                callback(false);
            }
        });
    }

    checkMatch() {
        const formId = this.forms[this.currentFormIndex];
        const inputValue = this.getInputValue(formId);

        if (inputValue.length < this.kWord.length || inputValue.includes(" ")) {
            this.displayMessage("Eksik harf!", "danger");
        } else {
            this.resetInputColors(formId);
            this.setColors(inputValue, formId);

            this.isKeywordExist(inputValue, (isExist) => {
                if (!isExist) {
                    this.displayMessage("Geçersiz kelime!", "danger");
                    $("#" + formId + " input").css("background", "#8a0909");
                }
            });

            if (inputValue != this.kWord && inputValue.length >= 5) {
                $("#" + formId + " input").prop("readonly", true);
                $("#" + formId + " input").prop("disabled", true);


                this.currentFormIndex++;

                $("#" + this.forms[this.currentFormIndex]).show();
                $("#" + this.forms[this.currentFormIndex] + " input").prop("readonly", false);
                $("#" + this.forms[this.currentFormIndex] + " input").prop("disabled", false);

                setTimeout(() => {
                    $("#" + this.forms[this.currentFormIndex] + ' input[name="letter' + (2) + '"]').focus();
                    $("#" + this.forms[this.currentFormIndex] + " input:first").val(this.kWord[0]);
                    $("#" + this.forms[this.currentFormIndex] + " input:first").prop("disabled", true).prop("readonly", true).css("background", "#6aaa64").css("color", "black");

                }, 100);

                if (this.currentFormIndex == 5) {
                    this.second = 0;
                }

            } else if (inputValue === this.kWord) {

                this.displayMessage("Tebrikler!", "success");
                correctSound.play();
                this.currentFormIndex = 0;
                $("#" + formId + " input").prop("readonly", true);
                $("#" + formId + " input").prop("disabled", true);
                clearInterval(this.countDownZero);
                setTimeout(() => {
                    this.clearInputs();
                    this.second = 45;
                    this.countDown(this.second);
                    this.score += 1;
                    $("#score").show();
                    $("#score").html("Skor: " + this.score).css("font-size", "25px");
                }, 1500);
                this.kWord = this.getNKyw();
            }


        }
    }

    moveToNextForm() {
        this.currentFormIndex++;
        if (this.currentFormIndex < this.forms.length) {
            $("#" + this.forms[this.currentFormIndex]).show();
            $("#" + this.forms[this.currentFormIndex] + " input").prop("readonly", false);
            $("#" + this.forms[this.currentFormIndex] + " input").prop("disabled", false);
        }

        const foundLetters = this.countLetterOccurrences(this.kWord);
    }


    getInputValue(form) {
        return $("#" + form + " input").map(function () {
            return $(this).val().toUpperCase();
        }).get().join("");
    }

    resetInputColors(form) {
        $("#" + form + " input").css("background-color", "");
    }

    setColors(inputValue, formId) {
        const occurrences = this.countLetterOccurrences(this.kWord);

        for (let i = 0; i < inputValue.length; i++) {
            const char = inputValue.charAt(i);
            const input = $("#" + formId + ' input[name="letter' + (i + 1) + '"]');

            if (this.kWord.charAt(i) === char) {
                input
                    .css("background-color", "#6aaa64")
                    .css("color", "white")
                    .css("text-shadow", "2px 2px 4px rgb(0, 0, 0)")
                    .text(occurrences[char]);

                occurrences[char]--;
                if (occurrences[char] <= 0) {
                    delete occurrences[char];
                }
            } else {
                input
                    .css("background-color", "#3a3a3c")
                    .css("color", "white")
                    .css("text-shadow", "2px 2px 4px rgb(0, 0, 0)")
                    .text(occurrences[char]);
            }
        }

        for (let i = 0; i < inputValue.length; i++) {
            const char = inputValue.charAt(i);
            const input = $("#" + formId + ' input[name="letter' + (i + 1) + '"]');

            if (occurrences[char] > 0 && this.kWord.charAt(i) !== char) {
                input.css("background-color", "#b59f3b").css("color", "white").text(occurrences[char]);
                occurrences[char]--;
            }
        }
    }

    capitalizeTurkishLetter(text) {
        return text.replace(/i/g, "İ").toUpperCase();
    }

    getNKyw() {
        var self = this;
        const spaceDiv = $(".space");

        if (this.getNKywCounter > 0) {
            setTimeout(function () {
                spaceDiv.empty();
                self.performGetNKyw(spaceDiv);
            }, 1500);
        } else {
            this.performGetNKyw(spaceDiv);
        }
    }

    performGetNKyw(spaceDiv) {
        var self = this;
        $.ajax({
            url: "/Game/GetFiveLetter",
            type: "GET",
            success: function (data) {
                self.kWord = self.capitalizeTurkishLetter(data.word).toUpperCase();

                if (self.list.indexOf(self.kWord) === -1) {

                    $(".space").show();
                    self.list.push(self.kWord);
                }

                else {

                    $(".space").hide();
                    self.counter += 1
                    self.performGetNKyw(spaceDiv);

                    if (self.counter > 1500) {
                        self.list = [];
                    }

                }

                spaceDiv.empty();

                for (let formIndex = 0; formIndex < 5; formIndex++) {
                    const form = $("<form>")
                        .attr("id", "form" + (formIndex + 1))
                        .addClass("formInputFour align-middle")
                        .attr("autocomplete", "off");

                    for (let letterIndex = 0; letterIndex < self.kWord.length; letterIndex++) {
                        const input = $("<input>")
                            .attr("type", "text")
                            .attr("name", "letter" + (letterIndex + 1))
                            .attr("maxlength", "1")
                            .val("")
                            .on("input", (event) => self.handleInput(event.target))
                            .on("keydown", (event) => self.handleKeyDown(event.target, event))
                            .prop("disabled", formIndex > 0);

                        // Sadece harf girilmesine izin veren method.
                        input.on("keydown", function (event) {
                            if (!event.key.match(/[a-zA-ZğüşıöçĞÜŞİÖÇ]/i)) {
                                event.preventDefault();
                            }
                        });

                        form.append(input);
                    }

                    form.append("<br>");
                    spaceDiv.append(form);
                }

                // Sayaç artırılıyor
                self.getNKywCounter++;

                setTimeout(() => {
                    $("#" + self.forms[self.currentFormIndex] + ' input[name="letter' + (2) + '"]').focus();
                    $("#" + self.forms[self.currentFormIndex] + " input:first").val(self.kWord[0]);
                    $("#" + self.forms[self.currentFormIndex] + " input:first").prop("disabled", true).prop("readonly", true).css("background", "#6aaa64").css("color", "black");

                }, 100);
            },
            error: function (error) {
                console.error("Hata:", error);
            }
        });
    }


    countLetterOccurrences(text) {
        let occurrences = {};
        for (let i = 0; i < text.length; i++) {
            let char = text.charAt(i);
            occurrences[char] = (occurrences[char] || 0) + 1;
        }
        return occurrences;
    }

    displayMessage(message, type) {
        const msgText = $("#msg-text");
        let msgClass = "";
        switch (type) {
            case "success":
                msgClass = "bg-success";
                break;
            case "seconday":
                msgClass = "bg-secondary";
                break;
            case "danger":
                msgClass = "bg-danger";
                break;
            default:
                msgClass = "bg-dark";
        }
        msgText.html(message).addClass("shake").addClass(msgClass);
        setTimeout(() => {
            msgText.removeClass("shake").removeClass(msgClass).html("");
        }, type === "success" ? 1500 : 1500);
    }


    addEventListeners() {
        document.addEventListener("keydown", (event) => {

            const focusedElement = document.activeElement;

            if (focusedElement.tagName === "INPUT" || event.target.tagName === "INPUT") {
                this.enterEnabled = true;
            } else {
                this.enterEnabled = false;
                return;
            }

            if (event.key === "Enter" && this.enterEnabled && this.second > 0) {
                this.checkMatch();
                this.enterEnabled = false;
                setTimeout(() => {
                    this.enterEnabled = true;
                }, 1000);
            }

        });

        document.addEventListener("keydown", function (event) {
            if (event.ctrlKey && (event.key === 'z' || event.key === 'Z')) {
                event.preventDefault(); // Kombinasyonu engelle
                // İstediğiniz işlemleri gerçekleştirin veya boş bırakın
            }
        });
    }




    handleInput(input) {
        moveToNextInput(input);
        applyZoomEffect(input);
    }

    handleKeyDown(input, event) {
        handleBackspace(input, event);
    }
}

function startFiveLetterGame() {
    const fiveLettersGame = new FiveLetters();
    $("#btnStart").hide();
    $("#timer").show();
    $(".description").hide();
    $("#score").html("Skor: " + 0);
}

function startFourLetterGame() {
    const fourLettersGame = new FourLetters();
    $("#btnStart").hide();
    $("#timer").show();
    $(".description").hide();
    $("#score").html("Skor: " + 0);
}

function startVegetableGame() {
    const vegetablesGame = new Vegetable();
    $("#btnStart").hide();
    $("#timer").show();
    $(".description").hide();
    $("#score").html("Skor: " + 0);

}


function startFruitGame() {
    const fruitsGame = new Fruit();
    $("#btnStart").hide();
    $("#timer").show();
    $(".description").hide();
    $("#score").html("Skor: " + 0);

}


function startCountryGame() {
    const countriesGame = new Country();
    $("#btnStart").hide();
    $("#timer").show();
    $(".description").hide();
    $("#score").html("Skor: " + 0);

}


function startCityGame() {
    const citiesGame = new City();
    $("#btnStart").hide();
    $("#timer").show();
    $(".description").hide();
    $("#score").html("Skor: " + 0);

}


function startAnimalGame() {
    const animalsGame = new Animal();
    $("#btnStart").hide();
    $("#timer").show();
    $(".description").hide();
    $("#score").html("Skor: " + 0);

}
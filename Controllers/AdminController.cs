using KeywordGame.Models;
using KeywordGame.Repositories;
using KeywordGame.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace KeywordGame.Controllers
{

    public class AdminController : Controller
    {
        private readonly AnimalRepository _animalRepository;
        private readonly CityRepository _cityRepository;
        private readonly FruitRepository _fruitRepository;
        private readonly CountryRepository _countryRepository;
        private readonly FourLetterRepository _fourLetterRepository;
        private readonly FiveLetterRepository _fiveLetterRepository;
        private readonly VegetableRepository _vegetableRepository;
        private readonly ReportRepository _reportRepository;
        private readonly ContributionRepository _contributionRepository;


        public AdminController(
            AnimalRepository animalRepository,
            CityRepository cityRepository,
            FruitRepository fruitRepository,
            CountryRepository countryRepository,
            FourLetterRepository fourLetterRepository,
            FiveLetterRepository fiveLetterRepository,
            VegetableRepository vegetableRepository,
            ReportRepository reportRepository,
            ContributionRepository contributionRepository)
        {
            _animalRepository = animalRepository;
            _cityRepository = cityRepository;
            _fruitRepository = fruitRepository;
            _countryRepository = countryRepository;
            _fourLetterRepository = fourLetterRepository;
            _fiveLetterRepository = fiveLetterRepository;
            _vegetableRepository = vegetableRepository;
            _reportRepository = reportRepository;
            _contributionRepository = contributionRepository;
        }

        public IActionResult Index()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Home");
            }

            // Kullanıcı adını ViewBag'e ata
            ViewBag.Username = User.Identity.Name;

            

            return View();
        }

        public IActionResult ListAnimals()
        {

            var result = _animalRepository.GetAll();

            return PartialView("_AnimalList", result);
        }

        public IActionResult ListCities()
        {

            var result = _cityRepository.GetAll();

            return PartialView("_CityList", result);


        }

        public IActionResult ListCountries()
        {

            var result = _countryRepository.GetAll();

            return PartialView("_CountryList", result);

        }
        public IActionResult ListFruits()
        {

            var result = _fruitRepository.GetAll();

            return PartialView("_FruitList", result);


        }
        public IActionResult ListFourLetters()
        {

            var result = _fourLetterRepository.GetAll();

            return PartialView("_FourLetterList", result);

        }

        public IActionResult ListFiveLetters()
        {
            var result = _fiveLetterRepository.GetAll();
            return PartialView("_FiveLetterList", result);
        }       

        public IActionResult ListVegetables()
        {
            var result = _vegetableRepository.GetAll();

            return PartialView("_VegetableList", result);

        }

        public IActionResult ListReports()
        {
            var result = _reportRepository.GetAll();

            return PartialView("_ReportList", result);
        }

        public IActionResult ListContributions()
        {
            var result = _contributionRepository.GetAll();

            return PartialView("_ContributionList", result);
        }

        [HttpPost]
        public IActionResult AddNewKeyword(NewKeywordVM nk)
        {

            if (nk.Category == "Canlı")
            {
                var result = _animalRepository.GetByName(nk.Word);

                if (result == null)
                {

                    var newAnimal = new Animal { Word = nk.Word, ImagePath = nk.ImagePath };
                    _animalRepository.Insert(newAnimal);

                }

                else
                {
                    return BadRequest();
                }
            }

            else if (nk.Category == "Meyve")
            {
                var result = _fruitRepository.GetByName(nk.Word);

                if (result == null)
                {
                    var newFruit = new Fruit { Word = nk.Word, ImagePath = nk.ImagePath };
                    _fruitRepository.Insert(newFruit);
                }

                else
                {
                    return BadRequest();
                }
            }

            else if (nk.Category == "Sebze")
            {
                var result = _vegetableRepository.GetByName(nk.Word);
                if (result == null)
                {
                    var newVeg = new Vegetable { Word = nk.Word, ImagePath = nk.ImagePath };
                    _vegetableRepository.Insert(newVeg);
                }

                else
                {
                    return BadRequest();
                }
            }

            else if (nk.Category == "Ulke")
            {
                var result = _countryRepository.GetByName(nk.Word);

                if (result == null)
                {

                    var newCountry = new Country { Word = nk.Word, ImagePath = nk.ImagePath };
                    _countryRepository.Insert(newCountry);
                }

                else
                {
                    return BadRequest();
                }
            }

            else if (nk.Category == "Sehir")
            {

                var result = _cityRepository.GetByName(nk.Word);

                if (result == null)
                {

                    var newCity = new City { Word = nk.Word, ImagePath = nk.ImagePath, ImageDesc = nk.ImageDesc };
                    _cityRepository.Insert(newCity);

                }

                else
                {
                    return BadRequest();
                }
            }

            else if (nk.Category == "4 Harf")
            {

                var result = _fourLetterRepository.GetByName(nk.Word);

                if (result == null)
                {
                    var newFl = new FourLetter { Word = nk.Word };
                    _fourLetterRepository.Insert(newFl);
                }
                else
                {
                    return BadRequest();
                }
            }

            else if (nk.Category == "5 Harf")
            {
                var result = _fiveLetterRepository.GetByName(nk.Word);
                if (result == null)
                {
                    var newFive = new FiveLetter { Word = nk.Word };
                    _fiveLetterRepository.Insert(newFive);
                }

                else
                {
                    return BadRequest();
                }
            }
          

            return RedirectToAction("Index");

        }

        public async Task<IActionResult> DeleteWord(NewKeywordVM nk)
        {
            if (nk.Category == "Canlı")
            {
                var deleteAnimal = await _animalRepository.GetByName(nk.Word);

                if (deleteAnimal != null)
                {
                    // Meyveyi sil
                    _animalRepository.Delete(deleteAnimal);
                }

                else
                {
                    return BadRequest();

                }
            }

            else if (nk.Category == "Meyve")
            {
                var deleteFruit = await _fruitRepository.GetByName(nk.Word);

                if (deleteFruit != null)
                {
                    _fruitRepository.Delete(deleteFruit);
                }

                else
                {
                    return BadRequest();

                }
            }

            else if (nk.Category == "Sebze")
            {
                var deleteVeg = await _vegetableRepository.GetByName(nk.Word);
                if (deleteVeg != null)
                {
                    _vegetableRepository.Delete(deleteVeg);
                }

                else
                {
                    return BadRequest();

                }
            }

            else if (nk.Category == "Ulke")
            {
                var deleteCountry = await _countryRepository.GetByName(nk.Word);
                if (deleteCountry != null)
                {
                    _countryRepository.Delete(deleteCountry);
                }

                else
                {
                    return BadRequest();

                }
            }

            else if (nk.Category == "Sehir")
            {
                var deleteCity = await _cityRepository.GetByName(nk.Word);
                if (deleteCity != null)
                {
                    _cityRepository.Delete(deleteCity);
                }

                else
                {
                    return BadRequest();

                }
            }


            else if (nk.Category == "4 Harf")
            {
                var deleteFl = await _fourLetterRepository.GetByName(nk.Word);
                if (deleteFl != null)
                {
                    _fourLetterRepository.Delete(deleteFl);
                }

                else
                {
                    return BadRequest();

                }
            }

            else if (nk.Category == "5 Harf")
            {
                var deleteFive = await _fiveLetterRepository.GetByName(nk.Word);
                if (deleteFive != null)
                {
                    _fiveLetterRepository.Delete(deleteFive);
                }
            }
           

            return RedirectToAction("Index");

        }

        public async Task<IActionResult> UpdateWord(NewKeywordVM nk)
        {
            if (nk.Category == "Canlı")
            {
                var updateAnimal = await _animalRepository.GetByName(nk.Word);

                if (updateAnimal != null)
                {
                    updateAnimal.Word = nk.NewWord;
                    _animalRepository.Update(updateAnimal);
                }

                else
                {
                    return BadRequest();

                }
            }

            else if (nk.Category == "Meyve")
            {
                var updateFruit = await _fruitRepository.GetByName(nk.Word);

                if (updateFruit != null)
                {
                    updateFruit.Word = nk.NewWord;
                    _fruitRepository.Update(updateFruit);
                }

                else
                {
                    return BadRequest();

                }
            }

            else if (nk.Category == "Sebze")
            {
                var updateVeg = await _vegetableRepository.GetByName(nk.Word);
                if (updateVeg != null)
                {
                    updateVeg.Word = nk.NewWord;
                    _vegetableRepository.Update(updateVeg);
                }

                else
                {
                    return BadRequest();

                }
            }

            else if (nk.Category == "Sehir")
            {
                var updateCity = await _cityRepository.GetByName(nk.Word);
                if (updateCity != null)
                {
                    updateCity.Word = nk.NewWord;
                    _cityRepository.Update(updateCity);
                }

                else
                {
                    return BadRequest();

                }
            }

            else if (nk.Category == "Ulke")
            {
                var updateCountry = await _countryRepository.GetByName(nk.Word);
                if (updateCountry != null)
                {
                    updateCountry.Word = nk.NewWord;
                    _countryRepository.Update(updateCountry);
                }

                else
                {
                    return BadRequest();

                }
            }

            else if (nk.Category == "4 Harf")
            {
                var updateFl = await _fourLetterRepository.GetByName(nk.Word);
                if (updateFl != null)
                {
                    updateFl.Word = nk.NewWord;
                    _fourLetterRepository.Update(updateFl);
                }

                else
                {
                    return BadRequest();

                }
            }


            else if (nk.Category == "5 Harf")
            {
                var updateFive = await _fiveLetterRepository.GetByName(nk.Word);
                if (updateFive != null)
                {
                    updateFive.Word = nk.NewWord;
                    _fiveLetterRepository.Update(updateFive);
                }

                else
                {
                    return BadRequest();

                }

            }
            

            return RedirectToAction("Index");

        }


        public IActionResult DeleteCon(Contribution con)
        {
            _contributionRepository.Delete(con);
            return RedirectToAction("Index");
        }

        public IActionResult DeleteRep(Report rep)
        {
            _reportRepository.Delete(rep);
            return RedirectToAction("Index");
        }

        [HttpPost]
        public IActionResult AddBulk(NewKeywordVM nk)
        {
            string[] words = nk.Word.Split(',');

            if (nk.Category == "Canlı")
            {
                foreach (var animal in words)
                {
                    var newAnimal = new Animal { Word = animal.Trim() };

                    _animalRepository.Insert(newAnimal);
                }
            }

            else if (nk.Category == "Meyve")
            {
                foreach (var fruit in words)
                {
                    var newFruit = new Fruit { Word = fruit.Trim() };

                    _fruitRepository.Insert(newFruit);
                }

            }

            else if (nk.Category == "Sebze")
            {
                foreach (var veg in words)
                {
                    var newVegs = new Vegetable { Word = veg.Trim() };

                    _vegetableRepository.Insert(newVegs);
                }
            }

            else if (nk.Category == "Sehir")
            {
                foreach (var city in words)
                {
                    var newCity = new City { Word = city.Trim() };

                    _cityRepository.Insert(newCity);
                }
            }

            else if (nk.Category == "Ulke")
            {
                foreach (var country in words)
                {
                    var newCountry = new Country { Word = country.Trim() };

                    _countryRepository.Insert(newCountry);
                }
            }

            else if (nk.Category == "4 Harf")
            {
                foreach (var four in words)
                {
                    var newFour = new FourLetter { Word = four.Trim() };

                    _fourLetterRepository.Insert(newFour);
                }
            }


            else if (nk.Category == "5 Harf")
            {
                foreach (var five in words)
                {
                    var newFive = new FiveLetter { Word = five.Trim() };

                    _fiveLetterRepository.Insert(newFive);
                }

            }           

            else
            {
                return BadRequest();
            }

            return RedirectToAction("Index");
        }


    }

}








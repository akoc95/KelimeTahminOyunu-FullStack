using KeywordGame.Models;
using KeywordGame.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace KeywordGame.Controllers
{
    [AllowAnonymous]
    public class GameController : Controller
    {
        private readonly AnimalRepository _animalRepository;
        private readonly CityRepository _cityRepository;
        private readonly FruitRepository _fruitRepository;
        private readonly CountryRepository _countryRepository;
        private readonly FourLetterRepository _fourLetterRepository;
        private readonly FiveLetterRepository _fiveLetterRepository;
        private readonly VegetableRepository _vegetableRepository;
        

        public GameController(
            AnimalRepository animalRepository,
            CityRepository cityRepository,
            FruitRepository fruitRepository,
            CountryRepository countryRepository,
            FourLetterRepository fourLetterRepository,
            FiveLetterRepository fiveLetterRepository,
            VegetableRepository vegetableRepository)
        {
            _animalRepository = animalRepository;
            _cityRepository = cityRepository;
            _fruitRepository = fruitRepository;
            _countryRepository = countryRepository;
            _fourLetterRepository = fourLetterRepository;
            _fiveLetterRepository = fiveLetterRepository;
            _vegetableRepository = vegetableRepository;

        }


        [Route("oyun/canlilar")]
        public IActionResult Animals() => View();
        public async Task<IActionResult> GetAnimal() => await GetKeywordResult(await _animalRepository.GetKeyword());
        public async Task<IActionResult> IsAnimalExist(string searchKeyword) => await GetExistenceResult(await _animalRepository.GetByName(searchKeyword));

        [Route("oyun/sehirler")]
        public IActionResult Cities() => View();
        public async Task<IActionResult> GetCity() => await GetKeywordResult(await _cityRepository.GetKeyword());
        public async Task<IActionResult> IsCityExist(string searchKeyword) => await GetExistenceResult(await _cityRepository.GetByName(searchKeyword));

        [Route("oyun/ulkeler")]
        public IActionResult Countries() => View();
        public async Task<IActionResult> GetCountry() => await GetKeywordResult(await _countryRepository.GetKeyword());
        public async Task<IActionResult> IsCountryExist(string searchKeyword) => await GetExistenceResult(await _countryRepository.GetByName(searchKeyword));

        [Route("oyun/4-harf")]
        public IActionResult FourLetters() => View();
        public async Task<IActionResult> GetFourLetter() => await GetKeywordResult(await _fourLetterRepository.GetKeyword());
        public async Task<IActionResult> IsFourLetterExist(string searchKeyword) => await GetExistenceResult(await _fourLetterRepository.GetByName(searchKeyword));

        [Route("oyun/meyveler")]
        public IActionResult Fruits() => View();

        public async Task<IActionResult> GetFruit() => await GetKeywordResult(await _fruitRepository.GetKeyword());
        public async Task<IActionResult> IsFruitExist(string searchKeyword) => await GetExistenceResult(await _fruitRepository.GetByName(searchKeyword));

        [Route("oyun/sebzeler")]
        public IActionResult Vegetables() => View();
        public async Task<IActionResult> GetVegetable() => await GetKeywordResult(await _vegetableRepository.GetKeyword());
        public async Task<IActionResult> IsVegetableExist(string searchKeyword) => await GetExistenceResult(await _vegetableRepository.GetByName(searchKeyword));

        [Route("oyun/5-harf")]
        public IActionResult FiveLetter() => View();
        public async Task<IActionResult> GetFiveLetter() => await GetKeywordResult(await _fiveLetterRepository.GetKeyword());
        public async Task<IActionResult> IsFiveLetterExist(string searchKeyword) => await GetExistenceResult(await _fiveLetterRepository.GetByName(searchKeyword));      


        // Gelen değer null değilse geriye Kelime döndür.
        private async Task<IActionResult> GetKeywordResult(BaseEntity randomEntry)
        {
            if (randomEntry != null)
                return Json(new { Word = randomEntry.Word, ImagePath = randomEntry.ImagePath, ImageDesc = randomEntry.ImageDesc });
            else
                return Json(new { Word = "", ImagePath = "", ImageDesc = "" });
        }

        // Gelen değer null değilse geriye Kelime var yada yok verisi döndür.
        private async Task<IActionResult> GetExistenceResult(BaseEntity randomEntry)
        {
            if (randomEntry != null)
                return Json(new { isExist = true });
            else
                return Json(new { isExist = false });
        }

    }
}

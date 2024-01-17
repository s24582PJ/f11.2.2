import React, { useState, useEffect } from 'react';
import './style.css';

function App() {
  const [meals, setMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [rating, setRating] = useState(0);
  const [searchError, setSearchError] = useState('');
  const [expandedMealId, setExpandedMealId] = useState(null);

  useEffect(() => {
    fetchMeals();
  }, [searchTerm]);

  const fetchMeals = async () => {
    try {
      const response = await fetch(
        'https://www.themealdb.com/api/json/v1/1/search.php?s=' + searchTerm
      );
      const data = await response.json();

      if (data.meals) {
        setMeals(data.meals);
        setSearchError('');
        setExpandedMealId(null);
      } else {
        setMeals([]);
        setSearchError('Brak wyników dla wprowadzonej nazwy.');
        setExpandedMealId(null);
      }
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  const fetchMealDetails = async (id) => {
    try {
      const response = await fetch(
        'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id
      );
      const data = await response.json();
      setSelectedMeal(data.meals[0]);

      setExpandedMealId((prevId) => (prevId === id ? null : id));
    } catch (error) {
      console.error('Error fetching meal details:', error);
    }
  };

  const handleSearch = () => {
    setSearchError('');
    fetchMeals();
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Meal Explorer</h1>

        <div>
          <input
            type="text"
            placeholder="Wyszukaj danie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Szukaj</button>
        </div>

        {searchError && <p className="error-message">{searchError}</p>}

        <div className="meal-list">
          {meals.map((meal) => (
            <div
              key={meal.idMeal}
              className="meal-card"
              onClick={() => fetchMealDetails(meal.idMeal)}
            >
              <img src={meal.strMealThumb} alt={meal.strMeal} />
              <p>{meal.strMeal}</p>
              {selectedMeal && expandedMealId === meal.idMeal && (
                <div className="meal-description">
                  <p>{selectedMeal.strInstructions}</p>
                  <p>Kraj pochodzenia: {selectedMeal.strArea}</p>
                  <p>Kategoria: {selectedMeal.strCategory}</p>
                  <p>
                    Ocena:
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} onClick={() => handleRatingChange(star)}>
                        {star <= rating ? '★' : '☆'}
                      </span>
                    ))}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;

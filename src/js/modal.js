// import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE } from './config';
import { getJSON } from './helper';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);
    const recipe = data.data.recipe;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    state.search.page = 1;
    const data = await getJSON(`${API_URL}?search=${query}`);

    state.search.results = data.data.recipes.map(recp => {
      return {
        id: recp.id,
        title: recp.title,
        publisher: recp.publisher,
        image: recp.image_url,
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchResultspage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    //newQty =  oldQty * newServings / oldServings;
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);

  //Mark cur recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(recipe => recipe.id === id);
  state.bookmarks.splice(index, 1);

  //Mark cur recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
};

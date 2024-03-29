import * as modal from './modal.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODEL_CLOSE_SECONDS } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import View from './views/View.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    resultsView.update(modal.getSearchResultspage());
    bookmarksView.update(modal.state.bookmarks);

    // 1) Loading Recipe
    await modal.loadRecipe(id);

    // 2) Rendering recipe
    recipeView.render(modal.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();

    await modal.loadSearchResults(query);

    resultsView.render(modal.getSearchResultspage());

    paginationView.render(modal.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(modal.getSearchResultspage(goToPage));
  paginationView.render(modal.state.search);
};

const controlServings = function (newServings) {
  //Update recipe servings
  modal.updateServings(newServings);
  //Update the recipe view
  recipeView.update(modal.state.recipe);
};

const controlAddBookmark = function () {
  //Add or remove bookmark
  if (!modal.state.recipe.bookmarked) modal.addBookmark(modal.state.recipe);
  else modal.deleteBookmark(modal.state.recipe.id);
  //Update recipe view
  recipeView.update(modal.state.recipe);
  //Render bookmarks
  bookmarksView.render(modal.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(modal.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    const recipe = await modal.uploadRecipe(newRecipe);
    recipeView.render(modal.state.recipe);
    addRecipeView.renderMessage();
    bookmarksView.render(modal.state.bookmarks);
    window.history.pushState(null, '', `#${modal.state.recipe.id}`);
    setTimeout(() => {
      location.reload();
    }, MODEL_CLOSE_SECONDS * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandleClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

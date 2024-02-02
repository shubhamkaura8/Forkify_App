import * as modal from './modal.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

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

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandleClick(controlPagination);
};
init();

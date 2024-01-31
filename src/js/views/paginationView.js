import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandleClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //First page, other page
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupBtn(curPage, numPages, 'next');
    }

    //Last page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupBtn(curPage, numPages, 'prev');
    }

    //other page
    if (curPage < numPages) {
      return `${this._generateMarkupBtn(curPage, numPages, 'next')}
      ${this._generateMarkupBtn(curPage, numPages, 'prev')}`;
    }

    //First page, no other page
    return '';
  }

  _generateMarkupBtn(curPage, numPages, btnType) {
    const goto = btnType === 'next' ? curPage + 1 : curPage - 1;
    const arrowDirection = btnType === 'next' ? 'right' : 'left';
    return `
        <button data-goto='${goto}' class="btn--inline pagination__btn--${btnType}">
            <span>Page ${goto}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-${arrowDirection}"></use>
            </svg>
        </button>`;
  }
}

export default new PaginationView();

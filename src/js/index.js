import Search from './models/Search';
import * as searchView from './views/searchView'
import { elements, renderLoader, clearLoader } from './views/base';
/**
 * Global state of the app
 * - Search Object 
 * - Current Recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {}

const controlSearch = async() =>{
    // get query from view
    const query = searchView.getInput();
    if(query) {
        // new search object and add to state
        state.search = new Search(query);
        // prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        // get search results
        await state.search.getResults();
        // 
        clearLoader();
        searchView.renderResults(state.search.result);
    }
    // 
};

elements.searchForm.addEventListener('submit', e =>{
    e.preventDefault();
    controlSearch();
})
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage =  parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage)
    }
})





//for recipe.js
// const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
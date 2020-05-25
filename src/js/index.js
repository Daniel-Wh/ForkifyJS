import Search from './models/Search';
import * as searchView from './views/searchView'
import { elements } from './views/base';
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

        // get search results
        await state.search.getResults();
        console.log(state.search);
        console.log(state.search.result);
        // 
        searchView.renderResults(state.search.result);
    }
    // 
};

elements.searchForm.addEventListener('submit', e =>{
    e.preventDefault();
    controlSearch();
})





//for recipe.js
// const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
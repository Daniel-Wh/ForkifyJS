import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';
/**
 * Global state of the app
 * - Search Object 
 * - Current Recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {}

/**
 * Global Search controller
 */
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

/**
 * Recipe Controller
 */
const controlRecipe = async () =>{
    // get id from URL
    const id = window.location.hash.replace('#', '');


    if(id){
        //prepare ui for changes
        recipeView.clearResults();
        renderLoader(elements.recipe)
        
        //create recipe object
        state.recipe = new Recipe(id);
        // get recipe data
        try{
            await state.recipe.getRecipe();
        //calc servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();
        //render to UI
        console.log(state.recipe)
        state.recipe.parseIngredients();
        // clear loader
        clearLoader(elements.recipe);
        recipeView.renderRecipe(state.recipe);
        } catch(error){
            console.log(error);
        }
    }

} 



//  window.addEventListener('hashchange', controlRecipe);
//  window.addEventListener('load', controlRecipe);

 ['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


//for recipe.js
// const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
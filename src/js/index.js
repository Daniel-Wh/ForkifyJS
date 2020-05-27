import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
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
        // highlight the selected element
        if(state.search) searchView.highlightSelected(id);
        
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
        if(state.likes){
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } else {
            recipeView.renderRecipe(state.recipe, false);
        }
        } catch(error){
            console.log(error);
        }
    }

} 


//  window.addEventListener('hashchange', controlRecipe);
//  window.addEventListener('load', controlRecipe);

 ['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

 // recipe button clicks

elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }

    if (e.target.matches('.btn-increase, .btn-increase *')) {

        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    }
    if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        // add ingredients to shopping list
        controlList();
    }
    if(e.target.matches('.recipe__love, .recipe__love *')){
        //like controller
        controlLike();
    }
})


/**
 * List Controller
 */
const controlList = () => {
    // create new list if none
    if(!state.list) state.list = new List();

    // add each ingredient to list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item)

    })
}

elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    console.log(id);
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        console.log('delete clicked')
        // delete from state
        state.list.deleteItem(id);
        // delete from ui
        listView.deleteItem(id);
    } else if(e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        console.log(val);
        if(val > 0){
            state.list.updateCount(id, val);
        }
        

    }
})


/**
 * Like controller
 */
const controlLike = () => {
    if(!state.likes) state.likes = new Likes(); // generate Likes object if there isn't one


    const currentID = state.recipe.id;
    console.log(currentID);


    if(!state.likes.isLiked(currentID)){
        // add current recipe to likes

        console.log(state.recipe.title)
        const newLike = state.likes.addLike(state.recipe.id, 
            state.recipe.title,
            state.recipe.author,
            state.recipe.img);
            console.log(newLike);
        //toggle like button
        likesView.toggleLikeBtn(true);
        //add like to UI list
        likesView.renderLike(newLike);
       
    } else {
        // remove current recipe from likes
        state.likes.deleteLike(currentID);
        //toggle like
        likesView.toggleLikeBtn(false);

        // remove like from ui list
        likesView.deleteLike(currentID);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
}


likesView.toggleLikeMenu(0);
//for recipe.js
// const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
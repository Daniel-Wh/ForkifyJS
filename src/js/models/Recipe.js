import axios from 'axios';

export default class Recipe {
    constructor(id){
        this.id = id;
    }
    /**
     * makes api call with id - if successfule, title/author/img/url/ingredients[] added to recipe object, logs error if not
     */
    async getRecipe() {
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`)
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
            console.log(res)
        }
        catch (error){
            console.log(error)
        }
    }
    /**
     * estimating cooking time 15 mins for each ingredient ** not accurate
     */
    calcTime() {
        const numIng = this.ingredients.length;
        this.time = Math.ceil(numIng / 3) * 15
    }
    /**
     * auto set to 4, not accurate
     */
    calcServings() {
        this.servings = 4;
    }
    /**
     * string formatting for ingredients for more uniform presentation
     */
    parseIngredients(){
        // initialize two arrays with matching lengths for comparison and index matching later
        const unitsLong = ['tablespoons', 'tablespoon', 'ounce', 'ounces', 'teaspoons', 'teaspoon', 'cups', 'pounds', 'pound', 'grams', 'gram', 'kilograms', 'kilogram']
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'lb', 'lb', 'g', 'g', 'kg', 'kg']
        const newIngredients = this.ingredients.map(el =>{
            // uniform units
            let ingredient = el.toLowerCase(); 
            unitsLong.forEach((unit, i) =>{
                ingredient = ingredient.replace(unit, unitsShort[i]);
            })
            // remove parens
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
            // parse ingredients into count, unit, and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2))
            let objIng;
            if(unitIndex > -1){
                // there is a unit
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if(arrCount.length === 1){
                    count = eval(arrIng[0].replace('-', '+')); // using eval to go from 4 1/2 to 4.5 - will format further later
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }
            }
            else if(parseInt(arrIng[0], 10)){
                // there is no unit but 1st element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            }
            else if(unitIndex === -1){
                // no unit and no number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objIng;

        });
        this.ingredients = newIngredients;
    }
    /**
     * updates servings up or down based on type parameter
     * @param {'inc' || 'dec'} type 
     */
    updateServings(type){
        //update servings
        const newServings = type === 'dec' ? this.servings -1 : this.servings + 1
        
        //update ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });


        this.servings = newServings;

    }
}
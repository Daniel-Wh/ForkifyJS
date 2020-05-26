import axios from 'axios';

export default class Recipe {
    constructor(id){
        this.id = id;
    }
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
            alert('Something went wrong :(')
        }
    }

    calcTime() {
        // estimating cooking time 15 mins for each ingredient ** not accurate
        const numIng = this.ingredients.length;
        this.time = Math.ceil(numIng / 3) * 15
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients(){

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
                    count = eval(arrIng[0].replace('-', '+'));
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
}
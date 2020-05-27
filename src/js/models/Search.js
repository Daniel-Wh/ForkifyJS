import axios from 'axios';

export default class Search{
    constructor(query){
        this.query = query;
    }
    /**
     * API call for recipe based on ID
     * @param {recipeID} query 
     */
    async getResults(query){
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            this.result = res.data.recipes;
            // console.log(this.result)
        } catch(error){
            console.log(error);
        }
    }
}





// const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
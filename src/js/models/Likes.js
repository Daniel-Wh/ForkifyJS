/**
 * Likes object, contains likes array of likes objects 
 */
export default class Likes {
    /**
     * constructor for Likes object - initializes empty likes array
     */
    constructor(){
        this.likes = [];
    }
    /**
     * Add liked recipe to likes object - returns liked object added to likes array
     * @param {number} id 
     * @param {string} title 
     * @param {string} author 
     * @param {string} img 
     */
    addLike(id, title, author, img){
        const like = {
            id,
            title,
            author,
            img
        }
        this.likes.push(like);
        // persist data in local storage
        this.persistData();
        return like;
    }
    /**
     * removes liked recipe based on href#id
     * @param {number} id 
     */
    deleteLike(id){
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
        this.persistData();
    }

    isLiked(id){
        return this.likes.findIndex(el => el.id === id) !== -1
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }
    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if(storage){ // restore likes
            this.likes = storage;
        }
    }
}
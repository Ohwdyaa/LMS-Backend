const Categories = require('../models/categories');

async function createCategories(categoriesData) {
    try {
        const categories = await Categories.createCategories(categoriesData);   
        return categories;
    } catch (error) {
        throw error;
    } 
}
// async function updateCategories(categoriesId, categoriesData) {
//     try {
//         const categoriesUpdate = await Categories.
//     } catch (error) {
        
//     }
// }
module.exports = {
    createCategories,
}
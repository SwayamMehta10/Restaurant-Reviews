let restaurants

export default class RestaurantsDAO {
    static async injectDB(conn) {
        if (restaurants) {
            return
        }
        try {
            restaurants = await conn.db(process.env.REST_REVIEWS_NS).collection("restaurants")
        }
        catch (e) {
            console.error(
                'Unable to establish a collection handle in restaurantsDAO:', e
            )
        }
    }

    static async getRestaurants({
        filters = null,
        page = 0,
        restaurantsPerPage = 20,
    } = {}) {
        let query
        if(filters) {
            if ("name" in filters) {
                query = { $text: { $search: filters["name"] } }     // Go to MongoDB Atlas, in the "restaurants" collection, create an index and change the fields option to { "name": "text", }
            }
            else if ("cuisine" in filters) {
                query = { "cuisine": { $eq: filters["cuisine"] } }
            }
            else if ("zipcode" in filters) {
                query = { "address.zipcode": { $eq: filters["zipcode"] } }
            }
        }

        let cursor
        
        try {
            cursor = await restaurants.find(query)
        }
        catch (e) {
            console.error('Unable to isse find command', e)
            return { restaurantsList: [], totalNumRestaurants: 0 }
        }

        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)

        try {
            const restaurantsList = await displayCursor.toArray()
            const totalNumRestaurants = await restaurants.countDocuments(query)
            return { restaurantsList, totalNumRestaurants }
        }
        catch (e) {
            console.error('Unable to convert cursor to array or problem counting documents', e)
            return { restaurantsList: [], totalNumRestaurants: 0 }
        }
    }
}
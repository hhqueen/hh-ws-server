const axios = require("axios")
const api_key =  process.env.POSITION_STACK_API_KEY

const forwardSearchByTerm = async (term) =>{
    try {
        const params = {
            access_key: api_key,
            output: "json",
            country: "US",
            query: term
          }
        // const response = await axios.get('https://api.positionstack.com/v1/forward',{params})
        const response = await axios.get(`https://api.positionstack.com/v1/forward?access_key=${params.access_key}&query=${params.query}`)
        return response.data
    } catch (error) {
        console.log(error)
        return error
    }
}

exports.forwardSearchByTerm = forwardSearchByTerm;
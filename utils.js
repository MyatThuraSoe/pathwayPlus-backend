async function paginate(model, page, limit){
    try {
        let docs = await model.find().limit(limit * 1).skip((page - 1) * limit);
        let count = await model.countDocuments();

        return {
            data: docs,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        }
    } catch (err) {
        console.log(err.message)
        return null
    }
}
   

module.exports = {
    paginate
}
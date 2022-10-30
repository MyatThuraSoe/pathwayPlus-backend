async function consultant_filter(model, detailObj){
    let {page, limit, name, country} = detailObj

    let queryObj = {}
    if(name) queryObj["name"]={ $regex: name, $options: "i"}
    if(country) queryObj["country"]={ $regex: country, $options: "i"}

    let resultData = {}

    try {
        let filterPromise = model.find(queryObj)
        let x = await model.find(queryObj);
        let count = x.length

        if (page || limit){
            filterPromise = filterPromise.limit(limit * 1).skip((page - 1) * limit)
            resultData["totalPages"] = Math.ceil(count / limit)
            resultData["currentPage"] = page
        }
        let docs = await filterPromise.exec();
        

        resultData["data"] = docs

        return resultData
    } catch (err) {
        console.log(err.message)
        return null
    }
}

async function paginate(query, page, limit){
    let docs = query.limit(limit * 1).skip((page - 1) * limit)
    return 
}
   

module.exports = {
    consultant_filter,
    paginate
}
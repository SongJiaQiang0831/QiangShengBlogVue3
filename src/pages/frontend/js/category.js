import axios from "@/axios"

export function getCategories() {
    return axios.post("/props/queryProps")
}

export function getCategoryArticles(data) {
    return axios.post("/category/article/list", data)
}



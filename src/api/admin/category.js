import axios from "@/axios"

export function addCategory(data) {
    return axios.post("/props/updateProps", data)
}

export function getCategoryPageList(data) {
    return axios.post("/props/queryProps", data)
}


export function deleteCategory(categoryId) {
    return axios.post("/admin/category/delete", {categoryId})
}

export function getCategorySelect() {
    return axios.post("/admin/category/select/list")
}


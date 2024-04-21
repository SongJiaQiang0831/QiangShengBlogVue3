import axios from "@/axios"

export function getDashboardArticleStatisticsInfo(data) {
    return axios.post("/dashboard/article/statistics",data)
}

export function getDashboardPublishArticleStatisticsInfo() {
    return axios.post("/admin/dashboard/publishArticle/statistics")
}

export function getDashboardPVStatisticsInfo() {
    return axios.post("/admin/dashboard/pv/statistics")
}



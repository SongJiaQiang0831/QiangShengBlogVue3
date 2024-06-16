import request from "@/api/utils/request"
/**
 * 文章分页查询
 */
const API_URL_ARTICLE_PAGE='/article/queryArticlePage';
/**
 * 文章详情
 */
const API_URL_ARTICLE_DETAIL='/article/queryArticleDetail';

/**
 * 新建文章
 */
const API_URL_ARTICLE_CREATE='/article/saveArticle';

/**
 * 更新文章
 */
const API_URL_ARTICLE_UPDATE='***';
/**
 * 发布文章
 */
const API_URL_ARTICLE_PUBLISH='/article/publishArticle';

export const RESPONSE_CODE_SUCCESS='1';


/**
 * 分页查询文章内容
 * @param {*} data 
 * @returns 
 */
export function queryArticlePage(data) {
    return request.post(API_URL_ARTICLE_PAGE, data)
}

export function getArticleDetail(data) {
    return request.post(API_URL_ARTICLE_DETAIL, data)
}

export function createArticle(data) {
    return request.post(API_URL_ARTICLE_CREATE, data)
}
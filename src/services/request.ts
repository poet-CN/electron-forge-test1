/*
 * @Author: 马铭扬
 * @Email：poet_cn@gonxt.com
 * @Date: 2023-04-20 10:46:40
 * @Description: 全局http请求方法
 * @FilePath: /gonxt-web-fe/src/services/request.ts
 */

import { request, getIntl } from 'umi'
import type { RequestConfig } from 'umi'
import { toast } from 'react-toastify'
import { getAccessToken } from '@/utils/utils'

// 全局配置项。兼容所有axios参数
const extraOptions = (silent: boolean): RequestConfig => {
    return {
        timeout: 10000,
        withCredentials: true,
        responseInterceptors: [
            [
                (response) => {
                    return response
                },
                // @ts-ignore
                (error) => {
                    const errorJson = error
                    const { formatMessage } = getIntl()
                    // @ts-ignore
                    const response = errorJson?.response || {}
                    if (!silent) {
                        toast.error(formatMessage({ id: 'code.999' }))
                    }
                    return response?.data || {}
                },
            ],
        ],
    }
}

// GET方法
const get = (url: string, options?: RequestGetOptions) => {
    const { silent = false, ...requestOptions } = options || {}
    return request(url, {
        method: 'GET',
        headers: {
            'AccessToken': getAccessToken() || '',
            'Platform': 'client',
        },
        ...requestOptions,
        ...extraOptions(silent),
    })
}

// POST方法
const post = (url: string, options?: RequestPostOptions) => {
    const { isForm = false, silent = false, ...requestOptions } = options || {}
    return request(url, {
        method: 'POST',
        headers: {
            'Content-Type': isForm ? 'multipart/form-data' : 'application/json',
            'AccessToken': getAccessToken() || '',
            'Platform': 'client',
        },
        ...requestOptions,
        ...extraOptions(silent),
    })
}

const Request = { get, post }

export default Request

interface RequestGetOptions extends RequestConfig {
    silent?: boolean;
}

interface RequestPostOptions extends RequestGetOptions {
    isForm?: boolean;
}

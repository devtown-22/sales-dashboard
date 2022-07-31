import api from '../lib/api'
export const fetchCourses = async () => {
    const apiInst = await api()
    return apiInst.get('/courses')
}

export const fetchBatchesByCourse = async (courseId: string) => {
    const apiInst = await api()
    return apiInst.get(`/courses/${courseId}/batches`)
}

export const fetchProductByBatch = async (batchId: string) => {
    const apiInst = await api()
    return apiInst.get(`courses/batches/${batchId}/product`)
}

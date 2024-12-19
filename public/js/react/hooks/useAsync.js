import { useState, useCallback, useEffect } from 'react'

export function useAsync(func, dependencies = []) {
    const { execute, ...state } = useAsyncInternal(func, dependencies, true)

    useEffect(() => {
        console.log("useAsync useEffect called");
        execute()
    }, [execute])


    return state

}


export function useAsyncFn(func, dependencies = []) {
    return useAsyncInternal(func, dependencies, false)    
}



function useAsyncInternal(func, dependencies, initialLoading=false) {

    const [loading, setLoading] = useState(initialLoading)
    const [error, setError] = useState()
    const [value, setValue] = useState()

    const execute = useCallback((...params) => {
        console.log("useAsyncInternal execute called");

        setLoading(true)
        return func(...params).then(data => {
            console.log("useAsyncInternal execute success", data);
            setValue(data)
            setError(undefined)

            return data
        }).catch(error => {
            console.log("useAsyncInternal execute error", error);
            setValue(undefined)
            setError(error)

            return Promise.reject(error)
        }).finally(() => {
            setLoading(false)
        })

    }, dependencies)

    return { loading, error, value, execute }
    
}
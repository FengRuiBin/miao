import { useState, useCallback, useMemo, useEffect } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"

export function useInput(init = '') {
  var [value, setValue] = useState(init)
  var onChange = useCallback(function onChange(e) {
    setValue(e.target.value)
  }, [])
  return {
    value, onChange
  }
}

export function useBooleanInput(init = false) {
  var [checked, setChecked] = useState(init)
  var onChange = useCallback(function onChange(e) {
    setChecked(e.target.checked)
  }, [])
  return { checked, onChange }
}

export function useQuery() {
  var search = useLocation().search
  return useMemo(() => new URLSearchParams(search), [search])
}

export function useAxios(config) {
  // 用来存放请求结果
  var [data, setData] = useState()
  // 用来存放错误结果
  var [error, setError] = useState()
  // 用来存放是否还在加载中
  var [loading, setLoading] = useState(true)
  var [i, setI] = useState(0)
  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    var req = axios({
      ...config,
      cancelToken: source.token
    })
    req.then(res => {
      if (res.data.code === 0) {
        setData(res.data.result)
      } else {
        setError(res.data.msg)
      }
      setLoading(false)
    }).catch(e => {
      setError(e.toString())
      setLoading(false)
    })
    return () => source.cancel()
  }, [config.url, i])

  var update = useCallback(function update() {
    setI(i => i + 1)
  }, [])

  return {
    data,
    loading,
    error,
    update
  }
}
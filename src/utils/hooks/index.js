import { useState } from 'react'

export const useForm = (callback, initialState) => {
  const [values, setValues] = useState(initialState || {})

  const onChange = ({ target }) => {
    setValues({ ...values, [target.name]: target.value })
  }

  const onFormSubmit = e => {
    e.preventDefault()
    callback()
  }

  return { onChange, onFormSubmit, values }
}

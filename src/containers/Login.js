import React, { useContext, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import PropTypes from 'prop-types'
import { Button, Form } from 'semantic-ui-react'
import { useForm } from '../utils'
import { AuthContext } from '../contexts/auth'

const initialValues = {
  password: '',
  username: ''
}

export const Login = React.memo((props) => {
  const [errors, setErrors] = useState(null)

  const context = useContext(AuthContext)

  const { onChange, onFormSubmit, values } = useForm(loginCallback, initialValues)

  const [login, { loading }] = useMutation(LOGIN, {
    update (_, { data: { login: userData } }) {
      props.history.push('/')
      context.login(userData)
      onChange(initialValues)
    },
    onError (error) {
      const newErrors = error?.graphQLErrors[0]?.extensions?.exception?.errors

      if (newErrors && Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
      } else if (error?.graphQLErrors[0]?.message) {
        const errorMsg = error?.graphQLErrors[0].message.split(':')
        setErrors([errorMsg[1]])
      }
    },
    variables: values
  })

  function loginCallback () {
    login()
  }

  return (
    <div className='form-container'>
      <Form onSubmit={onFormSubmit} noValidate>
        <h1>Login</h1>
        <Form.Input
          name='username'
          placeholder='Enter your username...'
          label='Username'
          type='text'
          value={values.username}
          onChange={onChange}
          error={!!errors?.username}
        />
        <Form.Input
          name='password'
          label='Password'
          placeholder='Type your password...'
          type='password'
          value={values.password}
          onChange={onChange}
          error={!!errors?.password}
        />
        <Button type='submit' disabled={loading} color='teal' primary>
          LogIn
        </Button>
      </Form>
      {errors && (
        <div className='ui error message'>
          <ul className='list'>
            {(Object.values(errors) || []).map(errorMsg => <li key={errorMsg}>{errorMsg}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
})

const LOGIN = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login(username: $username, password: $password) {
      id
      email
      username 
      token
    }
  }
`

Login.propTypes = {
  history: PropTypes.object
}

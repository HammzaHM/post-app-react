import React, { useContext, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import PropTypes from 'prop-types'
import { Button, Form } from 'semantic-ui-react'
import { useForm } from '../utils'
import { AuthContext } from '../contexts/auth'

const initialValues = {
  password: '',
  confirmPassword: '',
  username: '',
  email: ''
}

export const Register = React.memo((props) => {
  const [errors, setErrors] = useState(null)
  const context = useContext(AuthContext)

  const { onChange, onFormSubmit, values } = useForm(registerUser, initialValues)

  const [addUser, { loading }] = useMutation(REGISTER, {
    update (_, { data: { register: userData } }) {
      props.history.push('/')
      context.login(userData)
      onChange(initialValues)
    },
    onError (error) {
      const newErrors = error?.graphQLErrors[0]?.extensions?.exception?.errors
      if (newErrors && Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
      }
    },
    variables: values
  })

  function registerUser () {
    addUser()
  }

  return (
    <div className='form-container'>
      <Form onSubmit={onFormSubmit} noValidate>
        <h1>Register</h1>
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
          name='email'
          placeholder='Enter your email...'
          label='Enter your email'
          type='text'
          value={values.email}
          onChange={onChange}
          error={!!errors?.email}
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
        <Form.Input
          name='confirmPassword'
          placeholder='Confirm your password...'
          label='Confirm Password'
          type='password'
          value={values.confirmPassword}
          onChange={onChange}
          error={!!errors?.confirmPassword}
        />
        <Button type='submit' disabled={loading} color='teal' primary>
          Submit
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

const REGISTER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
     registerInput: {
       username: $username
       email: $email
       password: $password,
       confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username 
      token
      createdAt
    }
  }
`

Register.propTypes = {
  history: PropTypes.object
}

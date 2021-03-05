import { gql, useMutation } from '@apollo/client'
import React from 'react'
import { Button, Form } from 'semantic-ui-react'

import { useForm, GET_POSTS_QUERY } from '../utils'

export const PostForm = () => {
  try {
    const createPostCallback = () => {
      createPost()
    }

    const { onFormSubmit, onChange, values } = useForm(createPostCallback, {
      body: ''
    })

    const [createPost, { error }] = useMutation(CREATE_POST, {
      variables: values,
      update (proxy, result) {
        const data = proxy.readQuery({
          query: GET_POSTS_QUERY
        })

        const newData = { ...data }
        newData.getPosts = { ...newData.getPosts, [data.getPosts]: result.data.createPost }

        proxy.writeQuery({ query: GET_POSTS_QUERY, data: newData })

        values.body = ''
      },
      awaitRefetchQueries: true
    })

    if (error) {
      console.log(error)
    }

    return (
      <>
        <Form onSubmit={onFormSubmit}>
          <h2>Craete a post: </h2>
          <Form.Input
            placeholder='Hi World!'
            name='body'
            onChange={onChange}
            value={values.body}
            error={!!error}
          />
          <Button type='submit' color='teal'>
            Create Post
          </Button>
        </Form>
        {
        error && (
          <div className='ui error message'>
            <ul className='list'>
              <li>{error.graphQLErrors[0].message}</li>
            </ul>
          </div>
        )
    }
      </>
    )
  } catch (err) {
    console.error(err)
  }
}

const CREATE_POST = gql`
    mutation createPost($body: String!) {
        createPost(body: $body) {
            id
            username
            body
            createdAt
            likes {
                id username createdAt
            }
            comments {
                id 
                body
                username 
                createdAt
            }
            likeCount
            commentCount
        }
    }
`

import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Grid, Transition } from 'semantic-ui-react'

import { PostCard, PostForm } from '../components'
import { AuthContext } from '../contexts/auth'
import { GET_POSTS_QUERY } from '../utils'

export function Home () {
  const { data, loading, error } = useQuery(GET_POSTS_QUERY, { fetchPolicy: 'cache-first' })

  const { user } = useContext(AuthContext)

  if (error) {
    return null
  }

  if (loading) {
    return <h1>loading....</h1>
  }

  const posts = data.getPosts

  return (
    <Grid columns={3}>
      <Grid.Row className='page-title'>
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {
        loading
          ? (<h1>loading...</h1>)
          : (
            <Transition.Group duration={1200}>
              {posts && posts.map(post =>
                (
                  <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                    <PostCard post={post} />
                  </Grid.Column>
                )
              )}
            </Transition.Group>
            )
        }
      </Grid.Row>
    </Grid>
  )
}

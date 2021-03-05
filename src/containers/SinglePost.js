import React, { useContext, useRef, useState } from 'react'
import { any } from 'prop-types'
import { gql, useMutation, useQuery } from '@apollo/client'
import { formatDistanceToNow } from 'date-fns'
import moment from 'moment'
import { Button, Card, Form, Grid, Icon, Image, Label, Popup } from 'semantic-ui-react'

import LikeButton from '../components/LikeButton'
import { AuthContext } from '../contexts/auth'
import DeleteButton from '../components/DeleteButton'

export const SinglePost = ({ match, history }) => {
  const { postId } = match?.params
  const [comment, setComment] = useState('')
  const commentInputRef = useRef(null)

  const { data, loading } = useQuery(FETCH_POST_QUERY, {
    variables: { postId }
  })

  const { user } = useContext(AuthContext)

  const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
    variables: {
      postId,
      body: comment
    },
    update () {
      setComment('')
      if (typeof commentInputRef.current.blur === 'function') {
        commentInputRef.current.blur()
      }
    },
    refetchQueries: [{ query: FETCH_POST_QUERY, variables: { postId } }],
    awaitRefetchQueries: true
  })

  let postMarkUp = <div />

  function deletePostCallback () {
    history?.push('/')
  }

  function onCommentInputChange (event) {
    event.preventDefault()
    setComment(event.target.value)
  }

  if (!data?.getPost && loading) {
    postMarkUp = <p>Loading...</p>
  } else {
    const {
      id,
      body,
      createdAt,
      likeCount,
      likes,
      commentCount,
      username,
      comments
    } = data.getPost

    postMarkUp = (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Image
              floated='right'
              size='mini'
              src='https://react.semantic-ui.com/images/avatar/large/molly.png'
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <Popup
                  content='Like this post'
                  trigger={<LikeButton user={user} post={{ id, likes, likeCount }} />}
                />
                <Popup
                  content='Comment a Post'
                  trigger={
                    <Button as='div' labelPosition='right'>
                      <Button color='blue' basic>
                        <Icon name='comments' />
                      </Button>
                      <Label basic color='blue' pointing='left'>
                        {commentCount}
                      </Label>
                    </Button>
                 }
                />
                {user?.username && username === user.username && (
                  <DeleteButton postId={id} callBack={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>post a comment</p>
                  <Form>
                    <div className='ui action input fluid'>
                      <input
                        type='text'
                        placeholder='comment...'
                        name='comment'
                        value={comment}
                        onChange={onCommentInputChange}
                        style={{ marginRight: 20 }}
                        ref={commentInputRef}
                      />
                      <button
                        type='submit'
                        className='ui button teal'
                        disabled={!comment}
                        onClick={createComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map(({ id, body, createdAt, username }) =>
              <Card fluid key={id}>
                <Card.Content>
                  {(user && user.username) === username && (
                    <DeleteButton postId={postId} commentId={id} />
                  )}
                  <Card.Header>{username}</Card.Header>
                  <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                  <Card.Description>{body}</Card.Description>
                </Card.Content>
              </Card>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  return postMarkUp
}

const FETCH_POST_QUERY = gql`
    query getPost($postId: ID!) {
        getPost(postId: $postId) {
            id
            body
            createdAt
            likeCount
            username
            likes {
                username
            }
            commentCount
            comments {
                id  
                username
                body
                createdAt
            }
        }
    }
`

const CREATE_COMMENT_MUTATION = gql`
  mutation createCommet($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id body username createdAt
      }
      commentCount
    }
  } 
`

SinglePost.propTypes = {
  match: any
}

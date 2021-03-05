import React, { useEffect, useState } from 'react'
import { objectOf, string, number, object, instanceOf } from 'prop-types'
import { Button, Icon, Label, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { gql, useMutation } from '@apollo/client'

const LikeButton = ({ post, user = null }) => {
  if (!(post?.id)) {
    return null
  }
  const { likeCount, likes, id: postId } = post

  const [liked, setLiked] = useState(false)

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId }
  })

  function onLikeClick () {
    likePost()
  }

  useEffect(() => {
    if (user && likes.findIndex(like => like.username === user.username) !== -1) {
      setLiked(true)
    } else setLiked(false)
  }, [likes, user])

  const likeButton = user
    ? liked
        ? (
          <Button color='teal'>
            <Icon name='heart' />
          </Button>
          )
        : (
          <Button color='teal' basic>
            <Icon name='heart' />
          </Button>
          )
    : (
      <Button as={Link} color='teal' basic to='/login'>
        <Icon name='heart' />
      </Button>
      )

  return (
    <Button as='div' labelPosition='right' onClick={onLikeClick}>
      <Popup
        content={!liked ? 'Like a post' : 'Unlike'}
        trigger={likeButton}
        inverted
      />
      <Label as='a' basic color='teal' pointing='left'>
        {likeCount}
      </Label>
    </Button>
  )
}

LikeButton.propTypes = {
  post: objectOf({
    id: string,
    likes: instanceOf(Array),
    likeCount: number
  }).isRequired,
  user: object
}

const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!) {
        likePost(postId: $postId) {
            id
            likes{
                id
                username
            }
            likeCount
        }
    }
`

export default LikeButton

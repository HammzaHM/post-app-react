
import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Card, Image, Icon, Label, Button, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { AuthContext } from '../contexts/auth'
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'

export const PostCard = ({ post, history }) => {
  if (!post) {
    return null
  }

  const { user } = useContext(AuthContext)

  const { username, likeCount, id, createdAt, body, commentCount, likes } = post

  function onCommentPress () {
    console.log('Comment press')
  }

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
          as={Link}
          to={`/posts/${id}`}
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow()}</Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <Popup
          inverted
          content='Comment on Post'
          trigger={
            <Button labelPosition='right' onClick={onCommentPress} as={Link} to={`/posts/${id}`}>
              <Button color='teal' basic>
                <Icon name='comment' />
              </Button>
              <Label as='a' basic color='teal' pointing='left'>
                {commentCount}
              </Label>
            </Button>
        }
        />
        {user?.username && user.username === username && (
          <DeleteButton postId={id} />
        )}
      </Card.Content>
    </Card>
  )
}

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

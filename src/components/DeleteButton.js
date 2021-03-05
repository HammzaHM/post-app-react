import React, { useState } from 'react'
import { string, func } from 'prop-types'
import { Button, Icon, Confirm, Popup } from 'semantic-ui-react'
import { gql, useMutation } from '@apollo/client'

import { GET_POSTS_QUERY } from '../utils'

const DeleteButton = ({ postId, callBack, commentId }) => {
  const [confirmDeletePost, setConfirmDeletePost] = useState(false)

  if (!postId) {
    return null
  }

  let mutation = DELETE_POST_MUTATION
  const variables = { postId }

  if (commentId) {
    variables.commentId = commentId
    mutation = DELETE_COMMENT_MUTATION
  }

  const [deleteMethod] = useMutation(mutation, {
    variables,
    update (proxy) {
      setConfirmDeletePost(false)
      if (!commentId) {
        const data = proxy.readQuery({
          query: GET_POSTS_QUERY
        })
        const newData = { ...data }

        newData.getPosts = { ...newData.getPosts.filter(p => p.id !== postId) }

        proxy.writeQuery({ query: GET_POSTS_QUERY, data: newData })
      }

      if (typeof callBack === 'function') callBack()
    },
    awaitRefetchQueries: true
  })

  function onTrashClick () {
    setConfirmDeletePost(true)
  }

  function onCancelClicked () {
    setConfirmDeletePost(false)
  }

  function onConfirmClicked () {
    deleteMethod()
  }

  return (
    <>
      <Popup
        content={'delete a ' + (commentId ? 'comment' : 'post')}
        trigger={
          <Button
            as='div'
            color='red'
            onClick={onTrashClick}
            floated='right'
          >
            <Icon name='trash' style={{ margin: 0, padding: 0 }} />
          </Button>
        }
      />
      <Confirm open={confirmDeletePost} onConfirm={onConfirmClicked} onCancel={onCancelClicked} />
    </>
  )
}

DeleteButton.propTypes = {
  postId: string.isRequired,
  commentId: string,
  callBack: func
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!) {
        deletePost(postId: $postId)
    }
`

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($commentId: ID!, $postId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id username createdAt body
      }
      commentCount
    }
  }
`

export default DeleteButton

import { gql } from '@apollo/client'

export const GET_POSTS_QUERY = gql`
  {
    getPosts {
      id
      username
      body
      createdAt
      likeCount
      commentCount
      likes {
        id
        username
      }
      comments {
        id
        username
        createdAt
        body
      }
      __typename
    }
  }
`

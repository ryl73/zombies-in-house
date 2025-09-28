import React from 'react'
import { Box, Typography, Divider, Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Comment } from '../../types/types'

const useStyles = makeStyles(theme => ({
  comment: {
    marginBottom: theme.spacing(3),
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    backgroundColor: theme.palette.primary.light,
    marginRight: theme.spacing(2),
  },
  commentHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  commentContent: {
    marginLeft: 56,
  },
  topDivider: {
    marginBottom: 24,
  },
  commentDivider: {
    marginTop: 16,
  },
}))

interface CommentListProps {
  comments: Comment[]
}

export const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  const classes = useStyles()

  if (comments.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="body1" color="textSecondary">
          Пока нет комментариев. Будьте первым!
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="textPrimary">
        Комментарии ({comments.length})
      </Typography>
      <Divider className={classes.topDivider} />

      {comments.map((comment, index) => (
        <Box key={comment.id} className={classes.comment}>
          <Box className={classes.commentHeader}>
            <Avatar className={classes.avatar}>
              {comment.author.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" color="textPrimary">
                {comment.author}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {comment.createdAt.toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="body1"
            color="textPrimary"
            className={classes.commentContent}>
            {comment.content}
          </Typography>
          {index < comments.length - 1 && (
            <Divider className={classes.commentDivider} />
          )}
        </Box>
      ))}
    </Box>
  )
}

import React from 'react'
import { Box, Typography, Divider, Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Comment } from '../../types/forum'
import { ReactionDisplay } from './ReactionDisplay'
import { EmojiPicker } from './EmojiPicker'
import { useCommentReactions } from '../../hooks/useCommentReactions'

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
    marginLeft: theme.spacing(6),
  },
  topDivider: {
    marginBottom: theme.spacing(3),
  },
  commentDivider: {
    marginTop: theme.spacing(2),
  },
  reactionSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(6),
  },
  errorText: {
    color: theme.palette.error.main,
    fontSize: '0.75rem',
    marginTop: theme.spacing(0.5),
  },
}))

interface CommentListProps {
  comments: Comment[]
  currentUser: string
}

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  currentUser,
}) => {
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
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUser={currentUser}
          showDivider={index < comments.length - 1}
        />
      ))}
    </Box>
  )
}

interface CommentItemProps {
  comment: Comment
  currentUser: string
  showDivider: boolean
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUser,
  showDivider,
}) => {
  const classes = useStyles()

  const { reactions, userReactions, error, handleReactionClick } =
    useCommentReactions({
      commentId: comment.id,
      currentUser,
      initialReactions: comment.reactions || {},
    })

  return (
    <Box className={classes.comment}>
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
      <Box className={classes.reactionSection}>
        <Box display="flex" alignItems="center">
          <EmojiPicker onEmojiSelect={handleReactionClick} />
        </Box>
        <Box display="flex" flexDirection="column">
          <ReactionDisplay
            reactions={reactions}
            userReactions={userReactions}
            onReactionClick={handleReactionClick}
          />
          {error && (
            <Typography className={classes.errorText}>{error}</Typography>
          )}
        </Box>
      </Box>

      {showDivider && <Divider className={classes.commentDivider} />}
    </Box>
  )
}

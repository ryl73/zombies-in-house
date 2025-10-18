import React, { useState } from 'react'
import {
  Box,
  Typography,
  Divider,
  Avatar,
  CircularProgress,
  IconButton,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Comment } from '../../types/forum'
import { ReactionDisplay } from './ReactionDisplay'
import { EmojiPicker } from './EmojiPicker'
import { useCommentReactions } from '../../hooks/useCommentReactions'
import { useAppSelector } from '../../hooks/useApp'
import { selectUser } from '../../slices/userSlice'
import { forumAPI } from '../../api/forumAPI'
import { CommentMenu } from './CommentMenu'
import { EditCommentDialog } from './EditCommentDialog'
import { MoreVert } from '@material-ui/icons'

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
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
  authorInfo: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  commentContent: {
    marginLeft: theme.spacing(6),
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
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
  onCommentUpdate?: (commentId: string, newMessage: string) => void
  onCommentDelete?: (commentId: string) => void
}

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  onCommentUpdate,
  onCommentDelete,
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
          showDivider={index < comments.length - 1}
          onCommentUpdate={onCommentUpdate}
          onCommentDelete={onCommentDelete}
        />
      ))}
    </Box>
  )
}

interface CommentItemProps {
  comment: Comment
  showDivider: boolean
  onCommentUpdate?: (commentId: string, newMessage: string) => void
  onCommentDelete?: (commentId: string) => void
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  showDivider,
  onCommentUpdate,
  onCommentDelete,
}) => {
  const classes = useStyles()
  const currentUser = useAppSelector(selectUser)

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editMessage, setEditMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { reactions, error, loading, handleReactionClick } =
    useCommentReactions({
      commentId: comment.id,
    })

  const isCommentAuthor = currentUser?.login === comment.authorLogin

  const handleEditComment = async () => {
    setIsEditing(true)
    try {
      const response = await forumAPI.updateComment(comment.id, editMessage)

      if (response.success && response.data) {
        setEditDialogOpen(false)
        setMenuAnchor(null)
        if (onCommentUpdate) {
          onCommentUpdate(comment.id, editMessage)
        }
      }
    } catch (error) {
      console.error('Ошибка при редактировании комментария:', error)
    } finally {
      setIsEditing(false)
    }
  }

  const handleDeleteComment = async () => {
    setIsDeleting(true)
    try {
      const response = await forumAPI.deleteComment(comment.id)

      if (response.success) {
        setMenuAnchor(null)
        if (onCommentDelete) {
          onCommentDelete(comment.id)
        }
      }
    } catch (error) {
      console.error('Ошибка при удалении комментария:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleOpenEditDialog = () => {
    setEditMessage(comment.message)
    setEditDialogOpen(true)
    setMenuAnchor(null)
  }

  return (
    <Box className={classes.comment}>
      <Box className={classes.commentHeader}>
        <Box className={classes.authorInfo}>
          <Avatar
            className={classes.avatar}
            src={`https://ya-praktikum.tech/api/v2/resources${comment.authorAvatar}`}>
            {comment.authorLogin?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" color="textPrimary">
              {comment.authorLogin}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {new Date(comment.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        {isCommentAuthor && (
          <>
            <IconButton
              size="small"
              onClick={e => setMenuAnchor(e.currentTarget)}
              aria-label="Действия с комментарием">
              <MoreVert color="secondary" />
            </IconButton>

            <CommentMenu
              anchorEl={menuAnchor}
              isDeleting={isDeleting}
              onClose={() => setMenuAnchor(null)}
              onEdit={handleOpenEditDialog}
              onDelete={handleDeleteComment}
            />
          </>
        )}
      </Box>

      <Typography
        variant="body1"
        color="textPrimary"
        className={classes.commentContent}>
        {comment.message}
      </Typography>

      <Box className={classes.reactionSection}>
        <Box display="flex" alignItems="center">
          {loading && <CircularProgress size={16} style={{ marginRight: 8 }} />}
          <EmojiPicker onEmojiSelect={handleReactionClick} disabled={loading} />
        </Box>
        <Box display="flex" flexDirection="column">
          <ReactionDisplay
            reactions={reactions}
            onReactionClick={handleReactionClick}
            disabled={loading}
          />
          {error && (
            <Typography className={classes.errorText}>{error}</Typography>
          )}
        </Box>
      </Box>

      <EditCommentDialog
        open={editDialogOpen}
        message={editMessage}
        isEditing={isEditing}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleEditComment}
        onMessageChange={setEditMessage}
      />

      {showDivider && <Divider className={classes.commentDivider} />}
    </Box>
  )
}

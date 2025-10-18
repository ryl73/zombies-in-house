import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, Typography, Box, Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { Comment as CommentIcon } from '@material-ui/icons'
import { Topic } from '../../types/forum'

const useStyles = makeStyles(theme => ({
  card: {
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
    },
  },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    backgroundColor: theme.palette.primary.light,
    marginRight: theme.spacing(1),
  },
  contentPreview: {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  commentIcon: {
    marginRight: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
  },
}))

interface TopicItemProps {
  topic: Topic
  isContent?: boolean
  commentsCount?: number
}

export const TopicItem: React.FC<TopicItemProps> = ({
  topic,
  isContent = true,
  commentsCount,
}) => {
  const classes = useStyles()

  return (
    <Card className={classes.card}>
      <Link
        to={`/forum/topic/${topic.id}`}
        className={classes.link}
        data-testid="topic-link">
        <CardContent>
          <Box display="flex" flexDirection="row" alignItems="center" mb={1}>
            <Avatar
              className={classes.avatar}
              src={`https://ya-praktikum.tech/api/v2/resources${topic.authorAvatar}`}></Avatar>
            <Typography variant="caption" color="textSecondary">
              {topic.authorLogin}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="h6">{topic.title}</Typography>
          </Box>
          {isContent !== false && (
            <Typography
              variant="body1"
              color="textSecondary"
              paragraph
              className={classes.contentPreview}>
              {topic.description}
            </Typography>
          )}
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <Typography variant="caption" color="textSecondary">
              {new Date(topic.createdAt).toLocaleDateString()}
            </Typography>
            <CommentIcon fontSize="small" className={classes.commentIcon} />
            <Typography variant="caption" color="textSecondary">
              {commentsCount !== undefined ? commentsCount : '...'}
            </Typography>
          </Box>
        </CardContent>
      </Link>
    </Card>
  )
}

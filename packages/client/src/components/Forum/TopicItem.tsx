import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, Typography, Box, Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { Comment as CommentIcon } from '@material-ui/icons'
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
}))

export interface Topic {
  id: number
  title: string
  content: string
  author: string
  createdAt: Date
  commentsCount: number
}

interface TopicItemProps {
  topic: Topic
  onClick?: () => void
  isContent?: boolean
}

export const TopicItem: React.FC<TopicItemProps> = ({
  topic,
  onClick,
  isContent = true,
}) => {
  const classes = useStyles()

  return (
    <Card className={classes.card}>
      <Link to={`/forum/topic/${topic.id}`} className={classes.link}>
        <CardContent onClick={onClick}>
          <Box display="flex" flexDirection="row" alignItems="center" mb={1}>
            <Avatar className={classes.avatar}>
              {topic.author.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="caption" color="textSecondary">
              {topic.author}
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
              {topic.content}
            </Typography>
          )}
          <Box display="flex" justifyContent="flex-start" alignItems="center">
            <Typography variant="caption" color="textSecondary">
              {topic.createdAt.toLocaleDateString()}
            </Typography>
            <CommentIcon
              fontSize="small"
              style={{ marginRight: 4, marginLeft: 8 }}
            />
            <Typography variant="caption" color="textSecondary">
              {topic.commentsCount}
            </Typography>
          </Box>
        </CardContent>
      </Link>
    </Card>
  )
}

export const mockTopics: Topic[] = [
  {
    id: 1,
    title: 'Тактика за Бегуна (Зеленый) vs Тактика за Снайпера (Красный)',
    content:
      'Мы с другом постоянно спорим, за кого эффективнее играть. Я говорю, что скорость Зеленого бесценна для разведки. Он утверждает, что способность Красного убирать зомби с дальней дистанции спасает команду. Что вы думаете? Как вам кажется, чья способность чаще приносит победу?',
    author: 'ryl73',
    createdAt: new Date(2024, 0, 15),
    commentsCount: 4,
  },
  {
    id: 2,
    title: 'Паника! На кубике выпала 4. Все пропало?',
    content:
      'Только что проиграли партию из-за злосчастной четверки на кубике в самый неподходящий момент. Активировались ВСЕ зомби на поле, и нас просто сомнули у самого выхода. Как вы минимизируете риски выпадения четверки? Может, есть карты, которые могут это как-то заблокировать?',
    author: 'andreissh',
    createdAt: new Date(2024, 0, 16),
    commentsCount: 3,
  },
  {
    id: 3,
    title: 'Карта "Сгоряча" — самая переоцененная или самая полезная?',
    content:
      'Вчера был жаркий спор. Я считаю, что карта "Сгоряча" (два движения за один ход) — это must-have для доставки тотема к выходу в финале. Друг говорит, что она бесполезна и лучше взять любое оружие. Кто прав? Как вы используете эту карту?',
    author: 'cyperus-papyrus',
    createdAt: new Date(2024, 0, 17),
    commentsCount: 5,
  },
  {
    id: 4,
    title: 'Раскидаться или сгруппироваться? Стратегия первых ходов.',
    content:
      'После стартового размещения зомби мы всегда стоим перед выбором: бежать всем в одну сторону или раскидаться по углам для быстрого поиска выхода и тотема? В первом случае мы медленные, но безопасные. Во втором — нас быстро изолируют и выводят поодиночке. Какой ваш проверенный план?',
    author: 'MarsiKris76',
    createdAt: new Date(2024, 0, 18),
    commentsCount: 2,
  },
]

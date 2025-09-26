import React from 'react'
import { Box, Typography, Divider, Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

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
}))

export interface Comment {
  id: number
  author: string
  content: string
  createdAt: Date
}

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
      <Divider style={{ marginBottom: 24 }} />

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
            style={{ marginLeft: 56 }}>
            {comment.content}
          </Typography>
          {index < comments.length - 1 && <Divider style={{ marginTop: 16 }} />}
        </Box>
      ))}
    </Box>
  )
}

export const mockComments: Record<number, Comment[]> = {
  1: [
    {
      id: 1,
      author: 'andreissh',
      content:
        'Всё зависит от состава игроков! Зеленый (Бегун) — это скаут. Его задача — нестись вперёд, заглядывать в комнаты и кричать, если нашёл выход. А Красный (Снайпер) — это телохранитель. Он должен прикрывать спину тому, кто понесёт тотем. Идеально, когда они в одной команде!',
      createdAt: new Date(2024, 0, 15, 10, 30),
    },
    {
      id: 2,
      author: 'cyperus-papyrus',
      content:
        'Я как раз чаще играю за Снайпера. Его способность не просто убирает одного зомби. Она позволяет контролировать пространство! Например, я могу специально оставить одного зомби в коридоре, чтобы он блокировал путь для других, и при необходимости убрать его действием с другой комнаты. Это стратегически мощнее, чем просто быстрее бежать.',
      createdAt: new Date(2024, 0, 15, 12, 15),
    },
    {
      id: 3,
      author: 'MarsiKris76',
      content:
        'А вы пробовали комбо? Бегун находит выход, кричит. Снайпер в это время очищает путь к нему. Желтый (Психолог) успокаивает паникёра, который будет тащить тотем, а Синий (Умник) ищет нужную карту. Без слаженной работы способности сами по себе не побеждают.',
      createdAt: new Date(2024, 0, 15, 14, 45),
    },
    {
      id: 4,
      author: 'ryl73',
      content:
        'Классная мысль насчёт контроля пространства за Снайпера, cyperus-papyrus! Не думал об этом. Надо будет попробовать такую тактику в следующий раз, а не просто стрелять по первому попавшемуся.',
      createdAt: new Date(2024, 0, 15, 16, 20),
    },
  ],
  2: [
    {
      id: 5,
      author: 'cyperus-papyrus',
      content:
        'Всё не пропало! Главное — не паниковать. Да, это неприятно, но если вы не скучились в одной комнате, волна зомби тоже распределится. В этот момент важно использовать карты, которые позволяют переложить фишки шума. Например, "Крик" или "Громкий шорох". Отправьте зомби в пустующую комнату!',
      createdAt: new Date(2024, 0, 16, 9, 20),
    },
    {
      id: 6,
      author: 'MarsiKris76',
      content:
        'Ещё один лайфхак: если чувствуете, что на поле много зомби и вот-вот может выпасть 4, постарайтесь все оказаться в комнатах с одним входом. Тогда атаковать вас будет неоткуда, и активация затронет только зомби снаружи. Вы будете в ловушке, но живы.',
      createdAt: new Date(2024, 0, 16, 11, 5),
    },
    {
      id: 7,
      author: 'ryl73',
      content:
        'А карты, блокирующие кубик, — это редкая находка. "Удача" или "Предчувствие". Их надо нести до самого конца игры и держать на такого рода чёрный день. Я обычно отдаю их самому осторожному игроку, который реже всего рискует.',
      createdAt: new Date(2024, 0, 16, 13, 50),
    },
  ],
  3: [
    {
      id: 8,
      author: 'andreissh',
      content:
        'Однозначно полезная! Но не для всех. Отдайте её Бегуну (Зеленому) или тому, кто понесёт тотем. Представьте: выстоять с тотемом в центре комнаты с зомби, а потом за один ход сделать два шага и выскочить в дверь. Это победа! В руках же Синего (Умника) эта карта бесполезна, ему лучше искать другие.',
      createdAt: new Date(2024, 0, 17, 8, 45),
    },
    {
      id: 9,
      author: 'MarsiKris76',
      content:
        'Вот именно! Всё про контекст. "Сгоряча" — это не карта для поиска, это карта для побега. Её ценность возрастает в разы к концу игры. В начале же действительно лучше взять "Пистолет" или "Аптечку".',
      createdAt: new Date(2024, 0, 17, 10, 20),
    },
    {
      id: 10,
      author: 'cyperus-papyrus',
      content:
        'Я с вами не соглашусь, парни. Для меня "Сгоряча" — карта спасения. Если на Жёлтого (Паникёра) напали, и он вот-вот сбросит тотем, я могу как Красный с помощью этой карты за один ход прибежать к нему из дальнего угла и прикрыть выстрелом. Это не про побег, это про оперативную поддержку. Она универсальна.',
      createdAt: new Date(2024, 0, 17, 12, 30),
    },
    {
      id: 11,
      author: 'ryl73',
      content:
        'Andreissh, твой пример с выходом с тотемом — это гениально. Мы так не пробовали, всегда пытались отстреливаться. Надо будет сделать финальный рывок в следующей игре!',
      createdAt: new Date(2024, 0, 17, 14, 15),
    },
    {
      id: 12,
      author: 'andreissh',
      content:
        'Cyperus-papyrus, хороший контраргумент! Действительно, можно использовать для экстренной помощи. Значит, карта ещё круче, чем я думал.',
      createdAt: new Date(2024, 0, 17, 16, 40),
    },
  ],
  4: [
    {
      id: 13,
      author: 'cyperus-papyrus',
      content:
        'Наш золотой стандарт — держаться группами по 2 человека. Одиночку зомби быстро загрызут, а большой толпой двигаться неэффективно. Два человека могут помочь друг другу картами, и если на одного нападут, второй сможет его спасти.',
      createdAt: new Date(2024, 0, 18, 9, 30),
    },
    {
      id: 14,
      author: 'ryl73',
      content:
        'Мы пробовали делить роли: например, я как Бегун один лезу в тёмную, чтобы проверить дальние комнаты, так как я быстрый. А остальные трое идут плотной группой, чтобы было к кому отступать. Сработало однажды, но это рискованно. Метод "пар" от cyperus-papyrus кажется надежнее.',
      createdAt: new Date(2024, 0, 18, 11, 15),
    },
  ],
}

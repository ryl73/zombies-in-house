import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'
import { Header } from '../components/Header/Header'
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  TableSortLabel,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { EmojiEvents } from '@material-ui/icons'
import { useState, useEffect } from 'react'
import {
  getAllLeaderboard,
  GetLeaderboardResponseData,
} from '../api/LeaderboardAPI'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
  },
  container: {
    paddingTop: '2rem',
  },
  description: {
    color: theme.palette.text.primary,
  },
  tableContainer: {
    marginTop: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  tableHeader: {
    backgroundColor: theme.palette.primary.main,
    '& th': {
      color: theme.palette.common.white,
      fontWeight: 'bold',
      fontSize: '1.1rem',
      borderBottom: 'none',
    },
  },
  tableCell: {
    color: theme.palette.text.secondary,
    borderBottom: `1px solid ${theme.palette.primary.dark}`,
  },
  firstPlace: {
    background:
      'linear-gradient(90deg, rgba(136, 51, 41, 0.25) 0%, transparent 100%)',
    '&:hover': {
      backgroundColor: 'rgba(136, 51, 41, 0.35)',
    },
  },
  secondPlace: {
    background:
      'linear-gradient(90deg, rgba(136, 51, 41, 0.18) 0%, transparent 100%)',
    '&:hover': {
      backgroundColor: 'rgba(136, 51, 41, 0.28)',
    },
  },
  thirdPlace: {
    background:
      'linear-gradient(90deg, rgba(136, 51, 41, 0.12) 0%, transparent 100%)',
    '&:hover': {
      backgroundColor: 'rgba(136, 51, 41, 0.22)',
    },
  },
  regularPlace: {
    '&:hover': {
      backgroundColor: 'rgba(53, 81, 85, 0.2)',
    },
  },
  rankCell: {
    fontWeight: 'bold',
    width: '60px',
    textAlign: 'center',
  },
  usernameCell: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    backgroundColor: theme.palette.primary.light,
  },
  goldMedal: {
    color: '#FFD700',
    fontSize: '2rem',
  },
  silverMedal: {
    color: '#C0C0C0',
    fontSize: '2rem',
  },
  bronzeMedal: {
    color: '#CD7F32',
    fontSize: '2rem',
  },
  numberIcon: {
    fontSize: '1.5rem',
    marginRight: theme.spacing(1),
    verticalAlign: 'middle',
  },
  sortLabel: {
    color: theme.palette.common.white + ' !important',
    '&:hover': {
      color: theme.palette.common.white + ' !important',
    },
    '&.MuiTableSortLabel-active': {
      color: theme.palette.common.white + ' !important',
    },
  },
}))

type SortField = 'completions' | 'zombiesKilled' | 'lootFound' | 'totalPoints'
type SortDirection = 'asc' | 'desc'

export const LeaderboardPage = () => {
  const classes = useStyles()
  const [sortField, setSortField] = useState<SortField>('totalPoints')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [leaderboardData, setLeaderboardData] = useState<
    GetLeaderboardResponseData[]
  >([])
  const [sortedData, setSortedData] = useState<GetLeaderboardResponseData[]>([])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const renderRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return (
          <Tooltip title="Первое место">
            <EmojiEvents className={classes.goldMedal} />
          </Tooltip>
        )
      case 1:
        return (
          <Tooltip title="Второе место">
            <EmojiEvents className={classes.silverMedal} />
          </Tooltip>
        )
      case 2:
        return (
          <Tooltip title="Третье место">
            <EmojiEvents className={classes.bronzeMedal} />
          </Tooltip>
        )
      default:
        return <span>{index + 1}</span>
    }
  }

  const getPlaceClass = (index: number): keyof ReturnType<typeof useStyles> => {
    if (index === 0) return 'firstPlace'
    if (index === 1) return 'secondPlace'
    if (index === 2) return 'thirdPlace'
    return 'regularPlace'
  }

  useEffect(() => {
    getAllLeaderboard({ limit: 10, cursor: 0 })
      .then(data => {
        setLeaderboardData(data)
      })
      .catch(e => {
        console.log(e)
      })
  }, [])

  useEffect(() => {
    const sorted = [...leaderboardData].sort((a, b) => {
      const aValue = a.data[sortField]
      const bValue = b.data[sortField]

      if (sortDirection === 'asc') {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })

    setSortedData(sorted)
  }, [leaderboardData, sortField, sortDirection])

  return (
    <Box className={classes.root}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Лидерборд</title>
        <meta name="description" content="Таблица лидеров Зомби в доме" />
      </Helmet>

      <Header />

      <Container maxWidth="lg" className={classes.container}>
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          Таблица лидеров
        </Typography>

        <Typography
          variant="body1"
          align="center"
          className={classes.description}
          paragraph>
          Рейтинг игроков по результатам прохождения Зомби в доме
        </Typography>

        <TableContainer
          component={Paper}
          className={classes.tableContainer}
          elevation={3}
          style={{ overflow: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow className={classes.tableHeader}>
                <TableCell className={classes.rankCell}>Место</TableCell>
                <TableCell>Игрок</TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    className={classes.sortLabel}
                    active={sortField === 'totalPoints'}
                    direction={sortDirection}
                    onClick={() => handleSort('totalPoints')}>
                    Всего очков
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    className={classes.sortLabel}
                    active={sortField === 'completions'}
                    direction={sortDirection}
                    onClick={() => handleSort('completions')}>
                    Прохождения
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    className={classes.sortLabel}
                    active={sortField === 'zombiesKilled'}
                    direction={sortDirection}
                    onClick={() => handleSort('zombiesKilled')}>
                    Убито зомби
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    className={classes.sortLabel}
                    active={sortField === 'lootFound'}
                    direction={sortDirection}
                    onClick={() => handleSort('lootFound')}>
                    Найдено лута
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((row, index) => (
                <TableRow
                  key={row.data.login}
                  className={classes[getPlaceClass(index)]}>
                  <TableCell
                    className={`${classes.tableCell} ${classes.rankCell}`}
                    component="th"
                    scope="row">
                    {renderRankIcon(index)}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <div className={classes.usernameCell}>{row.data.login}</div>
                  </TableCell>
                  <TableCell className={classes.tableCell} align="right">
                    {row.data.totalPoints}
                  </TableCell>
                  <TableCell className={classes.tableCell} align="right">
                    {row.data.completions}
                  </TableCell>
                  <TableCell className={classes.tableCell} align="right">
                    {row.data.zombiesKilled}
                  </TableCell>
                  <TableCell className={classes.tableCell} align="right">
                    {row.data.lootFound}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  )
}

export const initLeaderboardPage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}

import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'
import { Header } from '../components/Header'
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
import { useState, useMemo } from 'react'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
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
    color: theme.palette.text.primary,
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

interface LeaderboardEntry {
  username: string
  completions: number
  zombiesKilled: number
  lootFound: number
}

type SortField = 'completions' | 'zombiesKilled' | 'lootFound'
type SortDirection = 'asc' | 'desc'

const mockData: LeaderboardEntry[] = [
  {
    username: 'ryl73',
    completions: 15,
    zombiesKilled: 287,
    lootFound: 72,
  },
  {
    username: 'andreissh',
    completions: 12,
    zombiesKilled: 154,
    lootFound: 103,
  },
  {
    username: 'cyperus-papyrus',
    completions: 9,
    zombiesKilled: 221,
    lootFound: 58,
  },
  {
    username: 'MarsiKris76',
    completions: 7,
    zombiesKilled: 193,
    lootFound: 91,
  },
  {
    username: 'testuser',
    completions: 1,
    zombiesKilled: 5,
    lootFound: 2,
  },
  {
    username: 'testuser2',
    completions: 0,
    zombiesKilled: 0,
    lootFound: 0,
  },
]

export const LeaderboardPage = () => {
  const classes = useStyles()
  const [sortField, setSortField] = useState<SortField>('completions')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedData = useMemo(() => {
    return [...mockData].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (sortDirection === 'asc') {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })
  }, [sortField, sortDirection])

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

  return (
    <Box className={classes.root}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Лидерборд</title>
        <meta name="description" content="Таблица лидеров Зомби в доме" />
      </Helmet>

      <Header />

      <Container maxWidth="lg" style={{ paddingTop: '2rem' }}>
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          Таблица лидеров
        </Typography>

        <Typography
          variant="body1"
          align="center"
          color="textSecondary"
          paragraph>
          Рейтинг игроков по результатам прохождения Зомби в доме
        </Typography>

        <TableContainer
          component={Paper}
          className={classes.tableContainer}
          elevation={3}>
          <Table>
            <TableHead>
              <TableRow className={classes.tableHeader}>
                <TableCell className={classes.rankCell}>Место</TableCell>
                <TableCell>Игрок</TableCell>
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
                  key={row.username}
                  className={
                    index === 0
                      ? classes.firstPlace
                      : index === 1
                      ? classes.secondPlace
                      : index === 2
                      ? classes.thirdPlace
                      : classes.regularPlace
                  }>
                  <TableCell
                    className={`${classes.tableCell} ${classes.rankCell}`}
                    component="th"
                    scope="row">
                    {renderRankIcon(index)}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <div className={classes.usernameCell}>{row.username}</div>
                  </TableCell>
                  <TableCell className={classes.tableCell} align="right">
                    {row.completions}
                  </TableCell>
                  <TableCell className={classes.tableCell} align="right">
                    {row.zombiesKilled}
                  </TableCell>
                  <TableCell className={classes.tableCell} align="right">
                    {row.lootFound}
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

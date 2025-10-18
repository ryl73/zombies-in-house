import React from 'react'
import { Box, Button, Typography } from '@material-ui/core'
import {
  ChevronLeft,
  ChevronRight,
  FirstPage,
  LastPage,
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { PaginationInfo } from '../../types/forum'

const useStyles = makeStyles(theme => ({
  paginationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(4),
    flexWrap: 'wrap',
    gap: theme.spacing(2),
  },
  paginationControls: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  paginationInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  pageSizeSelect: {
    minWidth: '120px',
  },
  pageButton: {
    minWidth: '40px',
  },
}))

interface ForumPaginationProps {
  pagination: PaginationInfo
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
}

export const ForumPagination: React.FC<ForumPaginationProps> = ({
  pagination,
  currentPage,
  onPageChange,
}) => {
  const classes = useStyles()

  const getPageNumbers = () => {
    const totalPages = pagination.pageCount
    const current = currentPage
    const delta = 2
    const range = []

    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(totalPages - 1, current + delta);
      i++
    ) {
      range.push(i)
    }

    if (current - delta > 2) {
      range.unshift('...')
    }
    if (current + delta < totalPages - 1) {
      range.push('...')
    }

    range.unshift(1)
    if (totalPages > 1) {
      range.push(totalPages)
    }

    return range
  }

  return (
    <Box className={classes.paginationContainer}>
      <Box className={classes.paginationInfo}>
        <Typography variant="body2" color="textSecondary">
          Всего топиков: {pagination.total}
        </Typography>
      </Box>

      <Box className={classes.paginationControls}>
        <Button
          className={classes.pageButton}
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}>
          <FirstPage />
        </Button>
        <Button
          className={classes.pageButton}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}>
          <ChevronLeft />
        </Button>

        {getPageNumbers().map((page, index) => (
          <Button
            key={index}
            className={classes.pageButton}
            variant={page === currentPage ? 'contained' : 'outlined'}
            color={page === currentPage ? 'primary' : 'default'}
            disabled={page === '...'}
            onClick={() => typeof page === 'number' && onPageChange(page)}>
            {page}
          </Button>
        ))}

        <Button
          className={classes.pageButton}
          disabled={currentPage === pagination.pageCount}
          onClick={() => onPageChange(currentPage + 1)}>
          <ChevronRight />
        </Button>

        <Button
          className={classes.pageButton}
          disabled={currentPage === pagination.pageCount}
          onClick={() => onPageChange(pagination.pageCount)}>
          <LastPage />
        </Button>
      </Box>

      <Typography variant="body2" color="textSecondary">
        Страница {currentPage} из {pagination.pageCount}
      </Typography>
    </Box>
  )
}

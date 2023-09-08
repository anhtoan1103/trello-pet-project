import Box from '@mui/material/Box'

function BoardContent() {
  return (
    <Box sx={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      height: (theme) => `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
      bgcolor: theme => theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'
    }}>
    </Box>
  )
}

export default BoardContent

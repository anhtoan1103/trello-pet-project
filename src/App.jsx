import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import Button from '@mui/material/Button'
import HomeIcon from '@mui/icons-material/Home'
import ThreeDRotation from '@mui/icons-material/ThreeDRotation'
import Typography from '@mui/material/Typography'

function App() {
  return (
    <>
      <div>toto</div>

      <Typography variant='body2' color="text.secondary">Test Typograpy</Typography>

      <Button variant='contained'>Hello world</Button>
      <Button variant='text' color='success'>Hello world</Button>
      <Button variant='outlined'>Hello world</Button>

      <br />
      <AccessAlarmIcon />
      <ThreeDRotation />
      <HomeIcon color="primary" />
    </>
  )
}

export default App

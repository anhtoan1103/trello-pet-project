import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import Button from '@mui/material/Button'
import HomeIcon from '@mui/icons-material/Home'
import ThreeDRotation from '@mui/icons-material/ThreeDRotation'
import Typography from '@mui/material/Typography'
import { useColorScheme } from '@mui/material/styles'

function ModeToggle() {
  const { mode, setMode } = useColorScheme()
  return (
    <>
    <Button 
      onClick={() => {
        setMode(mode === 'light' ? 'dark' : 'light')
      }}
    >
      {mode === 'light' ? 'Turn dark' : 'Turn light'}
    </Button>
    </>
  )
}

function App() {
  return (
    <>
      <ModeToggle />
        <br />
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

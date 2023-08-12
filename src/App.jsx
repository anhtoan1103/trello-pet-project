import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import HomeIcon from '@mui/icons-material/Home'
import ThreeDRotation from '@mui/icons-material/ThreeDRotation'
import Typography from '@mui/material/Typography'
import { useColorScheme } from '@mui/material/styles'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import Box from '@mui/material/Box'
// import useMediaQuery from '@mui/material/useMediaQuery'
function ModeSelect() {
  const { mode, setMode } = useColorScheme()
  const handleChange = (event) => {
    const selectedMode = event.target.value
    setMode(selectedMode)
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120}} size="small">
      <InputLabel id="label-select-dark-light-mode">Mode</InputLabel>
      <Select 
        labelId="label-select-dark-light-mode"
        id="select-dark-light-mode"
        value={mode}
        label="Mode"
        onChange={handleChange}
      >
        <MenuItem value="light">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LightModeIcon fontSize='small'></LightModeIcon> Light
          </div>
        </MenuItem>
        <MenuItem value="dark">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DarkModeOutlinedIcon fontSize='small'></DarkModeOutlinedIcon> Dark
          </Box>
        </MenuItem>
        <MenuItem value='system'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SettingsBrightnessIcon fontSize='small'></SettingsBrightnessIcon> System
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  )
}

function ModeToggle() {
  const { mode, setMode } = useColorScheme()
  // const preferDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  // const preferLightMode = useMediaQuery('(prefers-color-scheme: light)')
  // console.log('preferDarkMode:', preferDarkMode)
  // console.log('preferLightMode:', preferLightMode)
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
      <ModeSelect></ModeSelect>
      <hr></hr>
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

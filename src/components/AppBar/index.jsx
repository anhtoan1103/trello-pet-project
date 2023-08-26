// Material icons
import AppsIcon from '@mui/icons-material/Apps'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

// Material
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip';

// Component
import ModeSelect from '~/components/ModeSelect'
import Starred from './Menus/Starred'
import SvgIcon from '@mui/material/SvgIcon'
import Recent from './Menus/Recent'
import Templates from './Menus/Templates'
import TypoGraphy from '@mui/material/Typography'
import Workspaces from './Menus/Workspaces'

import { ReactComponent as TrelloIcon } from '~/assets/trello-icon.svg'
import Profiles from './Menus/Profiles';

function AppBar() {
  return (
    <Box px={2} sx={{
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
        <AppsIcon sx={{ color: 'primary.main' }}/>
        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
          <SvgIcon component={TrelloIcon} inheritViewBox sx={{ color: 'primary.main'}}/>
          <TypoGraphy variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'primary.main' }}>Trello</TypoGraphy>
        </Box>
        <Workspaces/>
        <Recent/>
        <Starred/>
        <Templates/>
        
        <Button variant='outlined'>Create</Button>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField id='outlined-search' type='search' label='Search...' size='small'></TextField>
        <ModeSelect/>
        <Tooltip title="Notification">
          <Badge color="secondary" variant="dot">
            <NotificationsNoneIcon sx={{ cursor: 'pointer' }}/>
          </Badge>
        </Tooltip>
        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: 'pointer' }}/>
        </Tooltip>
        <Profiles/>
      </Box>
    </Box>
  )
}

export default AppBar

import { useState } from 'react';

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
import LibraryAdd from '@mui/icons-material/LibraryAdd';

import { ReactComponent as TrelloIcon } from '~/assets/trello-icon.svg'
import Profiles from './Menus/Profiles';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

function AppBar() {
  const [searchValue, setSearchValue] = useState('')

  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: theme => theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0'
    }}>
      <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
        <AppsIcon sx={{ color: 'white' }}/>
        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
          <SvgIcon component={TrelloIcon} fontSize='small' inheritViewBox sx={{ color: 'white'}}/>
          <TypoGraphy variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>Trello</TypoGraphy>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Workspaces/>
          <Recent/>
          <Starred/>
          <Templates/>
          <Button
            sx={{
              color: 'white',
              border: 'none',
              '&:hover': {
                border: 'none'
              }
            }}
            variant='outlined'
            startIcon={<LibraryAdd/>}
          >
            Create
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          id='outlined-search'
          type='text' label='Search...'
          size='small'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: 'white' }}></SearchIcon>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position='end'>
                <CloseIcon
                  onClick={() => setSearchValue('')}
                  sx={{ color: searchValue ? 'white': 'transparent', cursor: 'pointer'}}
                  fontSize='small'
                  
                ></CloseIcon>
              </InputAdornment>
            )
          }}
          sx={{
            minWidth: '120px',
            maxWidth: '170px',
            '& label': { color: 'white' },
            '& input': { color: 'white' },
            '& label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white'
              },
              '&:hover fieldset': {
                borderColor: 'white'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white'
              }
            }
          }}
        ></TextField>
        <ModeSelect/>
        <Tooltip title="Notification">
          <Badge color="warning" variant="dot" sx={{ cursor: 'pointer' }}>
            <NotificationsNoneIcon sx={{ color: 'white' }} />
          </Badge>
        </Tooltip>
        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'white' }}/>
        </Tooltip>
        <Profiles/>
      </Box>
    </Box>
  )
}

export default AppBar

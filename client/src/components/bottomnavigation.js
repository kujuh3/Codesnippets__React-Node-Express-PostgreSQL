import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { DiPython, DiJavascript1, DiGithubBadge } from 'react-icons/di';
import { BsFillCollectionFill } from 'react-icons/bs';

export default function SimpleBottomNavigation({language, setLanguage}) {
  const [value, setValue] = React.useState(0);

  React.useEffect(() =>{
    switch(value){
        case 0:
            setLanguage("all");
            break;
        case 1:
            setLanguage("javascript");
            break;
        case 2:
            setLanguage("python");
            break;
    }
  }, [value])

  return (
    <Box sx={{ width: 500 }}>
      <BottomNavigation
        showLabels
        sx={{
          borderTop: "1px white solid", 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          backgroundColor: "#272822", 
          '& .Mui-selected' : {
            '& svg, & .MuiBottomNavigationAction-label': {
              color: "#ed6c02"}
            }
          }
        } 
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction sx={{color: "rgba(255, 255, 255, 0.84)"}} label="All" icon={<BsFillCollectionFill size={"2em"} />} />
        <BottomNavigationAction sx={{color: "rgba(255, 255, 255, 0.84)"}} label="JavaScript" icon={<DiJavascript1 size={"2em"}/>} />
        <BottomNavigationAction sx={{color: "rgba(255, 255, 255, 0.84)"}} label="Python" icon={<DiPython size={"2em"}/>}  />
        <a 
          href="https://www.github.com/kujuh3" 
          target="__blank" 
          style={{
            zIndex: "2", 
            color: "white", 
            left: "0", 
            position: "absolute"}}>
              <DiGithubBadge size={"3em"}/>
        </a>
      </BottomNavigation>
    </Box>
  );
}

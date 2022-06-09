import{ useState, useEffect } from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'
import 'react-pro-sidebar/dist/css/styles.css';
import SearchBar from './searchbar';
import { Link } from 'react-scroll';
import Chip from '@mui/material/Chip';
import useWindowDimensions from './viewport/getWindowDimensions';
import Fab from '@mui/material/Fab';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

export default function ObjectsMenu({setSearchItems, items, setSearchInput, toggle, setToggle, setName}) {
    /* Get window height and width for conditional render */
    const { height, width } = useWindowDimensions();
    const [collapsed, setCollapsed] = useState(false);
    
    /*  Handler function for individual submenu items 
        Toggle will be set as the menuitem ID,
        and each menu item checks if their ID matches that of the variable "toggle"
        and opens accordingly */
    const clickHandler = (menuid, name) => {
        if(menuid == toggle){
            setToggle(null);
            setSearchItems(items);
        } else{
            setToggle(menuid);
            setName(name);
            setSearchItems(items.filter(item => item.category[0].name === name));
        }
    }

    var res = sortCategories();

    useEffect(() => {
        if(width < 1400){
            setCollapsed(true);
        } else {
            setCollapsed(false);
        }
    }, [width])

    /* Function to sort categories, assign initial menu values from this on load */
    function sortCategories(){
        /* Sort items into categories matching their id */
        const cats = items.reduce((a, {id, name, shortextension, category:cat})=>{
            const obj = a.get(cat[0].name) || {...cat, packs: []}; 
            obj[0]["open"] = false;
            obj.packs.push({id, name, shortextension});
            return a.set(cat[0].name, obj);
        }, new Map());

        /* Assign sorted categories alphabetically into an array */
        return [...cats.values()].sort((a, b) => a[0].name.localeCompare(b[0].name));
    }

    /* When passed items are manipulated, run function to sort categories again */
    useEffect(() =>{
        res = sortCategories();
    }, [items])

    return (
        <>
        {(collapsed)
        ?<Fab sx={{
            position: "fixed",
            marginBottom: "70px",
            marginRight: "10px", 
            bottom: "0", 
            right: "0"}} 
            onClick={() => {setCollapsed(!collapsed)}} 
            color="warning" 
            aria-label="add"
        >
            <MenuIcon />
         </Fab>
        :<ProSidebar style={{
            position: "fixed", 
            right: "0", 
            top: "0", 
            zIndex: "0"}}
         >
            <Fab sx={{
                position: "fixed",
                marginBottom: "70px",
                marginRight: "10px", 
                bottom: "0", 
                right: "0"}} 
                onClick={() => {setCollapsed(!collapsed)}} 
                color="warning" 
                aria-label="add"
            >
                <CloseIcon />
            </Fab>
            <Menu style={{ background: "#272822 !important", width: "100%"}} iconShape="square">
                <SearchBar setSearchInput={setSearchInput}/>
                    {res.map((object, idx) => {
                        let name = object[0].name;
                        let id = object[0].id
                        return(
                            <SubMenu title={name} open={toggle == id ?true : false} onClick={()=>{clickHandler(id, name)}} key={idx}>
                                {object.packs.map((item) => {
                                    return(
                                        <MenuItem key={item.id}>
                                            <Link 
                                            smooth={true} 
                                            duration={200} 
                                            to={item.name}
                                            >{item.name}

                                            <Chip 
                                            size="small" 
                                            sx={{
                                                color: "white",
                                                fontVariant: "all-petite-caps", 
                                                right: "0", 
                                                marginRight: "8px", 
                                                position: "absolute"}} 
                                            label={item.shortextension} 
                                            variant="outlined"
                                            />

                                            </Link>
                                        </MenuItem>
                                    )
                                })}
                            </SubMenu>
                        )
                    })}
            </Menu>
         </ProSidebar>
        }
        </>
    );
}
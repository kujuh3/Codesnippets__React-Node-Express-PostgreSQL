import { useState, useEffect } from 'react';
import { CopyBlock, nord, monokai } from "react-code-blocks";
import Container from '@mui/material/Container';
import BottomNavigation from './bottomnavigation';
import Divider from '@mui/material/Divider';
import ObjectsMenu from './objectsmenu';
import Chip from '@mui/material/Chip';
import Upload from './upload';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import CodeEditor from '@uiw/react-textarea-code-editor';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

function App() {
    const [items, setItems] = useState([]);
    const [searchItems, setSearchItems] = useState([]);
    const [selection, setSelection] = useState();
    const [searchInput, setSearchInput] = useState();
    const [categories, setCategories] = useState([]);
    const [isloaded, setIsloaded] = useState(false);
    const [toggle, setToggle] = useState(null);
    const [name, setName] = useState();
    const [codeInput, setCodeInput] = useState(false);
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("");

    /* Code snippets and their descriptions */
    useEffect(() => {
        fetch('http://localhost:3001/snippets', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
        },
        ).then(response => {
        if (response.ok) {
            response.json().then(json => {
            setIsloaded(true);
            setItems(json.data);
            setSearchItems(json.data);
            setCategories(json.categories);
            });
        }
        });
    }, [])
    
    /*  useEffect hook for bottom navigation tabs 
        This isn't good practice, but since I wasn't actually planning
        on making this as nearly as advanced, this'll have to do.
        I think normally one would list these functionalities in another .js file
        and export them to be used globally, which also would make everything reusable */
    useEffect(() =>{
    /* Check if a submenu item is toggled on */
      if(toggle){
        if(selection === "all"){
            setSearchItems(items.filter(item => item.category[0].name === name));
        }   else{
            setSearchItems(items.filter(item => item.category[0].name === name && item.extension === selection));
        }
      } 
      /* If not toggled, apply filter to all items */
      if(!toggle){
        if(selection === "all"){
            setSearchItems(items);
        } else {
            setSearchItems(items.filter(item => item.extension === selection));
        }
      }
    }, [selection]);

    /* UseEffect hook for the search from all input field */
    useEffect(() => {
        if(toggle){
            if(!searchInput){
                setSearchItems(items.filter(item => item.category[0].name === name));
            } else {
            setSearchItems(items.filter(item => 
                item.description.toLowerCase().includes(searchInput.toLowerCase()) && item.category[0].name === name 
                || 
                item.name.toLowerCase().includes(searchInput.toLowerCase()) && item.category[0].name === name)
            );}
        }   else    {
            setSearchItems(items.filter(item => item.description.toLowerCase().includes(searchInput.toLowerCase()) || item.name.toLowerCase().includes(searchInput.toLowerCase())));
        }
    }, [searchInput])

    const handleChange = (event) => {
        setLanguage(event.target.value);
      };

  return (
      <>
      {(isloaded)
      ? <>
        <Grid container spacing={3}>
            <Grid item xs>
                <Upload codeInput={codeInput} setCodeInput={setCodeInput} categories={categories}/>
            </Grid>
            <Grid item xs={8}>

            {codeInput
            ?
            <div style={{
                zIndex: "99",
                position: "absolute",
                left: "50%",
                top: "100px",
                marginLeft: "-400px",
                width: "800px",
                color: "white",
                backgroundColor: "rgb(46, 47, 42)",
                color: "white",
                boxShadow: "black 1px 1px 3px",
                padding: "10px"
            }}>
                <FormControl color='warning' sx={{width: "150px", float: "left"}}>
                  <InputLabel id="demo-simple-select-label">Language</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={language}
                    label="Language"
                    onChange={handleChange}
                  >
                    <MenuItem value={10}>JavaScript</MenuItem>
                    <MenuItem value={20}>Python</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
                <CodeEditor
                    value={code}
                    language="js"
                    placeholder="Please enter JS code."
                    onChange={(evn) => setCode(evn.target.value)}
                    padding={15}
                    style={{
                      fontSize: 12,
                      backgroundColor: "#f5f5f5",
                      fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                      width: "80%",
                      marginLeft: "auto",
                      marginRight: "auto"
                    }}
                />
            </div>   
            :<></>
            }
            
                <Container sx={{textAlign: "left", padding: "10px", marginBottom: "10vh"}}>
                {(searchItems)
                ?searchItems.map((item, idx) => {
                    return(
                    <div key={idx}>
                        <div id={item.name} style={{boxShadow: "1px 1px 3px black",margin: "10px", backgroundColor: "rgb(39, 40, 34)", color: "white", borderRadius: "4px", paddingTop: "3px"}}>
                        <header style={{borderBottom: "1px solid white", padding: "15px"}}>
                            <div style={{display: "flex"}}>
                                <h2>{item.name}</h2>
                                <Chip sx={{marginTop: "auto",marginBottom: "auto",marginLeft: "auto",marginRight: "30px",color: "white",fontVariant: "all-petite-caps"}} label={item.extension} variant="outlined"/>
                            </div>
                            <p>{item.description}</p>
                        </header>   
                        <CopyBlock
                            text={item.code}
                            language={item.extension}
                            theme={monokai}
                            codeBlock
                        />
                        </div>
                        <Divider/>
                    </div>
                    );
                    })
                :<>No items to display</>
                }
                </Container>
            </Grid>
            <Grid item xs>
                {/* Pass items for sidemenu, sort alphabetically */}
                <ObjectsMenu 
                    setSearchItems={setSearchItems} 
                    items={items.sort((a,b) => a.name.localeCompare(b.name))} 
                    setSearchInput={setSearchInput}
                    toggle={toggle}
                    setToggle={setToggle}
                    setName={setName}
                />
            </Grid>
        </Grid>
        <BottomNavigation language={selection} setLanguage={setSelection}/>
        </>
      : <div style={{ display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',}}>
            <CircularProgress color="warning"/>
        </div>
      }
      </>
  )
};


export default App;

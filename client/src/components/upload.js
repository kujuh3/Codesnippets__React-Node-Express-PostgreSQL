import React, {useState, useEffect, useRef} from 'react';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import useWindowDimensions from './viewport/getWindowDimensions';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Fab from '@mui/material/Fab';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { BsFileCodeFill, BsFillFileEarmarkPlusFill } from 'react-icons/bs';

function FileUploadPage({categories, codeInput, setCodeInput}){
	const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
    const [codeName, setCodeName] = useState("");
    const [codeDescription, setCodeDescription] = useState("");
    const [category, setCategory] = useState("");
    const { height, width } = useWindowDimensions();
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        if(width < 1400){
            setCollapsed(true);
        } else {
            setCollapsed(false);
        }
    }, [width])

	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};

    const handleChange = (e) => {
        setCategory(e.target.value);
    };

	const handleSubmission = () => {
        let extension = selectedFile.name.split('.').pop();
        /* Before we allow post, lets check if everything is in order 
           First check if description or name are given*/
        if(codeName.length < 1 || codeDescription.length < 1) {
            alert("Name and description are required")
            return;
        }
        /* Then check if the file given is of acceptable extension */
        if(!selectedFile || extension === "py" || extension === "js") {
		const formData = new FormData();
        formData.append('name', codeName);
        formData.append('file', selectedFile);
        formData.append('description', codeDescription);
        formData.append('extension', extension);
        formData.append('category_id', category);
		fetch(
			'http://localhost:3000/newsnippet',
			{
				method: 'POST',
				body: formData,
			}
		)
			.then((response) => response.json())
			.then((result) => {
				console.log('Success:', result);
                alert("Filed uploaded")
                setCodeName("");
                setCodeDescription("");
                setSelectedFile();
                setIsFilePicked(false);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
        } else {
            alert("Wrong file extension or missing a file")
            return;
        }
	};

    const fileInput = useRef();

    return(
        <>
        {(collapsed)
        ?<Fab sx={{position: "fixed",marginBottom: "70px",marginLeft: "10px", bottom: "0", left: "0"}} onClick={() => {setCollapsed(!collapsed)}} color="warning" aria-label="add">
            <FileUploadIcon />
         </Fab>
        :<>
        <Fab sx={{position: "fixed",marginBottom: "70px",marginLeft: "10px", bottom: "0", left: "0"}} onClick={() => {setCollapsed(!collapsed)}} color="warning" aria-label="add">
            <CloseIcon />
        </Fab>
        <div style={{transition: "opacity 5s ease-in-out",padding: "10px", boxShadow: "black 1px 1px 3px", zIndex: "2", position: "fixed", left: "0", top: "0", margin: "20px", width: width < 1400 ? "250px" : "15vw", backgroundColor: "rgb(39, 40, 34)", color: "white"}}>
           <p style={{fontSize: "13px"}}>For now only Python and JavaScript files are accepted</p>
            <TextField 
                required={true}
                id="standard-basic" 
                label="Name" 
                variant="standard" 
                color="warning"
                value={codeName}
                onChange={(e) => setCodeName(e.target.value)}
                sx={{width: "90%", marginBottom: "20px", input: {color: "white", borderBottom: "1px solid white"}, label: {color: "#ffffffa3"}}} 
            />
            <TextField 
                required={true}
                multiline 
                rows={4} 
                id="standard-basic" 
                label="Description" 
                variant="standard" 
                color="warning" 
                value={codeDescription}
                onChange={(e) => setCodeDescription(e.target.value)}
                sx={{width: "90%", marginBottom: "20px", label: {color: "#ffffffa3"}}} 
            />
            <FormControl sx={{width: "90%", marginBottom: "20px"}}>
                <InputLabel required={true} color="warning" sx={{color: "#ffffffa3", left: "-14px"}}>Category</InputLabel>
                <Select
                  id="select"
                  variant='standard'
                  color="warning"
                  value={category}
                  label="Category"
                  onChange={handleChange}
                >
                {categories.map((category) =>{
                    return(
                            <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                    )
                })}
                </Select>
            </FormControl>

            <IconButton sx={{display: "inline-block", fontSize: "35px"}} onClick={()=>fileInput.current.click()} color="warning" aria-label="Upload file">
                <BsFillFileEarmarkPlusFill />
                <p style={{fontSize: "12px"}}>File</p>
                <input 
                    ref={fileInput}
                    style={{display: "none"}}
                    type="file" 
                    name="file" 
                    accept=".js,.py" 
                    onChange={changeHandler} 
                />
            </IconButton>

            <IconButton sx={{display: "inline-block", fontSize: "35px"}} onClick={()=>setCodeInput(!codeInput)} color="warning" aria-label="Upload file">
                <BsFileCodeFill/>
                <p style={{fontSize: "12px"}}>Write</p>
            </IconButton>

            {isFilePicked ? (
				<div style={{textAlign: "left", width: "90%"}}>
					<p>File: {selectedFile.name}</p>
                    <p>Size: {Math.round(selectedFile.size/1000)}KB</p>
				</div>
			):(
				<></>
			)}
			<div style={{marginTop: "10px"}}>
				<button onClick={handleSubmission}>Submit</button>
			</div>
		</div>
        </>
        }
        </>
	)
};

export default FileUploadPage;
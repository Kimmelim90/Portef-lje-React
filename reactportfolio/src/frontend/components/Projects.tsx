import { useEffect, useState } from "react";
import { ofetch } from "ofetch";

export default function Projects() {
    let initialized = false;

    const [projects, setProjects] = useState([]);
    const [projectTitle, setProjectTitle] = useState("");
    const [projectShortDescription, setProjectShortDescription] = useState("");
    const [projectDate, setProjectDate] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectFavourite, setProjectFavourite] = useState("false");

    


    function handleProjectTitle(event) {
        setProjectTitle(event.target.value);
    }

    function handleProjectShortDescription(event) {
        setProjectShortDescription(event.target.value);
    }

    function handleProjectDate(event) {
        setProjectDate(event.target.value);
    }
    
    function handleProjectDescription(event) {
        setProjectDescription(event.target.value);
    }

    function handleProjectFavourite(event) {        
            setProjectFavourite(event.target.value);
        }

    async function getProjects() {
        try {
            //https://www.npmjs.com/package/ofetch/v/1.2.1
            const data = await ofetch("http://localhost:3000/projects", { parseResponse: JSON.parse });
            console.log(data);
            return data;
        } catch (error) {
            console.error("Unable to fetch data:", error);
        }
    }

    async function handleProjects() {
        const projects = await getProjects();
        // Access a specific project by its key
        const keys = Object.keys(projects);
        let a, li, para, linkText, element, button, space;
        element = (document.getElementById("projectsDiv"));
        for (let i = 0; i < keys.length; i++) {
            a = document.createElement("a");
            li = document.createElement("li");
            para = document.createElement("para");
            button = document.createElement("button");
            space = document.createTextNode(" - ");
            linkText = document.createTextNode(keys[i]);
            
            a.appendChild(linkText);
            a.title = (`${keys[i]}`);
            a.href = `/${keys[i]}`;
            
            button.className = "deleteButton";
            button.innerHTML = "X";
            button.title = "delete " + projects[keys[i]]["id"];
            button.onclick = function () {handleDeleteProject(projects[keys[i]]["id"])}

            li.appendChild(a);
            li.appendChild(space);
            li.appendChild(button);
            https://stackoverflow.com/questions/9422974/createelement-with-id
            li.setAttribute("id", projects[keys[i]]["id"]);
            

            element.appendChild(li);
            element.appendChild(para);
        }
        }
        
async function handleDeleteProject(id:string) {
    await ofetch("http://localhost:3000/deleteproject", { query: { id: id } })
    let element = document.getElementById(id);
    if (element) {
        element.remove();
    } else {
        console.warn(`Element with id ${id} not found.`);
    }
}

    async function handleNewProject() {
        const [year, month, day] = projectDate.split("-");
        let id = Date.now();
        
        // Create a new FormData object to hold all form fields and the image
        const formData = new FormData();

        // Add the image file to the form data
        const fileInput = document.getElementById('file') as HTMLInputElement;
        if (fileInput && fileInput.files && fileInput.files[0]) {
            formData.append("image", fileInput.files[0]);  // Add the image file
        }
        
        const newProject = {           
            [projectTitle]: {
                "id": id,
                "short description": projectShortDescription,
                "date": {
                    "day": day,
                    "month": month,
                    "year": year
                },
                "description": projectDescription,
                "favourited": (projectFavourite === "true")
            }}

        formData.append("projectData", JSON.stringify(newProject));
        
        await ofetch("http://localhost:3000/newproject", {
            method: "POST",
            body: formData
        })
        
        //Adding new project, so the site does not need to be refreshed.
        let a, li, para, linkText, element, button, space;
        element = (document.getElementById("projectsDiv"));
        a = document.createElement("a");
        li = document.createElement("li");
        para = document.createElement("para");
        button = document.createElement("button");
        space = document.createTextNode(" - ");
        linkText = document.createTextNode(projectTitle);
        
        a.appendChild(linkText);
        a.title = (`${projectTitle}`);
        a.href = `/${projectTitle}`;

        li.appendChild(a);
        li.appendChild(space);
        li.appendChild(button);
        https://stackoverflow.com/questions/9422974/createelement-with-id
        li.setAttribute("id", String(id));

        button.className = "deleteButton";
        button.innerHTML = "X";
        button.title = "delete " + id;
        button.onclick = function () {handleDeleteProject(String(id))}
            
    
        element.appendChild(li);
        element.appendChild(para);

        //Resetting useStates
        setProjectTitle("");
        setProjectShortDescription("");
        setProjectDate("");
        setProjectDescription("");
        setProjectFavourite("false");
        

        }
    

    useEffect(() => { 
        //useEffect vil kjøre to ganger i utviklingsmodus, dette er for å stoppe det fra å kjøre to ganger
        if (!initialized) {
            initialized = true;

            handleProjects();
        }
    }, [])
    
    return (
        <>
        <h2><u>All Projects</u></h2>
        <div id="projectsDiv"></div>

        <h3><u>New Project</u></h3>

        <label>
          Title:
          <input className="project-info"
          type="text"
          name="title"
          value={projectTitle}
          onChange={handleProjectTitle}
          placeholder="Enter a title..."/>
          
        </label>
        <br/>
        <label>
          Short Description:
          <input className="project-info"
          type="text"
          name="shortDescription"
          value={projectShortDescription}
          onChange={handleProjectShortDescription}
          placeholder="Summarize the project..."/>
        </label>
        <br/>
        <label>
          Date:
          <input className="project-info"
          type="date"
          name="date"
          value={projectDate}
          onChange={handleProjectDate}
          />
        </label>
        <br/>
        <label>
          Description:
          <br/>
          <textarea 
          rows={5}
          cols={80}
          value={projectDescription}
          onChange={handleProjectDescription}
          id="description"
          name="description">
          </textarea>
        </label>
        <br/>
        <label>
        Favourite?:
        <select value={projectFavourite} onChange={handleProjectFavourite}>
            <option value="false">False</option>
            <option value="true">True</option>
        </select>
        </label>
        <br/>
        <input type="file" accept="image/*" name="image" id="file"
        onChange={(event) => {
        var image = document.getElementById('output') as HTMLImageElement;
        if (image && event.target.files) {
            image.src = URL.createObjectURL(event.target.files[0]);
        }
        }} />
        <br/>
        <img id="output" width="200" />
        <br/>
        <button onClick={handleNewProject}>New Project</button>
        </>)
    
    }
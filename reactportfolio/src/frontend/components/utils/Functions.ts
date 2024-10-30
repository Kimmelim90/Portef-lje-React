import { ofetch } from "ofetch";
import { baseUrl, endpoints } from "../../config/urls";
import { format } from "date-fns";
import { z } from "zod";

const projectSchema = z.object({
    name: z.string().min(4, 'Project must have a name greater than or equal to 4'),
    shortDescription: z.string().min(4, 'Project must have a shortDescription greater than or equal to 4'),
    createdAt: z.string(),
    description: z.string(),
    favourited: z.boolean(),
    tags: z.string()
  })

  const publicProjectSchema = z.object({
    id: z.number(),
    visible: z.boolean()
  })

  const publishDraftSchema = z.object({
    id: z.number(),
    status: z.string()
  })

const idIsNumber = z.number()

//Zod ser ikke ut til å ha en fin måte for å se etter ting som ikke skal være der =(
//const validTag = z.string().includes(" ", { message: "Tags must be made like: 'Tag1, Tag2, Tag3, etc...'" });

async function getProjects() {
    try {
        //https://www.npmjs.com/package/ofetch/v/1.2.1
        const data = await ofetch(baseUrl + endpoints.projects, { parseResponse: JSON.parse });
        console.log(data);
        return data['data'];
    } catch (error) {
        console.error("Unable to fetch data:", error);
    }
}

async function handleNewProject(projectDate, projectTitle, projectShortDescription, projectDescription, projectFavourite, projectTags) {
    let data, tagStatus;
    const projectData = {
        name: projectTitle,
        shortDescription: projectShortDescription,
        createdAt: projectDate,
        description: projectDescription,
        favourited: (projectFavourite === "true"),
        tags: projectTags
    }
    // Create a new FormData object to hold all form fields and the image
    const formData = new FormData();

    // Add the image file to the form data
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files[0]) {
        formData.append("image", fileInput.files[0]);  // Add the image file
    }
    
    try {
        projectSchema.parse(projectData)
        const tags = projectData.tags.split(", ")
        console.log(tags)
        for (let i = 0; i < tags.length; i++) {
            //Zod har ingen fin mulighet til å throwe feil, om noe er i stringen, f.eks. et mellomrom
            //Lager heller en egen validering:
            tagStatus = tags[i].includes(" ")
            if (tagStatus === true) {
                throw "Tag validation failed: Tags must be made like: 'Tag1, Tag2, Tag3, etc...'"
            }
        }
        const newProject = {           
            "name": projectData.name,
            "short description": projectData.shortDescription,
            "createdAt": projectData.createdAt,
            "description": projectData.description,
            "favourited": projectData.favourited,
            "tags": projectData.tags
        }
        formData.append("project Data", JSON.stringify(newProject));
    
        data = await ofetch(baseUrl + endpoints.newproject, {
        method: "POST",
        body: formData}
    )
    }
    catch (error) {
        console.error("Validation failed:", error);
    } 
    
    const projectId = data['data']['id']
    console.log(projectId);
    
    //Adding new project, so the site does not need to be refreshed.
    let a, li, para, linkText, publishButton, element, button, space;
    element = (document.getElementById("projectsDiv"));
    a = document.createElement("a");
    li = document.createElement("li");
    para = document.createElement("para");
    button = document.createElement("button");
    space = document.createTextNode(" - ");
    linkText = document.createTextNode(projectTitle);
    publishButton = document.createElement("button");
    
    a.appendChild(linkText);
    a.title = (`${projectTitle}`);
    a.href = `/${projectTitle}`;

    li.appendChild(a);
    li.appendChild(space);
    li.appendChild(button);
    li.appendChild(publishButton);
    https://stackoverflow.com/questions/9422974/createelement-with-id
    li.setAttribute("id", String(projectId));

    button.className = "deleteButton";
    button.innerHTML = "X";
    button.title = "delete " + projectId;
    button.onclick = function () {
        let element = document.getElementById(projectId);
            handleDeleteProject(projectId, element)
    }
        

    publishButton.className = "draftButton";
    publishButton.innerHTML = "N";
    publishButton.title = "published " + projectId;
    publishButton.onclick = function () {handlePublishDraft(projectId, true)}


    if (element) {
    element.appendChild(li);
    element.appendChild(para);
    }
}

async function handleDeleteProject(id:string, element) {
    try {
        idIsNumber.parse(+id)
        await ofetch(baseUrl + endpoints.deleteProject, { method: "DELETE", query: { id: id } })
    if (element) {
        element.remove();
    } else {
        console.warn(`Element with id ${id} not found.`);
    }
}
catch (error) {
    console.error("Validation failed:", error);
}
}

async function handleProjects() {
    const projects = await getProjects();
    // Access a specific project by its key
    let a, li, para, linkText, publishButton, publicButton, element, button, space, date;
    element = (document.getElementById("projectsDiv"));
    for (let i = 0; i < projects.length; i++) {
        let publishtext;
        let tagtext = " - Tags: "
        const tags = projects[i]['tags']
        a = document.createElement("a");
        li = document.createElement("li");
        para = document.createElement("para");
        button = document.createElement("button");
        space = document.createTextNode(" - ");
        linkText = document.createTextNode(projects[i]['name']);
        publishButton = document.createElement("button");
        publicButton = document.createElement("button");
        
        a.appendChild(linkText);
        a.title = (`${projects[i]['name']}`);
        a.href = `/${projects[i]['name']}`;
        
        button.className = "deleteButton";
        button.innerHTML = "X";
        button.title = "delete " + projects[i]["id"];
        button.onclick = function () {
            let element = document.getElementById(projects[i]["id"]);
            handleDeleteProject(projects[i]["id"], element)}

        if (projects[i]["public"] === true) {
            publicButton.className = "publicTrueButton";
            publicButton.innerHTML = "👁";
            publicButton.title = "public " + projects[i]["id"];
            publicButton.onclick = function () {handlePublic(projects[i]["id"], false)}
        }
        else {
            publicButton.className = "publicFalseButton";
            publicButton.innerHTML = "◌";
            publicButton.title = "public " + projects[i]["id"];
            publicButton.onclick = function () {handlePublic(projects[i]["id"], true)}
        }

        if (projects[i]["status"] === "published") {
            publishButton.className = "publishedButton";
            publishButton.innerHTML = "Y";
            publishButton.title = "draft " + projects[i]["id"];
            publishButton.onclick = function () {handlePublishDraft(projects[i]["id"], "draft")}
        }
        else {
            publishButton.className = "draftButton";
            publishButton.innerHTML = "N";
            publishButton.title = "published " + projects[i]["id"];
            publishButton.onclick = function () {handlePublishDraft(projects[i]["id"], "published")}
        }
        if (projects[i]["publishedAt"] && (projects[i]["status"] === "published")) {
            date = projects[i]["publishedAt"].split("-")
            publishtext = document.createTextNode(" - Published: " + format(new Date(date[0], date[1], date[2]), "MM/dd/yyyy"))
        }
        
        for (let i = 0; i < tags.length; i++) {
            if (i === 0) {
                tagtext = `${tagtext}` + tags[i]
            }
            else {
                tagtext = `${tagtext}, ` + tags[i]
            }            
        }
    
        console.log(tagtext)

        li.appendChild(a);
        li.appendChild(space);
        li.appendChild(button);
        li.append(publicButton)
        li.appendChild(publishButton);
        li.appendChild(document.createTextNode(tagtext))
        li.setAttribute("id", projects[i]["id"]);

        if(publishtext){
            li.appendChild(publishtext);
            
        }

        
        if (element) {
        element.appendChild(li);
        element.appendChild(para);
        }
    }
    }

    async function handleFavourites() {
        const projects = await getProjects();
        // Access a specific project by its key
        let a, li, para, linkText, element, elementFavourite, date, publishtext;
        elementFavourite = (document.getElementById("favouritesDiv"));
        element = (document.getElementById("projectsDiv"))
        for (let i = 0; i < projects.length; i++) {
            let tagtext = " - Tags: "
            const tags = projects[i]['tags']
            if (projects[i]["public"] == true) {
            if (projects[i]["favourited"] == true) {
                a = document.createElement("a");
                li = document.createElement("li");
                para = document.createElement("para");
                linkText = document.createTextNode(projects[i]['name']);
                
                a.appendChild(linkText);
                a.title = (`${projects[i]['name']}`);
                a.href = `/${projects[i]['name']}`;
                li.appendChild(a)
                
                if (projects[i]["publishedAt"] && (projects[i]["status"] === "published")) {
                    date = projects[i]["publishedAt"].split("-")
                    publishtext = document.createTextNode(" - Published: " + format(new Date(date[0], date[1], date[2]), "MM/dd/yyyy"))
                    li.appendChild(publishtext)
                }

                if (elementFavourite) {
                elementFavourite.appendChild(li);
                elementFavourite.appendChild(para);
                }
                
                for (let i = 0; i < tags.length; i++) {
                    if (i === 0) {
                        tagtext = `${tagtext}` + tags[i]
                    }
                    else {
                        tagtext = `${tagtext}, ` + tags[i]
                    }
                    
                }
                li.appendChild(document.createTextNode(tagtext))
                
            }
            else {
                a = document.createElement("a");
                li = document.createElement("li");
                para = document.createElement("para");
                linkText = document.createTextNode(projects[i]['name']);
                
                a.appendChild(linkText);
                a.title = (`${projects[i]['name']}`);
                a.href = `/${projects[i]['name']}`;
                li.appendChild(a)
                
                if (projects[i]["publishedAt"] && (projects[i]["status"] === "published")) {
                    date = projects[i]["publishedAt"].split("-")
                    publishtext = document.createTextNode(" - Published: " + format(new Date(date[0], date[1], date[2]), "MM/dd/yyyy"))
                    li.appendChild(publishtext)
                }

                if (element) {
                element.appendChild(li);
                element.appendChild(para);
                }
                
                for (let i = 0; i < tags.length; i++) {
                    if (i === 0) {
                        tagtext = `${tagtext}` + tags[i]
                    }
                    else {
                        tagtext = `${tagtext}, ` + tags[i]
                    }
                    
                }
                li.appendChild(document.createTextNode(tagtext))
                
            }
        }
    }
        }

async function handlePublishDraft(id:number, status: string) {
    const projectData = {
        id: +id,
        status: status
    }
    try {
        publishDraftSchema.parse(projectData)
        await ofetch(baseUrl + endpoints.publishDraft, { method: "PATCH", query: { id: projectData.id, status: projectData.status } })
    }
    catch (error) {
        console.error("Validation failed:", error);
    } 
}

async function handlePublic(id:number, visible: boolean) {
    const projectData = {
        id: +id,
        visible: visible
    }
    try {
        publicProjectSchema.parse(projectData)
        await ofetch(baseUrl + endpoints.makePublic, { method: "PATCH", query: { id: projectData.id, visible: projectData.visible } })
    }
    catch (error) {
        console.error("Validation failed:", error);
    } 
}

export {getProjects, handlePublishDraft, handleProjects, handleDeleteProject, handleNewProject, handleFavourites};
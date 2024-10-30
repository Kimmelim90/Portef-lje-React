import { useState } from "react";
import { useProjects } from "../Hooks/useProjects";
import ProjectForm from "../ProjectForm";

export default function ProjectsSite() {

    const [projectTitle, setProjectTitle] = useState("");
    const [projectShortDescription, setProjectShortDescription] = useState("");
    const [projectDate, setProjectDate] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectFavourite, setProjectFavourite] = useState("false");
    const [projectTags, setProjectTags] = useState("");

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

    function handleProjectTags(event) {
        setProjectTags(event.target.value);
    }

    function handleProjectFavourite(event) {        
            setProjectFavourite(event.target.value);
        }

    
    function resetStates(){
        //Resetting useStates
        setProjectTitle("");
        setProjectShortDescription("");
        setProjectDate("");
        setProjectDescription("");
        setProjectFavourite("false");
        setProjectTags("");
        }

    useProjects();
    
    return (
        <>
        <h2><u>All Projects</u></h2>
        <div id="projectsDiv"></div>

        <h3><u>New Project</u></h3>
        <ProjectForm 
        projectTitle={projectTitle}
        projectShortDescription={projectShortDescription}
        projectDate={projectDate}
        projectDescription={projectDescription}
        projectFavourite={projectFavourite}
        projectTags={projectTags}
        handleProjectTitle={handleProjectTitle}
        handleProjectShortDescription={handleProjectShortDescription}
        handleProjectDate={handleProjectDate}
        handleProjectDescription={handleProjectDescription}
        handleProjectFavourite={handleProjectFavourite}
        handleProjectTags={handleProjectTags}
        resetStates={resetStates}
        ></ProjectForm>
        
        </>)
    
    }
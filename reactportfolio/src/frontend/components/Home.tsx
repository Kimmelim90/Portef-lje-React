import { useEffect } from "react"
import { ofetch } from "ofetch";
import Personalia from "./Personalia";

export default function Home() {
    let initialized = false;

    async function getfavourites() {
        try {
            const data = await ofetch("http://localhost:3000/projects", { parseResponse: JSON.parse });
            console.log(data);
            return data;
        } catch (error) {
            console.error("Unable to fetch data:", error);
        }
    }

    async function handleFavourites() {
        const projects = await getfavourites();
        // Access a specific project by its key
        const keys = Object.keys(projects);
        let a, li, para, linkText, element;
        element = (document.getElementById("projectsDiv"));
        for (let i = 0; i < keys.length; i++) {
            if (projects[keys[i]]["favourited"] == true) {
                a = document.createElement("a");
                li = document.createElement("li");
                para = document.createElement("para");
                linkText = document.createTextNode(keys[i]);
                
                a.appendChild(linkText);
                a.title = (`${keys[i]}`);
                a.href = `/${keys[i]}`;
                li.appendChild(a)
            
                element.appendChild(li);
                element.appendChild(para);
            }
        }
        }

    useEffect(() => { 
        //useEffect vil kjøre to ganger i utviklingsmodus, dette er for å stoppe det fra å kjøre to ganger
        if (!initialized) {
            initialized = true;

            handleFavourites();
        }
    }, [])
        

return(
    

<>
    <Personalia></Personalia>
    <h2><u>Curated Projects</u></h2>
    <div id="projectsDiv"></div>
    

</>)

}
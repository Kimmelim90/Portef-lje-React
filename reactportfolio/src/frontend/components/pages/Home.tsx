import Personalia from "./Personalia";
import { useFavourites } from "../Hooks/useFavourites";

export default function Home() {
    
    useFavourites()
        
return(
    

<>
    <Personalia></Personalia>
    <h2><u>Curated Projects</u></h2>
    <div id="favouritesDiv"></div>
    <h2><u>Other Projects</u></h2>
    <div id="projectsDiv"></div>

</>)

}
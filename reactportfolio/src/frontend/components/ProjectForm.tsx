import { handleNewProject } from "./utils/Functions";

export default function ProjectForm(props) {
    return (
        <>
            <label>
                Title:
                <input
                    className="project-info"
                    type="text"
                    name="title"
                    value={props.projectTitle}
                    onChange={props.handleProjectTitle}
                    placeholder="Enter a title..."
                />
            </label>
            <br />
            <label>
                Short Description:
                <input
                    className="project-info"
                    type="text"
                    name="shortDescription"
                    value={props.projectShortDescription}
                    onChange={props.handleProjectShortDescription}
                    placeholder="Summarize the project..."
                />
            </label>
            <br />
            <label>
                Date:
                <input
                    className="project-info"
                    type="date"
                    name="date"
                    value={props.projectDate}
                    onChange={props.handleProjectDate}
                />
            </label>
            <br />
            <label>
                Description:
                <br />
                <textarea
                    rows={5}
                    cols={80}
                    value={props.projectDescription}
                    onChange={props.handleProjectDescription}
                    id="description"
                    name="description"
                />                
            </label>
            <br />
            <label>
                Tags:
                <input
                    className="project-info"
                    type="text"
                    name="tags"
                    value={props.projectTags}
                    onChange={props.handleProjectTags}
                    placeholder="Like this: 'cool, uncool, kim'"
                />
            </label>
            <br />
            <label>
                Favourite?:
                <select
                    value={props.projectFavourite}
                    onChange={props.handleProjectFavourite}
                >
                    <option value="false">False</option>
                    <option value="true">True</option>
                </select>
            </label>
            <br />
            <input
                type="file"
                accept="image/*"
                name="image"
                id="file"
                onChange={(event) => {
                    const image = document.getElementById("output") as HTMLImageElement;
                    if (image && event.target.files) {
                        image.src = URL.createObjectURL(event.target.files[0]);
                    }
                }}
            />
            <br />
            <img id="output" width="200" />
            <br />
            <button
                onClick={function () {
                    handleNewProject(
                        props.projectDate,
                        props.projectTitle,
                        props.projectShortDescription,
                        props.projectDescription,
                        props.projectFavourite,
                        props.projectTags
                    );
                    props.resetStates();
                }}
            >
                New Project
            </button>
        </>
    );
}
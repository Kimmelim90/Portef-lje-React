import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { PrismaClient } from '@prisma/client'
import { endpoints } from "../config/urls";
import { z } from "zod";

const app = new Hono()

const prisma = new PrismaClient()


const publicProjectSchema = z.object({
  id: z.number(),
  visible: z.string()
})

const publishDraftSchema = z.object({
  id: z.number(),
  status: z.string()
})

const projectSchema = z.object({
  name: z.string().min(4, 'Project must have a name greater than or equal to 4'),
  shortDescription: z.string().min(4, 'Project must have a shortDescription greater than or equal to 4'),
  createdAt: z.string(),
  description: z.string(),
  favourited: z.boolean(),
  tags: z.string()
})

const idIsNumber = z.number()


function createCurrentDate() {
  //https://stackoverflow.com/questions/10211145/getting-current-date-and-time-in-javascript
  var currentdate = new Date();
var date = currentdate.getFullYear() + "-" + (currentdate.getMonth())
+ "-" + currentdate.getDate()
return date
}

app.use("/*", cors());

app.get(endpoints.projects, async (c) => {
  
  try {    
    const projects = await prisma.projects.findMany({
      include: {
        tags: true,
        },
    });
    const data = projects.map(project => ({
      ...project,
      tags: project.tags.map(tag => tag.tag),  // Convert tags to an array of strings
    }));
    console.log(data);
    return c.json({success: true, data: data});
  } catch (err) {
    console.error(`Error writing to database`, err);
    return c.json({success: true, error: `Error writing to database:` + err}, 500);
  }
});

app.delete(endpoints.deleteProject, async (c) => {
  const id = c.req.query('id');
  if (id) {
    try {
      idIsNumber.parse(+id);
      
      const deletedProject = await prisma.projects.delete({
        where: { id: +id }
      });
      
      console.log("Deleted project with id:", id);
      return c.json({ success: true, data: id }, 201);
    } catch (error) {
      console.error("Error deleting project:", error);
      return c.json({ success: false, error: `Error deleting project: ` + error }, 500);
    }
  } else {
    return c.json({ success: false, error: `id is undefined.` }, 500);
  }
});

app.patch(endpoints.publishDraft, async (c) =>

  {
    const projectData = {
      id: +c.req.query('id'),
      status: c.req.query('status')
    }
    //visible is to contain the state of public
  if (projectData.id != undefined) {
    const currentDate = createCurrentDate()
    try {
      publishDraftSchema.parse(projectData);
      const updatedProject = await prisma.projects.update({
          where: {
              id: +projectData.id
          },
          data: { status: projectData.status,
                  publishedAt: currentDate
           }
      });
      console.log("Updated project with id:", projectData.id);
      return c.json({success: true, data: projectData.status}, 201);
  }
  catch (error) {
    console.error("Error updating project:", error);
    return c.json({success: false, error: `Error updating project: ` + error}, 500);
}  
}
else {
return c.json({success: false, error: `id is undefined.`}, 500);
}
})

app.patch(endpoints.makePublic, async (c) =>
  {
    
    //visible is to contain the state of public
    const projectData = {
      visible:c.req.query('visible'),
      id: +c.req.query('id')
    }
  if (projectData.id != undefined) {
    try {
      publicProjectSchema.parse(projectData)
      const updatedProject = await prisma.projects.update({
          where: {
              id: +projectData.id
          },
          data: { public: (projectData.visible === "true")
           }
      });
      console.log("Updated project with id:", projectData.id);
      return c.json({success: true, data: projectData.visible}, 201);
  }
  catch (error) {
    console.error("Error updating project:", error);
    return c.json({success: false, error: `Error updating project: ` + error}, 500);
}  
}
else {
return c.json({success: false, error: `id is undefined.`}, 500);
}
})

app.post(endpoints.newproject, async (c) => {
  let tempdata;

  // Setting body to be the JSON Data from the request
  let 
  newProject
  

  const body = await c.req.formData();
  const entries = body.entries();
  let project;
  
  for (let entry of entries) {
    project = JSON.parse(entry[1])
  }
  const projectData = {
  name: project['name'],
  shortDescription: project['short description'],
  createdAt: project['createdAt'],
  description: project['description'],
  favourited:project['favourited'],
  tags:project['tags']
  }

  try {
    projectSchema.parse(projectData)
    newProject = await prisma.projects.create({
      data: {
        name: projectData.name,
        shortDescription: projectData.shortDescription,
        createdAt: projectData.createdAt,
        description: projectData.description,
        favourited: projectData.favourited
      }
    })
    const tags = projectData.tags.split(", ")

    console.log(newProject.id)

    for (let i = 0; i < tags.length; i++) {
      await prisma.tags.create({
        data: {
          projectId: newProject.id,
          tag: tags[i]
        }
      })
    }

    console.log('Insert Successful');
  } catch (err) {
    console.error(`Error adding:`, err);
    return c.json({success: false, error: `Failed adding`}, 500);
  }

  return c.json({success: true, data: {id: newProject['id']}}, 201);
});

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})

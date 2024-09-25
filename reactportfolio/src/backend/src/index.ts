import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import {readFile, writeFile} from 'node:fs/promises'

const app = new Hono()

app.use("/*", cors());

app.get("/projects", async (c) => {
  const fileName = "projects.json";
  try {    
    const data = await readFile(`src/assets/${fileName}`, "utf-8");
    return c.json(JSON.parse(data));
  } catch (err) {
    console.error(`Error reading: ${fileName}`, err);
    return c.text(`Failed to read: ${fileName}`, 500);
  }
});

app.get("/getfavourites", async (c) => {
  const fileName = "projects.json";
  try {    
    const data = await readFile(`src/assets/${fileName}`, "utf-8");
    let tempjson = JSON.parse(data)
    return c.json(JSON.parse(data));
  } catch (err) {
    console.error(`Error reading: ${fileName}`, err);
    return c.text(`Failed to read: ${fileName}`, 500);
  }
});

app.get("/deleteproject", async (c) => {
  let tempjson;
  const fileName = "projects.json";
  const id = c.req.query('id');
  try {    
    const data = await readFile(`src/assets/${fileName}`, "utf-8");
    tempjson = JSON.parse(data);
  } catch (err) {
    console.error(`Error reading: ${fileName}`, err);
    return c.text(`Failed to read: ${fileName}`, 500);
  }
  const keys = Object.keys(tempjson);
  for (let i = 0; i < keys.length; i++) {
    if(String(tempjson[keys[i]]['id']) === String(id)) {
      delete tempjson[keys[i]];
      break;
    }
  }
  const cleanedJson = Object.fromEntries(
    Object.entries(tempjson).filter(([key, value]) => value !== undefined)
  );

  const newData = JSON.stringify(tempjson, null, 2);
  try {
    await writeFile("src/assets/projects.json", newData, "utf-8");
    console.log(`Deletion of ${id} Successful`);
  } catch (err) {
    console.error(`Error readiting to: ${fileName}:`, err);
    return c.text(`Failed to write to: ${fileName}`, 500);
  }
  return c.text('Deleted!', 201);
})

app.post("/newproject", async (c) => {
  const fileName = "projects.json";
  let tempdata;
  try {
    
    const data = await readFile(`src/assets/${fileName}`, "utf-8");
    tempdata = JSON.parse(data);
    
  } catch (err) {
    console.error(`Error reading: ${fileName}`, err);
    return c.text(`Failed to read: ${fileName}`, 500);
  }

  // Setting body to be the JSON Data from the request
  const body = await c.req.formData();
  const entries = body.entries();
  let information = [];
  for (let entry of entries) {
    information.push(entry[0])
    information.push(entry[1])
  }
  const json = JSON.parse(String(information[3]))
  // Making a new key to the JSON file, using the data from the form
  tempdata[Object.keys(json)[0]] = json[Object.keys(json)[0]];
  // Convert the new Data to a JSON object
  const newData = JSON.stringify(tempdata, null, 2);
  // Writing the New Data to the JSON File
  try {
    await writeFile("src/assets/projects.json", newData, "utf-8");
    console.log('Insert Successful');
  } catch (err) {
    console.error(`Error readiting to: ${fileName}:`, err);
    return c.text(`Failed to write to: ${fileName}`, 500);
  }

  return c.text('Created!', 201);
});

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})

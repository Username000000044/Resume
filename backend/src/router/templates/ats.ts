import { Hono } from "hono";
import { db } from "../../../drizzle";

const app = new Hono()

// (/templates/ats/)
app.get('/', async (c) => {
  const templates = await db.query.templatesTable.findMany();
  return c.json(templates)
})

// (/templates/ats?id=2)
app.get('/:id', async (c) => {
  const id = c.req.param('id');
  const template = await db.query.templatesTable.findFirst({ 
    where: (templates, { eq }) => eq(templates.id, id)
  });


  if(template == null) {
    return c.json({ error: "Template not found"}, 404)
  }

  return c.json(template)
})

export default app;
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

// Typed Entity Query Helpers
// export const queries = {
// 	projects: {
// 		getAll: async () => {
// 			return await db.query.projects.findMany({
// 				orderBy: [desc(schema.projects.createdAt)],
// 				with: {
// 					owner: true,
// 					team: true,
// 					lists: true,
// 				},
// 			});
// 		},
// 		getById: async (id: string) => {
// 			return await db.query.projects.findFirst({
// 				where: eq(schema.projects.id, id),
// 				with: {
// 					owner: true,
// 					team: true,
// 					lists: {
// 						with: {
// 							tasks: true,
// 						},
// 					},
// 				},
// 			});
// 		},
// 		create: async (data: typeof schema.projects.$inferInsert) => {
// 			const [newProject] = await db
// 				.insert(schema.projects)
// 				.values(data)
// 				.returning();
// 			return newProject;
// 		},
// 		update: async (
// 			id: string,
// 			data: Partial<typeof schema.projects.$inferInsert>
// 		) => {
// 			const [updatedProject] = await db
// 				.update(schema.projects)
// 				.set(data)
// 				.where(eq(schema.projects.id, id))
// 				.returning();
// 			return updatedProject;
// 		},
// 		delete: async (id: string) => {
// 			const [deletedProject] = await db
// 				.delete(schema.projects)
// 				.where(eq(schema.projects.id, id))
// 				.returning();
// 			return deletedProject;
// 		},
// 	},
// 	tasks: {
// 		getByProject: async (projectId: string) => {
// 			const projectLists = await db.query.lists.findMany({
// 				where: eq(schema.lists.projectId, projectId),
// 				with: {
// 					tasks: {
// 						with: {
// 							assignee: true,
// 							comments: true,
// 						},
// 					},
// 				},
// 			});
// 			return projectLists.flatMap((list) => list.tasks);
// 		},
// 		create: async (data: typeof schema.tasks.$inferInsert) => {
// 			const [newTask] = await db
// 				.insert(schema.tasks)
// 				.values(data)
// 				.returning();
// 			return newTask;
// 		},
// 		update: async (
// 			id: string,
// 			data: Partial<typeof schema.tasks.$inferInsert>
// 		) => {
// 			const [updatedTask] = await db
// 				.update(schema.tasks)
// 				.set(data)
// 				.where(eq(schema.tasks.id, id))
// 				.returning();
// 			return updatedTask;
// 		},
// 		delete: async (id: string) => {
// 			const [deletedTask] = await db
// 				.delete(schema.tasks)
// 				.where(eq(schema.tasks.id, id))
// 				.returning();
// 			return deletedTask;
// 		},
// 	},
// };

// TODO: Task 3.2 - Configure PostgreSQL database (Vercel Postgres or Neon)
// TODO: Task 3.5 - Implement database connection and query utilities

/*
TODO: Implementation Notes for Interns:

1. Choose database provider:
   - Vercel Postgres (recommended for Vercel deployment)
   - Neon (good alternative)
   - Local PostgreSQL for development

2. Set up environment variables:
   - DATABASE_URL
   - POSTGRES_URL (if using Vercel Postgres)

3. Configure Drizzle connection
4. Implement CRUD operations for all entities
5. Add proper error handling
6. Set up connection pooling if needed

Example structure:
import { drizzle } from 'drizzle-orm/vercel-postgres'
import { sql } from '@vercel/postgres'
import * as schema from './schema'

export const db = drizzle(sql, { schema })

export const queries = {
  projects: {
    getAll: async () => { ... },
    getById: async (id: string) => { ... },
    create: async (data: any) => { ... },
    update: async (id: string, data: any) => { ... },
    delete: async (id: string) => { ... },
  },
  // ... other entity queries
}
*/

// Placeholder exports to prevent import errors
// export const db = "TODO: Implement database connection";

// export const queries = {
// 	projects: {
// 		getAll: () => {
// 			console.log("TODO: Task 4.1 - Implement project CRUD operations");
// 			return [];
// 		},
// 		getById: (id: string) => {
// 			console.log(`TODO: Get project by ID: ${id}`);
// 			return null;
// 		},
// 		create: (data: any) => {
// 			console.log("TODO: Create project", data);
// 			return null;
// 		},
// 		update: (id: string, data: any) => {
// 			console.log(`TODO: Update project ${id}`, data);
// 			return null;
// 		},
// 		delete: (id: string) => {
// 			console.log(`TODO: Delete project ${id}`);
// 			return null;
// 		},
// 	},
// 	tasks: {
// 		getByProject: (projectId: string) => {
// 			console.log(`TODO: Task 4.4 - Get tasks for project ${projectId}`);
// 			return [];
// 		},
// 		create: (data: any) => {
// 			console.log("TODO: Create task", data);
// 			return null;
// 		},
// 		update: (id: string, data: any) => {
// 			console.log(`TODO: Update task ${id}`, data);
// 			return null;
// 		},
// 		delete: (id: string) => {
// 			console.log(`TODO: Delete task ${id}`);
// 			return null;
// 		},
// 	},
// };

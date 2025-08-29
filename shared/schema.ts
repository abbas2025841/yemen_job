import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  userType: text("user_type").notNull(), // 'job_seeker' or 'employer'
  createdAt: timestamp("created_at").defaultNow(),
});

export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameEn: text("name_en"),
  description: text("description"),
  descriptionEn: text("description_en"),
  logo: text("logo"),
  website: text("website"),
  industry: text("industry"),
  location: text("location"),
  size: text("size"), // 'startup', 'small', 'medium', 'large'
  userId: varchar("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  description: text("description").notNull(),
  descriptionEn: text("description_en"),
  requirements: text("requirements"),
  requirementsEn: text("requirements_en"),
  location: text("location").notNull(),
  employmentType: text("employment_type").notNull(), // 'full_time', 'part_time', 'contract', 'remote'
  experience: text("experience"), // 'entry', 'mid', 'senior'
  category: text("category").notNull(),
  skills: text("skills").array(),
  salary: text("salary"),
  companyId: varchar("company_id").references(() => companies.id).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").references(() => jobs.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  coverLetter: text("cover_letter"),
  resumeUrl: text("resume_url"),
  status: text("status").default("pending"), // 'pending', 'reviewed', 'accepted', 'rejected'
  appliedAt: timestamp("applied_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  appliedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

// Extended types for API responses
export type JobWithCompany = Job & { company: Company };
export type ApplicationWithJob = Application & { job: JobWithCompany; user: User };

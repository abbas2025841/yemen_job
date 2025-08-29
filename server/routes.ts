import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCompanySchema, insertJobSchema, insertApplicationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Jobs API
  app.get("/api/jobs", async (req, res) => {
    try {
      const { query, location, category, employmentType } = req.query;
      const jobs = await storage.searchJobs(
        query as string,
        location as string,
        category as string,
        employmentType as string
      );
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      const company = await storage.getCompany(job.companyId);
      res.json({ ...job, company });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });

  app.post("/api/jobs", async (req, res) => {
    try {
      const jobData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(jobData);
      res.json(job);
    } catch (error) {
      res.status(400).json({ error: "Invalid job data" });
    }
  });

  // Companies API
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });

  app.get("/api/companies/:id", async (req, res) => {
    try {
      const company = await storage.getCompany(req.params.id);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      const jobs = await storage.getJobsByCompanyId(company.id);
      res.json({ ...company, jobs });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch company" });
    }
  });

  app.post("/api/companies", async (req, res) => {
    try {
      const companyData = insertCompanySchema.parse(req.body);
      const company = await storage.createCompany(companyData);
      res.json(company);
    } catch (error) {
      res.status(400).json({ error: "Invalid company data" });
    }
  });

  // Applications API
  app.post("/api/applications", async (req, res) => {
    try {
      const applicationData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(applicationData);
      res.json(application);
    } catch (error) {
      res.status(400).json({ error: "Invalid application data" });
    }
  });

  app.get("/api/applications/user/:userId", async (req, res) => {
    try {
      const applications = await storage.getApplicationsByUserId(req.params.userId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user applications" });
    }
  });

  app.get("/api/applications/job/:jobId", async (req, res) => {
    try {
      const applications = await storage.getApplicationsByJobId(req.params.jobId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch job applications" });
    }
  });

  // Users API
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  // Categories endpoint
  app.get("/api/categories", async (req, res) => {
    const categories = [
      { name: "تقنية المعلومات", nameEn: "Information Technology", count: 247 },
      { name: "الإدارة", nameEn: "Management", count: 182 },
      { name: "المبيعات والتسويق", nameEn: "Sales & Marketing", count: 156 },
      { name: "التعليم", nameEn: "Education", count: 134 },
      { name: "الرعاية الصحية", nameEn: "Healthcare", count: 98 },
      { name: "الهندسة", nameEn: "Engineering", count: 89 },
    ];
    res.json(categories);
  });

  // Locations endpoint
  app.get("/api/locations", async (req, res) => {
    const locations = [
      { name: "صنعاء", nameEn: "Sanaa" },
      { name: "عدن", nameEn: "Aden" },
      { name: "تعز", nameEn: "Taiz" },
      { name: "الحديدة", nameEn: "Hodeidah" },
      { name: "إب", nameEn: "Ibb" },
      { name: "المكلا", nameEn: "Mukalla" },
    ];
    res.json(locations);
  });

  const httpServer = createServer(app);
  return httpServer;
}

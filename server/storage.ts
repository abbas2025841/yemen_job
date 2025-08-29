import { type User, type InsertUser, type Company, type InsertCompany, type Job, type InsertJob, type Application, type InsertApplication, type JobWithCompany, type ApplicationWithJob } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Companies
  getCompany(id: string): Promise<Company | undefined>;
  getCompanies(): Promise<Company[]>;
  getCompaniesByUserId(userId: string): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: string, company: Partial<Company>): Promise<Company | undefined>;

  // Jobs
  getJob(id: string): Promise<Job | undefined>;
  getJobs(): Promise<Job[]>;
  getJobsWithCompany(): Promise<JobWithCompany[]>;
  getJobsByCompanyId(companyId: string): Promise<Job[]>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: string, job: Partial<Job>): Promise<Job | undefined>;
  searchJobs(query?: string, location?: string, category?: string, employmentType?: string): Promise<JobWithCompany[]>;

  // Applications
  getApplication(id: string): Promise<Application | undefined>;
  getApplicationsByJobId(jobId: string): Promise<ApplicationWithJob[]>;
  getApplicationsByUserId(userId: string): Promise<ApplicationWithJob[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplicationStatus(id: string, status: string): Promise<Application | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private companies: Map<string, Company>;
  private jobs: Map<string, Job>;
  private applications: Map<string, Application>;

  constructor() {
    this.users = new Map();
    this.companies = new Map();
    this.jobs = new Map();
    this.applications = new Map();

    // Initialize with sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create sample companies
    const company1 = await this.createCompany({
      name: "شركة التقنيات المتقدمة",
      nameEn: "Advanced Technologies Company",
      description: "شركة رائدة في مجال تقنية المعلومات",
      descriptionEn: "Leading company in information technology",
      industry: "تقنية المعلومات",
      location: "صنعاء",
      size: "medium",
      userId: "employer1",
    });

    const company2 = await this.createCompany({
      name: "مستشفى السلام الطبي",
      nameEn: "Al-Salam Medical Hospital",
      description: "مركز طبي متخصص",
      descriptionEn: "Specialized medical center",
      industry: "الرعاية الصحية",
      location: "عدن",
      size: "large",
      userId: "employer2",
    });

    // Create sample jobs
    await this.createJob({
      title: "مطور ويب فرونت إند",
      titleEn: "Frontend Web Developer",
      description: "نبحث عن مطور ويب محترف للانضمام إلى فريقنا لتطوير وصيانة مواقع الويب والتطبيقات التفاعلية باستخدام أحدث التقنيات",
      descriptionEn: "Looking for a professional web developer to join our team for developing and maintaining interactive websites and applications using cutting-edge technologies",
      requirements: "خبرة في React، JavaScript، CSS",
      location: "صنعاء",
      employmentType: "full_time",
      experience: "mid",
      category: "تقنية المعلومات",
      skills: ["React", "JavaScript", "CSS"],
      companyId: company1.id,
    });

    await this.createJob({
      title: "ممرض/ة مؤهل/ة",
      titleEn: "Qualified Nurse",
      description: "مطلوب ممرض/ة مؤهل/ة للعمل في قسم العناية المركزة",
      descriptionEn: "Qualified nurse required for intensive care unit",
      requirements: "بكالوريوس في التمريض، خبرة سنتين على الأقل",
      location: "عدن",
      employmentType: "full_time",
      experience: "mid",
      category: "الرعاية الصحية",
      skills: ["التمريض", "العناية المركزة", "الرعاية الصحية"],
      companyId: company2.id,
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Companies
  async getCompany(id: string): Promise<Company | undefined> {
    return this.companies.get(id);
  }

  async getCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values());
  }

  async getCompaniesByUserId(userId: string): Promise<Company[]> {
    return Array.from(this.companies.values()).filter(company => company.userId === userId);
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = randomUUID();
    const company: Company = { ...insertCompany, id, createdAt: new Date() };
    this.companies.set(id, company);
    return company;
  }

  async updateCompany(id: string, companyUpdate: Partial<Company>): Promise<Company | undefined> {
    const company = this.companies.get(id);
    if (!company) return undefined;
    
    const updatedCompany = { ...company, ...companyUpdate };
    this.companies.set(id, updatedCompany);
    return updatedCompany;
  }

  // Jobs
  async getJob(id: string): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async getJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(job => job.isActive);
  }

  async getJobsWithCompany(): Promise<JobWithCompany[]> {
    const jobs = await this.getJobs();
    const result: JobWithCompany[] = [];
    
    for (const job of jobs) {
      const company = await this.getCompany(job.companyId);
      if (company) {
        result.push({ ...job, company });
      }
    }
    
    return result.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getJobsByCompanyId(companyId: string): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(job => job.companyId === companyId && job.isActive);
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = randomUUID();
    const job: Job = { ...insertJob, id, isActive: true, createdAt: new Date() };
    this.jobs.set(id, job);
    return job;
  }

  async updateJob(id: string, jobUpdate: Partial<Job>): Promise<Job | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    
    const updatedJob = { ...job, ...jobUpdate };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  async searchJobs(query?: string, location?: string, category?: string, employmentType?: string): Promise<JobWithCompany[]> {
    let jobs = await this.getJobsWithCompany();

    if (query) {
      const searchTerm = query.toLowerCase();
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm) ||
        job.titleEn?.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.company.name.toLowerCase().includes(searchTerm)
      );
    }

    if (location) {
      jobs = jobs.filter(job => job.location === location);
    }

    if (category) {
      jobs = jobs.filter(job => job.category === category);
    }

    if (employmentType) {
      jobs = jobs.filter(job => job.employmentType === employmentType);
    }

    return jobs;
  }

  // Applications
  async getApplication(id: string): Promise<Application | undefined> {
    return this.applications.get(id);
  }

  async getApplicationsByJobId(jobId: string): Promise<ApplicationWithJob[]> {
    const applications = Array.from(this.applications.values()).filter(app => app.jobId === jobId);
    const result: ApplicationWithJob[] = [];
    
    for (const application of applications) {
      const job = await this.getJob(application.jobId);
      const user = await this.getUser(application.userId);
      const company = job ? await this.getCompany(job.companyId) : undefined;
      
      if (job && user && company) {
        result.push({ 
          ...application, 
          job: { ...job, company }, 
          user 
        });
      }
    }
    
    return result;
  }

  async getApplicationsByUserId(userId: string): Promise<ApplicationWithJob[]> {
    const applications = Array.from(this.applications.values()).filter(app => app.userId === userId);
    const result: ApplicationWithJob[] = [];
    
    for (const application of applications) {
      const job = await this.getJob(application.jobId);
      const user = await this.getUser(application.userId);
      const company = job ? await this.getCompany(job.companyId) : undefined;
      
      if (job && user && company) {
        result.push({ 
          ...application, 
          job: { ...job, company }, 
          user 
        });
      }
    }
    
    return result.sort((a, b) => new Date(b.appliedAt!).getTime() - new Date(a.appliedAt!).getTime());
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = randomUUID();
    const application: Application = { 
      ...insertApplication, 
      id, 
      status: "pending",
      appliedAt: new Date() 
    };
    this.applications.set(id, application);
    return application;
  }

  async updateApplicationStatus(id: string, status: string): Promise<Application | undefined> {
    const application = this.applications.get(id);
    if (!application) return undefined;
    
    const updatedApplication = { ...application, status };
    this.applications.set(id, updatedApplication);
    return updatedApplication;
  }
}

export const storage = new MemStorage();

import { 
  users, 
  missions, 
  contacts, 
  risks, 
  recommendations, 
  type User, 
  type InsertUser, 
  type Mission, 
  type InsertMission, 
  type Contact, 
  type InsertContact, 
  type Risk, 
  type InsertRisk, 
  type Recommendation, 
  type InsertRecommendation 
} from "@shared/schema";

// Extend the storage interface with audit-specific methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Mission methods
  getMissions(): Promise<Mission[]>;
  getMission(id: number): Promise<Mission | undefined>;
  createMission(mission: InsertMission): Promise<Mission>;
  updateMission(id: number, mission: Partial<InsertMission>): Promise<Mission | undefined>;
  deleteMission(id: number): Promise<boolean>;
  
  // Contact methods
  getContactsByMissionId(missionId: number): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  deleteContactsByMissionId(missionId: number): Promise<boolean>;
  
  // Risk methods
  getRisksByMissionId(missionId: number): Promise<Risk[]>;
  createRisk(risk: InsertRisk): Promise<Risk>;
  deleteRisksByMissionId(missionId: number): Promise<boolean>;
  
  // Recommendation methods
  getRecommendationsByMissionId(missionId: number): Promise<Recommendation[]>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  deleteRecommendationsByMissionId(missionId: number): Promise<boolean>;
  
  // Utility methods
  calculateMissionProgress(id: number): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private missions: Map<number, Mission>;
  private contacts: Map<number, Contact>;
  private risks: Map<number, Risk>;
  private recommendations: Map<number, Recommendation>;
  currentUserId: number;
  currentMissionId: number;
  currentContactId: number;
  currentRiskId: number;
  currentRecommendationId: number;

  constructor() {
    this.users = new Map();
    this.missions = new Map();
    this.contacts = new Map();
    this.risks = new Map();
    this.recommendations = new Map();
    this.currentUserId = 1;
    this.currentMissionId = 1;
    this.currentContactId = 1;
    this.currentRiskId = 1;
    this.currentRecommendationId = 1;
    
    // Add sample user
    this.createUser({
      username: "admin",
      password: "admin123",
      fullName: "Antoine Dupont",
      email: "antoine@exemple.fr",
      role: "admin"
    });
    
    // Add sample mission
    this.createMission({
      title: "Mission d'audit - SARL TechInnovate",
      companyName: "SARL TechInnovate",
      companyType: "SARL",
      registrationNumber: "123 456 789 00012",
      creationDate: "2015-06-15",
      address: "15 Rue de l'Innovation, 75001 Paris",
      activitySector: "Technologie",
      status: "in_progress",
      progress: 65,
      createdBy: 1,
      annualRevenue: "1250000",
      profitMargin: "12.5",
      totalAssets: "2100000",
      totalDebts: "850000",
      financialRatios: {
        liquidity: 2.1,
        liquidityEvaluation: "Excellent",
        debt: 0.4,
        debtEvaluation: "Satisfaisant",
        roe: 15.2,
        roeEvaluation: "Excellent"
      },
      financialComments: "L'entreprise présente une situation financière globalement saine, avec des ratios de liquidité supérieurs à la moyenne du secteur. Le niveau d'endettement est maîtrisé et la rentabilité des capitaux propres est excellente. Points d'attention : la croissance rapide des charges opérationnelles au cours du dernier exercice.",
      complianceStatus: {
        gdpr: "Partiellement conforme",
        gdprComments: "Politique de protection des données à mettre à jour. Registre des traitements incomplet.",
        laborLaw: "Conforme",
        laborLawComments: "Tous les documents sociaux sont à jour. Règlement intérieur conforme.",
        industryStandards: "Partiellement conforme",
        industryStandardsComments: "Certifications ISO en cours de renouvellement. Processus d'amélioration continue à formaliser."
      },
      governanceStructure: {
        shareholderStructure: "Actionnariat multiple",
        boardMeetings: "Trimestrielle",
        committees: ["Comité d'audit", "Comité des risques"]
      }
    });
    
    // Add sample contact
    this.createContact({
      missionId: 1,
      name: "Martin Legrand",
      position: "Directeur Général",
      email: "m.legrand@techinnovate.fr"
    });
    
    // Add sample risk
    this.createRisk({
      missionId: 1,
      riskType: "Risque opérationnel",
      probability: "Moyenne",
      impact: "Élevé",
      description: "Dépendance excessive à un fournisseur clé qui représente plus de 40% des approvisionnements.",
      mitigation: "Diversifier les sources d'approvisionnement en identifiant au moins deux fournisseurs alternatifs. Établir des contrats à long terme avec des conditions favorables."
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Mission methods
  async getMissions(): Promise<Mission[]> {
    return Array.from(this.missions.values());
  }
  
  async getMission(id: number): Promise<Mission | undefined> {
    return this.missions.get(id);
  }
  
  async createMission(insertMission: InsertMission): Promise<Mission> {
    const id = this.currentMissionId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const mission: Mission = { 
      ...insertMission, 
      id, 
      createdAt, 
      updatedAt 
    };
    this.missions.set(id, mission);
    return mission;
  }
  
  async updateMission(id: number, missionData: Partial<InsertMission>): Promise<Mission | undefined> {
    const mission = this.missions.get(id);
    if (!mission) return undefined;
    
    const updatedMission: Mission = {
      ...mission,
      ...missionData,
      updatedAt: new Date()
    };
    
    this.missions.set(id, updatedMission);
    return updatedMission;
  }
  
  async deleteMission(id: number): Promise<boolean> {
    // Delete associated contacts, risks and recommendations
    await this.deleteContactsByMissionId(id);
    await this.deleteRisksByMissionId(id);
    await this.deleteRecommendationsByMissionId(id);
    
    return this.missions.delete(id);
  }
  
  // Contact methods
  async getContactsByMissionId(missionId: number): Promise<Contact[]> {
    return Array.from(this.contacts.values()).filter(
      contact => contact.missionId === missionId
    );
  }
  
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = { ...insertContact, id };
    this.contacts.set(id, contact);
    return contact;
  }
  
  async deleteContactsByMissionId(missionId: number): Promise<boolean> {
    let deleted = false;
    for (const [id, contact] of this.contacts.entries()) {
      if (contact.missionId === missionId) {
        this.contacts.delete(id);
        deleted = true;
      }
    }
    return deleted;
  }
  
  // Risk methods
  async getRisksByMissionId(missionId: number): Promise<Risk[]> {
    return Array.from(this.risks.values()).filter(
      risk => risk.missionId === missionId
    );
  }
  
  async createRisk(insertRisk: InsertRisk): Promise<Risk> {
    const id = this.currentRiskId++;
    const risk: Risk = { ...insertRisk, id };
    this.risks.set(id, risk);
    return risk;
  }
  
  async deleteRisksByMissionId(missionId: number): Promise<boolean> {
    let deleted = false;
    for (const [id, risk] of this.risks.entries()) {
      if (risk.missionId === missionId) {
        this.risks.delete(id);
        deleted = true;
      }
    }
    return deleted;
  }
  
  // Recommendation methods
  async getRecommendationsByMissionId(missionId: number): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values()).filter(
      recommendation => recommendation.missionId === missionId
    );
  }
  
  async createRecommendation(insertRecommendation: InsertRecommendation): Promise<Recommendation> {
    const id = this.currentRecommendationId++;
    const recommendation: Recommendation = { ...insertRecommendation, id };
    this.recommendations.set(id, recommendation);
    return recommendation;
  }
  
  async deleteRecommendationsByMissionId(missionId: number): Promise<boolean> {
    let deleted = false;
    for (const [id, recommendation] of this.recommendations.entries()) {
      if (recommendation.missionId === missionId) {
        this.recommendations.delete(id);
        deleted = true;
      }
    }
    return deleted;
  }
  
  // Calculate mission progress based on completed sections
  async calculateMissionProgress(id: number): Promise<number> {
    const mission = await this.getMission(id);
    if (!mission) return 0;
    
    // Define total sections and points for each completed section
    const totalSections = 5;
    let completedSections = 0;
    
    // Check general information
    if (mission.companyName && mission.companyType && mission.registrationNumber) {
      completedSections++;
    }
    
    // Check financial analysis
    if (mission.annualRevenue && mission.profitMargin && mission.financialRatios) {
      completedSections++;
    }
    
    // Check risks
    const risks = await this.getRisksByMissionId(id);
    if (risks.length > 0) {
      completedSections++;
    }
    
    // Check compliance
    if (mission.complianceStatus && mission.governanceStructure) {
      completedSections++;
    }
    
    // Check recommendations
    const recommendations = await this.getRecommendationsByMissionId(id);
    if (recommendations.length > 0 && mission.followUpDate) {
      completedSections++;
    }
    
    return Math.round((completedSections / totalSections) * 100);
  }
}

export const storage = new MemStorage();

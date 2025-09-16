import { FormSection } from "@/lib/utils/form-sections";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MissionFormData } from "@shared/schema";
import { 
  companyTypes, 
  activitySectors, 
  complianceStatusOptions, 
  shareholderStructureOptions, 
  boardMeetingOptions, 
  committeeOptions 
} from "@/lib/utils/form-sections";
import { Checkbox } from "@/components/ui/checkbox";
import { ContactsField } from "./ContactsField";
import { RisksField } from "./RisksField";
import { RecommendationsField } from "./RecommendationsField";
import { AvantProposSection } from "./AvantProposSection";
import { MissionFrameworkSection } from "./MissionFrameworkSection";
import { OrganizationPresentationSection } from "./OrganizationPresentationSection";
import { AuditScopeSection } from "./AuditScopeSection";
import { AuditMethodologySection } from "./AuditMethodologySection";

interface AuditFormSectionProps {
  section: FormSection;
  currentSection: number;
  form: ReturnType<typeof useFormContext<MissionFormData>>;
}

export function AuditFormSection({ section, currentSection, form }: AuditFormSectionProps) {
  const isCompleted = section.isCompleted(form.getValues());

  // Section 0: Avant propos
  const renderAvantPropos = () => (
    <AvantProposSection form={form} />
  );
  
  // Section 1: Cadre de la mission
  const renderMissionFramework = () => (
    <MissionFrameworkSection form={form} />
  );
  
  // Section 2: Organization Presentation
  const renderOrgPresentation = () => (
    <OrganizationPresentationSection form={form} />
  );
  
  // Section 3: Audit Scope
  const renderAuditScope = () => (
    <AuditScopeSection form={form} />
  );
  
  // Section 4: Audit Methodology
  const renderAuditMethodology = () => (
    <AuditMethodologySection form={form} />
  );

  // Section 5: General Information
  const renderGeneralInformation = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{section.name}</h2>
        <Badge variant={isCompleted ? "default" : "outline"} className={isCompleted ? "bg-green-100 text-green-800" : ""}>
          {isCompleted ? "Complété" : "Non complété"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Titre de la mission</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Mission d'audit - SARL TechInnovate" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Nom de l'entreprise</FormLabel>
              <FormControl>
                <Input placeholder="Ex: SARL TechInnovate" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyType"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Type d'entreprise</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value ?? ""}
                value={field.value ?? ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type d'entreprise" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {companyTypes.map((type: any) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="registrationNumber"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Numéro SIRET</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 123 456 789 00012" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="creationDate"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Date de création</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="activitySector"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Secteur d'activité</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value ?? ""}
                value={field.value ?? ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un secteur d'activité" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {activitySectors.map((sector: any) => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="address"
        render={({ field }: any) => (
          <FormItem className="mb-6">
            <FormLabel>Adresse</FormLabel>
            <FormControl>
              <Textarea rows={2} placeholder="Adresse complète de l'entreprise" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="mb-6">
        <h3 className="text-md font-semibold mb-3">Contacts principaux</h3>
        <ContactsField form={form} />
      </div>
    </div>
  );

  // Section 1: Financial Analysis
  const renderFinancialAnalysis = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{section.name}</h2>
        <Badge variant={isCompleted ? "default" : "outline"} className={isCompleted ? "bg-green-100 text-green-800" : ""}>
          {isCompleted ? "Complété" : "Non complété"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FormField
          control={form.control}
          name="annualRevenue"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Chiffre d'affaires annuel (€)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ex: 1250000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profitMargin"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Marge bénéficiaire (%)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" placeholder="Ex: 12.5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalAssets"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Total des actifs (€)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ex: 2100000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalDebts"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Total des dettes (€)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ex: 850000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold mb-3">Ratios financiers</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-secondary-50">
                <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Ratio</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Valeur</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Référence sectorielle</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Évaluation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 text-sm border border-secondary-200">Ratio de liquidité</td>
                <td className="px-4 py-2 text-sm border border-secondary-200">
                  <FormField
                    control={form.control}
                    name="financialRatios.liquidity"
                    render={({ field }: any) => (
                      <FormItem className="m-0">
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="Ex: 2.1" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </td>
                <td className="px-4 py-2 text-sm border border-secondary-200">1.5 - 2.0</td>
                <td className="px-4 py-2 text-sm border border-secondary-200">
                  <FormField
                    control={form.control}
                    name="financialRatios.liquidityEvaluation"
                    render={({ field }: any) => (
                      <FormItem className="m-0">
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value ?? ""}
                          value={field.value ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Excellent">Excellent</SelectItem>
                            <SelectItem value="Satisfaisant">Satisfaisant</SelectItem>
                            <SelectItem value="À améliorer">À améliorer</SelectItem>
                            <SelectItem value="Préoccupant">Préoccupant</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm border border-secondary-200">Ratio d'endettement</td>
                <td className="px-4 py-2 text-sm border border-secondary-200">
                  <FormField
                    control={form.control}
                    name="financialRatios.debt"
                    render={({ field }: any) => (
                      <FormItem className="m-0">
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="Ex: 0.4" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </td>
                <td className="px-4 py-2 text-sm border border-secondary-200">0.4 - 0.6</td>
                <td className="px-4 py-2 text-sm border border-secondary-200">
                  <FormField
                    control={form.control}
                    name="financialRatios.debtEvaluation"
                    render={({ field }: any) => (
                      <FormItem className="m-0">
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value ?? ""}
                          value={field.value ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Excellent">Excellent</SelectItem>
                            <SelectItem value="Satisfaisant">Satisfaisant</SelectItem>
                            <SelectItem value="À améliorer">À améliorer</SelectItem>
                            <SelectItem value="Préoccupant">Préoccupant</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm border border-secondary-200">Rentabilité des capitaux propres (ROE)</td>
                <td className="px-4 py-2 text-sm border border-secondary-200">
                  <FormField
                    control={form.control}
                    name="financialRatios.roe"
                    render={({ field }: any) => (
                      <FormItem className="m-0">
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="Ex: 15.2" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </td>
                <td className="px-4 py-2 text-sm border border-secondary-200">10.0 - 15.0</td>
                <td className="px-4 py-2 text-sm border border-secondary-200">
                  <FormField
                    control={form.control}
                    name="financialRatios.roeEvaluation"
                    render={({ field }: any) => (
                      <FormItem className="m-0">
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value ?? ""}
                          value={field.value ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Excellent">Excellent</SelectItem>
                            <SelectItem value="Satisfaisant">Satisfaisant</SelectItem>
                            <SelectItem value="À améliorer">À améliorer</SelectItem>
                            <SelectItem value="Préoccupant">Préoccupant</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <FormField
        control={form.control}
        name="financialComments"
        render={({ field }: any) => (
          <FormItem className="mb-6">
            <FormLabel>Commentaires sur la situation financière</FormLabel>
            <FormControl>
              <Textarea rows={4} placeholder="Analysez la situation financière globale de l'entité..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  // Section 2: Risk Assessment
  const renderRiskAssessment = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{section.name}</h2>
        <Badge variant={isCompleted ? "default" : "outline"} className={isCompleted ? "bg-green-100 text-green-800" : ""}>
          {isCompleted ? "Complété" : "Non complété"}
        </Badge>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold mb-3">Identification des risques</h3>
        <RisksField form={form} />
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold mb-3">Matrice des risques</h3>
        <div className="bg-white border border-secondary-200 rounded-md p-4 mb-4">
          <div className="grid grid-cols-5 gap-1">
            <div className="col-span-1"></div>
            <div className="col-span-4 grid grid-cols-4 gap-1">
              <div className="text-center text-xs font-medium text-secondary-700 pb-1">Faible</div>
              <div className="text-center text-xs font-medium text-secondary-700 pb-1">Moyen</div>
              <div className="text-center text-xs font-medium text-secondary-700 pb-1">Élevé</div>
              <div className="text-center text-xs font-medium text-secondary-700 pb-1">Très élevé</div>
            </div>
            
            {/* Impact rows */}
            <div className="flex items-center justify-end pr-2 text-xs font-medium text-secondary-700">Très élevé</div>
            <div className="h-12 bg-yellow-100 rounded flex items-center justify-center"></div>
            <div className="h-12 bg-orange-100 rounded flex items-center justify-center"></div>
            <div className="h-12 bg-red-100 rounded flex items-center justify-center"></div>
            <div className="h-12 bg-red-200 rounded flex items-center justify-center"></div>
            
            <div className="flex items-center justify-end pr-2 text-xs font-medium text-secondary-700">Élevé</div>
            <div className="h-12 bg-yellow-100 rounded flex items-center justify-center"></div>
            <div className="h-12 bg-orange-100 rounded flex items-center justify-center"></div>
            <div className="h-12 bg-red-100 rounded flex items-center justify-center"></div>
            <div className="h-12 bg-red-200 rounded flex items-center justify-center"></div>
            
            <div className="flex items-center justify-end pr-2 text-xs font-medium text-secondary-700">Moyen</div>
            <div className="h-12 bg-green-100 rounded flex items-center justify-center"></div>
            <div className="h-12 bg-yellow-100 rounded flex items-center justify-center"></div>
            <div className="h-12 bg-orange-100 rounded flex items-center justify-center"></div>
            <div className="h-12 bg-red-100 rounded flex items-center justify-center"></div>
            
            <div className="flex items-center justify-end pr-2 text-xs font-medium text-secondary-700">Faible</div>
            <div className="h-12 bg-green-100 rounded flex items-center justify-center"></div>
            <div className="h-12 bg-green-100 rounded flex items-center justify-center"></div>
            <div className="h-12 bg-yellow-100 rounded flex items-center justify-center"></div>
            <div className="h-12 bg-orange-100 rounded flex items-center justify-center"></div>
          </div>
          
          <div className="mt-2 text-center text-sm font-medium text-secondary-700">Probabilité</div>
          
          <div className="mt-4 text-xs text-secondary-600">
            <p className="text-xs text-muted-foreground mt-4">
              Cette matrice aide à visualiser les risques en fonction de leur probabilité et de leur impact. 
              Plus un risque se situe vers le coin supérieur droit (zone rouge foncé), plus il est critique et nécessite une attention immédiate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Section 3: Compliance and Governance
  const renderComplianceGovernance = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{section.name}</h2>
        <Badge variant={isCompleted ? "default" : "outline"} className={isCompleted ? "bg-green-100 text-green-800" : ""}>
          {isCompleted ? "Complété" : "Non complété"}
        </Badge>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold mb-3">Conformité réglementaire</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-secondary-50">
                <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Domaine réglementaire</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Statut</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-secondary-700 border border-secondary-200">Commentaires</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 text-sm border border-secondary-200">RGPD / Protection des données</td>
                <td className="px-4 py-2 text-sm border border-secondary-200">
                  <FormField
                    control={form.control}
                    name="complianceStatus.gdpr"
                    render={({ field }: any) => (
                      <FormItem className="m-0">
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value ?? ""}
                          value={field.value ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {complianceStatusOptions.map((option: any) => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </td>
                <td className="px-4 py-2 text-sm border border-secondary-200">
                  <FormField
                    control={form.control}
                    name="complianceStatus.gdprComments"
                    render={({ field }: any) => (
                      <FormItem className="m-0">
                        <FormControl>
                          <Textarea rows={2} placeholder="Commentaires sur la conformité RGPD..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm border border-secondary-200">Droit du travail</td>
                <td className="px-4 py-2 text-sm border border-secondary-200">
                  <FormField
                    control={form.control}
                    name="complianceStatus.laborLaw"
                    render={({ field }: any) => (
                      <FormItem className="m-0">
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value ?? ""}
                          value={field.value ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {complianceStatusOptions.map((option: any) => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </td>
                <td className="px-4 py-2 text-sm border border-secondary-200">
                  <FormField
                    control={form.control}
                    name="complianceStatus.laborLawComments"
                    render={({ field }: any) => (
                      <FormItem className="m-0">
                        <FormControl>
                          <Textarea rows={2} placeholder="Commentaires sur la conformité au droit du travail..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm border border-secondary-200">Normes sectorielles</td>
                <td className="px-4 py-2 text-sm border border-secondary-200">
                  <FormField
                    control={form.control}
                    name="complianceStatus.industryStandards"
                    render={({ field }: any) => (
                      <FormItem className="m-0">
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value ?? ""}
                          value={field.value ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {complianceStatusOptions.map((option: any) => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </td>
                <td className="px-4 py-2 text-sm border border-secondary-200">
                  <FormField
                    control={form.control}
                    name="complianceStatus.industryStandardsComments"
                    render={({ field }: any) => (
                      <FormItem className="m-0">
                        <FormControl>
                          <Textarea rows={2} placeholder="Commentaires sur la conformité aux normes sectorielles..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold mb-3">Structure de gouvernance</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="governanceStructure.shareholderStructure"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Structure de l'actionnariat</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value ?? ""}
                  value={field.value ?? ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {shareholderStructureOptions.map((option: any) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="governanceStructure.boardMeetings"
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>Fréquence des réunions du conseil</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value ?? ""}
                  value={field.value ?? ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {boardMeetingOptions.map((option: any) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:col-span-2">
            <FormLabel>Existence de comités spécialisés</FormLabel>
            <div className="mt-2 space-y-2">
              {committeeOptions.map((committee: any) => (
                <FormField
                  key={committee}
                  control={form.control}
                  name="governanceStructure.committees"
                  render={({ field }: any) => {
                    const committees = field.value || [];
                    return (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={committees.includes(committee)}
                            onCheckedChange={(checked: any) => {
                              if (checked) {
                                field.onChange([...committees, committee]);
                              } else {
                                field.onChange(committees.filter((c: any) => c !== committee));
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {committee}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Section 4: Recommendations
  const renderRecommendations = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{section.name}</h2>
        <Badge variant={isCompleted ? "default" : "outline"} className={isCompleted ? "bg-green-100 text-green-800" : ""}>
          {isCompleted ? "Complété" : "Non complété"}
        </Badge>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold mb-3">Synthèse des observations</h3>
        <FormField
          control={form.control}
          name="observations"
          render={({ field }: any) => (
            <FormItem>
              <FormControl>
                <Textarea rows={4} placeholder="Résumez les principales observations de l'audit..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-3">Recommandations</h3>
        <RecommendationsField form={form} />
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold mb-3">Plan de suivi</h3>
        <div className="bg-secondary-50 p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="followUpDate"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Date de la prochaine revue</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="followUpResponsible"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Responsable du suivi</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du responsable..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="followUpDetails"
              render={({ field }: any) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Modalités de suivi</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Précisez les modalités de suivi des recommandations..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Render the appropriate section based on currentSection
  switch (currentSection) {
    case 0:
      return renderAvantPropos();
    case 1:
      return renderMissionFramework();
    case 2:
      return renderOrgPresentation();
    case 3:
      return renderAuditScope();
    case 4:
      return renderAuditMethodology();
    case 5:
      return renderGeneralInformation();
    case 6:
      return renderFinancialAnalysis();
    case 7:
      return renderRiskAssessment();
    case 8:
      return renderComplianceGovernance();
    case 9:
      return renderRecommendations();
    default:
      return null;
  }
}

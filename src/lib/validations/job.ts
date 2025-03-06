import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string()
    .min(5, 'Le titre doit contenir au moins 5 caractères')
    .max(100, 'Le titre ne doit pas dépasser 100 caractères'),
  
  description: z.string()
    .min(100, 'La description doit contenir au moins 100 caractères')
    .max(5000, 'La description ne doit pas dépasser 5000 caractères'),
  
  type: z.enum(['full-time', 'part-time', 'contract', 'internship'], {
    required_error: 'Le type de contrat est requis'
  }),
  
  location: z.string()
    .min(2, 'La localisation est requise')
    .max(100, 'La localisation ne doit pas dépasser 100 caractères'),
  
  remote: z.boolean(),
  
  salaryMin: z.string().optional()
    .refine(val => !val || Number(val) >= 0, 'Le salaire minimum doit être positif'),
  
  salaryMax: z.string().optional()
    .refine(val => !val || Number(val) >= 0, 'Le salaire maximum doit être positif'),
  
  requirements: z.array(z.string())
    .min(1, 'Au moins un prérequis est requis')
    .refine(reqs => reqs.some(req => req.trim()), 'Au moins un prérequis valide est requis'),
  
  expiresAt: z.string()
    .refine(date => {
      const expiryDate = new Date(date);
      const today = new Date();
      return expiryDate > today;
    }, 'La date d\'expiration doit être dans le futur'),
  
  status: z.enum(['draft', 'published']),
  featured: z.boolean()
}).refine(data => {
  if (data.salaryMin && data.salaryMax) {
    return Number(data.salaryMin) <= Number(data.salaryMax);
  }
  return true;
}, {
  message: 'Le salaire minimum ne peut pas être supérieur au salaire maximum',
  path: ['salaryMin']
});

export type JobFormData = z.infer<typeof jobSchema>;
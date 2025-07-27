import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { Briefcase, Users, TrendingUp, Mail, Phone, Building, MapPin, DollarSign, Clock, Star } from 'lucide-react';

// Validation schema for hiring inquiry
const hiringSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  contactPerson: z.string().min(2, 'Contact person name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Please enter a valid phone number (e.g., +234...)'),
  jobTitle: z.string().min(2, 'Job title must be at least 2 characters'),
  department: z.string().min(2, 'Department must be at least 2 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  jobType: z.string().min(1, 'Please select a job type'),
  experienceLevel: z.string().min(1, 'Please select an experience level'),
  skillsRequired: z.array(z.string()).min(1, 'Please select at least one required skill'),
  salaryRange: z.string().min(1, 'Please select a salary range'),
  jobDescription: z.string().min(100, 'Job description must be at least 100 characters'),
  companyDescription: z.string().min(50, 'Company description must be at least 50 characters'),
  benefits: z.string().optional(),
  urgency: z.string().min(1, 'Please select hiring urgency'),
  // Honeypot field for spam protection
  website: z.string().max(0, 'Form submission rejected')
});

type HiringFormData = z.infer<typeof hiringSchema>;

// Available skills/specializations
const availableSkills = [
  'Web Development',
  'Mobile App Development',
  'Software Engineering',
  'Data Science',
  'Artificial Intelligence',
  'Machine Learning',
  'Cybersecurity',
  'Network Administration',
  'Database Management',
  'Cloud Computing',
  'DevOps',
  'UI/UX Design',
  'Digital Marketing',
  'Project Management',
  'Quality Assurance',
  'Technical Writing',
  'System Administration',
  'Business Analysis',
  'Electrical Installation',
  'Plumbing',
  'Welding & Fabrication',
  'Carpentry',
  'Construction Management',
  'HVAC Systems',
  'Automotive Maintenance'
];

// Graduate success stories data
const successStories = [
  {
    name: 'Adebayo Johnson',
    role: 'Full Stack Developer',
    company: 'TechCorp Nigeria',
    program: 'Web Development',
    testimonial: 'FolioTech graduates bring both technical skills and practical problem-solving abilities to our team.',
    image: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Chioma Okafor',
    role: 'Network Administrator',
    company: 'DataFlow Systems',
    program: 'Networking',
    testimonial: 'The hands-on training at FolioTech prepared me perfectly for real-world challenges.',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Emmanuel Nwachukwu',
    role: 'Construction Supervisor',
    company: 'BuildRight Construction',
    program: 'Construction Technologies',
    testimonial: 'FolioTech graduates understand both theory and practice, making them valuable team members.',
    image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  }
];

export default function HireAGraduate() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<HiringFormData>({
    resolver: zodResolver(hiringSchema),
    defaultValues: {
      skillsRequired: [],
      website: '' // Honeypot field
    }
  });

  const onSubmit = async (data: HiringFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // Remove honeypot field before submission
      const { website, ...submissionData } = data;
      
      // TODO: Implement actual form submission to backend
      console.log('Hiring inquiry submitted:', submissionData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting hiring inquiry:', error);
      setSubmitError('Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <>
        <Helmet>
          <title>Thank You | Hire a Graduate | FolioTech Institute</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Thank You for Your Interest!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We've received your hiring inquiry and will connect you with suitable candidates. 
              Our placement team will contact you within 1-2 business days.
            </p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Hire a Graduate | FolioTech Institute</title>
        <meta name="description" content="Connect with skilled FolioTech Institute graduates ready to contribute to your organization's success." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Hire a Graduate
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Connect with skilled FolioTech Institute graduates who are ready to contribute 
              to your organization's success with practical skills and fresh perspectives.
            </p>
          </div>

          {/* Why Hire Our Graduates Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-center">
              <TrendingUp className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Industry-Ready Skills
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our graduates are trained with current industry standards and real-world projects
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-center">
              <Users className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Diverse Talent Pool
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access graduates from technology, vocational, and construction programs
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-center">
              <Star className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Proven Track Record
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                92% employment rate with high employer satisfaction scores
              </p>
            </div>
          </div>

          {/* Success Stories */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
              Success Stories
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                  <div className="flex items-center mb-4">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{story.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{story.role} at {story.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 italic mb-2">"{story.testimonial}"</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Graduate: {story.program}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hiring Inquiry Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Submit Hiring Inquiry
            </h2>

            {submitError && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Company Information */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register('companyName')}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pl-10"
                    />
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    {...register('contactPerson')}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.contactPerson && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contactPerson.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      {...register('email')}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pl-10"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      {...register('phone')}
                      placeholder="+234..."
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pl-10"
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Job Details */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    {...register('jobTitle')}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.jobTitle && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.jobTitle.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    {...register('department')}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.department && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.department.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register('location')}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pl-10"
                    />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Job Type
                  </label>
                  <select
                    {...register('jobType')}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select job type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                  </select>
                  {errors.jobType && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.jobType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Experience Level Required
                  </label>
                  <select
                    {...register('experienceLevel')}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select experience level</option>
                    <option value="entry">Entry Level (0-2 years)</option>
                    <option value="mid">Mid Level (2-5 years)</option>
                    <option value="senior">Senior Level (5+ years)</option>
                    <option value="any">Any experience level</option>
                  </select>
                  {errors.experienceLevel && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.experienceLevel.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Salary Range (NGN per month)
                  </label>
                  <div className="relative">
                    <select
                      {...register('salaryRange')}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pl-10"
                    >
                      <option value="">Select salary range</option>
                      <option value="50k-100k">₦50,000 - ₦100,000</option>
                      <option value="100k-200k">₦100,000 - ₦200,000</option>
                      <option value="200k-350k">₦200,000 - ₦350,000</option>
                      <option value="350k-500k">₦350,000 - ₦500,000</option>
                      <option value="500k+">₦500,000+</option>
                      <option value="negotiable">Negotiable</option>
                    </select>
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.salaryRange && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.salaryRange.message}</p>
                  )}
                </div>
              </div>

              {/* Skills Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Required Skills (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableSkills.map((skill) => (
                    <div key={skill} className="flex items-center">
                      <input
                        type="checkbox"
                        value={skill}
                        {...register('skillsRequired')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {skill}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.skillsRequired && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.skillsRequired.message}</p>
                )}
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Description
                </label>
                <textarea
                  {...register('jobDescription')}
                  rows={4}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Describe the role, responsibilities, and what the candidate will be working on..."
                />
                {errors.jobDescription && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.jobDescription.message}</p>
                )}
              </div>

              {/* Company Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Description
                </label>
                <textarea
                  {...register('companyDescription')}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Tell us about your company, culture, and what makes it a great place to work..."
                />
                {errors.companyDescription && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyDescription.message}</p>
                )}
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Benefits & Perks (Optional)
                </label>
                <textarea
                  {...register('benefits')}
                  rows={2}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Health insurance, flexible hours, professional development, etc."
                />
              </div>

              {/* Hiring Urgency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hiring Urgency
                </label>
                <div className="relative">
                  <select
                    {...register('urgency')}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pl-10"
                  >
                    <option value="">Select urgency</option>
                    <option value="immediate">Immediate (within 2 weeks)</option>
                    <option value="soon">Soon (within 1 month)</option>
                    <option value="flexible">Flexible (within 3 months)</option>
                    <option value="planning">Planning ahead (3+ months)</option>
                  </select>
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                {errors.urgency && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.urgency.message}</p>
                )}
              </div>

              {/* Honeypot field - hidden from users but bots will fill it out */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website (Leave this empty)</label>
                <input type="text" id="website" {...register('website')} tabIndex={-1} autoComplete="off" />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="animate-spin mr-2 h-5 w-5" />
                      Submitting Inquiry...
                    </>
                  ) : (
                    <>
                      <Briefcase className="mr-2 h-5 w-5" />
                      Submit Hiring Inquiry
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Need Immediate Assistance?
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  For urgent hiring needs or questions about our graduates:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <a href="tel:+2347088616350" className="text-blue-600 dark:text-blue-400 hover:underline">
                      +234-708-861-6350
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <a href="mailto:careers@foliotechinstitute.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                      careers@foliotechinstitute.com
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Our placement team is available:
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>Monday - Friday: 9:00 AM - 5:00 PM</li>
                  <li>Response time: Within 24 hours</li>
                  <li>Graduate profiles available upon request</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
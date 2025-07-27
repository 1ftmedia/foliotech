import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { Users, BookOpen, Clock, Mail, Phone, User, GraduationCap, Award, Heart } from 'lucide-react';

// Validation schema for volunteer application
const volunteerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Please enter a valid phone number (e.g., +234...)'),
  profession: z.string().min(2, 'Please specify your profession'),
  experience: z.string().min(1, 'Please select your experience level'),
  expertise: z.array(z.string()).min(1, 'Please select at least one area of expertise'),
  availability: z.string().min(1, 'Please specify your availability'),
  motivation: z.string().min(50, 'Please provide at least 50 characters explaining your motivation'),
  previousTeaching: z.boolean(),
  teachingExperience: z.string().optional(),
  preferredFormat: z.string().min(1, 'Please select a preferred teaching format'),
  // Honeypot field for spam protection
  website: z.string().max(0, 'Form submission rejected')
});

type VolunteerFormData = z.infer<typeof volunteerSchema>;

// Available expertise areas
const expertiseAreas = [
  'Computer Technology',
  'Web Development',
  'Mobile App Development',
  'Artificial Intelligence',
  'Data Science',
  'Cybersecurity',
  'Networking',
  'Database Management',
  'Software Engineering',
  'UI/UX Design',
  'Digital Marketing',
  'Project Management',
  'Entrepreneurship',
  'Business Development',
  'Vocational Skills',
  'Construction Technologies',
  'Electrical Work',
  'Mechanical Skills',
  'Other'
];

export default function VolunteerToTeach() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      expertise: [],
      previousTeaching: false,
      website: '' // Honeypot field
    }
  });

  const previousTeaching = watch('previousTeaching');

  const onSubmit = async (data: VolunteerFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // Remove honeypot field before submission
      const { website, ...submissionData } = data;
      
      // TODO: Implement actual form submission to backend
      console.log('Volunteer application submitted:', submissionData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting volunteer application:', error);
      setSubmitError('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <>
        <Helmet>
          <title>Thank You | Volunteer to Teach | FolioTech Institute</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Thank You for Volunteering!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We've received your volunteer application and will review it shortly. 
              Our team will contact you within 2-3 business days.
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
        <title>Volunteer to Teach | FolioTech Institute</title>
        <meta name="description" content="Share your expertise and help shape the next generation of tech professionals at FolioTech Institute." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Volunteer to Teach
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Share your expertise and help shape the next generation of tech professionals. 
              Join our community of volunteer educators making a difference.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-center">
              <BookOpen className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Share Knowledge
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Pass on your valuable industry experience to eager students
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-center">
              <Award className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Build Your Profile
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enhance your professional reputation and expand your network
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-center">
              <Heart className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Make Impact
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Contribute to Nigeria's tech ecosystem and future workforce
              </p>
            </div>
          </div>

          {/* Application Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Volunteer Application
            </h2>

            {submitError && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register('fullName')}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pl-10"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName.message}</p>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Profession
                  </label>
                  <input
                    type="text"
                    {...register('profession')}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.profession && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.profession.message}</p>
                  )}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Years of Professional Experience
                </label>
                <select
                  {...register('experience')}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select experience level</option>
                  <option value="1-3">1-3 years</option>
                  <option value="4-7">4-7 years</option>
                  <option value="8-12">8-12 years</option>
                  <option value="13+">13+ years</option>
                </select>
                {errors.experience && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.experience.message}</p>
                )}
              </div>

              {/* Areas of Expertise */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Areas of Expertise (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {expertiseAreas.map((area) => (
                    <div key={area} className="flex items-center">
                      <input
                        type="checkbox"
                        value={area}
                        {...register('expertise')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {area}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.expertise && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.expertise.message}</p>
                )}
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Availability
                </label>
                <select
                  {...register('availability')}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select your availability</option>
                  <option value="weekdays">Weekdays (Mon-Fri)</option>
                  <option value="weekends">Weekends (Sat-Sun)</option>
                  <option value="evenings">Evenings (After 6 PM)</option>
                  <option value="flexible">Flexible schedule</option>
                  <option value="specific">Specific days/times (please specify in motivation)</option>
                </select>
                {errors.availability && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.availability.message}</p>
                )}
              </div>

              {/* Teaching Experience */}
              <div>
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    {...register('previousTeaching')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    I have previous teaching or training experience
                  </label>
                </div>

                {previousTeaching && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Please describe your teaching/training experience
                    </label>
                    <textarea
                      {...register('teachingExperience')}
                      rows={3}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Describe your teaching experience, training programs, workshops, etc."
                    />
                  </div>
                )}
              </div>

              {/* Preferred Teaching Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Preferred Teaching Format
                </label>
                <select
                  {...register('preferredFormat')}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select preferred format</option>
                  <option value="in-person">In-person classes</option>
                  <option value="virtual">Virtual/Online sessions</option>
                  <option value="hybrid">Hybrid (both in-person and virtual)</option>
                  <option value="workshops">One-time workshops</option>
                  <option value="mentoring">One-on-one mentoring</option>
                </select>
                {errors.preferredFormat && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.preferredFormat.message}</p>
                )}
              </div>

              {/* Motivation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Why do you want to volunteer with FolioTech Institute?
                </label>
                <textarea
                  {...register('motivation')}
                  rows={4}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Tell us about your motivation to teach, what you hope to contribute, and how you align with our mission..."
                />
                {errors.motivation && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.motivation.message}</p>
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
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <GraduationCap className="mr-2 h-5 w-5" />
                      Submit Volunteer Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Additional Information */}
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              What to Expect Next
            </h3>
            <div className="space-y-3 text-gray-600 dark:text-gray-400">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <p>We'll review your application within 2-3 business days</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">2</span>
                </div>
                <p>If selected, we'll schedule a brief interview to discuss your interests and availability</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">3</span>
                </div>
                <p>We'll provide orientation and support to help you get started as a volunteer educator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
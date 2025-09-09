import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Building2, User, Phone, DollarSign, Info } from 'lucide-react';
import type { ApplicationFormData } from '../../../lib/validation/application';

function AccommodationStep() {
  const { register, watch, formState: { errors } } = useFormContext<ApplicationFormData>();
  const needsAccommodation = watch('accommodation.needsAccommodation');
  const sponsorshipType = watch('accommodation.sponsorshipType');

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Accommodation & Sponsorship
        </h3>
        
      {/* Accommodation Preference */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Accommodation Preference
        </h4>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            {...register('accommodation.needsAccommodation')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Do you need accommodation?
          </label>
        </div>

        {needsAccommodation && (
          <div className="ml-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center mb-2">
              <Building2 className="h-5 w-5 text-gray-400 mr-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                On-campus accommodation costs ₦30,000 per month
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Accommodation includes furnished room, utilities, and security
            </p>
          </div>
        )}
      </div>

      {/* Sponsorship Type */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Sponsorship Information
        </h4>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          How will your education be sponsored?
        </label>
        <div className="mt-1 relative">
          <select
            {...register('accommodation.sponsorshipType')}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 
              shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pl-10"
          >
            <option value="">Select sponsorship type</option>
            <option value="self">Self-Sponsored</option>
            <option value="organization">Organization/Company</option>
            <option value="guardian">Parent/Guardian</option>
          </select>
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        {errors.accommodation?.sponsorshipType && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.accommodation.sponsorshipType.message}
          </p>
        )}
      </div>

      {/* Sponsor Details */}
      {sponsorshipType && sponsorshipType !== 'self' && (
        <div className="space-y-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
            Sponsor Details
          </h4>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sponsor Name
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  {...register('accommodation.sponsorDetails.name')}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                    shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pl-10"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.accommodation?.sponsorDetails?.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.accommodation.sponsorDetails.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Relationship to Student
              </label>
              <input
                type="text"
                {...register('accommodation.sponsorDetails.relationship')}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                  shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              {errors.accommodation?.sponsorDetails?.relationship && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.accommodation.sponsorDetails.relationship.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact Information
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  {...register('accommodation.sponsorDetails.contact')}
                  placeholder="Phone number or email address"
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                    shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pl-10"
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.accommodation?.sponsorDetails?.contact && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.accommodation.sponsorDetails.contact.message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Cost Breakdown */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Monthly Cost Breakdown
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Tuition Fee</span>
            <span className="font-medium text-gray-900 dark:text-white">₦40,000</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Student Allowance</span>
            <span className="font-medium text-gray-900 dark:text-white">₦30,000</span>
          </div>
          {needsAccommodation && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Accommodation</span>
              <span className="font-medium text-gray-900 dark:text-white">₦30,000</span>
            </div>
          )}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-base font-medium">
              <span className="text-gray-900 dark:text-white">Total Monthly Cost</span>
              <span className="text-blue-600 dark:text-blue-400">
                ₦{(needsAccommodation ? 100000 : 70000).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-md">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>Note:</strong> Student allowance is provided to support living expenses during your studies.
          </p>
        </div>
      </div>
    </div>
  );
}

export { AccommodationStep };
export default AccommodationStep;
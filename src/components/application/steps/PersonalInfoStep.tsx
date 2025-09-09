import React from 'react';
import { useFormContext } from 'react-hook-form';
import { User, Mail, Phone, MapPin, Calendar, Globe, Building, Heart } from 'lucide-react';
import type { PersonalInfo } from '../../../lib/validation/application';

function PersonalInfoStep() {
  const { register, formState: { errors } } = useFormContext<{ personalInfo: PersonalInfo }>();

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex items-center mb-6">
          <User className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Personal Information
          </h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Surname */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Surname *
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                {...register('personalInfo.surname')}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                  shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 
                  dark:text-white pl-10"
                placeholder="Enter your surname"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.personalInfo?.surname && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.personalInfo.surname.message}
              </p>
            )}
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name *
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                {...register('personalInfo.firstName')}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                  shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 
                  dark:text-white pl-10"
                placeholder="Enter your first name"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.personalInfo?.firstName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.personalInfo.firstName.message}
              </p>
            )}
          </div>

          {/* Middle Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Middle Name
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                {...register('personalInfo.middleName')}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                  shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 
                  dark:text-white pl-10"
                placeholder="Enter your middle name (optional)"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address *
            </label>
            <div className="mt-1 relative">
              <input
                type="email"
                {...register('personalInfo.email')}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                  shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 
                  dark:text-white pl-10"
                placeholder="Enter your email address"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.personalInfo?.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.personalInfo.email.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number *
            </label>
            <div className="mt-1 relative">
              <input
                type="tel"
                {...register('personalInfo.phoneNumber')}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                  shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 
                  dark:text-white pl-10"
                placeholder="+2341234567890"
              />
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.personalInfo?.phoneNumber && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.personalInfo.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date of Birth *
            </label>
            <div className="mt-1 relative">
              <input
                type="date"
                {...register('personalInfo.dateOfBirth')}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                  shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 
                  dark:text-white pl-10"
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.personalInfo?.dateOfBirth && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.personalInfo.dateOfBirth.message}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Gender *
            </label>
            <div className="mt-1">
              <select
                {...register('personalInfo.gender')}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                  shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 
                  dark:text-white"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            {errors.personalInfo?.gender && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.personalInfo.gender.message}
              </p>
            )}
          </div>

          {/* Marital Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Marital Status *
            </label>
            <div className="mt-1">
              <select
                {...register('personalInfo.maritalStatus')}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                  shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 
                  dark:text-white"
              >
                <option value="">Select marital status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
              </select>
            </div>
            {errors.personalInfo?.maritalStatus && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.personalInfo.maritalStatus.message}
              </p>
            )}
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nationality *
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                {...register('personalInfo.nationality')}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                  shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 
                  dark:text-white pl-10"
                placeholder="Enter your nationality"
              />
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.personalInfo?.nationality && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.personalInfo.nationality.message}
              </p>
            )}
          </div>

          {/* State of Origin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              State of Origin *
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                {...register('personalInfo.stateOfOrigin')}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                  shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 
                  dark:text-white pl-10"
                placeholder="Enter your state of origin"
              />
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.personalInfo?.stateOfOrigin && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.personalInfo.stateOfOrigin.message}
              </p>
            )}
          </div>

          {/* Religion */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Religion
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                {...register('personalInfo.religion')}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                  shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 
                  dark:text-white pl-10"
                placeholder="Enter your religion (optional)"
              />
              <Heart className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Contact Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contact Address *
            </label>
            <div className="mt-1 relative">
              <textarea
                {...register('personalInfo.contactAddress')}
                rows={3}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                  shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 
                  dark:text-white pl-10"
                placeholder="Enter your complete residential address"
              />
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            {errors.personalInfo?.contactAddress && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.personalInfo.contactAddress.message}
              </p>
            )}
          </div>

          {/* Disability Information */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                {...register('personalInfo.disability.hasDisability')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Do you have any disability?
              </label>
            </div>
            
            {errors.personalInfo?.disability?.hasDisability && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.personalInfo.disability.hasDisability.message}
              </p>
            )}

            {/* Conditional disability details */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Disability Details (if applicable)
              </label>
              <div className="mt-1">
                <textarea
                  {...register('personalInfo.disability.details')}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                    shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 
                    dark:text-white"
                  placeholder="Please describe any disabilities or special needs..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { PersonalInfoStep };
export default PersonalInfoStep;
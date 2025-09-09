import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { GraduationCap, Plus, Award, Trash2 } from 'lucide-react';
import type { ApplicationFormData } from '../../../lib/validation/application';

function EducationStep() {
  const { register, control, watch, formState: { errors } } = useFormContext<ApplicationFormData>();
  
  const educationLevel = watch('academicBackground.educationLevel');
  
  const { fields: certificates, append: addCertificate, remove: removeCertificate } = useFieldArray({
    control,
    name: 'academicBackground.certificates'
  });

  const handleAddCertificate = () => {
    addCertificate({ type: '', grade: '', year: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Education Level
        </label>
        <select
          {...register('academicBackground.educationLevel')}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
            shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Select education level</option>
          <option value="none">None</option>
          <option value="primary">Primary School</option>
          <option value="js">Junior Secondary</option>
          <option value="jsse">JSSE</option>
          <option value="ssce">SSCE</option>
          <option value="tertiary">Tertiary</option>
        </select>
        {errors.academicBackground?.educationLevel && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.academicBackground.educationLevel.message}
          </p>
        )}
      </div>

      {educationLevel === 'tertiary' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tertiary Education Level
          </label>
          <div className="mt-1 relative">
            <select
              {...register('academicBackground.tertiaryEducation')}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pl-10"
            >
              <option value="none">None</option>
              <option value="certificate">Certificate</option>
              <option value="national_diploma">National Diploma (ND/OND)</option>
              <option value="degree">Degree (B.Sc/HND/BA/B.E)</option>
              <option value="other">Other</option>
            </select>
            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {errors.academicBackground?.tertiaryEducation && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.academicBackground.tertiaryEducation.message}
            </p>
          )}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
            Certificates & Qualifications
          </h4>
          <button
            type="button"
            onClick={handleAddCertificate}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Certificate
          </button>
        </div>
        
        {certificates.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No certificates added yet</p>
            <button
              type="button"
              onClick={handleAddCertificate}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Certificate
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {certificates.map((_, index) => (
              <div key={index} className="grid gap-4 md:grid-cols-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Certificate Type
                  </label>
                  <input
                    type="text"
                    {...register(`academicBackground.certificates.${index}.type`)}
                    placeholder="e.g., WAEC, NECO, JAMB"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                      shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Grade
                  </label>
                  <input
                    type="text"
                    {...register(`academicBackground.certificates.${index}.grade`)}
                    placeholder="e.g., A1, B2, Credit"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                      shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Year
                  </label>
                  <input
                    type="text"
                    {...register(`academicBackground.certificates.${index}.year`)}
                    placeholder="e.g., 2023"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                      shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                {certificates.length > 1 && (
                  <div className="md:col-span-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeCertificate(index)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Information Notice */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          <strong>Important:</strong> Please ensure all academic information is accurate. 
          You may be required to provide original certificates during the verification process.
        </p>
      </div>
    </div>
  );
}

export { EducationStep };
export default EducationStep;
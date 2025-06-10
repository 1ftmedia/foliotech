import React, { useState } from 'react';
import { subscribeToNewsletter } from '../lib/api/newsletter';
import { Loader2, Mail, CheckCircle, XCircle } from 'lucide-react';

interface NewsletterFormProps {
  className?: string;
}

export function NewsletterForm({ className = '' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) return;
    
    try {
      setIsSubmitting(true);
      setStatus('idle');
      setMessage('');
      
      const result = await subscribeToNewsletter(email);
      
      if (result.success) {
        setStatus('success');
        setEmail(''); // Clear the input on success
      } else {
        setStatus('error');
      }
      
      setMessage(result.message);
    } catch (error) {
      setStatus('error');
      setMessage('An unexpected error occurred. Please try again later.');
      console.error('Newsletter subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${className}`}>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="px-4 py-2 border-none rounded-l-md text-black focus:outline-none w-full"
            disabled={isSubmitting}
            aria-label="Email for newsletter subscription"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#4CAF50] text-white rounded-r-md hover:bg-[#45a049] transition-colors duration-300 absolute right-0 top-0 h-full flex items-center justify-center min-w-[100px]"
            disabled={isSubmitting}
            aria-label="Subscribe to newsletter"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <>Subscribe</>
            )}
          </button>
        </div>
        
        {status === 'success' && (
          <div className="flex items-center text-green-500 text-sm mt-1">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>{message}</span>
          </div>
        )}
        
        {status === 'error' && (
          <div className="flex items-center text-red-500 text-sm mt-1">
            <XCircle className="h-4 w-4 mr-1" />
            <span>{message}</span>
          </div>
        )}
      </form>
    </div>
  );
}
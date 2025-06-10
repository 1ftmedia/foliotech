import { supabase } from '../supabase/client';
import { z } from 'zod';
import { toast } from 'react-hot-toast';

// Email validation schema
export const emailSchema = z.string().email('Please enter a valid email address');

/**
 * Subscribe an email to the newsletter
 * @param email The email to subscribe
 * @returns Promise with success status and message
 */
export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // Validate email format
    emailSchema.parse(email);

    // Insert email into subscribers table
    const { error } = await supabase
      .from('subscribers')
      .insert([{ email }]);

    if (error) {
      // Handle unique constraint violation (duplicate email)
      if (error.code === '23505') {
        return {
          success: false,
          message: 'This email is already subscribed to our newsletter.'
        };
      }
      
      // Handle other errors
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    // Show success toast
    toast.success('Thank you for subscribing to our newsletter!');
    
    // Return success result
    return {
      success: true,
      message: 'You have been successfully subscribed to our newsletter.'
    };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    
    // Show error toast
    if (error instanceof z.ZodError) {
      toast.error('Please enter a valid email address.');
      return {
        success: false,
        message: 'Please enter a valid email address.'
      };
    }
    
    toast.error('Failed to subscribe. Please try again later.');
    
    // Return error result
    return {
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to subscribe to newsletter'
    };
  }
}
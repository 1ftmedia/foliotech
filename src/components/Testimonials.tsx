import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: "At Folio Tech Institute, I, Adamas Ingah, honed my welding and fabrication skills from February to November 2022. Mentored by M.D. Baba Olumide and Baba Akintoye, I learned leadership, safety, and organization. Folio Tech is a family that shaped my life, and I am proud to be part of it.",
    author:"Adamas Ingah",
    role:  "Welding and Fabrication Student",
    image: "https://res.cloudinary.com/dtzv2ckwm/image/upload/v1755792725/studen1_fofpa5.jpg"
  },
  {
    id: 2,
    quote: "When I enrolled for tailoring, I just wanted to learn how to cut and sew clothes, but the CEO called me and told me that I could be a designer as well. From that day, I took on myself to be a fashion designer",
    author: "Ms. Peace David",
    role: "Fashion Design Student",
    image: "https://res.cloudinary.com/dtzv2ckwm/image/upload/v1755791195/student2_l87vcc.jpg"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Student Success Stories
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Hear from our alumni about their journey at FolioTech Institute
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-lg transition-transform hover:scale-105"
            >
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <blockquote className="text-xl text-gray-700 dark:text-gray-300 mb-6">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center">
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={testimonial.image}
                  alt={testimonial.author}
                />
                <div className="ml-4">
                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-base text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

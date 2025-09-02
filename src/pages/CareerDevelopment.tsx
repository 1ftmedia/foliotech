import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Briefcase, BookOpen, Search, Filter, ChevronDown, ChevronUp, ExternalLink,
  Star, Clock, Award, DollarSign, Bookmark, ArrowRight
} from 'lucide-react';
import { supabase } from '../lib/supabase/client';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../components/auth/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Types
interface CareerTrack {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  salary_range: string;
  demand_level: 'high' | 'medium' | 'low';
  tools: string[];
  certifications: string[];
  icon: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'video' | 'article' | 'course' | 'book' | 'interactive';
  level: 'beginner' | 'intermediate' | 'advanced';
  is_free: boolean;
  track_id: string;
  rating: number;
  review_count: number;
}

// Main Component
export default function CareerDevelopment() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'tracks' | 'resources'>('tracks');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [careerTracks, setCareerTracks] = useState<CareerTrack[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  
  // Filter states
  const [trackFilter, setTrackFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [resourceTypeFilter, setResourceTypeFilter] = useState<string>('all');
  const [resourceFreeFilter, setResourceFreeFilter] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI states
  const [expandedTrackId, setExpandedTrackId] = useState<string | null>(null);
  const [bookmarkedResources, setBookmarkedResources] = useState<string[]>([]);
  
  // Intersection observer for animations
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [tracksRef, tracksInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [resourcesRef, resourcesInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch career tracks
        const { data: tracksData, error: tracksError } = await supabase
          .from('career_tracks')
          .select('*');
        
        if (tracksError) throw new Error(`Failed to fetch career tracks: ${tracksError.message}`);
        
        // Fetch resources
        const { data: resourcesData, error: resourcesError } = await supabase
          .from('learning_resources')
          .select('*');
        
        if (resourcesError) throw new Error(`Failed to fetch resources: ${resourcesError.message}`);
        
        // Set data
        setCareerTracks(tracksData || []);
        setResources(resourcesData || []);
        
        // Load user bookmarks if logged in
        if (user) {
          const { data: userPrefs, error: userPrefsError } = await supabase
            .from('user_preferences')
            .select('bookmarked_resources')
            .eq('user_id', user.id)
            .single();
          
          if (!userPrefsError && userPrefs) {
            setBookmarkedResources(userPrefs.bookmarked_resources || []);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Toggle bookmark for a resource
  const toggleBookmark = async (resourceId: string) => {
    if (!user) {
      toast.error('Please sign in to bookmark resources');
      return;
    }
    
    try {
      const newBookmarks = bookmarkedResources.includes(resourceId)
        ? bookmarkedResources.filter(id => id !== resourceId)
        : [...bookmarkedResources, resourceId];
      
      setBookmarkedResources(newBookmarks);
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          bookmarked_resources: newBookmarks,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast.success(
        bookmarkedResources.includes(resourceId)
          ? 'Resource removed from bookmarks'
          : 'Resource bookmarked successfully'
      );
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      toast.error('Failed to update bookmarks');
      
      // Revert state on error
      setBookmarkedResources(bookmarkedResources);
    }
  };

  // Filter career tracks
  const filteredTracks = careerTracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || track.level === levelFilter;
    
    return matchesSearch && matchesLevel;
  });

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrack = trackFilter === 'all' || resource.track_id === trackFilter;
    const matchesLevel = levelFilter === 'all' || resource.level === levelFilter;
    const matchesType = resourceTypeFilter === 'all' || resource.type === resourceTypeFilter;
    const matchesFree = resourceFreeFilter === null || resource.is_free === resourceFreeFilter;
    
    return matchesSearch && matchesTrack && matchesLevel && matchesType && matchesFree;
  });

  // Get icon component based on string name
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'briefcase': <Briefcase className="h-6 w-6" />,
      'book': <BookOpen className="h-6 w-6" />,
      'award': <Award className="h-6 w-6" />,
      'compass': <Briefcase className="h-6 w-6" />
    };
    
    return iconMap[iconName] || <Briefcase className="h-6 w-6" />;
  };

  // Mock data for demonstration
  const mockCareerTracks: CareerTrack[] = [
    {
      id: '1',
      title: 'Carpentry',
      description: 'Learn woodworking techniques and furniture construction.',
      level: 'beginner',
      duration: '6 months',
      salary_range: '₦100,000 - ₦300,000',
      demand_level: 'medium',
      tools: ['Hammer', 'Saw', 'Chisel', 'Drill', 'Measuring Tape'],
      certifications: ['National Vocational Certificate in Carpentry', 'City & Guilds Carpentry Level 1'],
      icon: 'briefcase'
    },
    {
      id: '2',
      title: 'Block-Laying and Concrete Works',
      description: 'Master the fundamentals of construction and concrete work.',
      level: 'beginner',
      duration: '6 months',
      salary_range: '₦120,000 - ₦350,000',
      demand_level: 'high',
      tools: ['Trowel', 'Level', 'Mixer', 'Wheelbarrow', 'Masonry Saw'],
      certifications: ['National Vocational Certificate in Masonry', 'NCCER Concrete Finishing'],
      icon: 'book'
    },
    {
      id: '3',
      title: 'Steel Fabrication',
      description: 'Learn metal fabrication and welding techniques.',
      level: 'intermediate',
      duration: '6 months',
      salary_range: '₦150,000 - ₦400,000',
      demand_level: 'high',
      tools: ['Welding Machine', 'Grinder', 'Cutting Torch', 'Measuring Tape', 'Clamps'],
      certifications: ['AWS Certified Welder', 'NCCER Structural Welding'],
      icon: 'compass'
    },
    {
      id: '4',
      title: 'Tiling',
      description: 'Master the art of tile installation and design.',
      level: 'beginner',
      duration: '3 months',
      salary_range: '₦80,000 - ₦250,000',
      demand_level: 'medium',
      tools: ['Tile Cutter', 'Trowel', 'Level', 'Spacers', 'Grout Float'],
      certifications: ['National Vocational Certificate in Tiling', 'City & Guilds Tiling Basics'],
      icon: 'briefcase'
    },
    {
      id: '5',
      title: 'Aluminium Works',
      description: 'Learn aluminium fabrication and installation.',
      level: 'beginner',
      duration: '3 months',
      salary_range: '₦90,000 - ₦280,000',
      demand_level: 'medium',
      tools: ['Cutting Machine', 'Drill', 'Riveting Gun', 'Measuring Tape', 'Screwdriver'],
      certifications: ['National Vocational Certificate in Aluminium Works', 'NCCER Aluminium Fabrication'],
      icon: 'book'
    },
    {
      id: '6',
      title: 'POP (Plaster of Paris) Design',
      description: 'Create decorative ceiling and wall designs.',
      level: 'beginner',
      duration: '3 months',
      salary_range: '₦80,000 - ₦250,000',
      demand_level: 'medium',
      tools: ['Trowel', 'Spatula', 'Mixing Bowl', 'Measuring Tape', 'Sandpaper'],
      certifications: ['National Vocational Certificate in POP Design', 'City & Guilds Interior Design Basics'],
      icon: 'compass'
    },
    {
      id: '7',
      title: 'Painting and Decorating',
      description: 'Learn professional painting and finishing techniques.',
      level: 'beginner',
      duration: '3 months',
      salary_range: '₦80,000 - ₦250,000',
      demand_level: 'medium',
      tools: ['Paint Roller', 'Brush', 'Spray Gun', 'Sandpaper', 'Ladder'],
      certifications: ['National Vocational Certificate in Painting', 'City & Guilds Painting & Decorating'],
      icon: 'briefcase'
    },
    {
      id: '8',
      title: 'Radio/Router Configuration',
      description: 'Configure and manage network infrastructure equipment.',
      level: 'beginner',
      duration: '3 months',
      salary_range: '₦120,000 - ₦350,000',
      demand_level: 'high',
      tools: ['Router', 'Switch', 'Crimping Tool', 'Network Tester', 'Laptop'],
      certifications: ['Cisco CCNA Basics', 'CompTIA Network+'],
      icon: 'book'
    },
    {
      id: '9',
      title: 'Drone Technology',
      description: 'Learn drone operations, maintenance, and programming.',
      level: 'intermediate',
      duration: '3 months',
      salary_range: '₦150,000 - ₦400,000',
      demand_level: 'high',
      tools: ['Drone', 'Controller', 'FPV Goggles', 'Screwdriver', 'Programming Software'],
      certifications: ['FAA Part 107 Drone Pilot', 'Drone Technology Certification'],
      icon: 'compass'
    },
    {
      id: '10',
      title: 'Remote Control Systems',
      description: 'Design and implement remote control and automation systems.',
      level: 'intermediate',
      duration: '3 months',
      salary_range: '₦150,000 - ₦400,000',
      demand_level: 'high',
      tools: ['Microcontroller', 'Sensors', 'Transmitter', 'Receiver', 'Programming Software'],
      certifications: ['IoT Fundamentals Certification', 'Arduino Certification'],
      icon: 'briefcase'
    },
    {
      id: '11',
      title: 'Artificial Intelligence',
      description: 'Explore AI concepts, machine learning, and practical applications.',
      level: 'advanced',
      duration: '6 months',
      salary_range: '₦250,000 - ₦700,000',
      demand_level: 'high',
      tools: ['Python', 'TensorFlow', 'PyTorch', 'Jupyter Notebook', 'GPU'],
      certifications: ['Google AI Professional Certificate', 'Coursera AI Specialization'],
      icon: 'book'
    },
    {
      id: '12',
      title: 'Plumbing-Pipe Fitting',
      description: 'Learn professional plumbing techniques and pipe system installation.',
      level: 'beginner',
      duration: '6 months',
      salary_range: '₦100,000 - ₦300,000',
      demand_level: 'medium',
      tools: ['Pipe Wrench', 'Plumber Tape', 'Pipe Cutter', 'Fittings', 'Torch'],
      certifications: ['National Vocational Certificate in Plumbing', 'NCCER Plumbing Level 1'],
      icon: 'compass'
    },
    {
      id: '13',
      title: 'Welding & Fabrications',
      description: 'Master various welding techniques and metal fabrication.',
      level: 'intermediate',
      duration: '6 months',
      salary_range: '₦150,000 - ₦400,000',
      demand_level: 'high',
      tools: ['Welding Machine', 'Electrodes', 'Grinder', 'Protective Gear', 'Measuring Tape'],
      certifications: ['AWS Certified Welder', 'NCCER Welding Level 2'],
      icon: 'briefcase'
    },
    {
      id: '14',
      title: 'Metal Folding Technology',
      description: 'Learn precision metal folding and forming techniques.',
      level: 'intermediate',
      duration: '3 months',
      salary_range: '₦120,000 - ₦350,000',
      demand_level: 'medium',
      tools: ['Folding Machine', 'Press Brake', 'Measuring Tools', 'Cutting Tools', 'Safety Gear'],
      certifications: ['National Vocational Certificate in Metal Folding', 'NCCER Metal Fabrication'],
      icon: 'book'
    },
    {
      id: '15',
      title: 'Electrical Installations & Maintenance',
      description: 'Install and maintain electrical systems safely and efficiently.',
      level: 'intermediate',
      duration: '6 months',
      salary_range: '₦150,000 - ₦400,000',
      demand_level: 'high',
      tools: ['Multimeter', 'Wire Strippers', 'Screwdrivers', 'Conduit Bender', 'Safety Gear'],
      certifications: ['National Vocational Certificate in Electrical', 'NCCER Electrical Level 1'],
      icon: 'compass'
    },
    {
      id: '16',
      title: 'Integrated Circuits',
      description: 'Design and build electronic circuits and systems.',
      level: 'advanced',
      duration: '6 months',
      salary_range: '₦200,000 - ₦600,000',
      demand_level: 'high',
      tools: ['Breadboard', 'Oscilloscope', 'Soldering Iron', 'Microchip', 'Design Software'],
      certifications: ['Electronics Technician Certification', 'IEEE Circuits Certification'],
      icon: 'briefcase'
    },
    {
      id: '17',
      title: 'Exotic Furniture',
      description: 'Create unique, high-quality furniture pieces.',
      level: 'intermediate',
      duration: '6 months',
      salary_range: '₦120,000 - ₦350,000',
      demand_level: 'medium',
      tools: ['Woodworking Tools', 'Sander', 'Varnish', 'Measuring Tape', 'Design Software'],
      certifications: ['National Vocational Certificate in Furniture Making', 'City & Guilds Furniture Design'],
      icon: 'book'
    },
    {
      id: '18',
      title: 'Electronics & Related Equipment Maintenance',
      description: 'Maintain and repair various electronic equipment.',
      level: 'intermediate',
      duration: '6 months',
      salary_range: '₦150,000 - ₦400,000',
      demand_level: 'high',
      tools: ['Soldering Iron', 'Multimeter', 'Oscilloscope', 'Screwdrivers', 'Diagnostic Software'],
      certifications: ['CompTIA A+ Certification', 'Electronics Repair Certification'],
      icon: 'compass'
    },
    {
      id: '19',
      title: 'Automobile Maintenance (Mechanical)',
      description: 'Service and repair various types of vehicles.',
      level: 'intermediate',
      duration: '6 months',
      salary_range: '₦120,000 - ₦350,000',
      demand_level: 'high',
      tools: ['Wrench Set', 'Diagnostic Scanner', 'Jack', 'Oil Filter Wrench', 'Torque Wrench'],
      certifications: ['ASE Certification', 'NCCER Automotive Maintenance'],
      icon: 'briefcase'
    },
    {
      id: '20',
      title: 'Visual Arts',
      description: 'Develop artistic skills and creative techniques.',
      level: 'beginner',
      duration: '3 months',
      salary_range: '₦80,000 - ₦250,000',
      demand_level: 'medium',
      tools: ['Canvas', 'Paints', 'Brushes', 'Sketchbook', 'Digital Drawing Tablet'],
      certifications: ['National Vocational Certificate in Visual Arts', 'Adobe Certified Associate'],
      icon: 'book'
    },
    {
      id: '21',
      title: 'Computer Appreciation',
      description: 'Master the fundamentals of computing and essential software applications.',
      level: 'beginner',
      duration: '3 months',
      salary_range: '₦80,000 - ₦250,000',
      demand_level: 'medium',
      tools: ['Computer', 'Microsoft Office', 'Internet Browser', 'Keyboard', 'Mouse'],
      certifications: ['ICDL Certification', 'Microsoft Office Specialist'],
      icon: 'compass'
    },
    {
      id: '22',
      title: 'Computer Graphics',
      description: 'Learn digital design principles and industry-standard graphic design tools.',
      level: 'intermediate',
      duration: '6 months',
      salary_range: '₦150,000 - ₦400,000',
      demand_level: 'high',
      tools: ['Adobe Photoshop', 'Illustrator', 'CorelDRAW', 'Tablet', 'Design Software'],
      certifications: ['Adobe Certified Professional', 'Graphic Design Certification'],
      icon: 'briefcase'
    },
    {
      id: '23',
      title: 'Networking',
      description: 'Understand computer networks, protocols, and security fundamentals.',
      level: 'intermediate',
      duration: '6 months',
      salary_range: '₦150,000 - ₦400,000',
      demand_level: 'high',
      tools: ['Router', 'Switch', 'Cables', 'Network Analyzer', 'Firewall Software'],
      certifications: ['Cisco CCNA', 'CompTIA Network+'],
      icon: 'book'
    },
    {
      id: '24',
      title: 'Web Development',
      description: 'Build modern, responsive websites using the latest web technologies.',
      level: 'intermediate',
      duration: '6 months',
      salary_range: '₦200,000 - ₦600,000',
      demand_level: 'high',
      tools: ['HTML', 'CSS', 'JavaScript', 'React', 'VS Code'],
      certifications: ['FreeCodeCamp Web Development', 'Meta Frontend Developer'],
      icon: 'compass'
    },
    {
      id: '25',
      title: 'Mobile App Development',
      description: 'Create native and cross-platform mobile applications.',
      level: 'intermediate',
      duration: '6 months',
      salary_range: '₦250,000 - ₦700,000',
      demand_level: 'high',
      tools: ['React Native', 'Flutter', 'Android Studio', 'Xcode'],
      certifications: ['Google Associate Android Developer', 'React Native Certification'],
      icon: 'briefcase'
    },
    {
      id: '26',
      title: 'Desktop Application Development',
      description: 'Develop powerful desktop applications using modern frameworks.',
      level: 'intermediate',
      duration: '6 months',
      salary_range: '₦200,000 - ₦600,000',
      demand_level: 'high',
      tools: ['C#', 'Java', 'Electron', 'Visual Studio', 'Qt Framework'],
      certifications: ['Microsoft Certified: Desktop Apps', 'Java SE Programmer'],
      icon: 'book'
    }
  ];

  const mockResources: Resource[] = [
    {
      id: '1',
      title: 'Introduction to Woodworking',
      description: 'A beginner course covering basic woodworking techniques and tools.',
      url: 'https://example.com/intro-woodworking',
      type: 'course',
      level: 'beginner',
      is_free: true,
      track_id: '1',
      rating: 4.6,
      review_count: 850
    },
    {
      id: '2',
      title: 'Furniture Design Tutorial',
      description: 'Video series on designing and constructing furniture pieces.',
      url: 'https://example.com/furniture-design-video',
      type: 'video',
      level: 'intermediate',
      is_free: false,
      track_id: '1',
      rating: 4.7,
      review_count: 600
    },
    {
      id: '3',
      title: 'Concrete Basics Guide',
      description: 'An article explaining the fundamentals of concrete mixing and laying.',
      url: 'https://example.com/concrete-basics',
      type: 'article',
      level: 'beginner',
      is_free: true,
      track_id: '2',
      rating: 4.5,
      review_count: 450
    },
    {
      id: '4',
      title: 'Advanced Masonry Techniques',
      description: 'Comprehensive course on advanced block-laying and concrete work.',
      url: 'https://example.com/advanced-masonry',
      type: 'course',
      level: 'intermediate',
      is_free: false,
      track_id: '2',
      rating: 4.8,
      review_count: 720
    },
    {
      id: '5',
      title: 'Welding 101 Video Series',
      description: 'Learn the basics of welding and metal fabrication through video tutorials.',
      url: 'https://example.com/welding-101',
      type: 'video',
      level: 'beginner',
      is_free: true,
      track_id: '3',
      rating: 4.7,
      review_count: 900
    },
    {
      id: '6',
      title: 'Steel Fabrication Masterclass',
      description: 'In-depth course on advanced steel fabrication techniques.',
      url: 'https://example.com/steel-fabrication-course',
      type: 'course',
      level: 'intermediate',
      is_free: false,
      track_id: '3',
      rating: 4.9,
      review_count: 650
    },
    {
      id: '7',
      title: 'Tile Installation Guide',
      description: 'Step-by-step article on tile installation and design principles.',
      url: 'https://example.com/tile-installation-guide',
      type: 'article',
      level: 'beginner',
      is_free: true,
      track_id: '4',
      rating: 4.6,
      review_count: 500
    },
    {
      id: '8',
      title: 'Aluminium Fabrication Basics',
      description: 'Video tutorial introducing aluminium fabrication and installation.',
      url: 'https://example.com/aluminium-basics',
      type: 'video',
      level: 'beginner',
      is_free: true,
      track_id: '5',
      rating: 4.5,
      review_count: 400
    },
    {
      id: '9',
      title: 'POP Design Techniques',
      description: 'Interactive guide on creating decorative ceiling and wall designs.',
      url: 'https://example.com/pop-design-interactive',
      type: 'interactive',
      level: 'beginner',
      is_free: false,
      track_id: '6',
      rating: 4.7,
      review_count: 300
    },
    {
      id: '10',
      title: 'Painting Techniques Video',
      description: 'Video lessons on professional painting and finishing techniques.',
      url: 'https://example.com/painting-techniques',
      type: 'video',
      level: 'beginner',
      is_free: true,
      track_id: '7',
      rating: 4.6,
      review_count: 550
    },
    {
      id: '11',
      title: 'Network Configuration Course',
      description: 'Learn to configure routers and network infrastructure.',
      url: 'https://example.com/network-config-course',
      type: 'course',
      level: 'beginner',
      is_free: false,
      track_id: '8',
      rating: 4.8,
      review_count: 700
    },
    {
      id: '12',
      title: 'Drone Operations Guide',
      description: 'Article on drone operations and maintenance basics.',
      url: 'https://example.com/drone-operations',
      type: 'article',
      level: 'beginner',
      is_free: true,
      track_id: '9',
      rating: 4.6,
      review_count: 600
    },
    {
      id: '13',
      title: 'Automation Systems Tutorial',
      description: 'Video tutorial on designing remote control and automation systems.',
      url: 'https://example.com/automation-tutorial',
      type: 'video',
      level: 'intermediate',
      is_free: false,
      track_id: '10',
      rating: 4.7,
      review_count: 450
    },
    {
      id: '14',
      title: 'AI Fundamentals Course',
      description: 'Explore AI concepts and machine learning with practical examples.',
      url: 'https://example.com/ai-fundamentals',
      type: 'course',
      level: 'advanced',
      is_free: false,
      track_id: '11',
      rating: 4.9,
      review_count: 950
    },
    {
      id: '15',
      title: 'Plumbing Basics Video',
      description: 'Video series on plumbing techniques and pipe installation.',
      url: 'https://example.com/plumbing-basics',
      type: 'video',
      level: 'beginner',
      is_free: true,
      track_id: '12',
      rating: 4.6,
      review_count: 500
    },
    {
      id: '16',
      title: 'Advanced Welding Course',
      description: 'In-depth course on various welding and fabrication techniques.',
      url: 'https://example.com/advanced-welding',
      type: 'course',
      level: 'intermediate',
      is_free: false,
      track_id: '13',
      rating: 4.8,
      review_count: 700
    },
    {
      id: '17',
      title: 'Metal Folding Guide',
      description: 'Article on precision metal folding and forming techniques.',
      url: 'https://example.com/metal-folding-guide',
      type: 'article',
      level: 'intermediate',
      is_free: true,
      track_id: '14',
      rating: 4.5,
      review_count: 400
    },
    {
      id: '18',
      title: 'Electrical Safety Course',
      description: 'Learn to install and maintain electrical systems safely.',
      url: 'https://example.com/electrical-safety',
      type: 'course',
      level: 'intermediate',
      is_free: false,
      track_id: '15',
      rating: 4.7,
      review_count: 600
    },
    {
      id: '19',
      title: 'Circuit Design Video',
      description: 'Video tutorial on designing and building electronic circuits.',
      url: 'https://example.com/circuit-design',
      type: 'video',
      level: 'advanced',
      is_free: true,
      track_id: '16',
      rating: 4.6,
      review_count: 550
    },
    {
      id: '20',
      title: 'Furniture Crafting Course',
      description: 'Learn to create unique, high-quality furniture pieces.',
      url: 'https://example.com/furniture-crafting',
      type: 'course',
      level: 'intermediate',
      is_free: false,
      track_id: '17',
      rating: 4.7,
      review_count: 450
    },
    {
      id: '21',
      title: 'Electronics Repair Guide',
      description: 'Article on maintaining and repairing electronic equipment.',
      url: 'https://example.com/electronics-repair',
      type: 'article',
      level: 'intermediate',
      is_free: true,
      track_id: '18',
      rating: 4.6,
      review_count: 500
    },
    {
      id: '22',
      title: 'Auto Repair Basics',
      description: 'Video series on servicing and repairing vehicles.',
      url: 'https://example.com/auto-repair-basics',
      type: 'video',
      level: 'intermediate',
      is_free: true,
      track_id: '19',
      rating: 4.5,
      review_count: 400
    },
    {
      id: '23',
      title: 'Creative Arts Course',
      description: 'Develop artistic skills and creative techniques.',
      url: 'https://example.com/creative-arts',
      type: 'course',
      level: 'beginner',
      is_free: false,
      track_id: '20',
      rating: 4.6,
      review_count: 350
    },
    {
      id: '24',
      title: 'Computer Basics Course',
      description: 'Master computing fundamentals and software applications.',
      url: 'https://example.com/computer-basics',
      type: 'course',
      level: 'beginner',
      is_free: true,
      track_id: '21',
      rating: 4.7,
      review_count: 600
    },
    {
      id: '25',
      title: 'Graphic Design Tutorial',
      description: 'Video series on digital design and graphic tools.',
      url: 'https://example.com/graphic-design',
      type: 'video',
      level: 'intermediate',
      is_free: false,
      track_id: '22',
      rating: 4.8,
      review_count: 700
    },
    {
      id: '26',
      title: 'Networking Fundamentals',
      description: 'Article on computer networks, protocols, and security.',
      url: 'https://example.com/networking-fundamentals',
      type: 'article',
      level: 'intermediate',
      is_free: true,
      track_id: '23',
      rating: 4.6,
      review_count: 550
    },
    {
      id: '27',
      title: 'Web Development Bootcamp',
      description: 'Comprehensive course on building responsive websites.',
      url: 'https://example.com/web-dev-bootcamp',
      type: 'course',
      level: 'intermediate',
      is_free: false,
      track_id: '24',
      rating: 4.9,
      review_count: 900
    },
    {
      id: '28',
      title: 'Mobile App Development Guide',
      description: 'Article on creating native and cross-platform apps.',
      url: 'https://example.com/mobile-app-guide',
      type: 'article',
      level: 'intermediate',
      is_free: true,
      track_id: '25',
      rating: 4.7,
      review_count: 650
    },
    {
      id: '29',
      title: 'Desktop App Development Course',
      description: 'Learn to develop desktop applications with modern frameworks.',
      url: 'https://example.com/desktop-app-course',
      type: 'course',
      level: 'intermediate',
      is_free: false,
      track_id: '26',
      rating: 4.8,
      review_count: 700
    }
  ];

  const navigate = useNavigate();

  // Event handler for Apply Now
  const handleApplyNow = () => {
    navigate('/apply');
  };

  // Event handler for Explore Programs
  const handleExplorePrograms = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    const programsSection = document.getElementById('featured-programs');
    if (programsSection) {
      const headerOffset = 80;
      const elementPosition = programsSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      window.scrollTo({
        top: offsetPosition,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });

      programsSection.focus();
    }
  };

  // Use mock data if no data is fetched yet
  useEffect(() => {
    if (careerTracks.length === 0 && !isLoading) {
      setCareerTracks(mockCareerTracks);
    }
    if (resources.length === 0 && !isLoading) {
      setResources(mockResources);
    }
  }, [isLoading, careerTracks.length, resources.length]);

  return (
    <>
      <Helmet>
        <title>Career Development | FolioTech Institute</title>
        <meta name="description" content="Explore career paths and resources in the Nigerian tech ecosystem." />
      </Helmet>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="relative py-24 bg-gradient-to-r from-blue-700 to-indigo-800 dark:from-blue-900 dark:to-indigo-900"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCA1OHM4LjA1OSAxOCAxOCAxOGMxMC4yMzcgMCAxOC44LTguNDIgMTguOC0xOC44QzU0LjggMjUuMjIgNDYuMjM3IDE4IDM2IDE4eiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMjQgNDJjMC05Ljk0MSA4LjA1OS0xOCAxOC0xOHMxOCA4LjA1OSAxOCAxOC04LjA1OSAxOC0xOCAxOC0xOC04LjA1OS0xOC0xOHoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-10" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            FolioTech Builds Your Career in Nigeria
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-blue-100">
            Discover learning paths and resources to accelerate your growth in the Nigerian tech ecosystem.
          </p>
          
          <div className="mt-10 max-w-xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-lg focus:ring-2 focus:ring-white focus:border-white bg-white/10 backdrop-blur-sm text-white placeholder-blue-100"
                placeholder="Search for career tracks or resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveTab('tracks')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'tracks'
                  ? 'bg-white text-blue-700'
                  : 'bg-blue-600/30 text-white hover:bg-blue-600/50'
              }`}
            >
              Career Tracks
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'resources'
                  ? 'bg-white text-blue-700'
                  : 'bg-blue-600/30 text-white hover:bg-blue-600/50'
              }`}
            >
              Resource Hub
            </button>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner size="lg" message="Loading career development data..." />
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Error loading data</h3>
                  <div className="mt-2 text-sm">{error}</div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Career Tracks Section */}
              {activeTab === 'tracks' && (
                <motion.div
                  ref={tracksRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={tracksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20}}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Career Track Explorer
                    </h2>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                      Discover structured learning paths to guide your tech career journey
                    </p>
                  </div>

                  {/* Filters */}
                  <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <label htmlFor="level-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Experience Level
                        </label>
                        <select
                          id="level-filter"
                          value={levelFilter}
                          onChange={(e) => setLevelFilter(e.target.value)}
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="all">All Levels</option>
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                      
                      <div className="flex-1">
                        <label htmlFor="demand-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Market Demand
                        </label>
                        <select
                          id="demand-filter"
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="all">All Demand Levels</option>
                          <option value="high">High Demand</option>
                          <option value="medium">Medium Demand</option>
                          <option value="low">Low Demand</option>
                        </select>
                      </div>
                      
                      <div className="flex-1">
                        <label htmlFor="duration-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Learning Duration
                        </label>
                        <select
                          id="duration-filter"
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="all">Any Duration</option>
                          <option value="short">0-6 months</option>
                          <option value="medium">6-12 months</option>
                          <option value="long">12+ months</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Career Tracks Grid */}
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTracks.length > 0 ? (
                      filteredTracks.map((track) => (
                        <div
                          key={track.id}
                          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg"
                        >
                          <div className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-12 w-12 rounded-md bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                  {getIconComponent(track.icon)}
                                </div>
                                <div className="ml-4">
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {track.title}
                                  </h3>
                                  <div className="mt-1 flex items-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      track.level === 'beginner'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                        : track.level === 'intermediate'
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                    }`}>
                                      {track.level.charAt(0).toUpperCase() + track.level.slice(1)}
                                    </span>
                                    <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      track.demand_level === 'high'
                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                                        : track.demand_level === 'medium'
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                                    }`}>
                                      {track.demand_level.charAt(0).toUpperCase() + track.demand_level.slice(1)} Demand
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => setExpandedTrackId(expandedTrackId === track.id ? null : track.id)}
                                className="ml-4 flex-shrink-0 bg-white dark:bg-gray-700 rounded-full p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                              >
                                {expandedTrackId === track.id ? (
                                  <ChevronUp className="h-5 w-5" />
                                ) : (
                                  <ChevronDown className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                            
                            <p className="mt-4 text-gray-600 dark:text-gray-400">
                              {track.description}
                            </p>
                            
                            <div className="mt-4 flex items-center justify-between text-sm">
                              <div className="flex items-center text-gray-500 dark:text-gray-400">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{track.duration}</span>
                              </div>
                              <div className="flex items-center text-gray-500 dark:text-gray-400">
                                <DollarSign className="h-4 w-4 mr-1" />
                                <span>{track.salary_range}</span>
                              </div>
                            </div>
                            
                            {expandedTrackId === track.id && (
                              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="mb-4">
                                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Required Tools & Technologies
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {track.tools.map((tool) => (
                                      <span
                                        key={tool}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                      >
                                        {tool}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="mb-4">
                                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Recommended Certifications
                                  </h4>
                                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                    {track.certifications.map((cert) => (
                                      <li key={cert} className="flex items-center">
                                        <Award className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                                        {cert}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div className="mt-4 flex justify-end">
                                  <button
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                                  >
                                    Start This Track
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3 mb-4">
                          <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No career tracks found</h3>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                          Try adjusting your search or filters to find what you're looking for.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Resources Section */}
              {activeTab === 'resources' && (
                <motion.div
                  ref={resourcesRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={resourcesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Resource Hub
                    </h2>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                      Curated learning materials to help you master tech skills
                    </p>
                  </div>

                  {/* Filters */}
                  <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <label htmlFor="track-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Career Track
                        </label>
                        <select
                          id="track-filter"
                          value={trackFilter}
                          onChange={(e) => setTrackFilter(e.target.value)}
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="all">All Tracks</option>
                          {careerTracks.map((track) => (
                            <option key={track.id} value={track.id}>
                              {track.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex-1">
                        <label htmlFor="resource-level-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Difficulty Level
                        </label>
                        <select
                          id="resource-level-filter"
                          value={levelFilter}
                          onChange={(e) => setLevelFilter(e.target.value)}
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="all">All Levels</option>
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                      
                      <div className="flex-1">
                        <label htmlFor="resource-type-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Content Type
                        </label>
                        <select
                          id="resource-type-filter"
                          value={resourceTypeFilter}
                          onChange={(e) => setResourceTypeFilter(e.target.value)}
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="all">All Types</option>
                          <option value="video">Video</option>
                          <option value="article">Article</option>
                          <option value="course">Course</option>
                          <option value="book">Book</option>
                          <option value="interactive">Interactive</option>
                        </select>
                      </div>
                      
                      <div className="flex-1">
                        <label htmlFor="resource-free-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Price
                        </label>
                        <select
                          id="resource-free-filter"
                          value={resourceFreeFilter === null ? 'all' : resourceFreeFilter ? 'free' : 'paid'}
                          onChange={(e) => {
                            const value = e.target.value;
                            setResourceFreeFilter(value === 'all' ? null : value === 'free');
                          }}
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="all">All Resources</option>
                          <option value="free">Free Only</option>
                          <option value="paid">Paid Only</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Resources Grid */}
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredResources.length > 0 ? (
                      filteredResources.map((resource) => {
                        const isBookmarked = bookmarkedResources.includes(resource.id);
                        const track = careerTracks.find(t => t.id === resource.track_id);
                        
                        return (
                          <div
                            key={resource.id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg"
                          >
                            <div className="p-6">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      resource.type === 'video'
                                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                        : resource.type === 'article'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                        : resource.type === 'course'
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                        : resource.type === 'book'
                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                    }`}>
                                      {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                                    </span>
                                    <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      resource.level === 'beginner'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                        : resource.level === 'intermediate'
                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                    }`}>
                                      {resource.level.charAt(0).toUpperCase() + resource.level.slice(1)}
                                    </span>
                                  </div>
                                  <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                                    {resource.title}
                                  </h3>
                                </div>
                                <button
                                  onClick={() => toggleBookmark(resource.id)}
                                  className={`flex-shrink-0 p-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 ${
                                    isBookmarked
                                      ? 'text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300'
                                      : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
                                  }`}
                                  aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark resource'}
                                >
                                  <Bookmark className="h-5 w-5" fill={isBookmarked ? 'currentColor' : 'none'} />
                                </button>
                              </div>
                              
                              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                {resource.description}
                              </p>
                              
                              {track && (
                                <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-medium text-gray-900 dark:text-white mr-1">Track:</span>
                                  {track.title}
                                </div>
                              )}
                              
                              <div className="mt-4 flex items-center">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < Math.floor(resource.rating)
                                          ? 'text-yellow-400'
                                          : 'text-gray-300 dark:text-gray-600'
                                      }`}
                                      fill={i < Math.floor(resource.rating) ? 'currentColor' : 'none'}
                                    />
                                  ))}
                                </div>
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                  ({resource.review_count})
                                </span>
                                <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                                <span className={`text-sm ${
                                  resource.is_free
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                  {resource.is_free ? 'Free' : 'Paid'}
                                </span>
                              </div>
                              
                              <div className="mt-6">
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                                >
                                  Access Resource
                                  <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3 mb-4">
                          <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No resources found</h3>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                          Try adjusting your search or filters to find what you're looking for.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-blue-600 dark:bg-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to Accelerate Your Tech Career?
          </h2>
          <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
            Join FolioTech Institute today and gain access to our comprehensive career development resources.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApplyNow}
              className="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-lg text-white 
                bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                transition-colors md:py-4 md:text-lg md:px-10 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                dark:focus:ring-offset-gray-900 shadow-md"
            >
              Apply Now
              <ArrowRight className="ml-2 h-4 w-4 inline-block" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExplorePrograms}
              className="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-lg 
                text-white-600 dark:text-blue-400 bg-transparent 
                border-2 border-blue-600 dark:border-blue-400 
                hover:bg-blue-50 dark:hover:bg-blue-900/20 
                transition-colors md:py-4 md:text-lg md:px-10
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                dark:focus:ring-offset-gray-900"
            >
              Explore Programs
            </motion.button>
          </div>
        </div>
      </section>
    </>
  );
}
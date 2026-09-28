-- Create custom types
CREATE TYPE user_role AS ENUM ('student', 'admin');

-- Create users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role user_role DEFAULT 'student'::user_role NOT NULL,
  full_name TEXT
);

-- Create food_items table
CREATE TABLE public.food_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  image_url TEXT,
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create feedback table
CREATE TABLE public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES public.food_items(id) NOT NULL,
  student_id UUID REFERENCES public.users(id) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  tags TEXT[] DEFAULT '{}'::TEXT[],
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create ai_analysis table
CREATE TABLE public.ai_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES public.food_items(id) UNIQUE NOT NULL,
  categorized_summary JSONB NOT NULL,
  suggestions TEXT NOT NULL,
  last_analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analysis ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Can read their own profile. Admins can read all.
CREATE POLICY "Users can view their own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
  ON public.users FOR SELECT 
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Food Items: Everyone can read. Only admins can insert/update/delete.
CREATE POLICY "Anyone can view food items" 
  ON public.food_items FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Admins can manage food items" 
  ON public.food_items FOR ALL 
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Feedback: Students can insert their own. Admins can read all.
CREATE POLICY "Students can insert their own feedback" 
  ON public.feedback FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can view their own feedback" 
  ON public.feedback FOR SELECT 
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Admins can view all feedback" 
  ON public.feedback FOR SELECT 
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- AI Analysis: Only admins can manage.
CREATE POLICY "Admins can manage ai analysis" 
  ON public.ai_analysis FOR ALL 
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Trigger to automatically create a user profile when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, full_name, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    -- Make the first user an admin, otherwise student
    CASE WHEN (SELECT count(*) FROM public.users) = 0 THEN 'admin'::user_role ELSE 'student'::user_role END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

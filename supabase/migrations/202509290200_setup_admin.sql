-- Migration: Setup admin user
-- Make the first registered user an admin (useful for development)

-- Update the first user to be admin if no admin exists yet
UPDATE profiles 
SET is_admin = true 
WHERE id = (
  SELECT id 
  FROM profiles 
  ORDER BY created_at ASC 
  LIMIT 1
) 
AND NOT EXISTS (
  SELECT 1 
  FROM profiles 
  WHERE is_admin = true
);
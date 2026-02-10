-- Create a function to delete a user (requires superuser privileges)
-- This function will be called via RPC from the frontend
CREATE OR REPLACE FUNCTION delete_user(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete from auth.users (this will cascade to profiles due to FK constraint)
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;

-- Grant execute permission to authenticated users
-- Note: You should add additional security checks here in production
-- For example, check if the calling user is an admin
GRANT EXECUTE ON FUNCTION delete_user(UUID) TO authenticated;

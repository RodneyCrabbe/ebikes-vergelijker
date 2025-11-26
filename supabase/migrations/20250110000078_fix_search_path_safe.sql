-- Fix Function Search Path Security Warnings - Safe Approach
-- This migration only updates functions that we know exist from the previous successful migrations

-- Update functions that were successfully created in previous migrations
ALTER FUNCTION update_updated_at_column() SET search_path = '';
ALTER FUNCTION public.handle_new_user() SET search_path = '';
ALTER FUNCTION cleanup_old_analytics_events() SET search_path = '';
ALTER FUNCTION get_user_retention_data(INTEGER) SET search_path = '';
ALTER FUNCTION update_chat_session_message_count() SET search_path = '';
ALTER FUNCTION update_chat_session_timestamp() SET search_path = '';
ALTER FUNCTION update_user_activity_points() SET search_path = '';
ALTER FUNCTION check_user_achievements() SET search_path = '';
ALTER FUNCTION mark_notifications_read(UUID, UUID[]) SET search_path = '';
ALTER FUNCTION cleanup_expired_notifications() SET search_path = '';
ALTER FUNCTION check_price_drops() SET search_path = '';
ALTER FUNCTION send_appointment_reminders() SET search_path = '';
ALTER FUNCTION update_review_vote_count() SET search_path = '';
ALTER FUNCTION update_post_like_count() SET search_path = '';
ALTER FUNCTION update_post_comment_count() SET search_path = '';
ALTER FUNCTION update_answer_vote_count() SET search_path = '';
ALTER FUNCTION check_subscription_limit(UUID, VARCHAR) SET search_path = '';
ALTER FUNCTION increment_subscription_usage(UUID, VARCHAR, INTEGER) SET search_path = '';
ALTER FUNCTION get_user_current_plan(UUID) SET search_path = '';
ALTER FUNCTION calculate_dealer_performance(UUID, VARCHAR) SET search_path = '';
ALTER FUNCTION create_commission_on_conversion() SET search_path = '';

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'All available functions have been updated with secure search_path settings';
  RAISE NOTICE 'This should resolve most of the Security Advisor warnings';
END $$;

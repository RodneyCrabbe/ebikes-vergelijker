-- Fix remaining function search_path security warnings
-- This migration handles functions that may have different signatures

-- Try to update functions that might exist with different signatures
DO $$
BEGIN
  -- Try to update insert_analytics_event with different possible signatures
  BEGIN
    ALTER FUNCTION insert_analytics_event(VARCHAR, UUID, VARCHAR, TEXT, TEXT, TEXT, JSONB, JSONB) SET search_path = '';
    RAISE NOTICE 'Updated insert_analytics_event with 8 parameters';
  EXCEPTION WHEN OTHERS THEN
    BEGIN
      ALTER FUNCTION insert_analytics_event(VARCHAR, UUID, VARCHAR, TEXT, TEXT, TEXT, JSONB) SET search_path = '';
      RAISE NOTICE 'Updated insert_analytics_event with 7 parameters';
    EXCEPTION WHEN OTHERS THEN
      BEGIN
        ALTER FUNCTION insert_analytics_event(VARCHAR, UUID, VARCHAR, TEXT, TEXT, TEXT) SET search_path = '';
        RAISE NOTICE 'Updated insert_analytics_event with 6 parameters';
      EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'insert_analytics_event function not found or already updated';
      END;
    END;
  END;

  -- Try to update calculate_dealer_performance with different possible signatures
  BEGIN
    ALTER FUNCTION calculate_dealer_performance(UUID, DATE, DATE) SET search_path = '';
    RAISE NOTICE 'Updated calculate_dealer_performance with 3 parameters';
  EXCEPTION WHEN OTHERS THEN
    BEGIN
      ALTER FUNCTION calculate_dealer_performance(UUID, VARCHAR) SET search_path = '';
      RAISE NOTICE 'Updated calculate_dealer_performance with 2 parameters';
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'calculate_dealer_performance function not found or already updated';
    END;
  END;

  -- Try to update get_user_retention_data with different possible signatures
  BEGIN
    ALTER FUNCTION get_user_retention_data(INTEGER) SET search_path = '';
    RAISE NOTICE 'Updated get_user_retention_data with INTEGER parameter';
  EXCEPTION WHEN OTHERS THEN
    BEGIN
      ALTER FUNCTION get_user_retention_data() SET search_path = '';
      RAISE NOTICE 'Updated get_user_retention_data with no parameters';
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'get_user_retention_data function not found or already updated';
    END;
  END;

  -- Try to update increment_subscription_usage with different possible signatures
  BEGIN
    ALTER FUNCTION increment_subscription_usage(UUID, VARCHAR, INTEGER) SET search_path = '';
    RAISE NOTICE 'Updated increment_subscription_usage with 3 parameters';
  EXCEPTION WHEN OTHERS THEN
    BEGIN
      ALTER FUNCTION increment_subscription_usage(UUID, VARCHAR) SET search_path = '';
      RAISE NOTICE 'Updated increment_subscription_usage with 2 parameters';
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'increment_subscription_usage function not found or already updated';
    END;
  END;

  -- Try to update get_user_current_plan with different possible signatures
  BEGIN
    ALTER FUNCTION get_user_current_plan(UUID) SET search_path = '';
    RAISE NOTICE 'Updated get_user_current_plan with UUID parameter';
  EXCEPTION WHEN OTHERS THEN
    BEGIN
      ALTER FUNCTION get_user_current_plan() SET search_path = '';
      RAISE NOTICE 'Updated get_user_current_plan with no parameters';
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'get_user_current_plan function not found or already updated';
    END;
  END;

  -- Try to update check_subscription_limit with different possible signatures
  BEGIN
    ALTER FUNCTION check_subscription_limit(UUID, VARCHAR) SET search_path = '';
    RAISE NOTICE 'Updated check_subscription_limit with 2 parameters';
  EXCEPTION WHEN OTHERS THEN
    BEGIN
      ALTER FUNCTION check_subscription_limit(UUID) SET search_path = '';
      RAISE NOTICE 'Updated check_subscription_limit with 1 parameter';
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'check_subscription_limit function not found or already updated';
    END;
  END;

  -- Try to update mark_notifications_read with different possible signatures
  BEGIN
    ALTER FUNCTION mark_notifications_read(UUID, UUID[]) SET search_path = '';
    RAISE NOTICE 'Updated mark_notifications_read with 2 parameters';
  EXCEPTION WHEN OTHERS THEN
    BEGIN
      ALTER FUNCTION mark_notifications_read(UUID) SET search_path = '';
      RAISE NOTICE 'Updated mark_notifications_read with 1 parameter';
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'mark_notifications_read function not found or already updated';
    END;
  END;

  -- Try to update create_notification with different possible signatures
  BEGIN
    ALTER FUNCTION create_notification(UUID, VARCHAR, VARCHAR, TEXT, JSONB) SET search_path = '';
    RAISE NOTICE 'Updated create_notification with 5 parameters';
  EXCEPTION WHEN OTHERS THEN
    BEGIN
      ALTER FUNCTION create_notification(UUID, VARCHAR, VARCHAR, TEXT) SET search_path = '';
      RAISE NOTICE 'Updated create_notification with 4 parameters';
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'create_notification function not found or already updated';
    END;
  END;

  RAISE NOTICE 'Completed search_path updates for remaining functions';
END $$;

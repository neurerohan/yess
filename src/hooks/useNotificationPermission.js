import { useState, useEffect, useCallback } from 'react';

const PERMISSION_LAST_ASKED_KEY = 'notificationPermissionLastAsked';
const PERMISSION_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Custom hook to manage browser notification permissions with a weekly cool-down.
 */
function useNotificationPermission() {
  const [permissionStatus, setPermissionStatus] = useState(Notification.permission);
  const [canAskPermission, setCanAskPermission] = useState(false);

  // Check cool-down and initial permission status on mount
  useEffect(() => {
    const currentStatus = Notification.permission;
    setPermissionStatus(currentStatus);

    if (currentStatus === 'default') {
      try {
        const lastAskedTimestamp = localStorage.getItem(PERMISSION_LAST_ASKED_KEY);
        if (lastAskedTimestamp) {
          const lastAskedTime = parseInt(lastAskedTimestamp, 10);
          const currentTime = Date.now();
          if (currentTime - lastAskedTime >= PERMISSION_COOLDOWN_MS) {
            // Cool-down expired
            setCanAskPermission(true);
            console.log('Notification permission cool-down expired. Can ask again.');
            localStorage.removeItem(PERMISSION_LAST_ASKED_KEY); // Clean up old timestamp
          } else {
            // Still in cool-down
            setCanAskPermission(false);
            console.log('Notification permission request is in cool-down.');
          }
        } else {
          // Never asked before (or timestamp cleared)
          setCanAskPermission(true);
          console.log('Can ask for notification permission (never asked or cool-down expired).');
        }
      } catch (error) {
        console.error('Error checking notification permission cool-down:', error);
        setCanAskPermission(true); // Allow asking if localStorage fails
      }
    } else {
      // Already granted or denied
      setCanAskPermission(false);
    }
  }, []);

  // Function to request permission from the user
  const requestPermission = useCallback(async () => {
    // Only request if status is 'default' and not in cool-down
    if (permissionStatus !== 'default' || !canAskPermission) {
        console.log('Cannot request notification permission. Status:', permissionStatus, 'Can Ask:', canAskPermission);
      return permissionStatus; // Return current status
    }

    try {
      const status = await Notification.requestPermission();
      setPermissionStatus(status); // Update state with the user's choice
      setCanAskPermission(false); // Cannot ask again immediately

      // Record the time permission was asked, regardless of outcome
      localStorage.setItem(PERMISSION_LAST_ASKED_KEY, Date.now().toString());
      console.log(`Notification permission ${status}. Cool-down started.`);
      return status;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      // If request fails, maybe allow trying again later?
      // For now, keep canAskPermission false, but don't set timestamp
      setCanAskPermission(false); 
      return permissionStatus; // Return the status before the failed attempt
    }
  }, [permissionStatus, canAskPermission]);

  return { permissionStatus, requestPermission, canAskPermission };
}

export default useNotificationPermission; 
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const showNotification = (
  title: string,
  options?: NotificationOptions
) => {
  if (Notification.permission === "granted") {
    return new Notification(title, options);
  }
  return null;
};

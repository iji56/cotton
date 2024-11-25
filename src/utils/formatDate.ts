export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  // Format Date
  const dateFormat = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto',
    month: 'numeric',
    day: 'numeric',
  }).format(date);

  // Format Time
  const timeFormat = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);

  return `${dateFormat} ${timeFormat}`;
};

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const timeFormat = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
  return timeFormat;
}

export const timeSince = (dateString: string) => {
  const now = new Date();
  const sentTime = new Date(dateString);
  const elapsed = now.getTime() - sentTime.getTime();

  const minutes = Math.floor(elapsed / 60000);
  const hours = Math.floor(elapsed / 3600000);
  const days = Math.floor(elapsed / (3600000 * 24));

  if (days > 0) {
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}hr`;
  } else if (minutes > 0) {
    return `${minutes} min`;
  } else {
    return 'now';
  }
};

interface AvatarProps {
  firstName?: string;
  lastName?: string;
  username?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const colorPalette = [
  'bg-blue-600 text-white',
  'bg-indigo-600 text-white',
  'bg-emerald-600 text-white',
  'bg-teal-600 text-white',
  'bg-violet-600 text-white',
  'bg-cyan-600 text-white',
  'bg-slate-700 text-white',
];

export function Avatar({
  firstName = '',
  lastName = '',
  username = '',
  size = 'md',
  className = '',
}: AvatarProps) {
  let initials = '';
  if (firstName || lastName) {
    const f = firstName.trim().charAt(0).toUpperCase();
    const l = lastName.trim().charAt(0).toUpperCase();
    initials = `${f}${l}`.trim();
  }

  if (!initials && username) {
    initials = username.trim().slice(0, 2).toUpperCase();
  }

  if (!initials) {
    initials = 'U';
  }

  const charCodeSum = (firstName + lastName + username)
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorClass = colorPalette[charCodeSum % colorPalette.length];

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-lg font-bold',
  };

  return (
    <div
      className={`inline-flex items-center justify-center font-semibold rounded-full select-none shrink-0 ${sizeClasses[size]} ${colorClass} ${className}`}
      aria-label={`${firstName} ${lastName}`.trim() || username || 'User'}
    >
      <span>{initials}</span>
    </div>
  );
}

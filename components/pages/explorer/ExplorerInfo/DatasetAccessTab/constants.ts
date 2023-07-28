export const purposeList = [
  {
    label: 'Academia',
    value: 'ACADEMIA',
  },
  {
    label: 'Business',
    value: 'BUSINESS',
  },
  {
    label: 'Government Use',
    value: 'GOVERNMENT_USE',
  },
  {
    label: 'Journalism',
    value: 'JOURNALISM',
  },
  {
    label: 'R&D',
    value: 'R_D',
  },
  {
    label: 'Other',
    value: 'OTHERS',
  },
];

export function getButtonDetails(session, type, hasAgreed) {
  if (!session) {
    if (type === 'OPEN' && !hasAgreed) {
      return 'Get Access';
    }
    if (type === 'OPEN' && hasAgreed) {
      return 'Show Distributions';
    }
    return 'Sign In';
  }

  if (hasAgreed) {
    return 'Show Distributions';
  }
  return 'Get Access';
}

export const projectTypes = ['Custom Build', 'Restoration', 'Upgrades', 'Other'];

export function validateProject(values) {
  const errors = {};
  const name = values.name?.trim() ?? '';
  const email = values.email?.trim() ?? '';
  const motorcycle = values.motorcycle?.trim() ?? '';
  const message = values.message?.trim() ?? '';

  if (!name) errors.name = 'Please enter your name.';
  else if (name.length > 100) errors.name = 'Please keep this within 100 characters.';
  if (!email) errors.email = 'Please enter your email address.';
  else if (email.length > 254) errors.email = 'Please keep this within 254 characters.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Please enter a valid email address.';
  if (motorcycle.length > 120) errors.motorcycle = 'Please keep this within 120 characters.';
  if (!projectTypes.includes(values.projectType)) errors.projectType = 'Please choose a project type.';
  if (!message) errors.message = 'Please tell us about your project.';
  else if (message.length > 3000) errors.message = 'Please keep this within 3000 characters.';
  return errors;
}

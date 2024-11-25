import { STRIP_EDGE_FUNCTIONS_BASE_URL, SUPABASE_ANON_KEY } from '@env';

// Takes the email template name as a string and a replacements object, containing the key,
// the template string to replace, and the value, the value to replace the template string with
export const sendEmail = async (
  templateName: string,
  replacements: object,
  recipient: string,
) => {
  console.log('call supabase func');
  const response = await fetch(`${STRIP_EDGE_FUNCTIONS_BASE_URL}/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      templateName,
      replacements,
      recipient,
    }),
  });
  console.log('resposne from email', response);
  return response;
};

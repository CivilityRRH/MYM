export interface GoogleFormResponse {
  responseId: string;
  createTime: string;
  answers?: Record<string, any>;
}

export interface GoogleFormDetail {
  formId: string;
  info: {
    title: string;
    description?: string;
    documentTitle?: string;
  };
  responderUri?: string;
}

export async function createGoogleForm(accessToken: string, title: string, questions: string[] = []): Promise<GoogleFormDetail> {
  // 1. Create empty form
  const createRes = await fetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      info: {
        title: title,
        documentTitle: title,
      },
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Google Forms API Error (${createRes.status}): ${errText}`);
  }

  const formData: GoogleFormDetail = await createRes.json();

  // 2. Add questions if provided
  if (questions.length > 0) {
    const requests = questions.map((qText, index) => ({
      createItem: {
        item: {
          title: qText,
          questionItem: {
            question: {
              required: true,
              textQuestion: {
                paragraph: true,
              },
            },
          },
        },
        location: {
          index: index,
        },
      },
    }));

    const updateRes = await fetch(`https://forms.googleapis.com/v1/forms/${formData.formId}:batchUpdate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    });

    if (!updateRes.ok) {
      console.warn('Failed to populate form questions:', await updateRes.text());
    }
  }

  return formData;
}

export async function getGoogleFormDetails(accessToken: string, formId: string): Promise<GoogleFormDetail> {
  const res = await fetch(`https://forms.googleapis.com/v1/forms/${formId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch form details: ${await res.text()}`);
  }

  return await res.json();
}

export async function getGoogleFormResponses(accessToken: string, formId: string): Promise<GoogleFormResponse[]> {
  const res = await fetch(`https://forms.googleapis.com/v1/forms/${formId}/responses`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch form responses: ${await res.text()}`);
  }

  const data = await res.json();
  return data.responses || [];
}

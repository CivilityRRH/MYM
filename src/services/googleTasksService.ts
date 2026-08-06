export interface GoogleTask {
  id: string;
  title: string;
  notes?: string;
  status: 'needsAction' | 'completed';
  due?: string;
  completed?: string;
  updated?: string;
}

export async function getGoogleTasks(accessToken: string, taskListId: string = '@default'): Promise<GoogleTask[]> {
  const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks?showCompleted=true&showHidden=true`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Tasks API Error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.items || [];
}

export async function createGoogleTask(
  accessToken: string,
  title: string,
  notes?: string,
  due?: string,
  taskListId: string = '@default'
): Promise<GoogleTask> {
  const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      notes,
      due,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to create Google Task (${res.status}): ${errText}`);
  }

  return await res.json();
}

export async function updateGoogleTaskStatus(
  accessToken: string,
  taskId: string,
  status: 'needsAction' | 'completed',
  taskListId: string = '@default'
): Promise<GoogleTask> {
  const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to update Google Task (${res.status}): ${errText}`);
  }

  return await res.json();
}

export async function deleteGoogleTask(
  accessToken: string,
  taskId: string,
  taskListId: string = '@default'
): Promise<void> {
  const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to delete Google Task (${res.status}): ${errText}`);
  }
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAddApplicationTag, useRemoveApplicationTag } from '@/hooks/useApplications';
import { useCreateTag, useTags } from '@/hooks/useTags';

interface TagManagerProps {
  applicationId: string;
  applicationTags: string[];
}

export function TagManager({ applicationId, applicationTags }: TagManagerProps) {
  const [newTagName, setNewTagName] = useState('');
  const { data: tags = [] } = useTags();
  const createTagMutation = useCreateTag();
  const addApplicationTagMutation = useAddApplicationTag();
  const removeApplicationTagMutation = useRemoveApplicationTag();
  const isAdding = createTagMutation.isPending || addApplicationTagMutation.isPending;

  const handleCreateOrAddTag = async () => {
    const tagName = newTagName.trim();

    if (!tagName || applicationTags.includes(tagName)) {
      return;
    }

    const existingTag = tags.find(tag => tag.name.toLowerCase() === tagName.toLowerCase());
    const tag = existingTag || await createTagMutation.mutateAsync({ name: tagName });

    await addApplicationTagMutation.mutateAsync({ applicationId, tagId: tag.id });
    setNewTagName('');
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    const tag = tags.find(existingTag => existingTag.name === tagToRemove);

    if (!tag) {
      return;
    }

    await removeApplicationTagMutation.mutateAsync({ applicationId, tagId: tag.id });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-neutral-900 mb-3">Tags</h3>
        <div className="flex gap-2 mb-3">
          <Input
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Add or create new tag"
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCreateOrAddTag();
              }
            }}
          />
          <Button
            onClick={handleCreateOrAddTag}
            disabled={!newTagName.trim() || isAdding}
            className="bg-teal-600 hover:bg-teal-700"
          >
            Add
          </Button>
        </div>

        {applicationTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {applicationTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-md"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-neutral-500 hover:text-neutral-700"
                  aria-label={`Remove ${tag}`}
                >
                  x
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">No tags added yet.</p>
        )}
      </div>
    </div>
  );
}

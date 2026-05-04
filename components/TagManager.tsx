'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
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
    <div className="rounded-3xl border border-border bg-white/76 p-4 shadow-sm">
      <div>
        <h3 className="mb-3 text-lg font-bold text-foreground">Tags</h3>
        <div className="mb-3 flex gap-2">
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
          >
            Add
          </Button>
        </div>

        {applicationTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {applicationTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-bold text-teal-700"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 rounded-full text-teal-600 hover:text-teal-900 focus-ring"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No tags added yet.</p>
        )}
      </div>
    </div>
  );
}

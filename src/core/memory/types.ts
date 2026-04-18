export const memoryRecordTypes = [
  "project_convention",
  "architecture_note",
  "skill_outcome",
  "fix_pattern",
] as const;

export type MemoryRecordType = (typeof memoryRecordTypes)[number];

export type MemoryRecord = {
  id: string;
  workspaceId: string;
  type: MemoryRecordType;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

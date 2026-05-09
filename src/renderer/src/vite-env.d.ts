/// <reference types="vite/client" />

import type {
  AppSettings,
  CreateNoteInput,
  GenerateReferenceImagesInput,
  GenerateTasksInput,
  LockAssetsInput,
  Note,
  NoteFilter,
  PipelineActionResult,
  PipelineSnapshot,
  RunBatchInput,
  RunTaskInput,
  StartProjectInput,
  UpdateNoteInput
} from "@shared/types";

declare global {
  interface Window {
    notesApi: {
      list: (filter?: NoteFilter) => Promise<Note[]>;
      categories: () => Promise<string[]>;
      create: (input: CreateNoteInput) => Promise<Note>;
      update: (id: number, input: UpdateNoteInput) => Promise<Note | null>;
      toggleComplete: (id: number, completed: boolean) => Promise<Note | null>;
      archive: (id: number) => Promise<Note | null>;
      reorder: (ids: number[]) => Promise<{ ok: true }>;
      delete: (id: number) => Promise<{ ok: true }>;
      minimizeWindow: () => Promise<{ ok: true }>;
      closeWindow: () => Promise<{ ok: true }>;
      togglePinWindow: () => Promise<{ pinned: boolean }>;
      isPinnedWindow: () => Promise<{ pinned: boolean }>;
      isAutoLaunchEnabled: () => Promise<{ enabled: boolean }>;
      toggleAutoLaunch: () => Promise<{ enabled: boolean }>;
      getSettings: () => Promise<AppSettings>;
      updateDisplayName: (displayName: string) => Promise<AppSettings>;
      onReminder: (
        callback: (payload: { id: number; title: string; content: string; reminderAt: string | null }) => void
      ) => () => void;
    };
    pipelineApi: {
      getSnapshot: () => Promise<PipelineSnapshot>;
      startProject: (input: StartProjectInput) => Promise<PipelineActionResult>;
      lockAssets: (input: LockAssetsInput) => Promise<PipelineActionResult>;
      generateReferenceImages: (input: GenerateReferenceImagesInput) => Promise<PipelineActionResult>;
      generateTasks: (input: GenerateTasksInput) => Promise<PipelineActionResult>;
      runTask: (input: RunTaskInput) => Promise<PipelineActionResult>;
      runBatch: (input: RunBatchInput) => Promise<PipelineActionResult>;
    };
  }
}

export {};

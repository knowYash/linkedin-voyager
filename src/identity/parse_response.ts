import { Profile, ProfileUpdate, Urn } from '../model/api';

interface RawProfileContainer {
  profile?: {
    entityUrn?: Urn;
  };
}

export const parseProfile = (data: unknown | null): Profile | null => {
  const output = {
    profileUrn: (data as RawProfileContainer)?.profile?.entityUrn,
  };
  if (!output.profileUrn) {
    return null;
  }
  return output;
};

interface RawProfileUpdate {
  actor: Record<string, unknown>;
  dashEntityUrn: Urn;
  resharedUpdate?: Record<string, unknown> & {
    commentary?: { text?: { text: string } };
  };
  updateMetadata: { urn: string };
  entityUrn: Urn;
  commentary?: { text?: { text: string } };
  socialDetail: Record<string, unknown>;
}

export const parseProfileUpdate = (
  data: unknown | null,
): ProfileUpdate | null => {
  const output = {
    updateUrn: (data as RawProfileUpdate)?.updateMetadata?.urn,
    text: (data as RawProfileUpdate)?.commentary?.text?.text,
    resharedText: (data as RawProfileUpdate)?.resharedUpdate?.commentary?.text
      ?.text,
  };
  if (!output.updateUrn || (!output.text && !output.resharedText)) {
    return null;
  }
  if (!output.text) delete output.text;
  if (!output.resharedText) delete output.resharedText;
  return output;
};

interface RawProfileUpdatesContainer {
  metadata?: { paginationToken: string };
  elements?: RawProfileUpdate[];
  paging?: Record<string, unknown>;
}

export const parseProfileUpdates = (
  data: unknown | null,
): { results: ProfileUpdate[]; paginationToken?: string } | null => {
  const results = (data as RawProfileUpdatesContainer)?.elements.map(
    parseProfileUpdate,
  );
  const paginationToken = (data as RawProfileUpdatesContainer)?.metadata
    .paginationToken;
  return { results, paginationToken };
};

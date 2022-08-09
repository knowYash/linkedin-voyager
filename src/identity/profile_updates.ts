import queryString from 'query-string';
import { Session } from '../authentication/sessions';
import { HttpMethods } from '../model/methods';
import { Profile, ProfileUpdate, Urn } from '../model/api';
import { PROFILE_UPDATES_URL, PROFILE_URL } from '../model/urls';
import { parseProfile, parseProfileUpdates } from './parse_response';

export const getProfile = async (
  session: Session,
  id: Urn | string, // profile urn or public id
): Promise<Profile> => {
  const result = await session.fetch(`${PROFILE_URL}/${id}/profileView`, {
    method: HttpMethods.Get,
  });
  const data = await result.json();
  return parseProfile(data);
};

export interface GetProfileUpdatesOptions {
  urn?: Urn;
  publicId?: string;
  count?: number;
  start?: number;
}

export const getProfileUpdates = async (
  session: Session,
  options: GetProfileUpdatesOptions,
): Promise<ProfileUpdate[] | null> => {
  if (!options.urn && !options.publicId) return null;

  const urn =
    options.urn || (await getProfile(session, options.publicId)).profileUrn;
  const urlParams = {
    count: options?.count || 10,
    start: options?.start || 0,
    q: 'memberShareFeed',
    moduleKey: 'member-shares:phone',
    includeLongTermHistory: true,
    profileUrn: urn,
  };

  const result = await session.fetch(
    `${PROFILE_UPDATES_URL}?${queryString.stringify(urlParams)}`,
    {
      method: HttpMethods.Get,
    },
  );
  const data = await result.json();
  return parseProfileUpdates(data);
};

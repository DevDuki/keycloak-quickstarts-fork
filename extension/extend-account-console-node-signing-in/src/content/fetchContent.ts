import { joinPath } from "../utils/joinPath";
import { CallOptions, MenuItem } from '../types/types';

export default async function fetchContentJson(
  opts: CallOptions,
): Promise<MenuItem[]> {
  const response = await fetch(
    joinPath(opts.context.environment.resourceUrl, "/content.json"),
    opts,
  );
  return await response.json();
}

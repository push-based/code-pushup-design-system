import { CoreConfig } from '@code-pushup/models';
import { config as dotEnvConfig } from 'dotenv';

dotEnvConfig();

const { CP_SERVER, CP_API_KEY, CP_ORGANIZATION, CP_PROJECT } = process.env;

export function cpUploadConfig(projectSlug: string): Pick<CoreConfig, 'upload'> {
    return CP_API_KEY && CP_SERVER && CP_ORGANIZATION && CP_PROJECT
        ? {
              upload: {
                  server: CP_SERVER,
                  apiKey: CP_API_KEY,
                  organization: CP_ORGANIZATION,
                  project:
                      CP_PROJECT === projectSlug
                          ? projectSlug
                          : `${CP_PROJECT}-${projectSlug
                                .replace(/[A-Z]/g, (char) => char.toLowerCase())
                                .replace(/\s+/g, '-')
                                .replace(/[/_\\=]/g, '-')
                                .replace(/[^a-z\d-]/g, '')}`,
              },
          }
        : {};
}

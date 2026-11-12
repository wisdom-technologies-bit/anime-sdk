
import {
  HttpClient,
  AllmangaProvider,
  GogoanimeProvider,
  AnikotoProvider,
  MegaPlayProvider,
  AnilistMeta,
  MalMeta,
  KitsuMeta,
  MappingClient,
  startServer,
} from "./src/index.js";

const port = Number(process.env.PORT || 3000);

const http = new HttpClient({ timeoutMs: 25000 });

const mapping = new MappingClient(http);

const providers = [
  new AllmangaProvider(http),
  new GogoanimeProvider(http),
  new AnikotoProvider(http),
  new MegaPlayProvider(http),
];

const metaProviders = [
  new AnilistMeta(http, { mappingClient: mapping }),
  new MalMeta(http, { mappingClient: mapping }),
  new KitsuMeta(http, { mappingClient: mapping }),
];

const app = startServer({
  providers,
  metaProviders,
  port,

  auth: process.env.API_TOKEN
    ? { token: process.env.API_TOKEN }
    : undefined,

  proxy: true,
  proxySignSecret: process.env.PROXY_SECRET,

  proxyAllowedHosts: (
    process.env.PROXY_ALLOWED_HOSTS || ""
  )
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean),
});

app.on("listening", () => {
  console.log(`Anime SDK listening on port ${port}`);
});

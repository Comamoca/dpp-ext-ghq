import {
  Actions,
  BaseExt,
  Plugin,
} from "https://deno.land/x/dpp_vim@v0.0.5/types.ts";
import { Denops } from "https://deno.land/x/dpp_vim@v0.0.5/deps.ts";
import { join } from "https://deno.land/std@0.204.0/path/mod.ts";
import { basename } from "https://deno.land/std@0.202.0/path/mod.ts";
import { is } from "https://deno.land/x/unknownutil@v3.10.0/mod.ts";

console.log("dpp-ext-ghq is loaded!");

type Params = Record<string, never>;

type Args = {
  ghq_root: string;
  repos: string[];
  hostname: string;
  options?: Partial<Plugin>;
};

export class Ext extends BaseExt<Params> {
  override actions: Actions<Params> = {
    ghq: {
      description: "Load plugins in ghq directory",
      callback: async (args: {
        denops: Denops;
        actionParams: unknown;
      }) => {
        const params = args.actionParams as Args;
        const defaultOptions = params.options ?? {};

        const expanded_ghq_root = await args.denops.call(
          "expand",
          params.ghq_root,
        );

        console.log(`${"-".repeat(20)} DEBUG ${"-".repeat(20)}`);
        console.log(expanded_ghq_root, params.repos);

        const plugins: Plugin[] = [];

        params.repos.forEach((repo) => {
          if (is.String(repo)) {
            if (is.String(expanded_ghq_root)) {
              const abs_path = join(expanded_ghq_root, params.hostname, repo);

              plugins.push({
                ...defaultOptions,
                repo: abs_path,
                local: true,
                path: abs_path,
                name: basename(abs_path),
              });
            }
          }
        });

        return plugins;
      },
    },
  };

  override params(): Params {
    return {};
  }
}

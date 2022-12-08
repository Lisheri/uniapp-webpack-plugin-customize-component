type UsingComponents = Record<string, string>;

export type Options = Record<string, UsingComponents>;

export type Platform = "wx" | "tt" | "ax" | "q";

export default class UniappCustomComponent {
  private options = {};
  constructor(options: Options, private readonly platform: Platform = "wx") {
    this.options = Object.keys(options).reduce((prev, item) => {
      return {
        ...prev,
        [`${item}.json`]: options[item],
        [`${item}.${platform}ml`]: options[item],
      };
    }, {});
  }

  apply(compiler: any) {
    const _this: any = this;
    compiler.hooks.emit.tapAsync(
      "UniappCustomComponent",
      (compilation: any, callback: any) => {
        Object.keys(compilation.assets).forEach((name) => {
          const currentBundle = compilation.assets[name];
          if (Object.keys(_this.options).includes(name)) {
            if (name.includes("json")) {
              const usingComponentsOption = _this.options[name];
              const appJson = JSON.parse(compilation.assets[name].source());
              appJson.usingComponents = {
                ...(appJson.usingComponents || {}),
                ...usingComponentsOption,
              };
              compilation.assets[name] = {
                source() {
                  return JSON.stringify(appJson);
                },
                size() {
                  return this.source().length;
                },
              };
            } else {
              // 处理组件标签属性
              const tags = Object.keys(_this.options[name]);
              tags.forEach((tag) => {
                const reg = new RegExp(
                  `\\<${tag}[\\s\\S]*?(/>|</${tag}>)`,
                  "g"
                );
                compilation.assets[name] = {
                  source() {
                    return currentBundle
                      .source()
                      .replace(reg, (str: string) => {
                        if (!str.includes('u-t="m"')) {
                          // 构建出来没有u-t="m"属性
                          const targetProps = 'u-t="m"';
                          const resourcePropsArr = str.split(" ");
                          resourcePropsArr.splice(2, 0, targetProps);
                          return resourcePropsArr.join(" ");
                        }
                        return str;
                      });
                  },
                  size() {
                    return this.source().length;
                  },
                };
              });
            }
          }
        });
        callback();
      }
    );
  }
}

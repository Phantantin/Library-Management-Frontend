import {describe,expect,it} from "vitest";
import {translate} from "./i18n";

describe("translate",()=>{
  it("returns English source text for the English locale",()=>{
    expect(translate("en","Sign in")).toBe("Sign in");
  });

  it("returns Vietnamese translations",()=>{
    expect(translate("vi","Sign in")).toBe("Đăng nhập");
  });

  it("interpolates values and safely falls back to the source text",()=>{
    expect(translate("vi","Page {page} of {total}",{page:2,total:7})).toBe("Trang 2 / 7");
    expect(translate("vi","Backend supplied title")).toBe("Backend supplied title");
  });
});
